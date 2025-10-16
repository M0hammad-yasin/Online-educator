import { Role } from "../../../constants/role";
import { UserRole } from "../../authentication/store/authStore";
import { StudentWidget } from "../types/student.types";

// Widget configuration based on roles
export const widgetConfig = {
    stats: {
      roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
      widgets: {
        [Role.ADMIN]: ['totalStudents', 'activeStudents', 'avgAttendance', 'topPerformers'],
        [Role.MODERATOR]: ['totalStudents', 'activeStudents', 'avgAttendance', 'topPerformers'],
        [Role.TEACHER]: ['myStudents', 'activeStudents', 'avgAttendance', 'upcomingClasses'],
      },
    },
    charts: {
      roles: [Role.ADMIN, Role.MODERATOR] as UserRole[],
      widgets: {
        [Role.ADMIN]: ['gradeDistribution', 'attendanceTrend', 'performanceAnalysis', 'regionDistribution'],
        [Role.MODERATOR]: ['gradeDistribution', 'attendanceTrend', 'regionDistribution'],
      },
    },
    quickActions: {
      roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
      actions: {
        [Role.ADMIN]: ['addStudent', 'bulkImport', 'exportData', 'sendNotification'],
        [Role.MODERATOR]: ['addStudent', 'exportData', 'sendNotification'],
        [Role.TEACHER]: ['viewSchedule', 'contactStudent'],
      },
    },
    table: {
      roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
      columns: {
        [Role.ADMIN]: ['name', 'email', 'grade', 'region', 'attendance', 'performance', 'status', 'actions'],
        [Role.MODERATOR]: ['name', 'email', 'grade', 'region', 'attendance', 'status', 'actions'],
        [Role.TEACHER]: ['name', 'grade', 'attendance', 'performance', 'lastClass', 'actions'],
      },
    },
  };
// Check if role has access to widget
  export const hasAccess = (currentRole :UserRole,widgetType: StudentWidget['widgetType'], widgetName: StudentWidget['widgetName'] = null) => {
    const config = widgetConfig[widgetType];
    if (!config) return false;

    if (!config.roles.includes(currentRole )) return false;

    if (widgetName) {
      if ('widgets' in config) {
        const widgets = config.widgets;
        if (!Object.prototype.hasOwnProperty.call(widgets, currentRole)) return false;
        const roleKey = currentRole as keyof typeof widgets;
        return widgets[roleKey]?.includes(widgetName);
      }
    }

    return true;
  };