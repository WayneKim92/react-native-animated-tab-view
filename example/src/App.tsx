import { StyleSheet, View, Animated } from 'react-native';
import {
  AnimatedFlatList,
  CollapsibleStickyHeaderOnlyRN,
} from 'react-native-header-components';
import { useRef } from 'react';

export default function App() {
  const animationScrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animationScrollY } } }],
    { useNativeDriver: true } // useNativeDriver을 사용하려면 Animated Component를 사용해야함
  );

  return (
    <View style={styles.container}>
      <CollapsibleStickyHeaderOnlyRN
        animationScrollY={animationScrollY}
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
      <AnimatedFlatList
        data={new Array(50).fill(0)}
        style={{
          backgroundColor: 'gary',
        }}
        contentContainerStyle={{ backgroundColor: 'gray' }}
        onScroll={onScroll}
        renderItem={({ index }) => {
          type ColorIndex = 0 | 1 | 2;
          const colorIndex: ColorIndex = (index % 3) as ColorIndex;

          const colorMap = {
            '0': 'red',
            '1': 'green',
            '2': 'blue',
          };

          return (
            <View
              style={{ height: 100, backgroundColor: colorMap[colorIndex] }}
            />
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
