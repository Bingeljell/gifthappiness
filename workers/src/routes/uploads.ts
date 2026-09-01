import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { getSessionUser } from "../lib/session";
import type { Env } from "../lib/env";

// Mirrors admin.ts's isAuthorizedAdmin -- kept local rather than shared to
// avoid a cross-route import cycle for one guard clause.
async function isAuthorizedAdmin(request: Request, env: Env): Promise<boolean> {
  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, token] = auth.split(" ");
  if (scheme === "Bearer" && env.ADMIN_API_KEY.length > 0 && token === env.ADMIN_API_KEY) {
    return true;
  }

  const user = await getSessionUser(request, env);
  return user?.isAdmin === true;
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const MAX_BYTES = 5 * 1024 * 1024;

// Shared by both charity image upload routes below -- multipart/form-data
// with a "file" field, uploaded to the given public Storage bucket under a
// random filename. Returns the public URL; the admin form sends that URL
// back as logo_url/header_image_url on POST/PATCH /admin/charities (upload
// is a separate step from charity create/update, so re-saving a charity's
// text fields never re-uploads or re-touches the image).
async function uploadCharityImage(request: Request, env: Env, bucket: string): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
    return errorResponse("Unauthorized", env, 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Request body must be multipart/form-data", env, 422);
  }

  // workers-types' FormData.get() is typed as string | null (it doesn't
  // model the File-returning overload), even though the runtime does return
  // a File for a file field -- cast so the instanceof check below compiles.
  const file = form.get("file") as unknown as File | string | null;
  if (!(file instanceof File)) {
    return errorResponse("A 'file' field is required", env, 422);
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return errorResponse("Image must be PNG, JPEG, or WebP", env, 422);
  }
  if (file.size > MAX_BYTES) {
    return errorResponse("Image must be 5MB or smaller", env, 422);
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseClient(env);
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
  });

  if (uploadError) {
    return errorResponse("Could not upload image", env, 500);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return json({ url: data.publicUrl }, env, 201);
}

// POST /admin/uploads/charity-logo -- the small profile/logo picture.
export function uploadCharityLogo(request: Request, env: Env): Promise<Response> {
  return uploadCharityImage(request, env, "charity-logos");
}

// POST /admin/uploads/charity-header -- the wide header/marquee banner shown
// atop the charity detail page and as a cover image on directory/homepage
// cards, distinct from the logo above.
export function uploadCharityHeader(request: Request, env: Env): Promise<Response> {
  return uploadCharityImage(request, env, "charity-headers");
}
