# Specification

## Summary
**Goal:** Make the Landing Page hero “Get Started” button open the provided Google Form in a new tab/window instead of starting the Internet Identity login flow.

**Planned changes:**
- Update the Landing Page hero “Get Started” button action/link to open `https://docs.google.com/forms/d/e/1FAIpQLSfPd7k1jiJqI71faIie9aYOmeScqdQ98jTcIFtYoJK9AJvHig/viewform?usp=preview` in a new browser tab/window.
- Remove/disable any Internet Identity login trigger and the associated “Loading...” state tied to the “Get Started” button.

**User-visible outcome:** Clicking/tapping “Get Started” opens the Google Form in a new tab/window and no longer initiates login or shows a loading state.
