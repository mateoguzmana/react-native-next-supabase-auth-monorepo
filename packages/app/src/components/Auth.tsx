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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication with Supabase</Text>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Your password"
          placeholderTextColor={'#ccc'}
          value={password}
          autoCapitalize="none"
          textContentType="password"
          onChange={e => setPassword(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => signInWithEmail()} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading' : 'Sign in with email'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.button}>
        <TouchableOpacity onPress={() => signUpWithEmail()} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading' : 'Sign up'}
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
    marginHorizontal: 20
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
    backgroundColor: '#841584',
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    padding: 10,
    fontSize: 20,
    textAlign: 'center'
  }
});
