# EVA Local — Testing Checklist

## 1. AUTHENTICATION

### Sign Up
- [x] Register with valid email, name, password
- [x] Validation errors show for missing/invalid fields
- [x] Duplicate email shows proper error
- [x] Email verification flow works (email received, link works)
- [x] Redirect to correct page after registration

### Sign In
- [x] Login with valid credentials
- [x] Wrong password shows error
- [x] Non-existent email shows error
- [x] Redirect to correct dashboard based on role (admin / vendor / client)
- [X] Google OAuth login works
- [X] Google OAuth creates user with CLIENT role

### Sign Out
- [x] Sign out modal appears with correct Playfair Display italic font
- [x] Cancel button dismisses modal
- [x] Confirm sign out logs user out and redirects to home

### Forgot / Reset Password
- [x] Forgot password sends email
- [x] Reset password link works
- [x] New password saves correctly
- [X] Expired reset link shows proper error

### Vendor Invite Flow
- [X] Admin creates new vendor → invite email is sent
- [X] Invite link opens accept-invite page
- [X] Vendor sets password and account is activated
- [X] Expired invite (>72hrs) shows error
- [X] Already-used invite shows error
- [X] Vendor is redirected to onboarding after accepting invite

---

## 2. ADMIN DASHBOARD (`/admin`)

### Overview Page
- [x] Analytics data loads without 500 error
- [x] Total Bookings stat shows correct value
- [X] New Inquiries stat shows correct value
- [X] New Users stat shows correct value
- [X] Pending Approvals stat shows correct value
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
- [x] Vendor initials display correctly
- [x] Status filter works: Active, Pending, Suspended
- [x] Category filter works correctly
- [x] Search works correctly
- [x] Pagination works (next/prev pages)
- [x] View vendor modal opens with correct data
- [x] All modal tabs (Basic Info, Media, Settings) work
- [x] All input fields have placeholder text
- [x] Approve pending vendor works
- [x] Suspend vendor works
- [X] Add New Vendor button opens modal
- [X] New vendor form validates required fields
- [X] Creating vendor sends invite email
- [X] Newly created vendor appears in list as PENDING

---

## 4. ADMIN USERS (`/admin/users`)

- [x] User list loads correctly
- [x] Status filter works: Active, Inactive, Suspended
- [x] Search works correctly
- [x] Pagination works
- [x] User details display correctly
- [X] Delete user works (admin cannot delete themselves)

---

## 5. ADMIN BOOKINGS (`/admin/bookings`)

- [x] Bookings list loads with latest at top
- [x] Pagination works
- [x] Actions modal opens (not dropdown)
- [x] View Details shows full booking info
- [x] Cancel Booking action works
- [x] Cancellation reason shows in booking details when vendor requested it
- [x] "Cancel Requested" badge shows in orange for pending cancellations
- [X] Cancelling a booking sends email to client with refund notice
- [X] Cancelling a booking sends notification to vendor
- [X] Search/filter by status works correctly

---

## 6. ADMIN QUOTES (`/admin/quotes`)

- [x] Quotes list loads correctly
- [x] Client name shows correctly for both guest and registered users
- [x] Client name falls back to booking data when no inquiry
- [x] Client email, phone, guest count show in detail modal
- [x] Search has debounce
- [x] Search returns correct results
- [x] Status filter works correctly
- [X] Quote detail modal shows all items with correct prices

---

## 7. ADMIN ANALYTICS (`/admin/analytics`)

- [x] Page loads without 500 error
- [x] Total Revenue displays correctly
- [x] Providers by category shows correct counts
- [x] Top performing vendors show correct booking/revenue data
- [x] Period selector (7d, 30d, 90d, 1y) updates data correctly
- [x] Growth percentages calculate correctly

---

## 8. ADMIN NOTIFICATIONS (`/admin/notifications`)

- [X] Notifications list loads correctly
- [X] Unread notifications show highlighted
- [X] Mark all as read works
- [X] Cancellation request notifications appear when vendor requests cancellation
- [X] Clicking notification links to relevant page

---

## 9. ADMIN SETTINGS (`/admin/settings`)

### Profile Tab
- [x] Profile data loads correctly (name, email, phone)
- [x] Avatar upload works
- [x] Save changes updates name and phone
- [x] Email field is disabled
- [x] User ID copy button works
- [x] Account role, email status, member since all display

### Security Tab
- [x] Change password works with correct current password
- [x] Wrong current password shows error
- [x] New password mismatch shows error
- [x] Password strength indicator updates correctly

### Delete Account Modal
- [x] Modal opens correctly
- [x] Playfair Display italic font on title
- [x] DELETE text + password verification both required
- [x] Delete button animates in when both conditions met
- [x] Deletion works and redirects to home
- [x] Admin cannot delete themselves via API guard (removed — admin CAN delete own account)

---

## 10. VENDOR ONBOARDING

- [X] Onboarding flow completes all steps
- [X] Business info saves correctly
- [X] Categories/subcategories save correctly
- [X] Location + postcode geocodes correctly
- [X] Cover image uploads correctly
- [X] Profile publishes at end of onboarding
- [X] Vendor is redirected to /vendor/profile after completion

---

## 11. VENDOR PROFILE (`/vendor/profile`)

### Header
- [X] Cover image upload works (camera button top-right of banner)
- [X] Logo/avatar upload works (pen icon on avatar box)
- [X] Uploaded logo displays instead of initials
- [X] Uploaded cover image displays in banner

### About Section
- [X] Edit description modal opens
- [X] Saving description updates correctly

### Services & Packages
- [x] Category tabs show when categories exist
- [x] Clicking a category tab filters services correctly (case-insensitive)
- [x] "All" tab shows all services
- [X] Add Service modal opens blank
- [X] All fields save correctly
- [X] Cover image upload in service modal works
- [X] Edit service modal pre-populates with existing data
- [X] Editing and saving updates service correctly

