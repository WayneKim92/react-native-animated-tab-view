import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

interface CollapsibleStickyHeaderProps {
  animatedScrollY: Animated.Value;
  onHeaderHeightChange: (height: number) => void;
  CollapsibleHeader: React.ReactNode;
  TopToolbar?: React.ReactNode;
  StickyHeader?: React.ReactNode;
  stickyHeaderOffsetY?: number;
  BottomToolBar?: React.ReactNode;
  collapsibleBottomToolBar?: boolean;
  containerStyle?: ViewStyle;
}

export const CollapsibleStickyHeader = forwardRef(
  (props: CollapsibleStickyHeaderProps, ref) => {
    const {
      containerStyle,
      animatedScrollY,
      CollapsibleHeader,
      TopToolbar,
      StickyHeader,
      stickyHeaderOffsetY = 0,
      BottomToolBar,
      collapsibleBottomToolBar = true,
      onHeaderHeightChange,
    } = props;

    const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
      useState<number>(0);
    const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0);
    const stickyHeaderHeaderTranslateY = useRef(new Animated.Value(0)).current;

    const [toolBarHeight, setToolBarHeight] = useState(0);
    const toolbarTranslateY = useRef(new Animated.Value(0)).current;
    const [
      visibleCollapsibleBottomToolBar,
      setVisibleCollapsibleBottomToolBar,
    ] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useImperativeHandle(ref, () => ({
      expand: (lastValue: number) => {
        Animated.timing(animatedScrollY, {
          toValue: lastValue, // Assuming 0 is the expanded state
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      collapse: () => {
        Animated.timing(animatedScrollY, {
          toValue: collapsibleHeaderHeight, // Assuming 0 is the expanded state
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    }));

    const collapsibleHeaderHeaderTranslateY = animatedScrollY.interpolate({
      inputRange: [0, collapsibleHeaderHeight],
      outputRange: [0, -collapsibleHeaderHeight],
      extrapolate: 'clamp',
    });

    useEffect(() => {
      const id = animatedScrollY.addListener((state) => {
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
          setVisibleCollapsibleBottomToolBar(direction === 'up');
        }
      });

      return () => {
        animatedScrollY.removeListener(id);
      };
    }, [
      animatedScrollY,
      collapsibleHeaderHeight,
      lastScrollY,
      stickyHeaderHeaderTranslateY,
      stickyHeaderOffsetY,
    ]);

    useEffect(() => {
      if (visibleCollapsibleBottomToolBar) {
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
    }, [visibleCollapsibleBottomToolBar, toolBarHeight, toolbarTranslateY]);

    useEffect(() => {
      if (onHeaderHeightChange) {
        onHeaderHeightChange(collapsibleHeaderHeight + stickyHeaderHeight);
      }
    }, [stickyHeaderHeight, collapsibleHeaderHeight, onHeaderHeightChange]); // Add this useEffect

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
            backgroundColor: 'red',
          }}
        />
        {/* Top Header */}
        {TopToolbar}

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
              {
                transform: collapsibleBottomToolBar
                  ? [{ translateY: toolbarTranslateY }]
                  : undefined,
              },
            ]}
            onLayout={(event) => {
              setToolBarHeight(event.nativeEvent.layout.height);
            }}
          >
            {BottomToolBar}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
);
