import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Your email"
          placeholderTextColor={'#ccc'}
          value={email}
          autoCapitalize="none"
          onChange={e => setEmail(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => handleLogin(email)} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading' : 'Send magic link'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  inputContainer: {
    padding: 20
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: '#fff',
    fontSize: 20
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: '#841584'
  },
  buttonText: {
    color: '#fff',
    padding: 10,
    fontSize: 20,
    textAlign: 'center'
  }
});
