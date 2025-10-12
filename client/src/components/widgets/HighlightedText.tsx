// components/HighlightedText.tsx
import React from "react";
import { Typography } from "antd";
import useHighlightMatch from "../../hooks/useHighlightMatch";

const { Text } = Typography;

interface HighlightedTextProps {
  text?: string;
  search?: string;
  strong?: boolean;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, search, strong }) => {
  const highlighted = useHighlightMatch(text, search);
  return <Text strong={strong}>{highlighted}</Text>;
};
