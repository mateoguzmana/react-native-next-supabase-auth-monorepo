import React from 'react';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../utils/supabase-client';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (loginEmail: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        email: loginEmail
      });
      if (error) throw error;
      Alert.alert('Check your email for the login link!');
    } catch (error) {
      console.log(error);
      Alert.alert((error as any).error_description || (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication with Supabase</Text>
      <Text style={styles.subtitle}>
        Sign in via magic link with your email below
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.nativeEvent.text)}
      />
      <View style={styles.button}>
        <Button
          onPress={() => handleLogin(email)}
          disabled={loading}
          title={loading ? 'Loading' : 'Send magic link'}
          color="#841584"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    width: '70%',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    width: '70%',
    textAlign: 'center'
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: '#fff',
    width: '70%'
  },
  button: {
    width: '70%'
  }
});