### Contact Information
- [X] Edit info modal opens with existing data
- [X] Saving updates phone, website, address

### Social Media
- [X] Edit social modal opens
- [X] Instagram, Facebook, TikTok links save and display

### Business Hours
- [X] Edit business hours modal opens
- [X] Saving hours updates the display correctly
- [X] Closed days show "Closed"

### Portfolio Gallery
- [X] Add photo works
- [X] Delete photo works

---

## 12. VENDOR BOOKINGS (`/vendor/bookings`)

- [X] Bookings list loads correctly
- [X] Actions modal opens (not dropdown)
- [X] View Details shows full booking info
- [X] Mark as Completed only shows within 1 day of event
- [X] Request Cancellation opens reason modal
- [X] Submitting cancellation reason sends notification to admin
- [X] Cancelled bookings show correct status

---

## 13. VENDOR QUOTES (`/vendor/quotes`)

- [x] Quotes list loads correctly
- [x] Client name shows in table (falls back to booking data)
- [x] Actions modal opens (not dropdown)
- [x] View Details modal shows correct client info (name, email, phone, source, event date, guest count)
- [x] Edit Quote modal pre-populates correctly
- [x] Save changes updates quote
- [x] Send to Client works and changes status to SENT
- [X] Status filter works
- [X] Search works

---

## 14. VENDOR SETTINGS (`/vendor/settings`)

- [X] Profile settings load correctly
- [X] Business name, description update correctly
- [X] Password change works

---

## 15. VENDOR DETAIL PAGE (`/vendors/[id]`) — Public

### General
- [x] Page loads correctly
- [x] Gallery images display
- [x] Vendor info (name, rating, location, categories) shows correctly
- [x] Favorite button works (authenticated users)
- [X] Favorite button prompts login for unauthenticated users

### Booking Flow
- [x] Services list loads correctly
- [x] Selecting/deselecting services works
- [x] Total price updates correctly
- [x] Guest count field works
- [x] Service compatibility warning shows when guest count exceeds limit
- [x] Booking form shows after clicking Book
- [x] Unauthenticated users are prompted to sign in
- [x] Booking progress saves to localStorage and restores after login
- [X] Successful booking creates booking in DB
- [X] Booking confirmation email sent to client
- [X] Booking notification sent to vendor

### Inquiry Form
- [x] Inquiry form opens
- [x] All fields validate correctly
- [x] Submitting sends inquiry successfully
- [X] Vendor receives new inquiry email

---

## 16. USER DASHBOARD (`/dashboard`)

### Bookings
- [X] Bookings list loads correctly
- [X] Booking details page loads
- [X] Booking status shows correctly
- [X] Cancelled bookings show refund notice

### Favorites
- [x] Favorites list loads
- [x] Remove from favorites works

### Inquiries
- [X] Inquiries list loads
- [X] Inquiry detail shows messages

### Quotes
- [X] Quotes list loads
- [X] Accept quote works → creates booking
- [X] Decline quote works
- [X] Quote review page (`/quotes/[id]`) loads correctly for client

### Settings (`/dashboard/settings`)
- [x] Profile update works (name, phone)
- [x] Password change works
- [x] Notification preferences save
- [X] Avatar upload works
- [X] Account info (role, email status, member since) displays

---

## 17. PUBLIC PAGES

- [x] Home page loads
- [x] Vendors listing page loads
- [X] Vendor search with filters (category, city, price) works
- [X] Search suggestions/autocomplete works
- [x] Category pages load
- [x] Vendor detail page loads for all vendors
- [x] Contact page form submits correctly
- [X] About page loads
- [X] Cookies page loads

---

## 18. EMAIL TEMPLATES

- [X] Welcome email sends on registration (correct design)
- [X] Email verification email sends (link works)
- [X] Password reset email sends (link works)
- [X] New inquiry email sends to vendor
- [X] Quote sent email sends to client
- [X] Booking confirmed email sends to client
- [X] Booking cancelled email sends to client (includes refund notice block)
- [X] Review request email sends after event
- [X] Vendor invite email sends (invite link works)
- [X] All emails use correct branding (logo, teal headings, grey background)
- [X] Logo loads from Cloudinary URL (not base64)

---

## 19. PAYMENTS (Stripe)

- [X] Stripe checkout session creates correctly
- [X] Successful payment updates booking status
- [X] Webhook receives and processes payment events
- [X] Failed payment shows error to user
- [X] Refund flow works (admin cancels → refund initiated)

---

## 20. MOBILE RESPONSIVENESS

- [x] Admin dashboard usable on mobile
- [x] Vendor detail page booking flow works on mobile
- [x] Modals display correctly on mobile
- [x] Navigation menus work on mobile
- [X] Vendor profile page usable on mobile
- [X] Dashboard pages usable on mobile
- [X] Tables scroll horizontally on small screens

---

## 21. EDGE CASES & ERROR STATES

- [x] Admin analytics with zero data shows 0s not errors
- [x] Vendor with no services shows empty state
- [x] Vendor with no reviews shows empty state
- [x] Booking with no listings selected shows validation error
- [x] Delete account with wrong password keeps button disabled
- [x] Pagination on last page doesn't break
- [X] Expired JWT session redirects to login gracefully
- [X] API rate limiting doesn't break normal usage
- [X] Upload with non-image file shows error
- [X] Upload with file too large shows error
- [X] Vendor with no cover image shows gradient fallback
- [X] Quote with no inquiry (direct booking quote) shows booking client info
- [X] Booking cancellation by admin when vendor had pending cancel request resolves correctly
