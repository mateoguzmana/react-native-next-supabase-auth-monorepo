import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native + Next.js Monorepo</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center'
  }
});

export default App;
