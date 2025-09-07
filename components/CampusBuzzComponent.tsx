import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CampusBuzzDock from './CampusBuzzDock'; // Import the new component
import { HapticTab } from './HapticTab';
import { IconSymbol } from './ui/IconSymbol';

const DATA = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/picsum/400/600',
    subheading: 'A Beautiful Subheading 1',
    text: 'This is some good text that will completely occupy the available space. It can be a description, a story, or any other relevant information.',
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/picsum/400/601',
    subheading: 'Another Great Title 2',
    text: 'Here is some more interesting content for the second card. It provides additional details and context.',
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/picsum/400/602',
    subheading: 'Third Card\'s Charm 3',
    text: 'The third card brings new perspectives and information, keeping the user engaged with fresh content.',
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/picsum/400/603',
    subheading: 'Fourth Time\'s the Charm 4',
    text: 'This is the fourth card, continuing the series with more captivating images and descriptive text.',
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

  const [isDockOpen, setIsDockOpen] = useState(false);

  const toggleDock = () => {
    setIsDockOpen((prev) => !prev);
  };

  const onSwipe = (direction: 'left' | 'right') => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % DATA.length);
    translateX.value = 0;
    rotate.value = 0;
  };

  type CardAnimatedGestureContext = {
    startX: number;
  };

  const panGestureEvent = useAnimatedGestureHandler<any, CardAnimatedGestureContext>({
    onStart: (event, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotate.value = event.translationX / SWIPE_THRESHOLD;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(500);
        runOnJS(onSwipe)('right');
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-500);
        runOnJS(onSwipe)('left');
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
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

  const currentCard = DATA[currentIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: tintColor }]}>
          <Text style={[styles.companyName, { color: textColor }]}>Noblex - Campus Buzz</Text>
          <View style={styles.headerIcons}>
            <HapticTab>
              <IconSymbol name="arrow.uturn.backward" size={24} color={textColor} />
            </HapticTab>
            <HapticTab onPress={toggleDock}>
              <IconSymbol name="slider.horizontal.3" size={24} color={textColor} />
            </HapticTab>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={[styles.card, cardStyle]}>
              {/* Image Section (60%) */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentCard.image }}
                  style={styles.image}
                />
              </View>

              {/* Text Section (20%) */}
              <View style={styles.textContainer}>
                <Text style={[styles.subheading, { color: textColor }]}>{currentCard.subheading}</Text>
                <Text style={[styles.text, { color: textColor }]}>
                  {currentCard.text}
                </Text>
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

        {/* CampusBuzzDock Component */}
        <CampusBuzzDock
          data={DATA}
          textColor={textColor}
          tintColor={tintColor}
          backgroundColor={backgroundColor}
          isDockOpen={isDockOpen}
          toggleDock={toggleDock}
        />
      </View>
    </GestureHandlerRootView>
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
    height: '90%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
  },
  imageContainer: {
    flex: 0.8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    flex: 0.2,
    paddingTop: 0,
    paddingBottom: 16,
    marginTop: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
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
});

export default CampusBuzzComponent;
