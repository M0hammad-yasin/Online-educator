# Authentication Pages

This directory contains modern, visually engaging authentication pages for the Online Educator platform.

## Pages Included

### Login Page
A modern login page with a clean, visually appealing design featuring:
- Email and password form with validation
- Remember me functionality
- Forgot password link
- Sign up link
- Responsive design with an attractive illustration

### Forgot Password Page
A user-friendly password recovery page featuring:
- Email input with validation
- Success confirmation screen
- Back to login link
- Responsive design with background graphics

### Logout Page
A visually appealing logout confirmation page featuring:
- Loading animation during logout process
- Success confirmation screen
- Options to log back in or return to home
- Responsive design with background graphics

## Integration Instructions

To integrate these pages into your application:

1. **Update your routing configuration**

Add routes for the new pages in your router configuration:

```jsx
import { Login, ForgotPassword, Logout } from './pages';

// In your router configuration:
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/logout" element={<Logout />} />
  {/* Your existing routes */}
</Routes>
```

2. **Add navigation links**

Add links to these pages in your header or navigation components:

```jsx
import { Link } from 'react-router-dom';

// In your navigation component:
<Link to="/login">Login</Link>
<Link to="/logout">Logout</Link>
```

3. **Authentication Integration**

Update the form submission handlers in these components to work with your actual authentication system:

- In `Login.tsx`, modify the `onFinish` function to use your authentication API
- In `ForgotPassword.tsx`, update the `onFinish` function to call your password reset API
- In `Logout.tsx`, modify the `useEffect` hook to properly clear authentication tokens

## Design Notes

These pages use a consistent design language with:
- Clean, modern UI with ample white space
- Gradient backgrounds and subtle patterns
- Responsive layouts that work on all device sizes
- Consistent color scheme using the primary blue (#1677ff) from the dashboard
- SVG illustrations and icons for visual appeal
- Smooth animations and transitions