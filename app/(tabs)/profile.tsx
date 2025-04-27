import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload photos.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Missing information', 'Please enter your name.');
      return;
    }
    
    // In a real app, this would save to a backend
    Alert.alert('Success', 'Your profile has been updated!');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Your Profile</ThemedText>
        <ThemedText style={styles.subtitle}>Share your story with the world</ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.content}>
        <ThemedView style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <ThemedView style={styles.profileImagePlaceholder}>
              <IconSymbol size={40} name="person.fill" color={Colors[colorScheme ?? 'light'].text} />
            </ThemedView>
          )}
          
          <TouchableOpacity 
            style={[
              styles.changePhotoButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={pickImage}
          >
            <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { 
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border,
                backgroundColor: Colors[colorScheme ?? 'light'].background
              }
            ]}
            placeholder="Your name"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={name}
            onChangeText={setName}
          />
        </ThemedView>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Age</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { 
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border,
                backgroundColor: Colors[colorScheme ?? 'light'].background
              }
            ]}
            placeholder="Your age"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </ThemedView>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Bio</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              styles.bioInput,
              { 
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border,
                backgroundColor: Colors[colorScheme ?? 'light'].background
              }
            ]}
            placeholder="Tell us about yourself..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />
        </ThemedView>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={handleSaveProfile}
        >
          <ThemedText style={styles.saveButtonText}>Save Profile</ThemedText>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 