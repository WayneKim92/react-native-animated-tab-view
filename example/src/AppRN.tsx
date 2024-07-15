import {
  View,
  Animated,
  Pressable,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { CollapsibleStickyHeaderOnlyRN } from 'react-native-header-components';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';

export default function AppRN() {
  const animationListScrollY = useRef(new Animated.Value(0)).current;
  const animationPagerViewScrollX = useRef(new Animated.Value(0)).current;
  // collapsibleHeaderHeight을 이용하여 FlatList의 paddingTop을 설정합니다!
  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] = useState(0);
  const stickyHeaderOffsetY = Platform.OS === 'ios' ? 120 : 100;

  const animationBackgroundColor =
    collapsibleHeaderHeight > 0
      ? animationListScrollY.interpolate({
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

  const onListScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animationListScrollY } } }],
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
        animationScrollY={animationListScrollY}
        onHeaderHeightChange={setCollapsibleHeaderHeight} // Add this line
        TopToolbar={
          <Animated.View
            style={{
              // TODO: height를 이용하면 레이아웃 문제 발생할 수 있어보임, 수정하자
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
          <View style={{ flexDirection: 'row' }}>
            {new Array(3).fill(0).map((_, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  console.log('Tab', index);
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width / 3,
                    height: 60,
                    backgroundColor: 'gray',
                  }}
                >
                  <Text>Tool Bar {index}</Text>
                </View>
              </Pressable>
            ))}
            <Animated.View
              style={{
                width: Dimensions.get('window').width / 3,
                height: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'absolute',
                left: 0,
                bottom: 0,
                transform: [
                  {
                    translateX: animationPagerViewScrollX.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [
                        0,
                        Dimensions.get('window').width / 3,
                        (Dimensions.get('window').width / 3) * 2,
                      ],
                    }),
                  },
                ],
              }}
            />
          </View>
        }
        BottomToolBar={
          <Pressable
            onPress={() => {
              console.log('Bottom Toolbar');
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
              <Text>Bottom Toolbar</Text>
            </View>
          </Pressable>
        }
      />
      <PagerView
        useNext={true}
        style={{ flex: 1 }}
        onPageScroll={(e) => {
          const { position, offset } = e.nativeEvent;
          animationPagerViewScrollX.setValue(position + offset);
        }}
      >
        <Animated.FlatList
          data={new Array(100).fill(0)}
          style={{ overflow: 'visible' }}
          contentContainerStyle={{
            backgroundColor: 'gray',
            paddingTop: collapsibleHeaderHeight,
          }}
          onScroll={onListScroll}
          renderItem={({ index }) => {
            type ColorIndex = 0 | 1 | 2;
            const colorIndex: ColorIndex = (index % 3) as ColorIndex;

            const colorMap = {
              '0': '#d11f1f',
              '1': '#c65252',
              '2': '#f89797',
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
        <Animated.FlatList
          initialScrollIndex={0}
          data={new Array(100).fill(0)}
          style={{ overflow: 'visible' }}
          contentContainerStyle={{
            backgroundColor: 'gray',
            paddingTop: collapsibleHeaderHeight,
          }}
          onScroll={onListScroll}
          renderItem={({ index }) => {
            type ColorIndex = 0 | 1 | 2;
            const colorIndex: ColorIndex = (index % 3) as ColorIndex;

            const colorMap = {
              '0': '#1fd122',
              '1': '#40bf47',
              '2': '#85c386',
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
        <Animated.FlatList
          initialScrollIndex={0}
          data={new Array(100).fill(0)}
          style={{ overflow: 'visible' }}
          contentContainerStyle={{
            backgroundColor: 'gray',
            paddingTop: collapsibleHeaderHeight,
          }}
          onScroll={onListScroll}
          renderItem={({ index }) => {
            type ColorIndex = 0 | 1 | 2;
            const colorIndex: ColorIndex = (index % 3) as ColorIndex;

            const colorMap = {
              '0': '#1f87d1',
              '1': '#416e8e',
              '2': '#9bbedd',
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
      </PagerView>
    </View>
  );
}
