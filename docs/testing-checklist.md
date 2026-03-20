# EVA Local — Testing Checklist

## 1. AUTHENTICATION

### Sign Up

- [x] Register with valid email, name, password
- [x] Validation errors show for missing/invalid fields
- [x] Duplicate email shows proper error
- [x] Email verification flow works
- [x] Redirect to correct page after registration

### Sign In

- [x] Login with valid credentials
- [x] Wrong password shows error
- [x] Non-existent email shows error
- [x] Redirect to correct dashboard based on role (admin / vendor / user)

### Sign Out

- [x] Sign out modal appears with correct Playfair Display italic font
- [x] Cancel button dismisses modal
- [x] Confirm sign out logs user out and redirects to home

### Forgot / Reset Password

- [x] Forgot password sends email
- [x] Reset password link works
- [x] New password saves correctly

---

## 2. ADMIN DASHBOARD (`/admin`)

### Overview Page

- [x] Analytics data loads without 500 error
- [x] Total Bookings stat shows correct value
- [ ] New Inquiries stat shows correct value
- [ ] New Users stat shows correct value
- [ ] Pending Approvals stat shows correct value
- [x] Platform Overview section shows Total Users, Active Vendors, Completed, Reviews
- [x] Platform Health indicator reflects correct status
- [x] Action Required section shows pending reviews/vendor approvals
- [x] Recent Activity feed shows latest bookings
- [x] Top Vendors list shows correct data
- [x] Recent Bookings list shows latest at top
- [x] Refresh button reloads data
- [x] All stat cards link to correct pages

---

## 3. ADMIN VENDORS (`/admin/vendors`)

- [x] Vendor list loads correctly
- [x] Vendor initials display correctly (not shrunken)
- [x] Business name truncates properly on mobile and desktop
- [x] Status filter works: Active, Pending, Suspended
- [x] Category filter works correctly
- [x] Search works correctly
- [x] Pagination works (next/prev pages)
- [x] Clicking a vendor opens detail/edit view
- [x] Approve pending vendor works
- [x] Suspend vendor works

---

## 4. ADMIN USERS (`/admin/users`)

- [X] User list loads correctly
- [X] Status filter works: Active, Inactive, Suspended
- [X] Search works correctly
- [X] Pagination works
- [X] User details display correctly

---

## 5. ADMIN BOOKINGS (`/admin/bookings`)

- [X] Bookings list loads with latest at top
- [X] Pagination works
- [X] Status update dropdown works (PENDING_PAYMENT, CONFIRMED, COMPLETED, CANCELLED, etc.)
- [X] Payment status update works
- [X] Search/filter works correctly

---

## 6. ADMIN QUOTES (`/admin/quotes`)

- [X] Quotes list loads correctly
- [X] Client name shows correctly (not N/A) for both guest and registered users
- [X] Search has debounce (no instant API call on every keystroke)
- [X] Search returns correct results
- [X] Status filter works correctly

---

## 7. ADMIN ANALYTICS (`/admin/analytics`)

- [X] Page loads without 500 error
- [X] Total Revenue displays correctly
- [X] Providers by category shows correct counts
- [X] Top performing vendors show correct booking/revenue data (not 0)
- [X] Period selector (7d, 30d, 90d, 1y) updates data correctly
- [X] Growth percentages calculate correctly

---

## 8. ADMIN SETTINGS (`/admin/settings`)

### Profile Tab

- [X] Profile data loads correctly (name, email, phone)
- [X] Avatar upload works
- [X] Save changes updates name and phone
- [X] Email field is disabled (cannot be changed)
- [X] User ID copy button works

### Security Tab

- [X] Change password works with correct current password
- [X] Wrong current password shows error
- [X] New password mismatch shows error
- [X] Password strength indicator updates correctly
- [X] Password must be at least 8 characters

### Delete Account Modal

