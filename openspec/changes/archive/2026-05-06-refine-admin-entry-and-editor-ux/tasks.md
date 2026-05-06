## 1. Admin Route And Public Entry

- [x] 1.1 Add a single frontend constant for `/plusplus7_admin_portal` and route admin screens only from that path.
- [x] 1.2 Remove the visible public footer Admin navigation control.
- [x] 1.3 Confirm `/admin` no longer renders the admin authentication or workspace flow.

## 2. Admin Authentication Feedback

- [x] 2.1 Add login error state to the admin sign-in form.
- [x] 2.2 Catch failed login API calls and display a clear invalid-password message without authenticating the user.
- [x] 2.3 Clear stale login errors when the owner edits the password or submits a successful login.

## 3. Post Library And Editor Preview

- [x] 3.1 Change the post library markup to compact rows that show only title, falling back to slug when title is empty.
- [x] 3.2 Keep the delete action visually distinct and separate from the title/load action.
- [x] 3.3 Replace manual Markdown preview generation with a debounced automatic preview request when the body changes.
- [x] 3.4 Ignore stale preview responses and show a lightweight preview failure state if rendering fails.

## 4. Styling And Documentation

- [x] 4.1 Update admin CSS for compact post rows, login error feedback, and preview status without disrupting mobile layout.
- [x] 4.2 Update QA documentation to use `/plusplus7_admin_portal` for manual admin checks.
- [x] 4.3 Update SRE/deploy-facing notes that mention direct admin SPA route verification.

## 5. Verification

- [x] 5.1 Run `npm run check`.
- [x] 5.2 Run `npm test`.
- [x] 5.3 Run `npm run build:static`.
- [x] 5.4 Manually inspect public pages to confirm no visible Admin entry remains.
- [x] 5.5 Manually inspect `/plusplus7_admin_portal` sign-in failure, compact post list, and live Markdown preview behavior.
