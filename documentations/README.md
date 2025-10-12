# Online Educator Platform - Documentation

Welcome to the comprehensive documentation for the Online Educator Platform. This guide will help you understand, use, and contribute to the platform.

## 📚 Documentation Overview

This documentation is organized into several comprehensive guides:

### 1. [API Documentation](./API_DOCUMENTATION.md)
Complete reference for all server and client APIs, including:
- Server API endpoints with request/response examples
- Authentication and authorization
- Client-side API services
- React Query hooks
- Error handling
- Response formats

**Perfect for**: Developers integrating with the API, building features, or understanding the backend architecture.

### 2. [Components Guide](./COMPONENTS_GUIDE.md)
Detailed guide to all React components:
- Layout components (Header, Sidebar, MainContent)
- Page components (Dashboard, Students, Teachers, Classes)
- Form components and patterns
- Component props and usage examples
- Styling guidelines
- Component patterns (HOC, Compound, Render Props)

**Perfect for**: Frontend developers building UI features or customizing the interface.

### 3. [Hooks and Utilities](./HOOKS_AND_UTILITIES.md)
In-depth coverage of custom hooks and utility functions:
- Custom React hooks (useDebounce, useAuth, useStudents, etc.)
- React Query hooks for data fetching
- Server-side utilities (asyncWrapper, error handling, pagination)
- State management with Zustand
- Validation schemas

**Perfect for**: Developers working with state management, data fetching, or building reusable logic.

### 4. [Development Guide](./DEVELOPMENT_GUIDE.md)
Complete guide for setting up and developing:
- Getting started and installation
- Project structure
- Development workflow
- Adding new features (step-by-step)
- Testing strategies
- Deployment instructions
- Troubleshooting common issues

**Perfect for**: New developers joining the project or setting up the development environment.

### 5. [Usage Examples](./USAGE_EXAMPLES.md)
Real-world, copy-paste examples:
- Complete authentication flow
- CRUD operations for students, teachers, classes
- Dashboard implementation
- Advanced patterns (infinite scroll, real-time updates, dynamic forms)
- Export functionality

**Perfect for**: Developers who learn by example and want quick implementation references.

---

## 🚀 Quick Start

### For New Developers

