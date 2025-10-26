// client/src/module/classes/components/classList/ResponsiveClassFilters.tsx
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Drawer,
  Badge,
} from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useClassStore } from "../../store/useClassStore";
import { useResponsive, useResponsiveColumns, useResponsiveSpacing } from "../../../../hooks/useResponsive";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ClassFilters: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const columns = useResponsiveColumns();
  const spacing = useResponsiveSpacing();
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const { filters, setFilters, resetFilters } = useClassStore();

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters({
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      });
    } else {
      setFilters({ startDate: undefined, endDate: undefined });
    }
  };

  const handleReset = () => {
    resetFilters();
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  ).length;

  // Filter controls
  const filterControls = (
    <Row gutter={columns.gutter as [number, number]}>
      {/* Status Filter */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <label style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500 }}>Status</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select status"
            allowClear
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            size={isMobile ? "middle" : "large"}
            options={[
              { label: "Scheduled", value: "SCHEDULED" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ]}
          />
        </Space>
      </Col>

      {/* Teacher Filter */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <label style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500 }}>Teacher</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select teacher"
            allowClear
            showSearch
            value={filters.teacherId}
            onChange={(value) => handleFilterChange("teacherId", value)}
            size={isMobile ? "middle" : "large"}
            // Add teacher options here
          />
        </Space>
      </Col>

      {/* Student Filter */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <label style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500 }}>Student</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select student"
            allowClear
            showSearch
            value={filters.studentId}
            onChange={(value) => handleFilterChange("studentId", value)}
            size={isMobile ? "middle" : "large"}
            // Add student options here
          />
        </Space>
      </Col>

      {/* Date Range Filter */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <label style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500 }}>Date Range</label>
          <RangePicker
            style={{ width: "100%" }}
            value={
              filters.startDate && filters.endDate
                ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                : null
            }
            onChange={handleDateRangeChange}
            size={isMobile ? "middle" : "large"}
            format="YYYY-MM-DD"
          />
        </Space>
      </Col>

         {/* Reset Button */}
      {!isMobile && (
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <label style={{ fontSize: 13, fontWeight: 500, opacity: 0 }}>Action</label>
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              disabled={activeFilterCount === 0}
              block
              size="large"
            >
              Reset Filters
            </Button>
          </Space>
        </Col>
      )}
    </Row>
  );

  // Mobile: Show filters in drawer
  if (isMobile) {
    return (
      <>
        <Space direction="horizontal" size={spacing.sm} style={{ width: "100%", marginBottom: spacing.md }}>
          <Badge count={activeFilterCount} offset={[-5, 5]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setDrawerVisible(true)}
              size="large"
              block
            >
              Filters
            </Button>
          </Badge>
          {activeFilterCount > 0 && (
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              size="large"
            >
              Reset
            </Button>
          )}
        </Space>

        <Drawer
          title="Filter Classes"
          placement="bottom"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          height="80vh"
          extra={
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              disabled={activeFilterCount === 0}
            >
              Reset All
            </Button>
          }
        >
          <Space direction="vertical" size={spacing.md} style={{ width: "100%" }}>
            {filterControls}
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setDrawerVisible(false)}
            >
              Apply Filters
            </Button>
          </Space>
        </Drawer>
      </>
    );
  }

  // Desktop: Show filters inline
  return (
    <Card
      variant="borderless"
      styles={{ body: { padding: isMobile ? 12 : isTablet ? 16 : 20 } }}
    >
      {filterControls}
    </Card>
  );
};

export default ClassFilters;