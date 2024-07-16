import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

interface AnimatedHeaderContainerProps {
  animatedScrollY: Animated.Value;
  stickyHeaderOffsetY?: number;
  styles?: {
    containerStyle?: Animated.WithAnimatedValue<ViewStyle>;
    coverStyle?: Animated.WithAnimatedValue<ViewStyle>;
    topToolBarStyle?: Animated.WithAnimatedValue<ViewStyle>;
    bottomToolBarStyle?: Animated.WithAnimatedValue<ViewStyle>;
  };
  onHeaderHeightChange: (height: number) => void;
  TopToolbar?: React.ReactNode;
  CollapsibleHeader: React.ReactNode;
  StickyHeader?: React.ReactNode;
  BottomToolBar?: React.ReactNode;
}

export const AnimatedHeaderContainer = forwardRef(
  (props: AnimatedHeaderContainerProps, ref) => {
    const {
      styles,
      animatedScrollY,
      CollapsibleHeader,
      TopToolbar,
      StickyHeader,
      stickyHeaderOffsetY = 0,
      BottomToolBar,
      onHeaderHeightChange,
    } = props;

    const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] =
      useState<number>(0);
    const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0);
    const stickyHeaderHeaderTranslateY = useRef(new Animated.Value(0)).current;

    const [bottomToolBarHeight, setBottomToolBarHeight] = useState(0);
    const bottomToolBarTranslateY = useRef(new Animated.Value(0)).current;
    const isBottomToolbarTranslateYAnimationRunning = useRef(false);
    const lastScrollYRef = useRef(0);

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
        const deltaY = Math.round(currentScrollY - lastScrollYRef.current);
        lastScrollYRef.current = currentScrollY;
        let direction = null;
        if (deltaY < 0) {
          direction = 'up';
        } else if (deltaY > 0) {
          direction = 'down';
        }

        if (
          BottomToolBar &&
          direction !== null &&
          currentScrollY > collapsibleHeaderHeight
        ) {
          if (isBottomToolbarTranslateYAnimationRunning.current) {
            return;
          }
          isBottomToolbarTranslateYAnimationRunning.current = true;

          Animated.timing(bottomToolBarTranslateY, {
            toValue: direction === 'up' ? 0 : -bottomToolBarHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            isBottomToolbarTranslateYAnimationRunning.current = false;
          });
        }
      });

      return () => {
        animatedScrollY.removeListener(id);
      };
    }, [
      animatedScrollY,
      collapsibleHeaderHeight,
      stickyHeaderHeaderTranslateY,
      stickyHeaderOffsetY,
      bottomToolBarHeight,
      bottomToolBarTranslateY,
      BottomToolBar,
    ]);

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
          styles?.containerStyle,
        ]}
      >
        {/* Cover, Sticky Header에 offset이 적용되었을 때, Header 뒤에 있는 요소 안 보이게 처리 */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: stickyHeaderOffsetY,
              width: '100%',
              backgroundColor: 'white',
            },
            styles?.coverStyle,
          ]}
        />
        {/* Top Header */}
        {TopToolbar && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: '100%',
                zIndex: 3,
              },
              styles?.topToolBarStyle,
            ]}
          >
            {TopToolbar}
          </Animated.View>
        )}

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
              {
                zIndex: 1,
                transform: [{ translateY: bottomToolBarTranslateY }],
              },
              styles?.bottomToolBarStyle,
            ]}
            onLayout={(event) => {
              setBottomToolBarHeight(event.nativeEvent.layout.height);
            }}
          >
            {BottomToolBar}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
);
