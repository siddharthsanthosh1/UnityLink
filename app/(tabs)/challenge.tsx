import { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert, Image, TextInput, View, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Game constants
const { width, height } = Dimensions.get('window');
const BUBBLE_SIZE = 60;
const BUBBLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];

// Define the Character type
interface Character {
  id: string;
  name: string;
  avatar: string;
}

// Define the Scenario type
interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  completed: boolean;
  empathyPoints: number;
  color: string;
}

// Define the Choice type
interface Choice {
  id: string;
  text: string;
  feedback: string;
  empathyPoints: number;
}

// Mock data for Unity Scenarios
const mockScenarios: Scenario[] = [
  {
    id: '1',
    title: 'Workplace Conversation',
    description: 'You overhear a colleague making a racist joke in the break room. Several people are laughing, but you can see that one person looks uncomfortable.',
    choices: [
      {
        id: '1a',
        text: 'Ignore it and walk away',
        feedback: 'While avoiding conflict might seem easier, speaking up against discrimination is important for creating an inclusive environment.',
        empathyPoints: 0
      },
      {
        id: '1b',
        text: 'Speak up and educate the person about the impact of their words',
        feedback: 'Great job! You helped educate others and fostered an inclusive environment. Your courage to speak up makes a difference.',
        empathyPoints: 10
      },
      {
        id: '1c',
        text: 'Report the behavior to HR',
        feedback: 'Reporting inappropriate behavior is important, especially in a professional setting. This helps create accountability.',
        empathyPoints: 5
      }
    ],
    completed: false,
    empathyPoints: 0,
    color: '#FF6B6B'
  },
  {
    id: '2',
    title: 'School Exclusion',
    description: 'You notice that a classmate is being excluded from group activities because of their religious practices. They often eat alone during lunch.',
    choices: [
      {
        id: '2a',
        text: 'Invite them to join your lunch table',
        feedback: 'Excellent! Small acts of inclusion can make a big difference in someone\'s day and help break down barriers.',
        empathyPoints: 10
      },
      {
        id: '2b',
        text: 'Talk to a teacher about the situation',
        feedback: 'Involving adults can help address systemic issues of exclusion. Good thinking about finding appropriate support.',
        empathyPoints: 7
      },
      {
        id: '2c',
        text: 'Do nothing, it\'s not your problem',
        feedback: 'Choosing not to act allows exclusion to continue. Remember that being a bystander to discrimination is a form of participation in it.',
        empathyPoints: 0
      }
    ],
    completed: false,
    empathyPoints: 0,
    color: '#4ECDC4'
  },
  {
    id: '3',
    title: 'Job Interview',
    description: 'During a job interview, you notice that the interviewer is asking different questions based on gender stereotypes. How do you respond?',
    choices: [
      {
        id: '3a',
        text: 'Answer professionally while noting the bias in your mind',
        feedback: 'You handled the situation professionally while being aware of the bias. This is a pragmatic approach in the moment.',
        empathyPoints: 5
      },
      {
        id: '3b',
        text: 'Politely point out the gender bias in the questions',
        feedback: 'Addressing bias directly but professionally helps create awareness and can lead to positive change in workplace practices.',
        empathyPoints: 8
      },
      {
        id: '3c',
        text: 'Report the interviewer to their supervisor after the interview',
        feedback: 'Reporting discriminatory practices is important for creating systemic change, even if it\'s uncomfortable.',
        empathyPoints: 7
      }
    ],
    completed: false,
    empathyPoints: 0,
    color: '#45B7D1'
  },
  {
    id: '4',
    title: 'Social Media Post',
    description: 'A friend shares a post that contains harmful stereotypes about a religious group. The post is getting a lot of likes from your mutual friends.',
    choices: [
      {
        id: '4a',
        text: 'Like the post to avoid conflict',
        feedback: 'Avoiding conflict might seem easier, but it can perpetuate harmful stereotypes. Your silence can be interpreted as agreement.',
        empathyPoints: 0
      },
      {
        id: '4b',
        text: 'Comment with factual information to counter the stereotypes',
        feedback: 'Educating others with facts is a powerful way to combat misinformation and stereotypes. Good job using your voice!',
        empathyPoints: 9
      },
      {
        id: '4c',
        text: 'Message your friend privately to discuss the issue',
        feedback: 'Having a private conversation can be more effective than public confrontation. This approach maintains relationships while addressing the issue.',
        empathyPoints: 8
      }
    ],
    completed: false,
    empathyPoints: 0,
    color: '#96CEB4'
  },
  {
    id: '5',
    title: 'Community Event',
    description: 'You\'re organizing a community event and notice that the planning committee doesn\'t include representation from all community groups.',
    choices: [
      {
        id: '5a',
        text: 'Continue with the current committee to avoid delays',
        feedback: 'While efficiency is important, excluding voices can lead to decisions that don\'t serve everyone in the community.',
        empathyPoints: 2
      },
      {
        id: '5b',
        text: 'Reach out to underrepresented groups to join the committee',
        feedback: 'Excellent! Including diverse perspectives leads to better decisions and a more inclusive community event.',
        empathyPoints: 10
      },
      {
        id: '5c',
        text: 'Suggest forming focus groups to gather input from all communities',
        feedback: 'Focus groups are a great way to gather diverse perspectives when full committee participation isn\'t possible.',
        empathyPoints: 7
      }
    ],
    completed: false,
    empathyPoints: 0,
    color: '#FFEEAD'
  }
];

