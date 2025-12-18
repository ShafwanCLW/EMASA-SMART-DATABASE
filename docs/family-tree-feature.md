# Family Tree Feature Visibility

## Current State
- `login-app/src/pages/admin/AdminDashboard.js` line with the `<div class="family-viewer-card">` now includes `hidden` plus a note comment, so the KIR family tree card never renders on the dashboard even though its data-loading logic still runs.

## Re-enabling Steps
1. Open `login-app/src/pages/admin/AdminDashboard.js`.
2. Locate the family viewer markup in the dashboard’s household section.
3. Remove the `hidden` attribute (and optional comment) on the `family-viewer-card` div.
4. Save and redeploy; no additional code changes are required because the JS initialization remains intact.

## Notes
- This approach only hides the UI; background data fetches still occur. Converting to a real feature flag later would avoid unnecessary requests when the card is disabled.