- [X] Modal opens when clicking Delete Account button
- [X] Title uses Playfair Display italic font (matches sign-out modal)
- [X] Only Cancel button shows by default
- [X] DELETE input field accepts text
- [X] Password field verifies against actual user password
- [X] Password verification shows green "Password verified" when correct
- [X] Password verification shows red "Incorrect password" when wrong
- [X] Delete Account button animates in smoothly only when BOTH conditions met:
  - [X] Exact text "DELETE" typed (case-sensitive)
  - [X] Correct password entered and verified
- [X] Cancel button smoothly resizes when delete button appears
- [X] Delete Account button triggers account deletion
- [X] Redirects to home after successful deletion
- [X] Typing "delete" (lowercase) does NOT enable the button

---

## 9. VENDOR PROFILE (`/vendor/profile`)

### Service Modal (Add)

- [X] Add New Service modal opens blank
- [X] All fields save correctly (name, description, price, max guests, time estimate, category)
- [X] Cover image upload works
- [X] Validation shows error if service name is empty

### Service Modal (Edit)

- [X] Clicking pencil icon immediately populates form with existing data (no blank form on first click)
- [X] All fields show correct existing values
- [X] Editing and saving updates the service correctly
- [X] maxGuests field saves and updates without 500 error
- [X] Closing and reopening shows correct data

### Service Guest Limits

- [X] Services with maxGuests set enforce the limit during booking
- [X] Incompatible services show warning when guest count exceeds limit
- [X] "Remove incompatible services" button works
- [X] Compatible services show green indicator

---

## 10. VENDOR DETAIL PAGE (`/vendors/[id]`)

### General

- [X] Page loads correctly
- [X] Gallery images display
- [X] Vendor info (name, rating, location, categories) shows correctly
- [X] Get Directions link works
- [X] Favorite button works
- [X] Share button works

### Booking Flow

- [X] Services list loads correctly
- [X] Selecting a service adds it to booking
- [X] Deselecting removes it
- [X] Total price updates correctly
- [X] Guest count field works
- [X] Service compatibility warning shows when guest count exceeds service limit
- [X] Incompatible service price shown correctly (no undefined errors)
- [X] Booking form shows after clicking Book
- [X] Unauthenticated users are prompted to sign in
- [X] Booking progress saves to localStorage and restores after login
- [X] Successful booking redirects to payment or shows success

### Inquiry Form

- [X] Inquiry form opens
- [X] All fields validate correctly
- [X] Submitting sends inquiry successfully
- [X] Success message shows after submission

---

## 11. ADMIN REVIEWS (`/admin/reviews`)

- [X] Reviews list loads
- [X] Pending reviews show correctly
- [X] Approve review works
- [X] Reject review works
- [X] Filter by status works

---

## 12. USER DASHBOARD

### Bookings

- [X] Bookings list loads correctly
- [X] Booking details page works
<!-- - [X] Cancel booking works (where applicable) -->

### Favorites

- [X] Favorites list loads
- [X] Remove from favorites works

### Inquiries

- [X] Inquiries list loads
- [X] Inquiry detail/messages work

### Quotes

- [X] Quotes list loads
- [X] Accept quote works
- [X] Decline quote works

### Settings

- [ ] Profile update works
- [ ] Password change works

---

## 13. PUBLIC PAGES

- [ ] Home page loads
- [ ] Vendors listing page loads and filters work
- [ ] Category pages load
- [ ] Search works with debounce
- [ ] Vendor detail page loads for all vendors
- [ ] Contact page form submits correctly

---

## 14. MOBILE RESPONSIVENESS

- [ ] Admin dashboard is usable on mobile
- [ ] Vendor detail page booking flow works on mobile
- [ ] Booking form scrolls into view on mobile after clicking Book
- [ ] Modals (sign-out, delete account) display correctly on mobile
- [ ] Navigation menus work on mobile

---

## 15. EDGE CASES

- [ ] Admin analytics with zero data (new platform) shows 0s not errors
- [ ] Vendor with no services shows empty state
- [ ] Vendor with no reviews shows empty state
- [ ] Booking with no listings selected shows validation error
- [ ] Delete account with wrong password keeps button disabled
- [ ] Delete account with "delete" (lowercase) keeps button disabled
- [ ] Service modal with no category selected still saves
- [ ] Pagination on last page doesn't break
