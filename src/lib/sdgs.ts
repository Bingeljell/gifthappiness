// UN Sustainable Development Goal reference text, keyed by the code strings
// stored on a charity's `sdgs` column (see supabase/schema.sql). Static
// lookup data, independent of any individual charity, so it doesn't belong
// in the database.
export const sdgDescriptions: Record<string, string> = {
  "SDG 1": "No Poverty — livelihood and social-support programmes.",
  "SDG 3": "Good Health and Well-Being — hospitals, healthcare, and medical assistance.",
  "SDG 4": "Quality Education — schools, scholarships, and educational initiatives.",
  "SDG 10": "Reduced Inequalities — disability, inclusion, and disadvantaged communities.",
  "SDG 13": "Climate Action — environmental initiatives.",
  "SDG 14": "Life Below Water — marine conservation.",
  "SDG 15": "Life on Land — wildlife, animal welfare, and conservation.",
};
