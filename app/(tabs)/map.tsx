import { useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert, ColorSchemeName } from 'react-native';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define the Story type
interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

// Define the Location type
interface Location {
  id: string;
  city: string;
  country: string;
  storyCount: number;
  recentStory: string;
  stories: Story[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Mock data for Unity Map locations with multiple stories
const mockLocations: Location[] = [
  {
    id: '1',
    city: 'New York',
    country: 'USA',
    storyCount: 24,
    recentStory: 'Interfaith dinner at the local community center',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    stories: [
      {
        id: 'ny1',
        title: 'Interfaith Dinner Success',
        content: 'Last week, our local community center hosted an interfaith dinner that brought together people from all walks of life. The event featured traditional dishes from various cultures, and everyone shared stories about their faith traditions. It was heartwarming to see how much we all have in common.',
        author: 'Sarah Johnson',
        date: 'May 15, 2023'
      },
      {
        id: 'ny2',
        title: 'Youth Bridge Program',
        content: 'The Youth Bridge Program in Manhattan has been connecting teenagers from different religious backgrounds for the past year. Through weekly meetings and monthly outings, these young people have formed lasting friendships that transcend religious differences.',
        author: 'Michael Chen',
        date: 'April 28, 2023'
      },
      {
        id: 'ny3',
        title: 'Interfaith Art Exhibition',
        content: 'The Brooklyn Museum recently hosted an interfaith art exhibition featuring works from artists of various religious backgrounds. The exhibition highlighted common themes across different faith traditions and attracted visitors from all over the city.',
        author: 'Priya Patel',
        date: 'March 10, 2023'
      },
      {
        id: 'ny4',
        title: 'Community Garden Project',
        content: 'A community garden in Queens brings together people from different faith communities to grow vegetables and flowers. The project has not only beautified the neighborhood but also created a space for meaningful dialogue and understanding.',
        author: 'David Rodriguez',
        date: 'February 5, 2023'
      },
      {
        id: 'ny5',
        title: 'Interfaith Music Festival',
        content: 'The annual Interfaith Music Festival in Central Park featured performances from musicians representing various religious traditions. The event drew thousands of attendees and demonstrated the power of music to unite people across cultural and religious divides.',
        author: 'Emily Thompson',
        date: 'January 20, 2023'
      }
    ]
  },
  {
    id: '2',
    city: 'London',
    country: 'UK',
    storyCount: 18,
    recentStory: 'Muslim and Jewish youth working together on community garden',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    stories: [
      {
        id: 'ld1',
        title: 'Community Garden Initiative',
        content: 'Muslim and Jewish youth in London have been working together on a community garden project in East London. The initiative has not only beautified the neighborhood but also created a space for meaningful dialogue and understanding between the two communities.',
        author: 'James Wilson',
        date: 'May 10, 2023'
      },
      {
        id: 'ld2',
        title: 'Interfaith Book Club',
        content: 'A monthly book club in Camden brings together readers from different faith backgrounds to discuss literature that explores themes of faith, identity, and belonging. The group has been meeting for over two years and has become a model for interfaith dialogue.',
        author: 'Aisha Rahman',
        date: 'April 15, 2023'
      },
      {
        id: 'ld3',
        title: 'Faith Leaders Forum',
        content: 'Faith leaders from across London gathered for a quarterly forum to discuss ways to promote understanding and cooperation among different religious communities. The forum has led to several joint initiatives addressing social issues in the city.',
        author: 'Reverend Thomas Brown',
        date: 'March 22, 2023'
      },
      {
        id: 'ld4',
        title: 'Interfaith Sports League',
        content: 'The London Interfaith Sports League brings together teams from different religious communities for friendly competition. The league has been running for five years and has helped break down stereotypes and build friendships across faith lines.',
        author: 'Mohammed Ali',
        date: 'February 8, 2023'
      },
      {
        id: 'ld5',
        title: 'Faith and Food Festival',
        content: 'The annual Faith and Food Festival in Hyde Park showcases culinary traditions from various religious communities in London. The event attracts thousands of visitors and provides an opportunity for people to learn about different faith traditions through food.',
        author: 'Sophie Williams',
        date: 'January 12, 2023'
      }
    ]
  },
  {
    id: '3',
    city: 'Mumbai',
    country: 'India',
    storyCount: 32,
    recentStory: 'Hindus and Muslims celebrating Eid together',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    stories: [
      {
        id: 'mb1',
        title: 'Eid Celebrations Together',
        content: 'In a heartwarming display of unity, Hindus and Muslims in Mumbai celebrated Eid together this year. The celebration included traditional Eid dishes, cultural performances, and a message of peace and harmony from community leaders.',
        author: 'Rajesh Kumar',
        date: 'May 5, 2023'
      },
      {
        id: 'mb2',
        title: 'Interfaith Youth Camp',
        content: 'A week-long interfaith youth camp in Mumbai brought together young people from different religious backgrounds for workshops, discussions, and team-building activities. The camp aimed to foster understanding and friendship among future leaders.',
        author: 'Fatima Khan',
        date: 'April 18, 2023'
      },
      {
        id: 'mb3',
        title: 'Faith Leaders Dialogue',
        content: 'Faith leaders from various communities in Mumbai participated in a dialogue session to discuss ways to promote peace and harmony in the city. The session resulted in a joint statement calling for respect and understanding among all religious communities.',
        author: 'Imam Abdul Rahman',
        date: 'March 30, 2023'
      },
      {
        id: 'mb4',
        title: 'Interfaith Art Workshop',
        content: 'An art workshop in Mumbai brought together artists from different religious backgrounds to create collaborative pieces that explore themes of unity and diversity. The resulting artwork was displayed at a public exhibition that attracted visitors from across the city.',
        author: 'Priya Sharma',
        date: 'February 15, 2023'
      },
      {
        id: 'mb5',
        title: 'Community Service Project',
        content: 'Members of different religious communities in Mumbai came together for a community service project to clean up a local park and plant trees. The project demonstrated how people of different faiths can work together for the common good.',
        author: 'Amit Patel',
        date: 'January 25, 2023'
      }
    ]
  },
  {
    id: '4',
    city: 'Cairo',
    country: 'Egypt',
    storyCount: 15,
    recentStory: 'Coptic Christians and Muslims sharing Ramadan iftar',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    stories: [
      {
        id: 'ca1',
        title: 'Shared Ramadan Iftar',
        content: 'Coptic Christians and Muslims in Cairo shared an iftar meal during Ramadan, demonstrating the spirit of unity and friendship between the two communities. The event included traditional Ramadan dishes and a discussion about the importance of interfaith dialogue.',
        author: 'Ahmed Hassan',
        date: 'May 8, 2023'
      },
      {
        id: 'ca2',
        title: 'Interfaith Youth Forum',
        content: 'Young people from different religious backgrounds in Cairo participated in a forum to discuss ways to promote understanding and cooperation among different faith communities. The forum resulted in several joint initiatives addressing social issues in the city.',
        author: 'Mariam Coptic',
        date: 'April 20, 2023'
      },
      {
        id: 'ca3',
        title: 'Faith Leaders Meeting',
        content: 'Faith leaders from various communities in Cairo gathered for a meeting to discuss ways to promote peace and harmony in the city. The meeting resulted in a joint statement calling for respect and understanding among all religious communities.',
        author: 'Father Mark',
        date: 'March 15, 2023'
      },
      {
        id: 'ca4',
        title: 'Interfaith Cultural Festival',
        content: 'A cultural festival in Cairo showcased the traditions and customs of different religious communities in the city. The festival included music, dance, and food from various faith traditions and attracted visitors from across the city.',
        author: 'Nour Ibrahim',
        date: 'February 10, 2023'
      },
      {
        id: 'ca5',
        title: 'Community Clean-up Day',
        content: 'Members of different religious communities in Cairo came together for a community clean-up day to improve their shared neighborhood. The event demonstrated how people of different faiths can work together for the common good.',
        author: 'Youssef Ahmed',
        date: 'January 18, 2023'
      }
    ]
  },
  {
    id: '5',
    city: 'Tokyo',
    country: 'Japan',
    storyCount: 12,
    recentStory: 'Buddhist temple hosting interfaith meditation session',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    stories: [
      {
        id: 'tk1',
        title: 'Interfaith Meditation Session',
        content: 'A Buddhist temple in Tokyo hosted an interfaith meditation session that brought together practitioners from various religious traditions. The session included guided meditation, discussion, and a shared meal, creating a space for spiritual connection across faith lines.',
        author: 'Yuki Tanaka',
        date: 'May 12, 2023'
      },
      {
        id: 'tk2',
        title: 'Faith and Art Exhibition',
        content: 'An art exhibition in Tokyo featured works from artists of various religious backgrounds, exploring themes of faith, spirituality, and human connection. The exhibition attracted visitors from across the city and sparked meaningful conversations about faith and art.',
        author: 'Hiroshi Sato',
        date: 'April 25, 2023'
      },
      {
        id: 'tk3',
        title: 'Interfaith Dialogue Series',
        content: 'A series of dialogue sessions in Tokyo brought together people from different religious backgrounds to discuss common values and shared challenges. The sessions were facilitated by faith leaders and community organizers and aimed to build bridges between different faith communities.',
        author: 'Akiko Yamamoto',
        date: 'March 18, 2023'
      },
      {
        id: 'tk4',
        title: 'Community Garden Project',
        content: 'A community garden in Tokyo brings together people from different faith backgrounds to grow vegetables and flowers. The project has not only beautified the neighborhood but also created a space for meaningful dialogue and understanding.',
        author: 'Kenji Watanabe',
        date: 'February 22, 2023'
      },
      {
        id: 'tk5',
        title: 'Interfaith Music Concert',
        content: 'A music concert in Tokyo featured performances from musicians representing various religious traditions. The event drew hundreds of attendees and demonstrated the power of music to unite people across cultural and religious divides.',
        author: 'Mika Suzuki',
        date: 'January 30, 2023'
      }
    ]
  },
];

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const [locations] = useState(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const handleLocationPress = (id: string) => {
    setSelectedLocation(id);
  };
  
  const selectedLocationData = selectedLocation 
    ? locations.find(loc => loc.id === selectedLocation) 
    : null;

  // Create HTML for the map using Google Maps JavaScript API
  const getMapHtml = (selectedLocationId: string | null) => {
    const isDarkMode = colorScheme === 'dark';
    const mapStyle = isDarkMode ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "administrative.locality", stylers: [{ color: "#d59563" }] },
      { elementType: "poi", stylers: [{ color: "#d59563" }] },
      { elementType: "poi.park", stylers: [{ color: "#263c3f" }] },
      { elementType: "poi.park", stylers: [{ color: "#6b9a76" }] },
      { elementType: "road", stylers: [{ color: "#38414e" }] },
      { elementType: "road", stylers: [{ color: "#212a37" }] },
      { elementType: "road", stylers: [{ color: "#9ca5b3" }] },
      { elementType: "road.highway", stylers: [{ color: "#746855" }] },
      { elementType: "road.highway", stylers: [{ color: "#1f2835" }] },
      { elementType: "road.highway", stylers: [{ color: "#f3d19c" }] },
      { elementType: "transit", stylers: [{ color: "#2f3948" }] },
      { elementType: "transit.station", stylers: [{ color: "#d59563" }] },
      { elementType: "water", stylers: [{ color: "#17263c" }] },
      { elementType: "water", stylers: [{ color: "#515c6d" }] },
      { elementType: "water", stylers: [{ color: "#17263c" }] }
    ] : [];

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body, #map {
              height: 100%;
              margin: 0;
              padding: 0;
              width: 100%;
            }
            #map {
              position: relative;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 39.8283, lng: -98.5795 },
                zoom: 3,
                styles: ${JSON.stringify(mapStyle)}
              });
              
              const locations = ${JSON.stringify(locations)};
              const markers = {};
              
              locations.forEach(location => {
                const isSelected = location.id === "${selectedLocationId}";
                const marker = new google.maps.Marker({
                  position: { lat: location.coordinates.lat, lng: location.coordinates.lng },
                  map: map,
                  title: location.city + ', ' + location.country,
                  animation: isSelected ? google.maps.Animation.BOUNCE : null,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: isSelected ? 10 : 7,
                    fillColor: isSelected ? '#0a7ea4' : '#00a3d7',
                    fillOpacity: 0.9,
                    strokeWeight: 1,
                    strokeColor: '#ffffff'
                  }
                });
                
                marker.addListener('click', function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'markerClick',
                    locationId: location.id
                  }));
                });
                
                markers[location.id] = marker;
              });
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8ZVwkITmcVacNzxZDkiuWuThowP6cpz4&callback=initMap">
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick') {
        handleLocationPress(data.locationId);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Unity Map</ThemedText>
          <ThemedText style={styles.subtitle}>Global visualization of cross-religion kindness</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{ html: getMapHtml(selectedLocation) }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </ThemedView>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.locationsContainer}
          contentContainerStyle={styles.locationsContentContainer}
        >
          {locations.map(location => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationButton,
                selectedLocation === location.id && styles.selectedLocationButton
              ]}
              onPress={() => handleLocationPress(location.id)}
            >
              <ThemedText 
                style={[
                  styles.locationButtonText,
                  selectedLocation === location.id && styles.selectedLocationButtonText
                ]}
              >
                {location.city}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {selectedLocationData && (
          <ThemedView style={styles.storiesContainer}>
            <ThemedText type="subtitle" style={styles.storiesTitle}>
              Stories from {selectedLocationData.city}
            </ThemedText>
            
            {selectedLocationData.stories.map(story => (
              <ThemedView key={story.id} style={styles.storyCard}>
                <ThemedText style={styles.storyTitle}>{story.title}</ThemedText>
                <ThemedText style={styles.storyAuthor}>
                  By {story.author} • {story.date}
                </ThemedText>
                <ThemedText style={styles.storyText}>{story.content}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  locationsContainer: {
    marginBottom: 16,
  },
  locationsContentContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 100,
  },
  selectedLocationButton: {
    backgroundColor: '#ADD8E6', // Light blue color
  },
  locationButtonText: {
    fontWeight: '600',
    color: '#000000',
    fontSize: 14,
  },
  selectedLocationButtonText: {
    color: '#000000', // Keep text black even when selected
  },
  storiesContainer: {
    marginTop: 8,
  },
  storiesTitle: {
    marginBottom: 16,
  },
  storyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storyAuthor: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  storyText: {
    lineHeight: 22,
  },
}); 