//studentPage.tsx
import  { useMemo } from 'react';
import DashboardRenderer from '../../components/DashboardRenderer/DashboardRenderer';
import { studentPageConfig } from '../../module/student';
import { useRole } from '../../hooks';
import { useAuthStore } from '../../module/authentication/store';

const StudentsPage = () => {
  const role = useRole();
  const { user } = useAuthStore();
  const context = useMemo(() => ({ role, userId: user?.id || '', permissions:  [] }), [role, user]);
  return <DashboardRenderer config={studentPageConfig} context={context} />;
};

export default StudentsPage;