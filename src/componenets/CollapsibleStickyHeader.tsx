import React, { useState } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from 'react-native-reanimated';

interface CollapsibleStickyHeaderProps {
  sharedScrollY: Animated.SharedValue<number>;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
  stickyHeaderOffset?: number;
}

export const CollapsibleStickyHeader = (
  props: CollapsibleStickyHeaderProps
) => {
  const {
    sharedScrollY,
    CollapsibleHeader,
    StickyHeader,
    stickyHeaderOffset = 0,
  } = props;

  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
    useState<number>(0);

  const collapsibleHeaderTranslateY = useDerivedValue(() => {
    if (sharedScrollY.value > collapsibleHeaderHeight) {
      return -collapsibleHeaderHeight;
    } else {
      return interpolate(
        sharedScrollY.value,
        [0, collapsibleHeaderHeight],
        [0, -collapsibleHeaderHeight],
        Extrapolate.CLAMP
      );
    }
  }, [collapsibleHeaderHeight]);
  const collapsibleHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: collapsibleHeaderTranslateY.value }],
    };
  });

  const stickyHeaderTranslateY = useDerivedValue(() => {
    if (sharedScrollY.value > collapsibleHeaderHeight) {
      return -collapsibleHeaderHeight + stickyHeaderOffset;
    } else {
      return interpolate(
        sharedScrollY.value,
        [0, collapsibleHeaderHeight],
        [0, -collapsibleHeaderHeight + stickyHeaderOffset],
        Extrapolate.CLAMP
      );
    }
  }, [collapsibleHeaderHeight, stickyHeaderOffset]);
  const stickyHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: stickyHeaderTranslateY.value }],
    };
  });

  return (
    <Animated.View style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
      <Animated.View
        onLayout={(event) => {
          setCollapsibleHeaderHeight(event.nativeEvent.layout.height);
        }}
        style={[collapsibleHeaderStyle]}
      >
        {CollapsibleHeader}
      </Animated.View>
      {StickyHeader && (
        <Animated.View style={[stickyHeaderStyle, { backgroundColor: 'red' }]}>
          {StickyHeader}
        </Animated.View>
      )}
    </Animated.View>
  );
};
