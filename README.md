# Online Educator Platform

A comprehensive online education management system built with React, TypeScript, Node.js, Express, and Prisma.

## 🎯 Overview

The Online Educator Platform is a full-stack web application designed to manage students, teachers, classes, and educational activities. It provides role-based access for administrators, moderators, teachers, and students with a modern, responsive interface.

### Key Features

- 🔐 **Authentication & Authorization**: Role-based access control (Admin, Moderator, Teacher, Student)
- 👥 **User Management**: Complete CRUD operations for students and teachers
- 📚 **Class Management**: Create, schedule, and manage classes with calendar view
- 📊 **Dashboard & Analytics**: Real-time statistics and data visualization
- 🎨 **Modern UI**: Responsive design with Ant Design components
- 🔍 **Advanced Search**: Filtering, sorting, and pagination
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Database (MongoDB or PostgreSQL)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd online-educator

# Install all dependencies (root, server, and client)
npm run install:all

# Configure environment variables
# Create .env files in server/ and client/ directories
# See documentation for required variables

# Set up database
cd server
npx prisma generate
npx prisma db push

# Start development servers
cd ..
npm run dev
```

The application will be available at:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3000

## 📚 Documentation

Comprehensive documentation is available in the `documentations/` folder:

### 📖 [Complete Documentation Index](./documentations/README.md)

### Quick Links

- **[API Documentation](./documentations/API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Components Guide](./documentations/COMPONENTS_GUIDE.md)** - React components and their usage
- **[Hooks & Utilities](./documentations/HOOKS_AND_UTILITIES.md)** - Custom hooks and utility functions
- **[Development Guide](./documentations/DEVELOPMENT_GUIDE.md)** - Setup and development workflow
- **[Usage Examples](./documentations/USAGE_EXAMPLES.md)** - Real-world implementation examples

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - UI component library
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
online-educator/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── module/      # Feature modules
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom hooks
│   │   ├── store/       # State management
│   │   └── routes/      # Route configuration
│   └── ...
├── server/              # Node.js backend application
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── utils/       # Utility functions
│   │   ├── validation/  # Input validation
│   │   └── Prisma/      # Database schema
│   └── ...
├── documentations/      # Complete documentation
└── ...
```

## 🎨 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png) *(Add your screenshot)*

### Class Management
![Classes](./screenshots/classes.png) *(Add your screenshot)*

## 🔑 Default Credentials

For development/testing purposes:

```
Admin:
Email: admin@example.com
Password: admin123

Teacher:
Email: teacher@example.com
Password: teacher123

Student:
Email: student@example.com
Password: student123
```

**⚠️ Important**: Change these credentials in production!

## 📝 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/teacher/login` - Teacher login
- `POST /api/student/login` - Student login

### Students
- `GET /api/student` - Get all students
- `POST /api/student/register` - Create student
- `GET /api/student/:id` - Get student by ID
- `PUT /api/student/:id` - Update student
- `DELETE /api/student/:id` - Delete student

### Teachers
- `GET /api/teacher` - Get all teachers
- `POST /api/teacher/register` - Create teacher
- `GET /api/teacher/:id` - Get teacher by ID

### Classes
- `GET /api/class` - Get all classes
- `POST /api/class/create` - Create class
- `GET /api/class/:id` - Get class by ID
- `GET /api/class/calander-view` - Get calendar view

**See [API Documentation](./documentations/API_DOCUMENTATION.md) for complete reference**

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🚢 Deployment

### Build for Production

```bash
# Build client
cd client
npm run build

# Build server (if using TypeScript)
cd server
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
docker-compose up -d
```

See [Development Guide - Deployment](./documentations/DEVELOPMENT_GUIDE.md#deployment) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build/tooling changes

## 📄 License

[Add your license here]

## 👥 Team

[Add team members and their roles]

## 📞 Support

- **Documentation**: See [documentations/](./documentations/)
- **Issues**: Open an issue on GitHub
- **Email**: [your-email@example.com]

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) for UI components
- [Prisma](https://www.prisma.io/) for database ORM
- [React Query](https://tanstack.com/query/latest) for data fetching
- All contributors and users of this platform

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-01

For detailed documentation, visit the [Documentation Index](./documentations/README.md)