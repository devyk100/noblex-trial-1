import React, { useEffect } from 'react'; // Added useState and useEffect
import { Dimensions, FlatList, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 56 : 56; // Approximate header height
const DOCK_OPEN_POSITION = HEADER_HEIGHT; // Dock opens just below the header
const DOCK_CLOSED_POSITION = SCREEN_HEIGHT; // Dock hides completely below the screen

interface CampusBuzzDockProps {
  data: {
    id: string;
    image: string;
    subheading: string;
    text: string;
  }[];
  textColor: string;
  tintColor: string;
  backgroundColor: string;
  isDockOpen: boolean; // Re-added to props
  toggleDock: () => void; // Re-added to props
}

const CampusBuzzDock: React.FC<CampusBuzzDockProps> = ({
  data,
  textColor,
  tintColor,
  backgroundColor,
  isDockOpen, // Re-added to props
  toggleDock, // Re-added to props
}) => {
  const dockTranslateY = useSharedValue(isDockOpen ? DOCK_OPEN_POSITION : DOCK_CLOSED_POSITION);

  // Update dock position when isDockOpen prop changes
  useEffect(() => { // Changed React.useEffect to useEffect
    dockTranslateY.value = withSpring(isDockOpen ? DOCK_OPEN_POSITION : DOCK_CLOSED_POSITION, { damping: 20, stiffness: 150 });
  }, [isDockOpen]);

  type DockGestureContext = {
    startY: number;
  };

  const dockPanGestureEvent = useAnimatedGestureHandler<any, DockGestureContext>({
    onStart: (event, ctx) => {
      ctx.startY = dockTranslateY.value;
    },
    onActive: (event, ctx) => {
      dockTranslateY.value = Math.max(DOCK_OPEN_POSITION, ctx.startY + event.translationY);
    },
    onEnd: (event) => {
      if (event.translationY > 100) { // If dragged down significantly
        dockTranslateY.value = withSpring(DOCK_CLOSED_POSITION, { damping: 20, stiffness: 150 });
        runOnJS(toggleDock)(); // Close the dock
      } else {
        dockTranslateY.value = withSpring(DOCK_OPEN_POSITION, { damping: 20, stiffness: 150 });
        runOnJS(toggleDock)(); // Open the dock
      }
    },
  });

  const dockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: dockTranslateY.value }],
    };
  });

  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <View style={[styles.dockListItem, { borderBottomColor: tintColor }]}>
      <Image source={{ uri: item.image }} style={styles.dockListItemImage} />
      <View style={styles.dockListItemTextContainer}>
        <Text style={[styles.dockListItemSubheading, { color: textColor }]}>{item.subheading}</Text>
        <Text style={[styles.dockListItemText, { color: textColor }]} numberOfLines={2}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <PanGestureHandler onGestureEvent={dockPanGestureEvent}>
      <Animated.View
        style={[
          styles.dock,
          {
            backgroundColor,
            top: 0,
            height: SCREEN_HEIGHT,
            borderTopColor: tintColor, // Apply borderTopColor here
          },
          dockAnimatedStyle,
        ]}
      >
        <View style={[styles.dockHeader, { borderBottomColor: tintColor }]}>
          <View style={styles.dockHandle} />
          <View style={styles.dockHeaderContent}>
            <Text style={[styles.dockTitle, { color: textColor }]}>All Campus Buzz Items</Text>
            <HapticTab onPress={toggleDock}>
              <IconSymbol name="xmark.circle.fill" size={24} color={textColor} />
            </HapticTab>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dockListContent}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    borderTopWidth: 1, // Slightly thicker border for visibility
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
    }),
  },
  dockHeader: {
    paddingTop: 16, // Make space for the handle
    paddingBottom: 12,
    borderBottomWidth: 1,
    alignItems: 'center', // Center the handle
  },
  dockHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  dockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dockListContent: {
    paddingBottom: 20,
  },
  dockListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dockListItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  dockListItemTextContainer: {
    flex: 1,
  },
  dockListItemSubheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dockListItemText: {
    fontSize: 14,
  },
  dockHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default CampusBuzzDock;
