import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PostStoryScreen() {
  const colorScheme = useColorScheme();
  const [storyText, setStoryText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload photos.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!storyText.trim()) {
      Alert.alert('Missing content', 'Please write your Unity Story before posting.');
      return;
    }
    
    // In a real app, this would upload to a backend
    Alert.alert('Success', 'Your Unity Story has been posted!');
    setStoryText('');
    setImage(null);
    setLocation('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Share Your Story</ThemedText>
        <ThemedText style={styles.subtitle}>Connect through shared experiences</ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.content}>
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Your Unity Story</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].border }
            ]}
            placeholder="Share a moment where someone from a different faith helped you, or where you learned something inspiring from another religion..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            multiline
            numberOfLines={6}
            value={storyText}
            onChangeText={setStoryText}
          />
        </ThemedView>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Location (optional)</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].border }
            ]}
            placeholder="City, Country"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={location}
            onChangeText={setLocation}
          />
        </ThemedView>
        
        <ThemedView style={styles.imageSection}>
          <ThemedText style={styles.label}>Add a Photo (optional)</ThemedText>
          
          {image ? (
            <ThemedView style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <IconSymbol size={20} name="xmark.circle.fill" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <TouchableOpacity 
              style={[
                styles.imagePickerButton,
                { borderColor: Colors[colorScheme ?? 'light'].border }
              ]}
              onPress={pickImage}
            >
              <IconSymbol size={24} name="photo.fill" color={Colors[colorScheme ?? 'light'].text} />
              <ThemedText style={styles.imagePickerText}>Add Photo</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        
        <TouchableOpacity 
          style={[
            styles.postButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={handlePost}
        >
          <ThemedText style={styles.postButtonText}>Post Your Story</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imageSection: {
    marginBottom: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 4,
  },
  postButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  postButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 