import React, { useEffect, useState } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface CollapsibleStickyHeaderProps {
  containerStyle?: ViewStyle;
  animationScrollY: Animated.Value;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
  stickyHeaderOffset?: number;
  onHeaderHeightChange?: (height: number) => void; // Add this line
}

export const CollapsibleStickyHeaderOnlyRN = (
  props: CollapsibleStickyHeaderProps
) => {
  const {
    containerStyle,
    animationScrollY,
    CollapsibleHeader,
    StickyHeader,
    onHeaderHeightChange,
  } = props;

  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
    useState<number>(0);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0);

  useEffect(() => {
    if (onHeaderHeightChange) {
      onHeaderHeightChange(collapsibleHeaderHeight + stickyHeaderHeight);
    }
  }, [stickyHeaderHeight, collapsibleHeaderHeight, onHeaderHeightChange]); // Add this useEffect

  const collapsibleHeaderHeaderTranslateY = animationScrollY.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [0, -collapsibleHeaderHeight],
    extrapolate: 'clamp',
  });
  const stickyHeaderHeaderTranslateY = animationScrollY.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [0, -collapsibleHeaderHeight],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents={'box-none'}
      style={[
        {
          position: 'absolute',
          width: '100%',
          zIndex: 1,
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateY: collapsibleHeaderHeaderTranslateY }],
        }}
        onLayout={(event) => {
          setCollapsibleHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        {CollapsibleHeader}
      </Animated.View>
      <Animated.View
        style={{ transform: [{ translateY: stickyHeaderHeaderTranslateY }] }}
        onLayout={(event) => {
          setStickyHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        {StickyHeader}
      </Animated.View>
    </Animated.View>
  );
};
