import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { HapticTab } from './HapticTab';
import { IconSymbol } from './ui/IconSymbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DOCK_WIDTH = SCREEN_WIDTH * 0.8; // 80% of screen width
const HEADER_HEIGHT = (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) + 48; // Estimated header height

const DATA = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/picsum/400/600',
    subheading: 'A Beautiful Subheading 1',
    text: 'This is some good text that will completely occupy the available space. It can be a description, a story, or any other relevant information.',
    longText: 'This is the extended content for the first event. It provides a much more detailed description, including background information, key speakers, agenda, and what attendees can expect. This section is designed to be scrolled through, offering a comprehensive overview for those who want to "know more." It can contain multiple paragraphs, bullet points, and other rich text elements to fully inform the user about the event. The goal is to provide all necessary details without cluttering the initial card view.',
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/picsum/400/601',
    subheading: 'Another Great Title 2',
    text: 'Here is some more interesting content for the second card. It provides additional details and context.',
    longText: 'This is the extended content for the second event. Dive deeper into the specifics of this gathering. Learn about the innovative ideas that will be discussed, the networking opportunities available, and the impact this event aims to achieve. We believe in providing transparent and thorough information to help you make the most of your experience. Scroll down to uncover all the layers of this exciting opportunity.',
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/picsum/400/602',
    subheading: 'Third Card\'s Charm 3',
    text: 'The third card brings new perspectives and information, keeping the user engaged with fresh content.',
    longText: 'This is the extended content for the third event. Explore the unique charm and offerings of this particular event. From interactive workshops to inspiring keynotes, there\'s something for everyone. Our aim is to foster a vibrant community and facilitate meaningful connections. Read on to discover why this event is a must-attend for enthusiasts and professionals alike.',
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/picsum/400/603',
    subheading: 'Fourth Time\'s the Charm 4',
    text: 'This is the fourth card, continuing the series with more captivating images and descriptive text.',
    longText: 'This is the extended content for the fourth event. Concluding our series with a bang, this event promises to be unforgettable. Featuring cutting-edge presentations and collaborative sessions, it\'s designed to push boundaries and inspire future leaders. Get ready for an immersive experience that combines learning, innovation, and fun. All the details you need are right here, just a scroll away.',
  },
];

const SWIPE_THRESHOLD = 100;

const CampusBuzzComponent = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  // Set button background to a fixed gray as requested by the user.
  const buttonBackgroundColor = Colors.light.icon;

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const isAnimating = useRef(false); // To prevent multiple animations from firing

  const [isSettingsDockOpen, setIsSettingsDockOpen] = useState(false); // Renamed from isDockOpen for clarity
  const [isInfoDockOpen, setIsInfoDockOpen] = useState(false);
  const infoDockTranslateX = useSharedValue(DOCK_WIDTH); // Start off-screen to the right
  const settingsDockTranslateY = useSharedValue(SCREEN_HEIGHT); // Start off-screen at the bottom

const toggleSettingsDock = () => {
  setIsSettingsDockOpen((prev) => {
    const newState = !prev;
    settingsDockTranslateY.value = withSpring(newState ? HEADER_HEIGHT + 10 : SCREEN_HEIGHT, { damping: 20, stiffness: 150 }); // 10 for slight gap
    return newState;
  });
};

const toggleInfoDock = useCallback(() => {
  setIsInfoDockOpen((prev) => {
    const newState = !prev;
    infoDockTranslateX.value = withSpring(newState ? 0 : DOCK_WIDTH, { damping: 20, stiffness: 150 });
    return newState;
  });
}, []); // No dependencies, as it only uses setIsInfoDockOpen and infoDockTranslateX.value which are stable references

const handleBackPress = useCallback(() => {
  if (isInfoDockOpen) {
    toggleInfoDock();
    return true;
  }
  return false;
}, [isInfoDockOpen, toggleInfoDock]);

