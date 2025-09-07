import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NetworkingPage() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🤝</Text>
        <ThemedText style={styles.title}>Networking</ThemedText>
        <ThemedText style={styles.subtitle}>Under Development</ThemedText>
        <ThemedText style={styles.description}>
          Connect with fellow students and professionals. This feature is currently being built. Check back later!
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.7,
  },
});
