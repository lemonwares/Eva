# Vendor Profile Modal Components

This directory contains reusable modal components for editing vendor profile information on the vendor dashboard.

## Components

### ServiceModal
**File**: `ServiceModal.tsx`

Modal for adding and editing vendor services/packages.

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onSubmit: (data: ServiceData) => Promise<void>` - Handles form submission
- `initialData?: ServiceData` - Pre-filled data for editing mode
- `darkMode: boolean` - Dark mode theme toggle

**Data Structure**:
```typescript
interface ServiceData {
  headline: string;        // Service name
  longDescription: string; // Detailed description
  minPrice: number | null; // Minimum price in euros
  maxPrice: number | null; // Maximum price in euros
}
```

**Features**:
- Add new services or edit existing ones
- Price range validation and display
- Real-time price preview with Euro formatting
- Loading states and error handling
- Form validation (service name required)

---

### PhotoModal
**File**: `PhotoModal.tsx`

Modal for managing vendor portfolio photos.

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onSubmit: (file: File) => Promise<void>` - Handles photo upload
- `existingPhotos?: PhotoItem[]` - Array of existing photos
- `onDeletePhoto?: (photoUrl: string) => Promise<void>` - Handles photo deletion
- `darkMode: boolean` - Dark mode theme toggle

**Data Structure**:
```typescript
interface PhotoItem {
  url: string;      // Photo URL
  alt?: string;     // Alt text
}
```

**Features**:
- File upload with preview (drag & drop or click)
- File validation (images only, max 5MB)
- Gallery view of existing photos
- Delete photos with confirmation
- Loading states for upload/delete operations
- Success/error messages

---

### DescriptionModal
**File**: `DescriptionModal.tsx`

Modal for editing vendor business description.

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onSubmit: (description: string) => Promise<void>` - Handles submission
- `initialValue?: string` - Pre-filled description text
- `darkMode: boolean` - Dark mode theme toggle

**Features**:
- Character limit (1000 characters)
- Character counter with visual feedback
- Rich text area with line count
- Form validation (description required)
- Loading states and error handling

---

### InfoModal
**File**: `InfoModal.tsx`

Modal for editing vendor business contact information.

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onSubmit: (data: BusinessInfoData) => Promise<void>` - Handles submission
- `initialData?: BusinessInfoData` - Pre-filled contact information
- `darkMode: boolean` - Dark mode theme toggle

**Data Structure**:
```typescript
interface BusinessInfoData {
  location: string;    // Business location/address
  phone: string;       // Phone number
  email: string;       // Email address
  experience: string;  // Years of experience
}
```

**Features**:
- Location, phone, email, and experience fields
- Form validation (location and phone required)
- Loading states and error handling
- Graceful field handling (optional fields)

---

## Design Patterns

### Animation
All modals use **Framer Motion** for smooth enter/exit animations:
- Backdrop fades in/out
- Modal scales and slides up from below
- Exit animations mirror entry animations

### Dark Mode
All components are fully dark mode aware using the `darkMode` prop:
- Dark backgrounds: `bg-[#1a1a1a]`
- Light backgrounds: `bg-white`
- Text colors adapt automatically
- Hover states respect theme

### Error Handling
- Try-catch blocks wrap async operations
- User-friendly error messages displayed in modals
- Form submission disabled during loading
- Close button disabled while submitting

### State Management
- Modal open/close controlled by parent component
- Form data validated before submission
- Loading states prevent double submission
- Success messages shown on completion

---

## Integration with Vendor Profile Page

Located in `/app/vendor/profile/page.tsx`:

```typescript
// Import modals
import ServiceModal from "@/components/vendor/modals/ServiceModal";
import PhotoModal from "@/components/vendor/modals/PhotoModal";
import DescriptionModal from "@/components/vendor/modals/DescriptionModal";
import InfoModal from "@/components/vendor/modals/InfoModal";

// State management
const [serviceModalOpen, setServiceModalOpen] = useState(false);
const [photoModalOpen, setPhotoModalOpen] = useState(false);
const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
const [infoModalOpen, setInfoModalOpen] = useState(false);
const [editingService, setEditingService] = useState<Listing | null>(null);

// Handler functions
const handleServiceSubmit = async (data: ServiceData) => { ... }
const handleAddPhoto = async (file: File) => { ... }
const handleDeletePhoto = async (photoUrl: string) => { ... }
const handleSaveDescription = async (description: string) => { ... }
const handleSaveInfo = async (data: BusinessInfoData) => { ... }

// Render modals
<ServiceModal
  isOpen={serviceModalOpen}
  onClose={() => {
    setServiceModalOpen(false);
    setEditingService(null);
  }}
  onSubmit={handleServiceSubmit}
  darkMode={darkMode}
/>
```

---

## API Integration

### Services
- **Add**: `POST /api/vendor/listings`
- **Update**: `PUT /api/vendor/listings/{id}`

### Photos
- **Upload**: `POST /api/upload`
- **Update Profile**: `PUT /api/vendor/profile`

### Description & Info
- **Update**: `PUT /api/vendor/profile`

---

## Styling

All modals follow the app's design system:
- **Accent Color**: Used for primary buttons and active states
- **Dark Mode**: Full support with CSS custom properties
- **Border Radius**: `rounded-lg` (8px) and `rounded-xl` (12px)
- **Shadows**: Subtle shadows with backdrop blur effect
- **Transitions**: Smooth 200-300ms transitions for all interactive elements

---

## Future Enhancements

- [ ] Add image cropping tool for photo uploads
- [ ] Implement service templates
- [ ] Add category selection for services
- [ ] Service availability calendar
- [ ] Photo reordering/sorting
- [ ] Bulk photo operations
- [ ] SEO meta description editing
- [ ] Social media link editing
