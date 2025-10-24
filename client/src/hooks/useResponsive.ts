// client/src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  currentBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

/**
 * Custom hook to get current responsive breakpoint information
 * Uses Ant Design's Grid.useBreakpoint under the hood
 */
export const useResponsive = (): ResponsiveState => {
  const screens = useBreakpoint();

  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    currentBreakpoint: 'md',
  });

  useEffect(() => {
    // Determine current state based on breakpoints
    const isMobile = screens.xs && !screens.sm;
    const isTablet = (screens.sm || screens.md) && !screens.lg;
    const isDesktop = screens.lg && !screens.xxl;
    const isLargeDesktop = screens.xxl || false;

    // Determine current breakpoint
    let currentBreakpoint: ResponsiveState['currentBreakpoint'] = 'md';
    if (screens.xxl) currentBreakpoint = 'xxl';
    else if (screens.xl) currentBreakpoint = 'xl';
    else if (screens.lg) currentBreakpoint = 'lg';
    else if (screens.md) currentBreakpoint = 'md';
    else if (screens.sm) currentBreakpoint = 'sm';
    else if (screens.xs) currentBreakpoint = 'xs';

    setState({
      isMobile: !!isMobile,
      isTablet: !!isTablet,
      isDesktop: !!isDesktop,
      isLargeDesktop,
      currentBreakpoint,
    });
  }, [screens]);

  return state;
};

/**
 * Hook to get responsive column spans for Ant Design Grid
 */
export const useResponsiveColumns = () => {
  const { isMobile, isTablet } = useResponsive();

  return {
    // Stat cards
    statCard: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6,
    },
    // Full width cards
    fullWidth: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
    },
    // Half width cards
    halfWidth: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    },
    // Third width cards
    thirdWidth: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 8,
    },
    // Two thirds width
    twoThirds: {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 16,
    },
    // One third width
    oneThird: {
      xs: 24,
      sm: 24,
      md: 8,
      lg: 8,
      xl: 8,
    },
    // Responsive padding
    padding: isMobile ? 12 : isTablet ? 16 : 24,
    // Responsive gutter
    gutter: isMobile ? [12, 12] : isTablet ? [16, 16] : [24, 24],
  };
};

/**
 * Hook for responsive font sizes
 */
export const useResponsiveFontSize = () => {
  const { isMobile, isTablet } = useResponsive();

  return {
    h1: isMobile ? 24 : isTablet ? 28 : 32,
    h2: isMobile ? 20 : isTablet ? 24 : 28,
    h3: isMobile ? 18 : isTablet ? 20 : 24,
    h4: isMobile ? 16 : isTablet ? 18 : 20,
    h5: isMobile ? 14 : isTablet ? 16 : 18,
    body: isMobile ? 13 : 14,
    small: isMobile ? 11 : 12,
  };
};

/**
 * Hook for responsive spacing
 */
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet } = useResponsive();

  return {
    xs: isMobile ? 4 : 8,
    sm: isMobile ? 8 : 12,
    md: isMobile ? 12 : 16,
    lg: isMobile ? 16 : isTablet ? 20 : 24,
    xl: isMobile ? 20 : isTablet ? 24 : 32,
    xxl: isMobile ? 24 : isTablet ? 32 : 48,
  };
};

export default useResponsive;