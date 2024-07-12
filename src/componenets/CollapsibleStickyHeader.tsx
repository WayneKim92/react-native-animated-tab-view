import React, { useRef } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

interface CollapsibleStickyHeaderProps {
  containerStyle?: ViewStyle;
  animationScrollY: Animated.Value;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
}

export const CollapsibleStickyHeader = (
  props: CollapsibleStickyHeaderProps
) => {
  const { containerStyle, animationScrollY, CollapsibleHeader, StickyHeader } =
    props;
  const collapsibleHeaderHeightRef = useRef<number>(0);

  const headerTranslateY = animationScrollY.interpolate({
    inputRange: [0, collapsibleHeaderHeightRef.current],
    outputRange: [0, -collapsibleHeaderHeightRef.current],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        { position: 'absolute', width: '100%', zIndex: 2 },
        containerStyle,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
        }}
        onLayout={(event) => {
          collapsibleHeaderHeightRef.current = event.nativeEvent.layout.height;
        }}
      >
        {CollapsibleHeader}
      </Animated.View>
      {StickyHeader}
    </View>
  );
};