// Game components
interface BubbleProps {
  position?: { x: number; y: number };
  color: string;
  size: number;
  onPress?: () => void;
}

const Bubble = ({ position = { x: 0, y: 0 }, color, size, onPress }: BubbleProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.bubble,
        {
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

// Game systems
interface GameEntities {
  physics: {
    engine: Matter.Engine;
    world: Matter.World;
  };
  bubble: {
    body: Matter.Body;
    color: string;
    size: number;
    renderer: (props: { body: Matter.Body; color: string; size: number }) => React.ReactElement;
  };
}

interface TimeProps {
  delta: number;
}

interface TouchProps {
  type: string;
  event: {
    pageX: number;
    pageY: number;
  };
}

interface TouchesProps {
  filter: (callback: (t: TouchProps) => boolean) => TouchProps[];
}

const Physics = (entities: GameEntities, { time }: { time: TimeProps }) => {
  const engine = entities.physics.engine;
  // Limit delta time to 16.667ms (60fps) to prevent physics instability
  const delta = Math.min(time.delta, 16.667);
  Matter.Engine.update(engine, delta);
  return entities;
};

const BubbleSystem = (entities: GameEntities, { touches }: { touches: TouchesProps }) => {
  touches.filter(t => t.type === 'move').forEach(t => {
    const bubble = entities.bubble;
    if (bubble && bubble.body) {
      Matter.Body.setPosition(bubble.body, { x: t.event.pageX, y: t.event.pageY });
    }
  });
  return entities;
};

// Define bubble type
interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function ChallengeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalEmpathyPoints, setTotalEmpathyPoints] = useState(0);
  const [character, setCharacter] = useState<Character | null>(null);
  const [showCharacterCreation, setShowCharacterCreation] = useState(true);
  const [name, setName] = useState('');
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameEntities, setGameEntities] = useState<GameEntities | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubbleAnimation] = useState(new Animated.Value(0));
  
  // Animation for bubbles
  useEffect(() => {
    if (showGame) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubbleAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bubbleAnimation, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showGame]);
  
  // Initialize game engine
  useEffect(() => {
    if (showGame) {
      // Create the physics engine with proper settings
      const engine = Matter.Engine.create({ 
        enableSleeping: false,
        constraintIterations: 4,
        positionIterations: 6,
        velocityIterations: 4
      });
      
      // Set gravity to a more natural value
      engine.world.gravity.y = 0.5;
      
      const world = engine.world;
      
      // Create bubble entities with improved physics properties
      const bubbleEntities: GameEntities = {
        physics: { engine, world },
        bubble: {
          body: Matter.Bodies.circle(width / 2, height / 2, BUBBLE_SIZE / 2, { 
            restitution: 0.8,
            friction: 0.005,
            density: 0.001,
            frictionAir: 0.001,
            slop: 0
          }),
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          size: BUBBLE_SIZE,
          renderer: (props) => {
            // Extract position from the body
            const position = { 
              x: props.body.position.x, 
              y: props.body.position.y 
            };
            
            return (
              <Bubble 
                position={position}
                color={props.color}
                size={props.size}
                onPress={() => {}}
              />
            );
          }
        }
      };
      
      // Add walls to contain the bubbles
      const wallThickness = 60;
      const walls = [
        Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }), // top
        Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }), // bottom
        Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }), // left
        Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }) // right
      ];
      
      Matter.World.add(world, walls);
      
      setGameEntities(bubbleEntities);
      setGameRunning(true);
      
      // Clean up function
      return () => {
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine);
      };
    }
  }, [showGame]);
  
  const handleCreateCharacter = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your character name.');
      return;
    }
    
    const newCharacter: Character = {
      id: '1',
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` // Generate avatar based on name
    };
    
    setCharacter(newCharacter);
    setShowCharacterCreation(false);
  };
  
  const handleStartScenario = (index: number) => {
    setCurrentScenarioIndex(index);
    setSelectedChoice(null);
    setShowFeedback(false);
  };
  
  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowFeedback(true);
    
    const scenario = scenarios[currentScenarioIndex!];
    const choice = scenario.choices.find(c => c.id === choiceId);
    
    if (choice) {
      // Update the scenario with the choice and empathy points
      const updatedScenarios = [...scenarios];
      updatedScenarios[currentScenarioIndex!] = {
        ...scenario,
        completed: true,
        empathyPoints: choice.empathyPoints
      };
      
      setScenarios(updatedScenarios);
      setTotalEmpathyPoints(totalEmpathyPoints + choice.empathyPoints);
      
      // Add a bubble for each empathy point earned
      const newBubbles = [...bubbles];
      for (let i = 0; i < choice.empathyPoints; i++) {
        newBubbles.push({
          id: Date.now() + i,
          x: Math.random() * width,
          y: height + 50,
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          size: 30 + Math.random() * 30
        });
      }
      setBubbles(newBubbles);
    }
  };
  
  const handleNextScenario = () => {
    if (currentScenarioIndex === null) return;
    
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // Game completed
      Alert.alert(
        'Congratulations!',
        `You've completed all scenarios with ${totalEmpathyPoints} empathy points!`,
        [{ text: 'Play Again', onPress: () => {
          setScenarios(mockScenarios);
          setCurrentScenarioIndex(null);
          setSelectedChoice(null);
          setShowFeedback(false);
          setTotalEmpathyPoints(0);
          setBubbles([]);
        }}]
      );
    }
  };
  
  const startGame = () => {
    setShowGame(true);
  };
  
  const renderCharacterCreation = () => (
    <ThemedView style={styles.characterCreationContainer}>
      <ThemedText type="title" style={styles.characterTitle}>Create Your Character</ThemedText>
      <ThemedText style={styles.characterSubtitle}>
        Your character will face various scenarios related to inequality and discrimination.
      </ThemedText>
      
      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>Name</ThemedText>
        <TextInput
          style={[
            styles.input,
            { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border,
              backgroundColor: Colors[colorScheme ?? 'light'].background
            }
          ]}
          placeholder="Enter your character's name"
          placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
          value={name}
          onChangeText={setName}
        />
      </ThemedView>
      
      <TouchableOpacity 
        style={[
          styles.createButton,
          { backgroundColor: Colors[colorScheme ?? 'light'].tint }
        ]}
        onPress={handleCreateCharacter}
      >
        <ThemedText style={styles.createButtonText}>Create Character</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
  
  const renderScenario = () => {
    if (currentScenarioIndex === null) return null;
    
    const scenario = scenarios[currentScenarioIndex];
    const selectedChoiceData = selectedChoice 
      ? scenario.choices.find(c => c.id === selectedChoice) 
      : null;
    
    return (
      <ThemedView style={[styles.scenarioContainer, { borderColor: scenario.color }]}>
        <LinearGradient
          colors={[scenario.color + '20', scenario.color + '10']}
          style={styles.scenarioGradient}
        >
          <ThemedView style={styles.scenarioHeader}>
            <ThemedText type="subtitle" style={styles.scenarioTitle}>
              {scenario.title}
            </ThemedText>
            <ThemedText style={styles.empathyPoints}>
              Empathy Points: {totalEmpathyPoints}
            </ThemedText>
          </ThemedView>
          
          <ThemedText style={styles.scenarioDescription}>
            {scenario.description}
          </ThemedText>
          
          {!showFeedback ? (
            <ThemedView style={styles.choicesContainer}>
              {scenario.choices.map(choice => (
                <TouchableOpacity
                  key={choice.id}
                  style={[
                    styles.choiceButton,
                    { borderColor: scenario.color }
                  ]}
                  onPress={() => handleSelectChoice(choice.id)}
                >
                  <ThemedText style={styles.choiceText}>{choice.text}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={styles.feedbackContainer}>
              <ThemedText style={styles.feedbackTitle}>Your Choice:</ThemedText>
              <ThemedText style={styles.feedbackChoice}>
                {selectedChoiceData?.text}
              </ThemedText>
              
              <ThemedText style={styles.feedbackTitle}>Feedback:</ThemedText>
              <ThemedText style={styles.feedbackText}>
                {selectedChoiceData?.feedback}
              </ThemedText>
              
              <ThemedText style={styles.empathyPointsEarned}>
                Empathy Points Earned: {selectedChoiceData?.empathyPoints}
              </ThemedText>
              
              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  { backgroundColor: scenario.color }
                ]}
                onPress={handleNextScenario}
              >
                <ThemedText style={styles.nextButtonText}>
                  {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Finish Game'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </LinearGradient>
      </ThemedView>
    );
  };
  
  const renderScenarioList = () => (
    <ThemedView style={styles.scenariosListContainer}>
      <ThemedView style={styles.characterInfo}>
        {character && (
          <>
            <Image 
              source={{ uri: character.avatar }} 
              style={styles.characterAvatar} 
            />
            <ThemedView style={styles.characterDetails}>
              <ThemedText style={styles.characterName}>{character.name}</ThemedText>
              <ThemedText style={styles.characterStats}>
                Empathy Points: {totalEmpathyPoints}
              </ThemedText>
            </ThemedView>
          </>
        )}
      </ThemedView>
      
      <ThemedText type="subtitle" style={styles.scenariosTitle}>
        Available Scenarios
      </ThemedText>
      
      {scenarios.map((scenario, index) => (
        <TouchableOpacity
          key={scenario.id}
          style={[
            styles.scenarioCard,
            scenario.completed && styles.completedScenario,
            { borderLeftColor: scenario.color }
          ]}
          onPress={() => handleStartScenario(index)}
        >
          <ThemedView style={styles.scenarioCardHeader}>
            <ThemedText style={styles.scenarioCardTitle}>
              {scenario.title}
            </ThemedText>
            {scenario.completed && (
              <IconSymbol 
                size={20} 
                name="checkmark.circle.fill" 
                color={scenario.color} 
              />
            )}
          </ThemedView>
          
          <ThemedText style={styles.scenarioCardDescription}>
            {scenario.description.substring(0, 100)}...
          </ThemedText>
          
          {scenario.completed && (
            <ThemedText style={[styles.empathyPointsEarned, { color: scenario.color }]}>
              Empathy Points: {scenario.empathyPoints}
            </ThemedText>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        style={styles.startGameButton}
        onPress={startGame}
      >
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.startGameGradient}
        >
          <ThemedText style={styles.startGameText}>Play Empathy Game</ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
  
  const renderGame = () => {
    if (!showGame) return null;
    
    return (
      <ThemedView style={styles.gameContainer}>
        <ThemedView style={styles.gameHeader}>
          <ThemedText type="title" style={styles.gameTitle}>Empathy Game</ThemedText>
          <ThemedText style={styles.gameSubtitle}>
            Collect empathy points by making good choices!
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.gameContent}>
          {gameRunning && gameEntities && (
            <GameEngine
              ref={(ref) => setGameEngine(ref)}
              style={styles.gameEngine}
              systems={[Physics, BubbleSystem]}
              entities={gameEntities}
              running={gameRunning}
              onEvent={(e: { type: string }) => {
                if (e.type === 'game-over') {
                  setGameRunning(false);
                }
              }}
            />
          )}
          
          <ThemedView style={styles.bubblesContainer}>
            {bubbles.map((bubble) => (
              <Animated.View
                key={bubble.id}
                style={[
                  styles.animatedBubble,
                  {
                    backgroundColor: bubble.color,
                    width: bubble.size,
                    height: bubble.size,
                    borderRadius: bubble.size / 2,
                    transform: [
                      {
                        translateY: bubbleAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -20],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </ThemedView>
          
          <ThemedView style={styles.gameStats}>
            <ThemedText style={styles.gameStatsText}>
              Empathy Points: {totalEmpathyPoints}
            </ThemedText>
          </ThemedView>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowGame(false)}
          >
            <ThemedText style={styles.backButtonText}>Back to Scenarios</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Unity Challenges</ThemedText>
        <ThemedText style={styles.subtitle}>Practice empathy through real-world scenarios</ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.content}>
        {showCharacterCreation ? (
          renderCharacterCreation()
        ) : showGame ? (
          renderGame()
        ) : currentScenarioIndex !== null ? (
          renderScenario()
        ) : (
          renderScenarioList()
        )}
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
    marginTop: 20,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  characterCreationContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterTitle: {
    marginBottom: 8,
  },
  characterSubtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  createButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scenariosListContainer: {
    marginBottom: 24,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  characterAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  characterDetails: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  characterStats: {
    opacity: 0.7,
  },
  scenariosTitle: {
    marginBottom: 16,
  },
  scenarioCard: {
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
  completedScenario: {
    opacity: 0.8,
  },
  scenarioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scenarioCardDescription: {
    marginBottom: 8,
    opacity: 0.7,
  },
  scenarioContainer: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    overflow: 'hidden',
  },
  scenarioGradient: {
    padding: 16,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scenarioTitle: {
    flex: 1,
  },
  empathyPoints: {
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  scenarioDescription: {
    marginBottom: 24,
    lineHeight: 22,
  },
  choicesContainer: {
    marginBottom: 16,
  },
  choiceButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  choiceText: {
    fontSize: 16,
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  feedbackChoice: {
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  feedbackText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  empathyPointsEarned: {
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 24,
  },
  nextButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startGameButton: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  startGameGradient: {
    padding: 16,
    alignItems: 'center',
  },
  startGameText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameContainer: {
    flex: 1,
  },
  gameHeader: {
    marginBottom: 20,
  },
  gameTitle: {
    marginBottom: 8,
  },
  gameSubtitle: {
    opacity: 0.7,
  },
  gameContent: {
    flex: 1,
    alignItems: 'center',
  },
  gameEngine: {
    width: width - 32,
    height: height / 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  animatedBubble: {
    position: 'absolute',
  },
  gameStats: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  gameStatsText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bubble: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
}); 