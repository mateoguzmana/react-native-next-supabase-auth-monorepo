import React from 'react';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
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
    <View style={{ backgroundColor: 'white' }}>
      <View>
        <Text>Authentication with Supabase</Text>
        <Text>Sign in via magic link with your email below</Text>
        <View>
          <TextInput
            style={{ backgroundColor: 'blue' }}
            keyboardType="email-address"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.nativeEvent.text)}
          />
        </View>
        <View>
          <Button
            onPress={() => handleLogin(email)}
            disabled={loading}
            title={loading ? 'Loading' : 'Send magic link'}
          />
        </View>
      </View>
    </View>
  );
}
