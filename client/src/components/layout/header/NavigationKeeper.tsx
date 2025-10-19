import React from "react";
import { Breadcrumb, Button, Flex, Space, theme } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationKeeper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // Split path into breadcrumb segments
  const pathSnippets = location.pathname
    .split("/")
    .filter((segment) => segment && segment.trim() !== "");

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      title: (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <HomeOutlined /> Dashboard
        </span>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const name = pathSnippets[index]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
        const isLast=index===pathSnippets.length-1
        return {
            title: 
              <Space
                style={{ cursor: "pointer", color: isLast ? token.colorPrimary: token.colorTextSecondary }}
                onClick={() => navigate(url)}
              >
                {name}
              </Space>
          };
    }),
  ];

  return (
    <Flex>
      {/* Back Button */}
      <Space size="middle" align="center">
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        />

        {/* Breadcrumb */}
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            fontSize: 15,
            color: token.colorTextSecondary,
          }}
        />
      </Space>
    </Flex>
  );
};

export default NavigationKeeper;
