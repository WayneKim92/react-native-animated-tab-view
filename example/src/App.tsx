import { Pressable, StyleSheet, View } from 'react-native';
import { CollapsibleStickyHeader } from 'react-native-header-components';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';

export default function App() {
  const sharedScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    sharedScrollY.value = event.contentOffset.y;
  });

  const renderItem = useCallback(({ index }: { index: number }) => {
    type ColorIndex = 0 | 1 | 2;
    const colorIndex: ColorIndex = (index % 3) as ColorIndex;

    const colorMap = {
      '0': 'pink',
      '1': 'purple',
      '2': 'orange',
    };

    return (
      <Pressable onPress={() => console.log('onPress', index)}>
        <View style={{ height: 100, backgroundColor: colorMap[colorIndex] }} />
      </Pressable>
    );
  }, []);

  return (
    <View style={styles.container}>
      <CollapsibleStickyHeader
        sharedScrollY={sharedScrollY}
        CollapsibleHeader={
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
        }
        StickyHeader={
          <View
            style={{
              backgroundColor: 'yellow',
              height: 60,
            }}
          />
        }
        stickyHeaderOffset={50}
      />
      <Animated.FlatList
        data={new Array(50).fill(0)}
        style={{
          backgroundColor: 'gray',
        }}
        windowSize={10}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ backgroundColor: 'gray' }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={renderItem}
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
