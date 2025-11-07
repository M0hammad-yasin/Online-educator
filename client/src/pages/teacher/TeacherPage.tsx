import React, { useMemo } from 'react';
import DashboardRenderer from '../../components/DashboardRenderer/DashboardRenderer';
import { teacherPageConfig } from '../../module/teacher/config/teacher-page.config';
import { useRole } from '../../hooks';
import {useAuthUser } from '../../module/authentication';

const TeacherPage: React.FC = () => {
  const role = useRole();
  const user  = useAuthUser();
  const context = useMemo(() => ({ role, userId: user?.id || '', permissions: user?.permissions || [] }), [role, user]);
  return <DashboardRenderer config={teacherPageConfig} context={context} />;
};

export default TeacherPage;
