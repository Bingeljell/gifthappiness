GiftHappiness
Website Development Brief v1.0

Mobile-first website concept and functional direction
This document separates the website/product-development work from the broader GiftHappiness master project. It can be shared directly with a designer, developer or product partner.
 
1. Website Objective
Build a warm, trustworthy and mobile-first digital experience that lets a host create a celebration, choose a verified charity, share a personalised page, and allow guests to donate securely and directly to the selected organisation.
The experience should feel like a celebration platform rather than a conventional fundraising portal.
2. Core Homepage Message
Brand: GiftHappiness
Hero: Turn every celebration into a gift that changes lives.
Supporting line: Give joy. Give meaning. Give happiness.
Campaign language: Celebrate with Purpose.
Primary CTA: Start a Celebration
Secondary CTA: Browse Charities
3. Mobile-First Design Principles
•	Design for phone screens first, then expand gracefully to tablet and desktop.
•	Use large touch targets, short forms and clear progress indicators.
•	Keep the primary Start a Celebration CTA visible and easy to reach.
•	Use generous spacing, emotionally warm copy and an optimistic visual language.
•	Avoid the institutional feel of a conventional donation portal.
•	Communicate trust, verification, transparency and the zero-platform-commission principle early.
•	Keep donation actions fast, secure and low-friction.
4. Proposed Main Navigation
•	How It Works
•	Browse Charities
•	Impact
•	FAQ
•	Start a Celebration
•	Sign In
Footer: About Us, Contact, For Charities, Privacy Policy, Terms of Service, Refund/Donation Policy, Charity Selection Policy, Transparency and SDGs.
5. Homepage Sections
1.	Hero: purpose statement, emotional brand line and two CTAs.
2.	Trust strip: zero platform commission, verified charities and simple giving.
3.	How It Works: three-step explanation.
4.	Featured Charities: browsable cause cards and filters.
5.	Our Promise: direct-to-cause / zero-platform-commission explanation.
6.	Origin/Youth Story: describe the idea as conceived by a 12-year-old without naming the individual.
7.	FAQ: concise answers to trust and process questions.
8.	Final CTA: invite the visitor to create a celebration.
6. How It Works - Website Copy Structure
01 Create Your Celebration
Set up a birthday, wedding, anniversary or other occasion. Add a personal message and date.
02 Choose a Charity
Pick a cause from a curated list of trusted organisations across health, children, education, environment, animals and other approved categories.
03 Share with Friends
Share the personalised celebration page. Guests contribute any amount directly to the selected charity and receive a warm confirmation/thank-you.
7. Start a Celebration - Proposed User Flow
Step 1: Host and Occasion
•	Host name
•	Mobile number
•	OTP verification
•	Address if required
•	Occasion
•	Celebration date
Step 2: Cause and Page
•	Charity selection
•	Donation page active-from date
•	Donation page active-till date
•	Personal message
•	Optional photograph
Step 3: Preview and Publish
•	Preview personalised celebration page
•	Confirm charity and dates
•	Complete OTP/identity requirements
•	Generate shareable URL
•	Generate QR code
•	Publish
The prototype created during concept development uses a three-step modal flow with a celebration-page preview. Production should connect this flow to authentication, the live charity database and publishing.
8. Celebration Page
•	Host name
•	Occasion
•	Celebration date
•	Optional host image
•	Personal message
•	Chosen charity and concise cause description
•	Contribution period
•	Prominent Contribute/Donate button
•	Share controls
•	GiftHappiness trust/zero-commission message
•	Optional progress/impact information where appropriate
Suggested language: 'Instead of gifts, please consider supporting a cause close to my heart.'
9. Donor Flow
•	Name
•	Mobile number
•	Email where needed for receipt
•	PAN where legally required
•	Donation amount
•	Option to show the amount to the host or keep the amount private
•	Payment method
•	Payment confirmation
•	Charity/tax receipt where applicable
•	Warm thank-you message
The preferred architecture is for funds to be credited directly to the charity rather than passing through GiftHappiness's operating account.
10. Charity Browsing
Users should be able to browse or filter charities by cause. Potential categories include Children & Education, Health, Animals, Environment, Poverty & Livelihood, Disability & Inclusion, Women & Community and Elder Care.
Each charity card should show enough information to make a confident selection without overwhelming the mobile screen.
11. Charity Detail Page
•	Name/logo/image
•	Cause category
•	What the charity does
•	Who it helps
•	Why it was selected
•	Relevant SDG(s)
•	Substantiated impact examples
•	Amount raised through GiftHappiness
•	Current allocation/rotation status
•	Choose this Charity CTA
12. Transparency and Charity Rotation
The website should publicly communicate fundraising totals and active/completed status for charities. When a charity reaches its predetermined platform allocation, it can be removed from selection for new celebrations while already-active celebration pages continue to completion.
13. Admin Requirements
•	Charity CRUD and verification status.
•	Document uploads and compliance records.
•	Fundraising ceiling/allocation settings.
•	Charity activation/deactivation.
•	Celebration-page moderation and expiry management.
•	User and OTP status management.
•	Homepage, FAQ, policy, SDG and testimonial content management.
•	Donation, charity, celebration and payment-failure reporting.
•	Security/fraud controls and audit trail.
14. Technical Direction Under Consideration
•	Cloudflare Pages + Workers with Supabase database.
•	Alternative deployment on AWS or DigitalOcean.
•	Responsive frontend with secure API/backend.
•	OTP authentication.
•	Payment gateway/direct settlement integration.
•	QR-code generation.
•	Admin dashboard.
•	Analytics and monitoring.
•	Backups, security controls and privacy-by-design.
The final payment and settlement model must be decided before production architecture is locked.
15. Prototype Already Created
A self-contained mobile-first website prototype has been created as part of the concept work. It includes:
•	Responsive landing page and navigation.
•	Sticky mobile Start a Celebration CTA.
•	Three-step celebration creation prototype.
•	Celebration-page preview.
•	Featured charity cards and category filtering.
•	Zero-commission/impact section.
•	Anonymous 12-year-old origin story.
•	FAQ accordion.
•	Responsive desktop adaptation.
The prototype uses fictional charity names and fundraising figures solely to demonstrate the interface. No placeholder charity should be represented as a real GiftHappiness partner.
16. Production Integrations Still Required
•	OTP and authentication service.
•	Live verified-charity database.
•	Payment gateway and direct-to-charity settlement logic.
•	PAN/tax-receipt rules and workflows.
•	Donation receipts.
•	Admin console.
•	Charity verification/compliance workflow.
•	Fraud and abuse controls.
•	Email/SMS/WhatsApp notifications as approved.
•	Privacy and consent mechanisms.
•	Analytics, reconciliation and reporting.
17. Content/Policy Items Not Yet Final
•	Tax-benefit FAQ wording.
•	Refund and payment-error policy.
•	Exact PAN threshold/requirements.
•	Final legal and privacy language.
•	Final charity-selection criteria.
•	Initial charity list.
•	Exact fundraising ceiling and rotation mechanics.
•	Final logo, colours, imagery and UI identity.
•	Payment sponsor / transaction-fee arrangement.
18. Recommended Next Design Iteration
The next visual iteration should move from functional prototype to a distinctive launch-ready brand experience. It should include:
•	Final GiftHappiness logo and brand system.
•	Premium but warm colour palette and typography.
•	Real approved charity imagery and profiles.
•	Polished celebration-page design.
•	Complete donation/payment screen.
•	Donor privacy selection.
•	Success/thank-you screens.
•	Certificate/appreciation experience.
•	Share and QR-code experience.
•	Admin dashboard wireframes.
•	Accessibility and mobile performance review.
19. Current Project Checklist
•	Final content.
•	Validate information architecture and required pages.
•	Finalise initial charity list.
•	Finalise admin-controlled elements.
•	Charity information and pages.
•	User management.
•	Landing-page management.
•	Admin and user flows.
•	Home-page content.
•	Finalise hosting mechanism.
•	Finalise logo and UI.
•	Resolve payment, compliance and direct-settlement architecture.
