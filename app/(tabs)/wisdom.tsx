import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Share } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define the Quote type
interface Quote {
  id: string;
  text: string;
  source: string;
  religion: string;
  date: string;
}

// Mock data for Daily Wisdom quotes
const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'Blessed are the peacemakers, for they will be called children of God.',
    source: 'Matthew 5:9',
    religion: 'Christianity',
    date: 'Today',
  },
  {
    id: '2',
    text: 'O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you.',
    source: 'Quran 49:13',
    religion: 'Islam',
    date: 'Yesterday',
  },
  {
    id: '3',
    text: 'The world is one family.',
    source: 'Vasudhaiva Kutumbakam, Maha Upanishad',
    religion: 'Hinduism',
    date: '2 days ago',
  },
  {
    id: '4',
    text: 'Love your neighbor as yourself.',
    source: 'Leviticus 19:18',
    religion: 'Judaism',
    date: '3 days ago',
  },
  {
    id: '5',
    text: 'If you light a lamp for someone else, it will also brighten your path.',
    source: 'Buddha',
    religion: 'Buddhism',
    date: '4 days ago',
  },
  {
    id: '6',
    text: 'The earth is but one country, and mankind its citizens.',
    source: 'Baha\'u\'llah',
    religion: 'Bahá\'í Faith',
    date: '5 days ago',
  },
  {
    id: '7',
    text: 'Do unto others as you would have them do unto you.',
    source: 'The Golden Rule',
    religion: 'Universal',
    date: '6 days ago',
  },
];

export default function WisdomScreen() {
  const colorScheme = useColorScheme();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuoteIndex(randomIndex);
  };
  
  // Function to share the current quote
  const shareQuote = async () => {
    const currentQuote = quotes[currentQuoteIndex];
    try {
      await Share.share({
        message: `"${currentQuote.text}"\n- ${currentQuote.source} (${currentQuote.religion})\n\nShared from UnityLink`,
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };
  
  // Set a random quote on component mount
  useEffect(() => {
    getRandomQuote();
  }, []);
  
  const currentQuote = quotes[currentQuoteIndex];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Daily Wisdom</ThemedText>
        <ThemedText style={styles.subtitle}>Inspiring quotes from world religions</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.quoteCard}>
        <ThemedText style={styles.quoteText}>"{currentQuote.text}"</ThemedText>
        
        <ThemedView style={styles.quoteSource}>
          <ThemedText style={styles.sourceText}>- {currentQuote.source}</ThemedText>
          <ThemedText style={styles.religionText}>{currentQuote.religion}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.dateContainer}>
          <IconSymbol 
            size={16} 
            name="calendar" 
            color={Colors[colorScheme ?? 'light'].icon} 
          />
          <ThemedText style={styles.dateText}>{currentQuote.date}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={getRandomQuote}
        >
          <IconSymbol size={20} name="arrow.clockwise" color="white" />
          <ThemedText style={styles.actionButtonText}>New Quote</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={shareQuote}
        >
          <IconSymbol size={20} name="square.and.arrow.up" color="white" />
          <ThemedText style={styles.actionButtonText}>Share</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.infoCard}>
        <ThemedText type="subtitle">About Daily Wisdom</ThemedText>
        <ThemedText style={styles.infoText}>
          Each day, UnityLink presents a quote from various religious traditions that promote peace, unity, and understanding. These quotes are selected to highlight the common values shared across faiths.
        </ThemedText>
      </ThemedView>
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
  quoteCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 22,
    lineHeight: 32,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  quoteSource: {
    marginBottom: 12,
  },
  sourceText: {
    fontWeight: '600',
  },
  religionText: {
    opacity: 0.7,
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    marginTop: 8,
    lineHeight: 22,
  },
}); 