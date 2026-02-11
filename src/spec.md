# Specification

## Summary
**Goal:** Remove the header “Login” button for unauthenticated users and change the Landing Page hero “Get Started” button to open a specified Google Form in a new tab without triggering login.

**Planned changes:**
- Remove the “Login” button/menu item from the header when the user is not authenticated, while keeping existing navigation items and mobile navigation intact.
- Keep the existing authenticated-user logout behavior available via the current user dropdown (“Logout”).
- Update the Landing Page hero “Get Started” button to open the provided Google Forms URL in a new browser tab/window and ensure it does not call the Internet Identity login flow.

**User-visible outcome:** Visitors no longer see a “Login” button in the header, and clicking “Get Started” opens the Google Form in a new tab without initiating authentication.
