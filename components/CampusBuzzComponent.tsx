import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HapticTab } from './HapticTab';
import { IconSymbol } from './ui/IconSymbol';

const CampusBuzzComponent = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: tintColor }]}>
        <Text style={[styles.companyName, { color: textColor }]}>Noblex - Campus Buzz</Text>
        <View style={styles.headerIcons}>
          <HapticTab>
            <IconSymbol name="arrow.uturn.backward" size={24} color={textColor} />
          </HapticTab>
          <HapticTab>
            <IconSymbol name="slider.horizontal.3" size={24} color={textColor} />
          </HapticTab>
        </View>
      </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Image Section (60%) */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/picsum/400/600' }}
              style={styles.image}
            />
          </View>

          {/* Text Section (20%) */}
          <View style={styles.textContainer}>
            <Text style={[styles.subheading, { color: textColor }]}>A Beautiful Subheading</Text>
            <Text style={[styles.text, { color: textColor }]}>
              This is some good text that will completely occupy the available space.
              It can be a description, a story, or any other relevant information.
            </Text>
            <TouchableOpacity style={[styles.floatingButton, { backgroundColor: tintColor }]}>
              <IconSymbol name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Re-added this line
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
    paddingTop: 16, // Re-added top padding to separate image from header
  },
  imageContainer: {
    flex: 0.8, // Give more space to the image
    // Removed justifyContent and alignItems to make content stick to edges
    paddingTop: 0, // Ensure no top padding
    paddingBottom: 0, // Ensure no bottom padding
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // rounded-sm
  },
  textContainer: {
    flex: 0.2, // Give less space to the text
    // Removed justifyContent to make content stick to edges
    paddingTop: 0, // Ensure no top padding
    paddingBottom: 16, // Apply bottom padding here for the floating button
    marginTop: 0, // Ensure no top margin
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
    elevation: 8,
  },
});

export default CampusBuzzComponent;
