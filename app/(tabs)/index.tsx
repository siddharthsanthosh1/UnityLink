import { StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define the Story type
interface Story {
  id: string;
  username: string;
  story: string;
  location: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

// Mock data for Unity Stories
const mockStories: Story[] = [
  {
    id: '1',
    username: 'PeaceSeeker',
    story: 'I attended a Diwali celebration with my Hindu neighbors last week. The lights, the food, and the warmth of their family made me feel so welcomed. It reminded me that joy and celebration are universal languages.',
    location: 'New York, USA',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    liked: false,
  },
  {
    id: '2',
    username: 'HarmonyLover',
    story: 'During Ramadan, my Muslim colleague invited me to break fast with her family. I learned so much about their traditions and felt the deep sense of community they share. It was a beautiful experience.',
    location: 'London, UK',
    timestamp: '5 hours ago',
    likes: 18,
    comments: 3,
    liked: false,
  },
  {
    id: '3',
    username: 'UnityBuilder',
    story: 'I visited a Buddhist temple for the first time last month. The peace and mindfulness practices I learned there have completely transformed my daily routine. I\'m grateful for the wisdom shared with me.',
    location: 'Toronto, Canada',
    timestamp: '1 day ago',
    likes: 32,
    comments: 7,
    liked: false,
  },
  {
    id: '4',
    username: 'BridgeMaker',
    story: 'My Jewish friend taught me how to make challah bread. As we kneaded the dough together, we shared stories about our families and traditions. Food truly brings people together.',
    location: 'Melbourne, Australia',
    timestamp: '2 days ago',
    likes: 29,
    comments: 4,
    liked: false,
  },
  {
    id: '5',
    username: 'FaithExplorer',
    story: 'I attended a Sunday service at a local church with my Christian friend. The sense of community and the beautiful hymns moved me deeply. It was a reminder that we all seek connection and meaning.',
    location: 'Berlin, Germany',
    timestamp: '3 days ago',
    likes: 21,
    comments: 6,
    liked: false,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [stories, setStories] = useState<Story[]>(mockStories);

  const handleLike = (id: string) => {
    setStories(stories.map(story => 
      story.id === id 
        ? { 
            ...story, 
            liked: !story.liked,
            likes: story.liked ? story.likes - 1 : story.likes + 1
          } 
        : story
    ));
  };

  const handleComment = (id: string) => {
    // In a real app, this would open a comment modal or navigate to a comment screen
    Alert.alert(
      'Comments',
      'This feature would open a comment section in a real app.',
      [{ text: 'OK' }]
    );
  };

  const renderStoryItem = ({ item }: { item: Story }) => (
    <ThemedView style={[
      styles.storyCard,
      {
        borderLeftColor: Colors[colorScheme ?? 'light'].tint,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }
    ]}>
      <ThemedView style={styles.storyHeader}>
        <ThemedText type="defaultSemiBold">{item.username}</ThemedText>
        <ThemedText style={[styles.timestamp, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.timestamp}
        </ThemedText>
      </ThemedView>
      
      <ThemedText style={[styles.storyText, { color: Colors[colorScheme ?? 'light'].text }]}>
        {item.story}
      </ThemedText>
      
      <ThemedView style={styles.storyFooter}>
        <ThemedView style={styles.locationContainer}>
          <IconSymbol size={16} name="location.fill" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={[styles.location, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.location}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.engagementContainer}>
          <TouchableOpacity 
            style={styles.engagementButton}
            onPress={() => handleLike(item.id)}
          >
            <IconSymbol 
              size={18} 
              name={item.liked ? "heart.fill" : "heart"} 
              color={item.liked ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text} 
            />
            <ThemedText 
              style={[
                styles.engagementText,
                { color: Colors[colorScheme ?? 'light'].text },
                item.liked && { color: Colors[colorScheme ?? 'light'].tint }
              ]}
            >
              {item.likes}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.engagementButton}
            onPress={() => handleComment(item.id)}
          >
            <IconSymbol size={18} name="bubble.left.fill" color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={[styles.engagementText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.comments}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Unity Stories</ThemedText>
        <ThemedText style={styles.subtitle}>Bridging divides through shared experiences</ThemedText>
      </ThemedView>
      
      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    paddingBottom: 20,
  },
  storyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  storyText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  engagementContainer: {
    flexDirection: 'row',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  engagementText: {
    fontSize: 14,
    marginLeft: 4,
  },
});