1. **Start here**: [Development Guide - Getting Started](./DEVELOPMENT_GUIDE.md#getting-started)
2. **Then read**: [Project Structure](./DEVELOPMENT_GUIDE.md#project-structure)
3. **Finally explore**: [Usage Examples](./USAGE_EXAMPLES.md)

### For API Consumers

1. **Start here**: [API Documentation - Overview](./API_DOCUMENTATION.md#overview)
2. **Then explore**: [Server API Endpoints](./API_DOCUMENTATION.md#server-api-endpoints)
3. **Finally check**: [Client API Services](./API_DOCUMENTATION.md#client-api-services)

### For Frontend Developers

1. **Start here**: [Components Guide](./COMPONENTS_GUIDE.md)
2. **Then read**: [Hooks and Utilities](./HOOKS_AND_UTILITIES.md)
3. **Finally explore**: [Usage Examples - Advanced Patterns](./USAGE_EXAMPLES.md#advanced-patterns)

---

## 📖 Documentation by Feature

### Authentication & Authorization

- **API**: [Admin API](./API_DOCUMENTATION.md#1-admin-api) | [Student API - Login](./API_DOCUMENTATION.md#login-student) | [Teacher API - Login](./API_DOCUMENTATION.md#login-teacher)
- **Client**: [Auth Service](./API_DOCUMENTATION.md#authentication-service) | [Auth Hooks](./HOOKS_AND_UTILITIES.md#authentication-hooks)
- **Components**: [Login Page](./COMPONENTS_GUIDE.md#login-page)
- **Examples**: [Complete Authentication Flow](./USAGE_EXAMPLES.md#authentication-flow)

### Student Management

- **API**: [Student API Endpoints](./API_DOCUMENTATION.md#2-student-api)
- **Client**: [Student Service](./API_DOCUMENTATION.md#student-service) | [Student Hooks](./HOOKS_AND_UTILITIES.md#student-hooks)
- **Components**: [Students Page](./COMPONENTS_GUIDE.md#studentspage)
- **Examples**: [Complete CRUD Implementation](./USAGE_EXAMPLES.md#student-management)

### Teacher Management

- **API**: [Teacher API Endpoints](./API_DOCUMENTATION.md#3-teacher-api)
- **Client**: [Teacher Service](./API_DOCUMENTATION.md#teacher-service) | [Teacher Hooks](./HOOKS_AND_UTILITIES.md#teacher-hooks)
- **Components**: Teachers Page
- **Examples**: Similar to Student Management

### Class Management

- **API**: [Class API Endpoints](./API_DOCUMENTATION.md#4-class-api)
- **Client**: [Class Service](./API_DOCUMENTATION.md#class-service) | [Class Hooks](./HOOKS_AND_UTILITIES.md#class-hooks)
- **Components**: [Class Components](./COMPONENTS_GUIDE.md#class-management-components)
- **Examples**: [Class Calendar](./USAGE_EXAMPLES.md#class-management)

### Dashboard & Analytics

- **Components**: [Dashboard Components](./COMPONENTS_GUIDE.md#dashboard-components) | [Charts](./COMPONENTS_GUIDE.md#chart-components)
- **Examples**: [Admin Dashboard](./USAGE_EXAMPLES.md#dashboard-implementation)

---

## 🛠️ Common Tasks

### How do I...

#### Add a new API endpoint?
→ [Development Guide - Adding New Features](./DEVELOPMENT_GUIDE.md#adding-a-new-api-endpoint)

#### Create a new page?
→ [Development Guide - Adding Client-Side Features](./DEVELOPMENT_GUIDE.md#adding-a-client-side-feature)

#### Fetch data from the API?
→ [Hooks and Utilities - React Query Hooks](./HOOKS_AND_UTILITIES.md#react-query-hooks)

#### Implement authentication?
→ [Usage Examples - Authentication Flow](./USAGE_EXAMPLES.md#authentication-flow)

#### Handle forms?
→ [Components Guide - Form Components](./COMPONENTS_GUIDE.md#form-components)

#### Implement pagination?
→ [API Documentation - Pagination](./API_DOCUMENTATION.md#common-query-parameters)

#### Handle errors?
→ [API Documentation - Error Handling](./API_DOCUMENTATION.md#error-handling)

#### Protect routes?
→ [Usage Examples - Protected Route](./USAGE_EXAMPLES.md#protected-route-implementation)

#### Style components?
→ [Components Guide - Styling Guidelines](./COMPONENTS_GUIDE.md#styling-guidelines)

#### Deploy the application?
→ [Development Guide - Deployment](./DEVELOPMENT_GUIDE.md#deployment)

---

## 📊 API Reference Quick Links

### Endpoints

**Admin**
- [POST /api/admin/register](./API_DOCUMENTATION.md#register-admin)
- [POST /api/admin/login](./API_DOCUMENTATION.md#login-admin)
- [GET /api/admin/me](./API_DOCUMENTATION.md#get-admin-profile)

**Students**
- [GET /api/student](./API_DOCUMENTATION.md#get-all-students-adminmoderatorteacher)
- [POST /api/student/register](./API_DOCUMENTATION.md#register-student)
- [GET /api/student/:id](./API_DOCUMENTATION.md#get-student-by-id)
- [PUT /api/student/:id](./API_DOCUMENTATION.md#update-student-by-adminmoderatorteacher)
- [DELETE /api/student/:id](./API_DOCUMENTATION.md#delete-student)

**Teachers**
- [GET /api/teacher](./API_DOCUMENTATION.md#get-all-teachers)
- [POST /api/teacher/register](./API_DOCUMENTATION.md#register-teacher)
- [GET /api/teacher/:id](./API_DOCUMENTATION.md#get-teacher-by-id)
- [PUT /api/teacher/:id](./API_DOCUMENTATION.md#update-teacher)
- [DELETE /api/teacher/:id](./API_DOCUMENTATION.md#delete-teacher)

**Classes**
- [GET /api/class](./API_DOCUMENTATION.md#get-all-classes)
- [POST /api/class/create](./API_DOCUMENTATION.md#create-class)
- [GET /api/class/:id](./API_DOCUMENTATION.md#get-class-by-id)
- [PUT /api/class/:id](./API_DOCUMENTATION.md#update-class)
- [DELETE /api/class/:id](./API_DOCUMENTATION.md#delete-class)
- [GET /api/class/calander-view](./API_DOCUMENTATION.md#get-calendar-view-classes)

---

## 🎨 Component Reference Quick Links

**Layout**
- [AppHeader](./COMPONENTS_GUIDE.md#appheader)
- [Sidebar](./COMPONENTS_GUIDE.md#sidebar)
- [MainContent](./COMPONENTS_GUIDE.md#maincontent)

**Dashboard**
- [StatCard](./COMPONENTS_GUIDE.md#statcard)
- [RecentActivities](./COMPONENTS_GUIDE.md#recentactivities)
- [StudentsPieChart](./COMPONENTS_GUIDE.md#studentspiechart)
- [ClassesBarChart](./COMPONENTS_GUIDE.md#classesbarchart)

**Pages**
- [ClassListPage](./COMPONENTS_GUIDE.md#classlistpage)
- [ClassCreatePage](./COMPONENTS_GUIDE.md#classcreatepage)
- [StudentsPage](./COMPONENTS_GUIDE.md#studentspage)
- [Login](./COMPONENTS_GUIDE.md#login-page)
- [Profile](./COMPONENTS_GUIDE.md#profile-page)

---

## 🔧 Utility Reference Quick Links

**Custom Hooks**
- [useDebounce](./HOOKS_AND_UTILITIES.md#usedebounce)
- [useAuth](./HOOKS_AND_UTILITIES.md#useauth)
- [useStudents](./HOOKS_AND_UTILITIES.md#usestudents)
- [useTeachers](./HOOKS_AND_UTILITIES.md#teacher-hooks)
- [useClasses](./HOOKS_AND_UTILITIES.md#class-hooks)

**Server Utilities**
- [asyncWrapper](./HOOKS_AND_UTILITIES.md#asyncwrapper)
- [sendSuccess / sendError](./HOOKS_AND_UTILITIES.md#sendsuccess--senderror)
- [Custom Error Classes](./HOOKS_AND_UTILITIES.md#custom-error-classes)
- [Password Utilities](./HOOKS_AND_UTILITIES.md#password-utilities)
- [JWT Utilities](./HOOKS_AND_UTILITIES.md#jwt-utilities)

**State Management**
- [Theme Store](./HOOKS_AND_UTILITIES.md#theme-store)
- [Auth Store](./HOOKS_AND_UTILITIES.md#auth-store)
- [Student Store](./HOOKS_AND_UTILITIES.md#module-stores)

---

## 🎯 Best Practices

### API Development
- Use `asyncWrapper` for all async route handlers
- Always validate input with Zod schemas
- Return standardized responses with `sendSuccess`/`sendError`
- Implement proper error handling
- Add pagination for list endpoints

### Frontend Development
- Use React Query for all data fetching
- Implement debouncing for search inputs
- Add loading and error states
- Use TypeScript for type safety
- Follow component composition patterns

### Code Organization
- Keep components under 300 lines
- Extract reusable logic into hooks
- Use proper folder structure
- Write meaningful comments
- Follow naming conventions

---

## 📝 Additional Resources

### Legacy Documentation
- [API Structure (PDF)](./api_structure.pdf)
- [Folder Structure](./folder_structure.md)
- [Old API Docs](./api_docs.md)

### External Resources
- [React Query Documentation](https://tanstack.com/query/latest)
- [Ant Design Components](https://ant.design/components/overview/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 🤝 Contributing

When contributing to documentation:

1. **Be clear and concise**: Use simple language and clear examples
2. **Provide examples**: Show real, working code examples
3. **Keep it updated**: Update docs when changing features
4. **Follow the structure**: Maintain consistent formatting
5. **Link appropriately**: Cross-reference related documentation

---

## 📞 Support

If you have questions or need help:

1. **Check the docs**: Search this documentation first
2. **Common issues**: See [Troubleshooting](./DEVELOPMENT_GUIDE.md#troubleshooting)
3. **Examples**: Check [Usage Examples](./USAGE_EXAMPLES.md) for patterns
4. **Ask the team**: Reach out to the development team

---

## 📄 License

[Add your license information here]

---

**Documentation Version**: 1.0.0  
**Last Updated**: 2024-01-01  
**Maintained by**: Development Team

---

## 📑 Version History

### Version 1.0.0 (2024-01-01)
- Initial comprehensive documentation
- Complete API reference
- Component guide
- Hooks and utilities documentation
- Development guide
- Usage examples
