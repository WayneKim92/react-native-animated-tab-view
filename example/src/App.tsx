import {
  View,
  Animated,
  Pressable,
  Text,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Platform,
} from 'react-native';
import {
  AnimatedHeaderContainer,
  type AnimatedHeaderContainerRef,
} from 'react-native-header-components';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';

const TabCount = 3;

export default function App() {
  const animatedScrollY = useRef(new Animated.Value(0)).current;
  const animationScrollX = useRef(new Animated.Value(0)).current;
  const animationActiveTabPosition = useRef(new Animated.Value(0)).current;

  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] = useState(0);
  const animatedHeaderContainerRef = useRef<AnimatedHeaderContainerRef>(null);
  // viewPager 라이브러리에 참조 타입에 대한 정의 없어서 임의로 정의함
  const pagerViewRef = useRef<{ setPage: (index: number) => void }>(null);

  const activeTabIndexRef = useRef<number>(0);
  const flatListScrollYsRef = useRef(
    new Array(TabCount).fill(0).reduce((acc, _, index) => {
      acc[index] = 0;
      return acc;
    }, {})
  );

  const stickyHeaderOffsetY = 100;
  const animationBackgroundColor =
    collapsibleHeaderHeight > 0
      ? animatedScrollY.interpolate({
          inputRange:
            Platform.OS === 'android'
              ? [
                  -collapsibleHeaderHeight,
                  0,
                  stickyHeaderOffsetY,
                  collapsibleHeaderHeight,
                  // AOS 에뮬레이터에서 색상 애니메이션 적용 버그 있어서 임의로 추가
                  collapsibleHeaderHeight,
                ]
              : [
                  -collapsibleHeaderHeight,
                  0,
                  stickyHeaderOffsetY,
                  collapsibleHeaderHeight,
                ],
          outputRange:
            Platform.OS === 'android'
              ? [
                  'rgba(255, 255, 255, 1)',
                  'rgba(255, 255, 255, 1)',
                  'rgba(255, 255, 255, 1)',
                  'rgba(0, 0, 0, 1)',
                  'rgba(0, 0, 0, 1)',
                ]
              : [
                  'rgba(255, 255, 255, 1)',
                  'rgba(255, 255, 255, 1)',
                  'rgba(255, 255, 255, 1)',
                  'rgba(0, 0, 0, 1)',
                ], // Change these colors to your desired initial and final colors
          extrapolate: 'clamp',
        })
      : 'rgba(255, 255, 255, 1)';

  // Animated.event 내에서 갱신 된 값 참조 불가하여, 일반 함수로 변경
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { y } = event.nativeEvent.contentOffset;
    flatListScrollYsRef.current[activeTabIndexRef.current] = y;
    animatedScrollY.setValue(y);
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedHeaderContainer
        ref={animatedHeaderContainerRef}
        animatedScrollY={animatedScrollY}
        onHeaderHeightChange={setCollapsibleHeaderHeight}
        styles={{
          topToolBarStyle: {
            paddingTop: 40,
            backgroundColor: animationBackgroundColor,
          },
        }}
        TopToolbar={
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              alignSelf: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            <Pressable onPress={() => console.log('Left')}>
              <Text style={{ backgroundColor: 'green', padding: 8 }}>Left</Text>
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
            {new Array(TabCount).fill(0).map((_, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  pagerViewRef.current?.setPage(index);
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width / TabCount,
                    height: 60,
                    backgroundColor: 'gray',
                  }}
                >
                  <Text>Tab {index}</Text>
                </View>
              </Pressable>
            ))}
            <Animated.View
              style={{
                width: Dimensions.get('window').width / TabCount,
                height: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'absolute',
                left: 0,
                bottom: 0,
                transform: [
                  {
                    translateX: animationActiveTabPosition.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [
                        0,
                        Dimensions.get('window').width / TabCount,
                        (Dimensions.get('window').width / TabCount) * 2,
                      ],
                    }),
                  },
                ],
              }}
            />
          </View>
        }
        BottomToolBar={
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX: animationScrollX }],
            }}
          >
            {new Array(TabCount).fill(0).map((_, index) => {
              const colorMap = {
                '0': '#1fd1b6',
                '1': '#2c4b9a',
                '2': '#ae2b76',
              };

              // @ts-ignore
              const backgroundColor = colorMap[index] ?? 'gray';

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    console.log('Bottom Toolbar');
                  }}
                >
                  <View
                    style={{
                      zIndex: 1,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: Dimensions.get('window').width,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <Text>Bottom Toolbar {index}</Text>
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>
        }
      />
      <PagerView
        // @ts-ignore, 라이브러리에 참조 타입에 대한 정의 없어서 임의로 정의한 ref 타입 사용
        ref={pagerViewRef}
        useNext={false}
        style={{ flex: 1 }}
        onPageSelected={(event) => {
          const { position } = event.nativeEvent;
          activeTabIndexRef.current = position;
          animationScrollX.setValue(-Dimensions.get('window').width * position);

          if (flatListScrollYsRef.current[position] < collapsibleHeaderHeight) {
            animatedHeaderContainerRef.current?.expand(
              flatListScrollYsRef.current[position]
            );
          } else {
            animatedHeaderContainerRef.current?.collapse();
          }
        }}
        onPageScroll={(e) => {
          const { position, offset } = e.nativeEvent;
          animationActiveTabPosition.setValue(position + offset);
        }}
      >
        {new Array(TabCount).fill(0).map((_, index) => {
          const colorMaps = [
            {
              '0': '#d11f1f',
              '1': '#c65252',
              '2': '#f89797',
            },
            {
              '0': '#1fd122',
              '1': '#40bf47',
              '2': '#85c386',
            },
            {
              '0': '#1f87d1',
              '1': '#416e8e',
              '2': '#9bbedd',
            },
          ];

          return (
            <Animated.FlatList
              key={index}
              data={new Array(100).fill(0)}
              contentContainerStyle={{
                backgroundColor: 'gray',
                paddingTop: collapsibleHeaderHeight,
              }}
              onScroll={onScroll}
              renderItem={({ index: i }) => {
                const colorMap = colorMaps[index] ?? {
                  0: 'red',
                  1: 'green',
                  2: 'blue',
                };
                // @ts-ignore
                const backgroundColor = colorMap[i % 3] ?? 'gray';

                return (
                  <Pressable onPress={() => console.log(index)}>
                    <View
                      style={{ height: 50, backgroundColor: backgroundColor }}
                    />
                  </Pressable>
                );
              }}
            />
          );
        })}
      </PagerView>
    </View>
  );
}
