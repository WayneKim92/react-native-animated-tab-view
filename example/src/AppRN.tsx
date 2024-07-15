import { View, Animated, Pressable, Text } from 'react-native';
import { CollapsibleStickyHeaderOnlyRN } from 'react-native-header-components';
import { useRef, useState } from 'react';

export default function AppRN() {
  const animationScrollY = useRef(new Animated.Value(0)).current;
  // collapsibleHeaderHeight을 이용하여 FlatList의 paddingTop을 설정합니다!
  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] = useState(0);
  const stickyHeaderOffsetY = 120;

  const animationBackgroundColor =
    collapsibleHeaderHeight > 0
      ? animationScrollY.interpolate({
          inputRange: [
            -collapsibleHeaderHeight,
            0,
            stickyHeaderOffsetY,
            collapsibleHeaderHeight,
            // AOS 에뮬레이터에서 색상 애니메이션 적용 버그 있어서 임의로 추가
            collapsibleHeaderHeight,
          ],
          outputRange: [
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
          ], // Change these colors to your desired initial and final colors
          extrapolate: 'clamp',
        })
      : 'rgba(255, 255, 255, 1)';

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animationScrollY } } }],
    {
      useNativeDriver: true,
    }
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'gray',
      }}
    >
      <CollapsibleStickyHeaderOnlyRN
        animationScrollY={animationScrollY}
        onHeaderHeightChange={setCollapsibleHeaderHeight} // Add this line
        TopToolbar={
          <Animated.View
            style={{
              height: stickyHeaderOffsetY,
              backgroundColor: animationBackgroundColor,
              position: 'absolute',
              width: '100%',
              zIndex: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: 'stretch',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 60,
              }}
            >
              <Pressable onPress={() => console.log('Left')}>
                <Text style={{ backgroundColor: 'green', padding: 8 }}>
                  Left
                </Text>
              </Pressable>
              <Text style={{ backgroundColor: 'green', padding: 8 }}>
                Top Header
              </Text>
              <Pressable onPress={() => console.log('Right')}>
                <Text style={{ backgroundColor: 'green', padding: 8 }}>
                  Right
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        }
        CollapsibleHeader={
          <Pressable
            onPress={() => {
              console.log('collapsible Header');
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                width: '100%',
                backgroundColor: 'white',
              }}
            >
              <Text>Collapsible Header</Text>
            </View>
          </Pressable>
        }
        stickyHeaderOffsetY={stickyHeaderOffsetY}
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
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>Sticky Header</Text>
            </View>
          </Pressable>
        }
        BottomToolBar={
          <Pressable
            onPress={() => {
              console.log('collapsible toolbar');
            }}
          >
            <View
              style={{
                zIndex: 1,
                backgroundColor: 'pink',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>Collapsible Toolbar</Text>
            </View>
          </Pressable>
        }
      />
      <Animated.FlatList
        data={new Array(100).fill(0)}
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          backgroundColor: 'gray',
          paddingTop: collapsibleHeaderHeight,
        }}
        onScroll={onScroll}
        renderItem={({ index }) => {
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
