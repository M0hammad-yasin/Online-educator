import { Card, message } from 'antd';
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
    <div style={{ padding: '24px', minHeight: '100vh' }}>
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
    </div>
  );
};

export default StudentsPage;