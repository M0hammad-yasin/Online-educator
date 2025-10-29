//studentPage.tsx
import { Card} from 'antd';
import {
  StudentStatsCards,
  StudentCharts,
  StudentTable,
  AddStudentModal,
  StudentPageHeader,
  StudentFilterBar,
  hasAccess
} from '../../module/student';
import { useRole } from '../../hooks';


const StudentsPage = () => {
  const  currentRole  = useRole() ;
  return (
    <>
      {/* Header Section */}
      <StudentPageHeader/>

      {/* Stats Cards Section */}
      <StudentStatsCards/>

      {/* Charts Section */}
      <StudentCharts/>

      {/* Students Table Section */}
      {hasAccess(currentRole,'table') && (
        <Card
          variant='borderless'
          style={{ borderRadius: '16px' }}
          title={
           <StudentFilterBar/>
          }
        >
          <StudentTable/>
        </Card>
      )}

      {/* Add Student Modal */}
      <AddStudentModal/>
    </>
  );
};

export default StudentsPage;