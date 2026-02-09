# Specification

## Summary
**Goal:** Update the site-wide contact phone number to 9888955099 across all displayed text and contact links (tel: and WhatsApp), keeping country-code formatting consistent.

**Planned changes:**
- Update `frontend/src/constants/contact.ts` to set `CONTACT.phone.display` to `+91 9888955099`, `CONTACT.phone.number` to `919888955099`, and `CONTACT.phone.tel` to `tel:+919888955099`.
- Update `frontend/src/constants/contact.ts` to set `CONTACT.whatsapp.url` to `https://wa.me/919888955099` and `CONTACT.whatsapp.urlWithMessage` to `https://wa.me/919888955099?text=Hi,%20I%20have%20a%20query%20about%20your%20services!` (same prefilled message as before).
- Ensure the floating WhatsApp button uses the updated `CONTACT.whatsapp.urlWithMessage`.
- Verify repo-wide that no frontend source files or user-facing links still reference `9888377403` or `919888377403`.

**User-visible outcome:** Users see the updated phone number everywhere and all call/WhatsApp contact actions open to the new number.
