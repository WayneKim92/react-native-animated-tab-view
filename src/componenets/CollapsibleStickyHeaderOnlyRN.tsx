import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

interface CollapsibleStickyHeaderProps {
  animationScrollY: Animated.Value;
  onHeaderHeightChange: (height: number) => void;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
  stickyHeaderOffsetY?: number;
  CollapsibleToolBar?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const CollapsibleStickyHeaderOnlyRN = (
  props: CollapsibleStickyHeaderProps
) => {
  const {
    containerStyle,
    animationScrollY,
    CollapsibleHeader,
    StickyHeader,
    stickyHeaderOffsetY = 0,
    CollapsibleToolBar,
    onHeaderHeightChange,
  } = props;

  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
    useState<number>(0);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0);
  const stickyHeaderHeaderTranslateY = useRef(new Animated.Value(0)).current;

  const [toolBarHeight, setToolBarHeight] = useState(0);
  const toolbarTranslateY = useRef(new Animated.Value(0)).current;
  const [shouldToolBarDown, setShouldToolBarDown] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const id = animationScrollY.addListener((state) => {
      const currentScrollY = state.value;

      // Sticky Header 처리 로직
      stickyHeaderHeaderTranslateY.setValue(
        currentScrollY <= 0
          ? 0
          : currentScrollY <= collapsibleHeaderHeight - stickyHeaderOffsetY
            ? -currentScrollY
            : -Math.min(
                currentScrollY,
                collapsibleHeaderHeight - stickyHeaderOffsetY
              )
      );

      // Collapsible Toolbar 처리 로직
      const deltaY = currentScrollY - lastScrollY;
      setLastScrollY(currentScrollY);
      let direction = null;
      if (deltaY < 0) {
        direction = 'up';
      } else if (deltaY > 0) {
        direction = 'down';
      }
      if (direction !== null && currentScrollY > collapsibleHeaderHeight) {
        setShouldToolBarDown(direction === 'up');
      }
    });

    return () => {
      animationScrollY.removeListener(id);
    };
  }, [
    animationScrollY,
    collapsibleHeaderHeight,
    lastScrollY,
    stickyHeaderHeaderTranslateY,
    stickyHeaderOffsetY,
  ]);

  useEffect(() => {
    if (shouldToolBarDown) {
      Animated.timing(toolbarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(toolbarTranslateY, {
        toValue: -toolBarHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldToolBarDown, toolBarHeight, toolbarTranslateY]);

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
      {/* Sticky Header에 offset이 적용되었을 때, Header 뒤에 있는 요소 안 보이게 처리 */}
      <View
        style={{
          position: 'absolute',
          height: stickyHeaderOffsetY,
          width: '100%',
          backgroundColor: 'green',
        }}
      />
      {/* Collapsible Header */}
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

      {/* Sticky Header and Collapsible Sticky Toolbar*/}
      <Animated.View
        pointerEvents={'box-none'}
        style={{
          zIndex: 2,
          transform: [{ translateY: stickyHeaderHeaderTranslateY }],
        }}
        onLayout={(event) => {
          setStickyHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        <View style={{ zIndex: 2 }}>{StickyHeader}</View>
        <Animated.View
          style={[
            { zIndex: 1 },
            { transform: [{ translateY: toolbarTranslateY }] },
          ]}
          onLayout={(event) => {
            setToolBarHeight(event.nativeEvent.layout.height);
          }}
        >
          {CollapsibleToolBar}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};
