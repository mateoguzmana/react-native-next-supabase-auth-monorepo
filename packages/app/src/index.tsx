import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase-client';
import Auth from './components/Auth';
import Account from './components/Account';
import { Session } from '@supabase/supabase-js';
import { SafeAreaView, StyleSheet } from 'react-native';

export function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      setSession(supabaseSession);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
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
