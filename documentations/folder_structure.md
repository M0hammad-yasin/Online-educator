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
    │       │   ├── AppSkeleton.tsx
    │       │   ├── AuthenticatedNotFound.tsx
    │       │   ├── PublicNotFound.tsx
    │       │   ├── layout/
    │       │   │   ├── index.ts
    │       │   │   ├── MainContent.tsx
    │       │   │   ├── header/
    │       │   │   │   └── Header.tsx
    │       │   │   └── sideBar/
    │       │   │       └── Sidebar.tsx
    │       │   └── widgets/
    │       │       ├── ErrorBoundary.tsx
    │       │       ├── HighlightedText.tsx
    │       │       ├── index.ts
    │       │       └── SearchBox.tsx
    │       ├── constants/
    │       │   ├── classStatus.ts
    │       │   ├── menu.ts
    │       │   ├── role.ts
    │       │   └── statCardOptions.ts
    │       ├── hooks/
    │       │   ├── index.ts
    │       │   ├── useDebounce.ts
    │       │   ├── useHighlightMatch.tsx
    │       │   └── useRole.ts
    │       ├── module/
    │       │   ├── admin/
    │       │   │   ├── index.ts
    │       │   │   ├── services/
    │       │   │   │   └── access-control.service.ts
    │       │   │   └── types/
    │       │   │       ├── admin.types.ts
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
    │       │   │   ├── store/
    │       │   │   │   ├── authStore.ts
    │       │   │   │   └── index.ts
    │       │   │   └── types/
    │       │   │       └── authentication.types.ts
    │       │   ├── classes/
    │       │   │   ├── index.ts
    │       │   │   ├── components/
    │       │   │   │   ├── ClassBarChart.tsx
    │       │   │   │   ├── ClassForm.tsx
    │       │   │   │   ├── ClassListCard.tsx
    │       │   │   │   ├── ClassLiveList.tsx
    │       │   │   │   ├── ClassMiniStatsRow.tsx
    │       │   │   │   ├── ClassQuickActions.tsx
    │       │   │   │   ├── ClassRecentActivities.tsx
    │       │   │   │   ├── ClassStatsCard.tsx
    │       │   │   │   ├── index.ts
    │       │   │   │   ├── cards/
    │       │   │   │   │   └── StatTile.tsx
    │       │   │   │   ├── classDetail/
    │       │   │   │   │   ├── ClassDetail.css
    │       │   │   │   │   └── ClassDetail.tsx
    │       │   │   │   ├── ClassGraph/
    │       │   │   │   │   ├── ClassChartFilter.tsx
    │       │   │   │   │   └── ClassPerDayChart.tsx
    │       │   │   │   ├── classList/
    │       │   │   │   │   ├── ClassFilters.tsx
    │       │   │   │   │   ├── ClassList.css
    │       │   │   │   │   ├── ClassList.tsx
    │       │   │   │   │   ├── SearchBox.tsx
    │       │   │   │   │   └── SortableHeader.tsx
    │       │   │   │   └── updateClass/
    │       │   │   │       └── UpdateClass.tsx
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
    │       │   │   ├── components/
    │       │   │   │   ├── AddStudentModal.tsx
    │       │   │   │   ├── index.ts
    │       │   │   │   ├── StudentCharts.tsx
    │       │   │   │   ├── StudentFilterBar.tsx
    │       │   │   │   ├── StudentPageHeader.tsx
    │       │   │   │   ├── StudentStatsCards.tsx
    │       │   │   │   └── StudentTable.tsx
    │       │   │   ├── config/
    │       │   │   │   └── config.ts
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
    │       │   │   ├── components/
    │       │   │   │   ├── AccessControlPanel.tsx
    │       │   │   │   ├── FiltersBar.tsx
    │       │   │   │   ├── index.ts
    │       │   │   │   ├── PerformanceCharts.tsx
    │       │   │   │   ├── SummaryCards.tsx
    │       │   │   │   ├── TeacherDetailDrawer.tsx
    │       │   │   │   ├── TeacherEditModal.tsx
    │       │   │   │   └── TeacherList.tsx
    │       │   │   ├── config/
    │       │   │   │   └── teacher.config.ts
    │       │   │   ├── hooks/
    │       │   │   │   ├── useTeachers.ts
    │       │   │   │   └── useTeacherStatistics.ts
    │       │   │   ├── services/
    │       │   │   │   ├── teacher.service.ts
    │       │   │   │   └── teacherStatistics.service.ts
    │       │   │   ├── store/
    │       │   │   │   └── useTeacherStore.ts
    │       │   │   └── types/
    │       │   │       ├── index.ts
    │       │   │       └── teacher.types.ts
    │       │   └── users/
    │       │       └── index.ts
    │       ├── pages/
    │       │   ├── index.ts
    │       │   ├── class/
    │       │   │   ├── ClassCreatePage.tsx
    │       │   │   ├── ClassListPage.tsx
    │       │   │   ├── ClassOverviewPage.tsx
    │       │   │   ├── ClassPage.tsx
    │       │   │   └── ClassUpdatePage.tsx
    │       │   ├── dashboard/
    │       │   │   ├── Dashboard.module.css
    │       │   │   ├── Dashboard.tsx
    │       │   │   ├── DashboardCopy1.tsx
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
    │       │   ├── Profile/
    │       │   │   ├── index.ts
    │       │   │   └── Profile.tsx
    │       │   ├── Students/
    │       │   │   └── StudentsPage.tsx
    │       │   └── teacher/
    │       │       └── TeacherPage.tsx
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
    │   ├── api_contract.md
    │   ├── api_docs.md
    │   └── folder_structure.md
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
            │   │   └── student.controller.js
            │   └── TeacherController/
            │       └── teacher.controller.js
            ├── middleware/
            │   ├── auth.js
            │   ├── comparePassword.middleware.js
            │   ├── error.middleware.js
            │   ├── roleCheck.js
            │   └── validate.middleware.js
            ├── Prisma/
            │   ├── prisma.client.js
            │   ├── seed.js
            │   └── tuition.prisma
            ├── routes/
            │   ├── admin.route.js
            │   ├── class.route.js
            │   ├── student.route.js
            │   └── teacher.route.js
            ├── Services/
            │   └── class.services.js
            ├── utils/
            │   ├── api.response.js
            │   ├── asyncWrapper.js
            │   ├── bcrypt.js
            │   ├── controller.helper.js
            │   ├── custom.error.js
            │   ├── index.js
            │   ├── jwt.user.js
            │   ├── pagination.js
            │   └── parseOrderBy.js
            └── validation/
                ├── access.validate.js
                ├── admin.validate.js
                ├── class.validate.js
                ├── general.validate.js
                ├── index.js
                ├── login.validate.js
                ├── moderator.validate.js
                ├── mongoId.validate.js
                ├── pagination.validate.js
                ├── role.validate.js
                ├── student.validate.js
                ├── teacher.validate.js
                └── user.validate.js
