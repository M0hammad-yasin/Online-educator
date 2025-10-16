import { Select, Space } from "antd";
import { Role } from "../../../constants/role";
import {useRole} from "../../../hooks";
import { useStudentFilters } from "../";
import {SearchBox} from "../../../components/widgets";
const StudentFilterBar : React.FC = ()=>{
  const { filters, setFilters } = useStudentFilters();
const currentRole=useRole();
    return(
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              {currentRole === Role.TEACHER ? 'My Students List' : 'All Students'}
            </span>
            <Space wrap>
              <SearchBox
                placeholder="Search teachers by name, qualification..."
                initialValue={filters.search}
                onSearch={(val) => setFilters({ search: val, page: 1 })}
              />
              <Select
                placeholder="Filter by Grade"
                value={filters.grade}
                onChange={(val) => setFilters({ grade: val, page: 1 })}
                style={{ width: 140 }}
                allowClear
                options={[
                  { label: 'Grade 1', value: 1 },
                  { label: 'Grade 2', value: 2 },
                  { label: 'Grade 3', value: 3 },
                  { label: 'Grade 4', value: 4 },
                  { label: 'Grade 5', value: 5 },
                  { label: 'Grade 6', value: 6 },
                  { label: 'Grade 7', value: 7 },
                  { label: 'Grade 8', value: 8 },
                  { label: 'Grade 9', value: 9 },
                  { label: 'Grade 10', value: 10 },
                  { label: 'Grade 11', value: 11 },
                  { label: 'Grade 12', value: 12 },
                ]}
              />
              {currentRole !== Role.TEACHER && (
                <Select
                  placeholder="Filter by Region"
                  value={filters.region}
                  onChange={(val) => setFilters({ region: val, page: 1 })}
                  style={{ width: 140 }}
                  allowClear
                  options={[
                    { label: 'Canada', value: 'canada' },
                    { label: 'USA', value: 'USA' },
                    { label: 'England', value: 'England' },
                    { label: 'West', value: 'West' },
                  ]}
                />
              )}
            </Space>
          </div>
    )

}
export default StudentFilterBar;