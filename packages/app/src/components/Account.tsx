import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase-client';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { ApiError, Session } from '@supabase/supabase-js';
import Avatar from './Avatar';
import Alert from './Alert';

interface AccountProps {
  imagePicker: () => Promise<any>;
  session: Session;
}

export default function Account({ session, imagePicker }: AccountProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);

      const user = supabase.auth.user();

      if (!user) throw new Error('No user on the session!');

      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date()
      };

      let { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateAvatar(newAvatarUrl?: string) {
    try {
      setLoading(true);

      const user = supabase.auth.user();

      if (!user) throw new Error('No user on the session!');

      const updates = {
        id: user.id,
        avatar_url: newAvatarUrl ?? avatar_url,
        updated_at: new Date()
      };

      let { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  function onUpload(url: string) {
    setAvatarUrl(url);
    updateAvatar(url);
  }

  return (
    <View style={styles.container}>
      <Avatar
        imagePicker={imagePicker}
        url={avatar_url}
        onUpload={onUpload}
        loading={loading}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={session?.user?.email}
          editable={false}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username || ''}
          onChangeText={text => setUsername(text)}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Website"
          value={website || ''}
          onChangeText={text => setWebsite(text)}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity
        onPress={() => updateProfile()}
        disabled={loading}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading ...' : 'Update'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => supabase.auth.signOut()}
        style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    minWidth: Platform.OS === 'web' ? '30%' : undefined
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
