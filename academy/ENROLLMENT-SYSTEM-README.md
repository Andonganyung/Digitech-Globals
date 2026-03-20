# DigiTech Academy Enrollment System

## Overview
Complete student registration and application management system with role-based access control.

## Features
- ✅ Course registration with comprehensive application form
- ✅ Username/password authentication
- ✅ Role-based dashboards (candidate & admin)
- ✅ Application status tracking (pending/approved/declined)
- ✅ Admin approval workflow
- ✅ Data isolation per user
- ✅ Secure validation and authentication

## User Roles

### Candidate
- Register for courses via application form
- Create unique username and password
- Access personal dashboard
- View own application status
- View submitted profile and documents

### Admin
- View all candidate applications
- Approve or decline applications
- Search and filter applications
- View detailed candidate information

## Files Created

### Pages
- `register.html` - Course registration application form
- `login.html` - User login page
- `candidate-dashboard.html` - Candidate private dashboard
- `admin-dashboard.html` - Admin management dashboard

### Scripts
- `js/register.js` - Registration form validation and submission
- `update-enroll-links.ps1` - Utility to update all Enroll buttons

## How It Works

### 1. Course Enrollment
- User clicks "Enroll" on any course
- Redirected to `register.html?course=COURSE_ID`
- Course info auto-populated in form

### 2. Registration
User submits:
- Personal info (name, DOB, gender)
- Contact (email, phone, address)
- Education & employment
- Course preferences
- Personal statement
- Optional document upload
- Username & password (validated)
- Terms agreement

### 3. Account Creation
- Validates username uniqueness
- Validates password requirements (8+ chars, mixed case, numbers, special chars)
- Creates candidate account
- Stores application with "pending" status
- Redirects to login

### 4. Login
- Username/email + password
- Routes to appropriate dashboard based on role

### 5. Candidate Dashboard
- View application ID and status
- See all submitted details
- Status badge (pending/approved/declined)

### 6. Admin Dashboard
- View all applications
- Filter by status or search
- Click "View" for full details
- Approve or decline pending applications
- Stats overview

## Default Admin Account

**Username:** `admin`  
**Email:** `admin@digitechglobals.com`  
**Password:** `Admin@123`

## Data Storage

Currently uses `localStorage` (simulates backend):
- `applications` - All candidate applications
- `users` - All user accounts

### Production Setup
Replace localStorage with:
- Backend API (Node.js, Python, PHP)
- Database (MySQL, PostgreSQL, MongoDB)
- Password hashing (bcrypt)
- File storage (AWS S3, Azure Blob)
- Email notifications

## Security Features

- Password validation (min 8 chars, uppercase, lowercase, number, special char)
- Username uniqueness check
- Email uniqueness check
- Form validation (client-side)
- Role-based access control
- Session management
- Data isolation (users only see own data)

## Validation Rules

### Required Fields
- First name, last name
- Email (valid format)
- Phone, address, city, state, country
- Date of birth, gender
- Education level, employment status
- Study mode, personal statement (50+ chars)
- Username (4+ chars, unique)
- Password (8+ chars, meets complexity)
- Password confirmation (must match)
- Terms acceptance

### Optional
- ID/document upload

## Course IDs
All course enrollments use these IDs:
- it-support-fundamentals
- helpdesk-pro
- enterprise-desktop-engineer
- az-900, az-104
- cybersec-essentials, security-plus
- ms-900, intune-endpoint
- sccm-intune-endpoint
- networking-fundamentals, ccna-prep
- powershell-it, python-it, ai-for-it-engineers
- (27 total courses)

## Workflow

```
User → Browse Courses → Click Enroll → Register → Submit → Login → Dashboard
                                                                      ↓
Admin → Login → Admin Dashboard → View Applications → Approve/Decline
```

## Testing

1. **Register as Candidate**
   - Go to any course page
   - Click "Enroll"
   - Fill registration form
   - Submit

2. **Login as Candidate**
   - Use created username/password
   - View dashboard

3. **Login as Admin**
   - Username: `admin`
   - Password: `Admin@123`
   - View all applications
   - Approve/decline

## Next Steps (Production)

1. Backend API development
2. Database schema implementation
3. Password hashing
4. Email verification
5. Payment integration (Stripe)
6. File upload to cloud storage
7. Email notifications
8. Admin notes/comments
9. Application export (PDF/Excel)
10. Advanced analytics

## Notes

- System auto-creates admin account on first load
- All data persists in browser localStorage
- Clear localStorage to reset data
- Mobile responsive design
- Professional university-style UX
