import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase-client';
import { Alert, StyleSheet, View, Image, Pressable } from 'react-native';
import React from 'react';

interface AvatarProps {
  imagePicker: () => Promise<any>;
}

export default function Avatar({
  url,
  size,
  onUpload,
  imagePicker
}: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const downloadedUrl = URL.createObjectURL(data);
      setAvatarUrl(downloadedUrl);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar(event) {
    const image = await imagePicker();

    console.log({ image });

    // try {
    //   setUploading(true);

    //   if (!event.target.files || event.target.files.length === 0) {
    //     throw new Error('You must select an image to upload.');
    //   }

    //   const file = event.target.files[0];
    //   const fileExt = file.name.split('.').pop();
    //   const fileName = `${Math.random()}.${fileExt}`;
    //   const filePath = `${fileName}`;

    //   let { error: uploadError } = await supabase.storage
    //     .from('avatars')
    //     .upload(filePath, file);

    //   if (uploadError) {
    //     throw uploadError;
    //   }

    //   onUpload(filePath);
    // } catch (error: any) {
    //   Alert.alert(error.message);
    // } finally {
    //   setUploading(false);
    // }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} />
      ) : (
        <Pressable onPress={uploadAvatar}>
          <Image
            source={{
              uri: 'data:image/png;base64,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'
            }}
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
      )}
      {/* <View>
        <Input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </View> */}
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
