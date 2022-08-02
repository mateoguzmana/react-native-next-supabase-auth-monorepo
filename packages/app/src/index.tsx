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
