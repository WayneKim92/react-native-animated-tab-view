import React, { useState } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface CollapsibleStickyHeaderProps {
  containerStyle?: ViewStyle;
  animationScrollY: Animated.Value;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
  stickyHeaderOffset?: number;
}

export const CollapsibleStickyHeaderOnlyRN = (
  props: CollapsibleStickyHeaderProps
) => {
  const {
    containerStyle,
    animationScrollY,
    CollapsibleHeader,
    StickyHeader,
    stickyHeaderOffset = 0,
  } = props;

  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
    useState<number>(0);

  const collapsibleHeaderHeaderTranslateY = animationScrollY.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [0, -collapsibleHeaderHeight],
    extrapolate: 'clamp',
  });
  const stickyHeaderHeaderTranslateY = animationScrollY.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [0, -collapsibleHeaderHeight + stickyHeaderOffset],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
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
      >
        {StickyHeader}
      </Animated.View>
    </Animated.View>
  );
};
