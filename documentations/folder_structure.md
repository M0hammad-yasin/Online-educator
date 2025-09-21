Directory structure:
└── m0hammad-yasin-online-educator/
    ├── README.md
    ├── package.json
    ├── client/
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   └── src/
    │       ├── App.tsx
    │       ├── main.tsx
    │       ├── routes.tsx
    │       ├── vite-env.d.ts
    │       ├── assets/
    │       │   └── auth-illustrations.tsx
    │       ├── components/
    │       │   └── layout/
    │       │       ├── index.ts
    │       │       ├── MainContent.tsx
    │       │       ├── header/
    │       │       │   └── Header.tsx
    │       │       └── sideBar/
    │       │           └── Sidebar.tsx
    │       ├── constants/
    │       │   ├── classStatus.ts
    │       │   ├── menu.ts
    │       │   ├── role.ts
    │       │   └── statCardOptions.ts
    │       ├── module/
    │       │   ├── admin/
    │       │   │   ├── index.ts
    │       │   │   └── types/
    │       │   │       └── index.ts
    │       │   ├── authentication/
    │       │   │   ├── index.ts
    │       │   │   ├── components/
    │       │   │   │   ├── ForgotPassword.module.css
    │       │   │   │   ├── ForgotPassword.tsx
    │       │   │   │   ├── index.ts
    │       │   │   │   ├── Login.module.css
    │       │   │   │   ├── Login.tsx
    │       │   │   │   ├── Logout.module.css
    │       │   │   │   ├── Logout.tsx
    │       │   │   │   ├── Register.tsx
    │       │   │   │   └── UserManagement.tsx
    │       │   │   ├── hooks/
    │       │   │   │   └── useAuth.ts
    │       │   │   ├── services/
    │       │   │   │   ├── auth.service.ts
    │       │   │   │   └── index.ts
    │       │   │   └── store/
    │       │   │       ├── authStore.ts
    │       │   │       └── index.ts
    │       │   ├── classes/
    │       │   │   ├── index.ts
    │       │   │   ├── components/
    │       │   │   │   ├── ClassBarChart.tsx
    │       │   │   │   ├── ClassForm.tsx
    │       │   │   │   ├── ClassList.tsx
    │       │   │   │   ├── ClassListCard.tsx
    │       │   │   │   ├── ClassRecentActivities.tsx
    │       │   │   │   ├── ClassStatsCard.tsx
    │       │   │   │   └── index.ts
    │       │   │   ├── hooks/
    │       │   │   │   └── useClasses.ts
    │       │   │   ├── services/
    │       │   │   │   └── class.service.ts
    │       │   │   ├── store/
    │       │   │   │   └── useClassStore.ts
    │       │   │   └── types/
    │       │   │       └── class.type.ts
    │       │   ├── moderator/
    │       │   │   └── types/
    │       │   │       └── index.ts
    │       │   ├── student/
    │       │   │   ├── index.ts
    │       │   │   ├── hooks/
    │       │   │   │   └── useStudents.ts
    │       │   │   ├── services/
    │       │   │   │   └── student.service.ts
    │       │   │   ├── store/
    │       │   │   │   └── useStudentStore.ts
    │       │   │   └── types/
    │       │   │       └── student.types.ts
    │       │   ├── teacher/
    │       │   │   ├── index.ts
    │       │   │   └── types/
    │       │   │       └── index.ts
    │       │   └── users/
    │       │       └── index.ts
    │       ├── pages/
    │       │   ├── README.md
    │       │   ├── index.ts
    │       │   ├── class/
    │       │   │   └── ClassPage.tsx
    │       │   ├── dashboard/
    │       │   │   ├── Dashboard.module.css
    │       │   │   ├── Dashboard.tsx
    │       │   │   ├── DashboardCopy.tsx
    │       │   │   ├── ItemList.module.css
    │       │   │   ├── ItemList.tsx
    │       │   │   ├── RecentActivities.module.css
    │       │   │   ├── RecentActivities.tsx
    │       │   │   ├── StatCard.tsx
    │       │   │   └── charts/
    │       │   │       ├── ClassesBarChart.tsx
    │       │   │       ├── RevenueLineChart.tsx
    │       │   │       └── StudentsPieChart.tsx
    │       │   ├── ForgotPassword/
    │       │   │   ├── ForgotPassword.module.css
    │       │   │   ├── ForgotPassword.tsx
    │       │   │   └── index.ts
    │       │   ├── Login/
    │       │   │   ├── index.ts
    │       │   │   ├── Login.module.css
    │       │   │   └── Login.tsx
    │       │   └── Profile/
    │       │       ├── index.ts
    │       │       └── Profile.tsx
    │       ├── routes/
    │       │   ├── AdminRoutes.tsx
    │       │   ├── AppRouter.tsx
    │       │   ├── index.ts
    │       │   ├── routeConfig.tsx
    │       │   ├── StudentRoutes.tsx
    │       │   └── TeacherRoutes.tsx
    │       ├── services/
    │       │   ├── index.ts
    │       │   └── api/
    │       │       ├── base.service.ts
    │       │       ├── client.ts
    │       │       ├── index.ts
    │       │       ├── response-transformer.ts
    │       │       ├── type.ts
    │       │       └── types.ts
    │       ├── store/
    │       │   ├── authStore.ts
    │       │   └── themeStore.ts
    │       ├── style/
    │       │   ├── App.css
    │       │   ├── header.css
    │       │   └── index.css
    │       └── theme/
    │           ├── themeConfig.ts
    │           └── ThemeProvider.tsx
    ├── documentations/
    │   └── api_docs.md
    └── server/
        ├── index.js
        ├── package.json
        ├── routeCreationRule.tldr
        ├── test-error-responses.js
        ├── test.js
        └── src/
            ├── app.js
            ├── constant.js
            ├── route.js
            ├── config/
            │   └── config.js
            ├── controllers/
            │   ├── common.controller.js
            │   ├── adminController/
            │   │   ├── admin.controller.js
            │   │   ├── common.admin.controlller.js
            │   │   └── moderator.admin.controller.js
            │   ├── classController/
            │   │   └── class.controller.js
            │   ├── StudentController/
            │   │   ├── class.student.controller.js
            │   │   └── student.controller.js
            │   └── TeacherController/
            │       └── teacher.controller.js
            ├── lib/
            │   ├── api.response.js
            │   └── custom.error.js
            ├── middleware/
            │   ├── auth.js
            │   ├── comparePassword.middleware.js
            │   ├── error.middleware.js
            │   ├── roleCheck.js
            │   └── validate.middleware.js
            ├── Prisma/
            │   ├── prisma.client.js
            │   └── tuition.prisma
            ├── routes/
            │   ├── admin.route.js
            │   ├── class.route.js
            │   ├── student.route.js
            │   └── teacher.route.js
            ├── Services/
            │   └── class.services.js
            ├── utils/
            │   ├── asyncWrapper.js
            │   ├── bcrypt.js
            │   ├── controller.helper.js
            │   ├── jwt.user.js
            │   └── pagination.js
            └── validation/
                ├── access.validate.js
                ├── admin.validate.js
                ├── class.validate.js
                ├── general.validate.js
                ├── login.validate.js
                ├── moderator.validate.js
                ├── mongoId.validate.js
                ├── pagination.validate.js
                ├── role.validate.js
                ├── student.validate.js
                ├── teacher.validate.js
                └── user.validate.js
