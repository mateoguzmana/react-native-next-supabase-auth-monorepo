import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Auth from './components/Auth';

export function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Auth />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212'
  }
});

export default App;
