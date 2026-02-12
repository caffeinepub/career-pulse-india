# Specification

## Summary
**Goal:** Keep a single “Follow Us” social icon set in the footer, showing full-color official platform icons that link correctly.

**Planned changes:**
- Remove the duplicated “Follow Us” social icon row from the Landing Page Contact section so the footer is the only social icon set.
- Ensure the footer social icons render as full-color/official platform icons, consistently sized/aligned, and map strictly from `SOCIAL_LINKS`.
- Ensure each footer icon click follows the outbound link behavior defined in `frontend/src/constants/socialLinks.ts` (including deep-link first with web fallback where applicable) and remains keyboard-accessible with aria-labels.
- Clean up unused social icon imports/dependencies from `frontend/src/pages/LandingPage.tsx` after removing the duplicated section.

**User-visible outcome:** Users see one “Follow Us” area in the footer with colorful official social icons; clicking an icon opens the correct social destination (with deep-link behavior where defined), and no extra social icon row appears at the bottom of the landing page.