useEffect(() => {
  const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  return () => {
    subscription.remove();
  };
}, [handleBackPress]);

  const onNavigate = useCallback((targetIndex: number, exitDirection: 'left' | 'right', entryDirection: 'left' | 'right', withRotation: boolean) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const exitTargetX = exitDirection === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    const entryStartX = entryDirection === 'right' ? -SCREEN_WIDTH : SCREEN_WIDTH;

    translateX.value = withSpring(exitTargetX, { damping: 20, stiffness: 150 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentIndex)(targetIndex);
        runOnJS(() => {
          translateX.value = entryStartX;
          translateX.value = withSpring(0, { damping: 20, stiffness: 150 }, () => {
            isAnimating.current = false;
          });
          if (withRotation) {
            rotate.value = withSpring(0, { damping: 20, stiffness: 150 });
          } else {
            rotate.value = 0;
          }
        })();
      }
    });
  }, [translateX, rotate, setCurrentIndex]);

  const onSwipeForward = useCallback((direction: 'left' | 'right') => {
    const nextIndex = (currentIndex + 1) % DATA.length;
    onNavigate(nextIndex, direction, direction === 'left' ? 'right' : 'left', true); // Exit in swipe direction, enter from opposite, with rotation
  }, [currentIndex, onNavigate]);

  const onUndo = useCallback(() => {
    const prevIndex = (currentIndex - 1 + DATA.length) % DATA.length;
    onNavigate(prevIndex, 'right', 'left', false); // Current card exits right, previous card enters left, no rotation
  }, [currentIndex, onNavigate]);

  type AnimatedGestureContext = {
    startX: number;
  };

  const panGestureEvent = useAnimatedGestureHandler<any, AnimatedGestureContext>({
    onStart: (event, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotate.value = event.translationX / SWIPE_THRESHOLD;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(onSwipeForward)('right');
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onSwipeForward)('left');
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 150 });
        rotate.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotate.value * 10}deg` },
      ],
    };
  });

  const infoDockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: infoDockTranslateX.value }],
    };
  });

  const settingsDockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: settingsDockTranslateY.value }],
    };
  });

  const currentCard = DATA[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: tintColor }]}>
        <Text style={[styles.companyName, { color: textColor }]}>Noblex - Campus Buzz</Text>
        <View style={styles.headerIcons}>
          <HapticTab onPress={onUndo}> {/* Call onUndo function */}
            <IconSymbol name="arrow.uturn.backward" size={24} color={textColor} />
          </HapticTab>
          <HapticTab onPress={toggleSettingsDock}>
            <IconSymbol name="slider.horizontal.3" size={24} color={textColor} />
          </HapticTab>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.card, cardStyle]}>
            {/* Image Section (60% height) */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: currentCard.image }}
                style={styles.image}
              />
            </View>

            {/* Text Section (20% height) */}
            <View style={styles.textContainer}>
              <Text style={[styles.subheading, { color: textColor }]}>{currentCard.subheading}</Text>
              <Text style={[styles.text, { color: textColor }]}>
                {currentCard.text}
              </Text>
              {/* Know More Button */}
              <TouchableOpacity onPress={toggleInfoDock} style={styles.knowMoreButton}>
                <Text style={[styles.knowMoreText, { color: tintColor }]}>Know more about this event</Text>
                <IconSymbol name="info.circle" size={16} color={tintColor} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
        {Platform.OS === 'android' ? (
          <TouchableNativeFeedback
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', true)}
          >
            <View style={[styles.floatingButton, { backgroundColor: buttonBackgroundColor }]}>
              <IconSymbol name="bell" size={24} color="white" />
            </View>
          </TouchableNativeFeedback>
        ) : (
          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={[styles.floatingButton, { backgroundColor: buttonBackgroundColor }]}
          >
            <IconSymbol name="bell" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Overlay for closing dock */}
      {isInfoDockOpen && (
        <TouchableWithoutFeedback onPress={toggleInfoDock}>
          <View style={styles.dockOverlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Info Dock from right */}
      <Animated.View style={[styles.infoDock, infoDockAnimatedStyle, { backgroundColor }]}>
        <View style={[styles.infoDockHeader, { borderBottomColor: tintColor }]}>
          <HapticTab onPress={toggleInfoDock}>
            <IconSymbol name="arrow.backward" size={24} color={textColor} />
          </HapticTab>
          <Text style={[styles.infoDockTitle, { color: textColor }]}>Event Details</Text>
        </View>
        <View style={styles.infoDockContent}>
          <Text style={[styles.longText, { color: textColor }]}>{currentCard.longText}</Text>
        </View>
      </Animated.View>

      {/* Settings Dock from bottom */}
      <Animated.View style={[styles.settingsDock, settingsDockAnimatedStyle, { backgroundColor }]}>
        <PanGestureHandler
          onGestureEvent={useAnimatedGestureHandler<any, { startY: number }>({
            onStart: (event, ctx) => {
              ctx.startY = settingsDockTranslateY.value;
            },
            onActive: (event, ctx) => {
              settingsDockTranslateY.value = Math.max(
                HEADER_HEIGHT + 10,
                ctx.startY + event.translationY
              );
            },
            onEnd: (event) => {
              if (event.translationY > 50) { // If swiped down enough, close
                settingsDockTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 150 });
                runOnJS(setIsSettingsDockOpen)(false);
              } else { // Otherwise, snap back to open position
                settingsDockTranslateY.value = withSpring(HEADER_HEIGHT + 10, { damping: 20, stiffness: 150 });
              }
            },
          })}
        >
          <View style={styles.settingsDockHandle} />
        </PanGestureHandler>
        <View style={styles.settingsDockContent}>
          {DATA.map((item, index) => (
            <TouchableOpacity key={item.id} style={styles.settingsCard} onPress={() => {
              setCurrentIndex(index);
              toggleSettingsDock();
            }}>
              <Image source={{ uri: item.image }} style={styles.settingsCardImage} />
              <View style={styles.settingsCardTextContainer}>
                <Text style={[styles.settingsCardSubheading, { color: textColor }]}>{item.subheading}</Text>
                <Text style={[styles.settingsCardText, { color: textColor }]}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%', // Occupy entire screen
    borderRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
  },
  imageContainer: {
    flex: 0.75, // Image takes 6/8 (60%) of the card height
    paddingTop: 0,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    flex: 0.25, // Text section takes 2/8 (20%) of the card height
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between', // Distribute content vertically
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4, // Reduced margin
  },
  text: {
    fontSize: 16,
    marginBottom: 8, // Added margin for separation from button
  },
  knowMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // Adjusted padding
    gap: 4,
  },
  knowMoreText: {
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  infoDock: {
    position: 'absolute',
    top: HEADER_HEIGHT, // Start below the header
    right: 0, // Start off-screen to the right, controlled by animation
    width: DOCK_WIDTH,
    height: SCREEN_HEIGHT - HEADER_HEIGHT, // Occupy remaining screen height
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    elevation: 10,
    zIndex: 20,
    borderTopLeftRadius: 16, // Rounded left edges
    borderBottomLeftRadius: 16, // Rounded left edges
    overflow: 'hidden', // Ensure content respects border radius
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
    }),
  },
  infoDockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // This padding is now handled by the infoDock's top offset
  },
  dockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
    zIndex: 10, // Below the dock, above main content
  },
  infoDockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoDockContent: {
    flex: 1,
    padding: 16,
  },
  longText: {
    fontSize: 16,
    lineHeight: 24,
  },
  settingsDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT - HEADER_HEIGHT - 10, // Occupy space up to just below header with a gap
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
    zIndex: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
    }),
  },
  settingsDockHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 8,
  },
  settingsDockContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  settingsCardTextContainer: {
    flex: 1,
  },
  settingsCardSubheading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsCardText: {
    fontSize: 14,
  },
});

export default CampusBuzzComponent;
