import {
  StyleSheet,
  View,
  Animated,
  Pressable,
  type NativeSyntheticEvent,
} from 'react-native';
import { CollapsibleStickyHeaderOnlyRN } from 'react-native-header-components';
import { useEffect, useRef, useState } from 'react';
import type { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';

export default function AppRN() {
  const animationScrollY = useRef(new Animated.Value(0)).current;
  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const toolbarTranslateY = useRef(new Animated.Value(0)).current;
  const toolBarHeight = 50;
  const [shouldToolBarDown, setShouldToolBarDown] = useState(false);

  useEffect(() => {
    if (shouldToolBarDown) {
      Animated.timing(toolbarTranslateY, {
        toValue: toolBarHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(toolbarTranslateY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldToolBarDown, toolbarTranslateY]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animationScrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const deltaY = currentScrollY - lastScrollY; // Calculate deltaY
        setLastScrollY(currentScrollY);

        let direction = null;
        if (deltaY < 0) {
          direction = 'up';
        } else if (deltaY > 0) {
          direction = 'down';
        }

        if (
          direction === 'up' &&
          currentScrollY > 0 &&
          currentScrollY < collapsibleHeaderHeight + 1
        ) {
          setShouldToolBarDown(false);
          return;
        }

        if (direction !== null && currentScrollY > collapsibleHeaderHeight) {
          setShouldToolBarDown(direction === 'up');
        }
      },
    }
  );

  return (
    <View style={styles.container}>
      <CollapsibleStickyHeaderOnlyRN
        animationScrollY={animationScrollY}
        onHeaderHeightChange={setCollapsibleHeaderHeight} // Add this line
        CollapsibleHeader={
          <Pressable
            onPress={() => {
              console.log('collapsible Header');
            }}
          >
            <View style={styles.collapsibleHeader}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'black',
                  borderRadius: 50,
                }}
              />
            </View>
          </Pressable>
        }
        StickyHeader={
          <Pressable
            onPress={() => {
              console.log('sticky header');
            }}
          >
            <View
              style={{
                backgroundColor: 'yellow',
                height: 50,
              }}
            />
          </Pressable>
        }
      />
      <Animated.FlatList
        data={new Array(100).fill(0)}
        stickyHeaderIndices={[0]}
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          backgroundColor: 'gray',
          paddingTop: collapsibleHeaderHeight,
        }}
        onScroll={onScroll}
        renderItem={({ index }) => {
          if (index === 0) {
            return (
              <Animated.View
                style={{
                  backgroundColor: 'pink',
                  height: 50,
                  transform: [{ translateY: toolbarTranslateY }],
                }}
              />
            );
          }

          type ColorIndex = 0 | 1 | 2;
          const colorIndex: ColorIndex = (index % 3) as ColorIndex;

          const colorMap = {
            '0': 'black',
            '1': 'green',
            '2': 'blue',
          };

          return (
            <Pressable onPress={() => console.log(index)}>
              <View
                style={{ height: 50, backgroundColor: colorMap[colorIndex] }}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  collapsibleHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
    backgroundColor: 'white',
  },
});
