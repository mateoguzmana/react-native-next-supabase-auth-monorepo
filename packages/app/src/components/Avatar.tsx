import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase-client';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  Pressable,
  Platform,
  ActivityIndicator
} from 'react-native';
import React from 'react';
import { decode } from 'base64-arraybuffer';

export declare type ErrorCode = 'camera_unavailable' | 'permission' | 'others';
export interface Asset {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
}
export interface ImagePickerResponse {
  didCancel?: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  assets?: Asset[];
}

interface AvatarProps {
  imagePicker: () => Promise<ImagePickerResponse>;
  url?: string;
  onUpload: (url: string) => void;
  loading?: boolean;
}

export default function Avatar({
  url,
  onUpload,
  imagePicker,
  loading
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

      if (data) {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(data);
        fileReaderInstance.onload = () => {
          const base64data = fileReaderInstance.result;

          base64data && setAvatarUrl(base64data as string);
        };
      }
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar() {
    const images = await imagePicker();

    if (images && images.assets) {
      const getFilename = images.assets[0].uri.split('/');
      const fileName = getFilename[getFilename.length - 1];
      const imageToUpload = images.assets[0].base64;

      try {
        setUploading(true);

        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(imageToUpload), {
            contentType: 'image/jpg'
          });

        if (uploadError) {
          throw uploadError;
        }

        onUpload(fileName);
      } catch (error: any) {
        Alert.alert(error.message);
      } finally {
        setUploading(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      {uploading || loading ? (
        <ActivityIndicator
          style={styles.avatar}
          animating={uploading || loading}
        />
      ) : avatarUrl ? (
        <Pressable onPress={uploadAvatar}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </Pressable>
      ) : (
        <Pressable onPress={uploadAvatar}>
          <Image
            source={{
              uri: 'data:image/png;base64,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'
            }}
            style={styles.avatar}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 150,
    height: 150,
    borderWidth: 4,
    borderColor: '#841584',
    borderRadius: 75
  }
});
