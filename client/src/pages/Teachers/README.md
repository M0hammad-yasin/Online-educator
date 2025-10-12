# Teachers Management Dashboard

A modern, data-driven dashboard page for managing teachers in an online educator platform.

## Overview

This dashboard provides Admin and Moderator roles with comprehensive tools to view, filter, and manage teachers, as well as monitor their classes and performance.

## Features

### 1. Role-Based Access Control
- **Admin**: Full CRUD access + access control management
- **Moderator**: Read + limited update access (no delete or access control)
- **Teacher/Student**: No access (page and menu item hidden)

### 2. Dashboard Components

#### Summary Cards Widget
- **Total Teachers**: Overall teacher count
- **Active Teachers**: Teachers with assigned classes
- **Total Classes Taught**: Cumulative class count across all teachers
- **Average Classes per Teacher**: Performance metric

#### Filters & Search Widget
- Search by name or email (debounced)
- Filter by qualification (B.Ed, M.Ed, Ph.D, etc.)
- Sort options (name, email, date joined)
- Reset filters functionality

#### Teacher List Widget
- List view with avatars and detailed information
- Status indicators (Active, Pending Verification)
- Qualification and hourly rate display
- Role-based action buttons:
  - View Details (All)
  - Edit (Admin/Moderator)
  - Delete (Admin only)
- Pagination with size controls

#### Teacher Detail Drawer
- Comprehensive teacher profile
- Class statistics (total, active)
- List of assigned classes
- Access control panel (Admin only)

#### Access Management Panel (Admin Only)
- Toggle permissions for each teacher:
  - View Classes
  - Create Classes
  - Update Classes
  - Delete Classes
- Real-time permission updates
- Visual feedback with switches

### 3. Technical Architecture

#### Config-Driven Widget System
```typescript
// widgets/config.ts
export const WidgetsConfig: PageWidgetsConfig = {
  top: [
    { key: 'SummaryCards', roles: [Role.ADMIN, Role.MODERATOR] },
    { key: 'FiltersBar', roles: [Role.ADMIN, Role.MODERATOR] },
  ],
  main: [
    { key: 'TeacherList', roles: [Role.ADMIN, Role.MODERATOR] },
  ],
};
```

Widgets automatically render or hide based on user role without manual layout adjustments.

#### Data Sources & APIs
- `GET /teacher` - List all teachers with pagination
- `GET /teacher/:id` - Get teacher by ID
- `GET /teacher/classes` - Teachers with their classes
- `GET /teacher/class-count` - Teachers with class count
- `POST /teacher/class-day-count` - Class count by day
- `GET /teacher/select` - Teachers for selection dropdowns
- `PUT /teacher/:id` - Update teacher (Admin/Moderator)
- `DELETE /teacher/:id` - Delete teacher (Admin)
- `PUT /teacher/:id/access-control` - Manage permissions (Admin)

#### State Management
- Zustand store for filters and UI state
- React Query for server state and caching
- Optimistic updates for better UX

### 4. File Structure

```
client/src/pages/Teachers/
├── TeachersPage.tsx           # Main page component
├── index.ts                   # Exports
├── README.md                  # This file
└── widgets/
    ├── config.ts              # Widget configuration
    ├── SummaryCards.tsx       # Statistics cards
    ├── FiltersBar.tsx         # Search and filters
    ├── TeacherList.tsx        # Teacher list with actions
    ├── TeacherDetailDrawer.tsx # Teacher profile drawer
    ├── TeacherEditModal.tsx   # Edit teacher modal
    └── AccessControlPanel.tsx # Permission management (Admin)

client/src/module/teacher/
├── hooks/
│   ├── useTeachers.ts         # Teacher CRUD hooks
│   └── useTeacherStatistics.ts # Statistics hooks
├── services/
│   ├── teacher.service.ts     # Teacher API service
│   └── teacherStatistics.service.ts # Statistics service
├── store/
│   └── useTeacherStore.ts     # Zustand state management
└── types/
    └── teacher.types.ts       # TypeScript types

client/src/module/admin/
└── services/
    └── access-control.service.ts # Access control API
```

### 5. Design Principles

#### Scalability
- Adding new widgets requires only config updates
- No UI logic rewrite needed
- Easy to extend with new features

#### Consistency
- Matches Students and Classes dashboard design
- Uses Ant Design components
- Consistent spacing, colors, and shadows
- Glass morphism card style

#### Performance
- Query caching with React Query
- Debounced search (300ms)
- Pagination for large datasets
- Optimistic updates

#### Accessibility
- Clear role-based permissions
- Tooltip descriptions
- Loading states
- Error handling

### 6. Usage

#### For Admins
1. View all teachers and statistics
2. Search and filter teachers
3. Create, edit, or delete teachers
4. View detailed teacher profiles
5. Manage class permissions per teacher
6. Monitor class assignments

#### For Moderators
1. View all teachers and statistics
2. Search and filter teachers
3. Edit teacher information
4. View detailed teacher profiles
5. Monitor class assignments
6. **Cannot** delete teachers or modify access control

### 7. Future Enhancements

- [ ] Export teacher data to CSV/PDF
- [ ] Bulk operations (assign classes, etc.)
- [ ] Performance charts and analytics
- [ ] Teacher activity feed
- [ ] Advanced filtering (by region, date range)
- [ ] Email verification management
- [ ] Batch import teachers

### 8. Menu Integration

The "Manage Teachers" menu item is automatically shown for Admin and Moderator roles:

```typescript
// constants/menu.ts
[Role.ADMIN]: [
  { key: 2, label: "Manage Teachers", path: "/teachers", icon: "UserOutlined" }
],
[Role.MODERATOR]: [
  { key: 2, label: "Manage Teachers", path: "/teachers", icon: "UserOutlined" }
]
```

### 9. Route Protection

Routes are protected by role-based middleware:

```typescript
// routes/routeConfig.tsx
{
  path: '/teachers',
  component: TeachersPage,
  allowedRoles: [Role.ADMIN, Role.MODERATOR],
  title: 'Manage Teachers'
}
```

## Development

### Adding a New Widget

1. Create widget component in `widgets/`
2. Add to widget renderer in `TeachersPage.tsx`
3. Configure in `widgets/config.ts` with role restrictions

### Modifying Permissions

Update the access control interface in:
- `module/admin/services/access-control.service.ts`
- `pages/Teachers/widgets/AccessControlPanel.tsx`

### Styling

All styles use Ant Design theme tokens for consistency and theme support.
