# EVA Local — Testing Checklist

## 1. AUTHENTICATION

### Sign Up
- [ ] Register with valid email, name, password
- [ ] Validation errors show for missing/invalid fields
- [ ] Duplicate email shows proper error
- [ ] Email verification flow works
- [ ] Redirect to correct page after registration

### Sign In
- [ ] Login with valid credentials
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Redirect to correct dashboard based on role (admin / vendor / user)

### Sign Out
- [ ] Sign out modal appears with correct Playfair Display italic font
- [ ] Cancel button dismisses modal
- [ ] Confirm sign out logs user out and redirects to home

### Forgot / Reset Password
- [ ] Forgot password sends email
- [ ] Reset password link works
- [ ] New password saves correctly

---

## 2. ADMIN DASHBOARD (`/admin`)

### Overview Page
- [ ] Analytics data loads without 500 error
- [ ] Total Bookings stat shows correct value
- [ ] New Inquiries stat shows correct value
- [ ] New Users stat shows correct value
- [ ] Pending Approvals stat shows correct value
- [ ] Platform Overview section shows Total Users, Active Vendors, Completed, Reviews
- [ ] Platform Health indicator reflects correct status
- [ ] Action Required section shows pending reviews/vendor approvals
- [ ] Recent Activity feed shows latest bookings
- [ ] Top Vendors list shows correct data
- [ ] Recent Bookings list shows latest at top
- [ ] Refresh button reloads data
- [ ] All stat cards link to correct pages

---

## 3. ADMIN VENDORS (`/admin/vendors`)

- [ ] Vendor list loads correctly
- [ ] Vendor initials display correctly (not shrunken)
- [ ] Business name truncates properly on mobile and desktop
- [ ] Status filter works: Active, Pending, Suspended
- [ ] Category filter works correctly
- [ ] Search works correctly
- [ ] Pagination works (next/prev pages)
- [ ] Clicking a vendor opens detail/edit view
- [ ] Approve pending vendor works
- [ ] Suspend vendor works

---

## 4. ADMIN USERS (`/admin/users`)

- [ ] User list loads correctly
- [ ] Status filter works: Active, Inactive, Suspended
- [ ] Search works correctly
- [ ] Pagination works
- [ ] User details display correctly

---

## 5. ADMIN BOOKINGS (`/admin/bookings`)

- [ ] Bookings list loads with latest at top
- [ ] Pagination works
- [ ] Status update dropdown works (PENDING_PAYMENT, CONFIRMED, COMPLETED, CANCELLED, etc.)
- [ ] Payment status update works
- [ ] Search/filter works correctly

---

## 6. ADMIN QUOTES (`/admin/quotes`)

- [ ] Quotes list loads correctly
- [ ] Client name shows correctly (not N/A) for both guest and registered users
- [ ] Search has debounce (no instant API call on every keystroke)
- [ ] Search returns correct results
- [ ] Status filter works correctly

---

## 7. ADMIN ANALYTICS (`/admin/analytics`)

- [ ] Page loads without 500 error
- [ ] Total Revenue displays correctly
- [ ] Providers by category shows correct counts
- [ ] Top performing vendors show correct booking/revenue data (not 0)
- [ ] Period selector (7d, 30d, 90d, 1y) updates data correctly
- [ ] Growth percentages calculate correctly

---

## 8. ADMIN SETTINGS (`/admin/settings`)

### Profile Tab
- [ ] Profile data loads correctly (name, email, phone)
- [ ] Avatar upload works
- [ ] Save changes updates name and phone
- [ ] Email field is disabled (cannot be changed)
- [ ] User ID copy button works

### Security Tab
- [ ] Change password works with correct current password
- [ ] Wrong current password shows error
- [ ] New password mismatch shows error
- [ ] Password strength indicator updates correctly
- [ ] Password must be at least 8 characters

### Delete Account Modal
- [ ] Modal opens when clicking Delete Account button
- [ ] Title uses Playfair Display italic font (matches sign-out modal)
- [ ] Only Cancel button shows by default
- [ ] DELETE input field accepts text
- [ ] Password field verifies against actual user password
- [ ] Password verification shows green "Password verified" when correct
- [ ] Password verification shows red "Incorrect password" when wrong
- [ ] Delete Account button animates in smoothly only when BOTH conditions met:
  - [ ] Exact text "DELETE" typed (case-sensitive)
  - [ ] Correct password entered and verified
- [ ] Cancel button smoothly resizes when delete button appears
- [ ] Delete Account button triggers account deletion
- [ ] Redirects to home after successful deletion
- [ ] Typing "delete" (lowercase) does NOT enable the button

---

## 9. VENDOR PROFILE (`/vendor/profile`)

### Service Modal (Add)
- [ ] Add New Service modal opens blank
- [ ] All fields save correctly (name, description, price, max guests, time estimate, category)
- [ ] Cover image upload works
- [ ] Validation shows error if service name is empty

### Service Modal (Edit)
- [ ] Clicking pencil icon immediately populates form with existing data (no blank form on first click)
- [ ] All fields show correct existing values
- [ ] Editing and saving updates the service correctly
- [ ] maxGuests field saves and updates without 500 error
- [ ] Closing and reopening shows correct data

### Service Guest Limits
- [ ] Services with maxGuests set enforce the limit during booking
- [ ] Incompatible services show warning when guest count exceeds limit
- [ ] "Remove incompatible services" button works
- [ ] "Adjust to max guests" button works
- [ ] Compatible services show green indicator

---

## 10. VENDOR DETAIL PAGE (`/vendors/[id]`)

### General
- [ ] Page loads correctly
- [ ] Gallery images display
- [ ] Vendor info (name, rating, location, categories) shows correctly
- [ ] Get Directions link works
- [ ] Favorite button works
- [ ] Share button works

### Booking Flow
- [ ] Services list loads correctly
- [ ] Selecting a service adds it to booking
- [ ] Deselecting removes it
- [ ] Total price updates correctly
- [ ] Guest count field works
- [ ] Service compatibility warning shows when guest count exceeds service limit
- [ ] Incompatible service price shown correctly (no undefined errors)
- [ ] Booking form shows after clicking Book
- [ ] Unauthenticated users are prompted to sign in
- [ ] Booking progress saves to localStorage and restores after login
- [ ] Successful booking redirects to payment or shows success

### Inquiry Form
- [ ] Inquiry form opens
- [ ] All fields validate correctly
- [ ] Submitting sends inquiry successfully
- [ ] Success message shows after submission

---

## 11. ADMIN REVIEWS (`/admin/reviews`)

- [ ] Reviews list loads
- [ ] Pending reviews show correctly
- [ ] Approve review works
- [ ] Reject review works
- [ ] Filter by status works

---

## 12. USER DASHBOARD

### Bookings
- [ ] Bookings list loads correctly
- [ ] Booking details page works
- [ ] Cancel booking works (where applicable)

### Favorites
- [ ] Favorites list loads
- [ ] Remove from favorites works

### Inquiries
- [ ] Inquiries list loads
- [ ] Inquiry detail/messages work

### Quotes
- [ ] Quotes list loads
- [ ] Accept quote works
- [ ] Decline quote works

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
