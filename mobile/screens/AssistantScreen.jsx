// mobile/screens/AssistantScreen.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { LocationContext } from '../context/LocationContext';
import { getAdvice }       from '../api/api';
import theme               from '../theme';

export default function AssistantScreen() {
  const { coords, current } = useContext(LocationContext);
  const [advice, setAdvice]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords || !current) return;

    (async () => {
      setLoading(true);
      try {
        const text = await getAdvice({
          locationName: current.name,
          temp:         current.temp,
          description:  current.desc,
          lat:          coords.lat,
          lon:          coords.lon,
        });
        setAdvice(text);
      } catch {
        setAdvice('Sorry, could not fetch advice at this time.');
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, current]);

  if (!coords || !current) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>
          Search for a city first to enable your AI assistant.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // split into bullet points if LLM returned multiple lines
  const lines = advice.split(/\r?\n/).filter(l => l.trim());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Decorative orb at top */}
      <Image
        source={require('../assets/orb.gif')}
        style={styles.orb}
        resizeMode="contain"
      />

      <Text style={styles.header}>Weather Assistant</Text>

      {/* Advice lines in cards */}
      {lines.map((line, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.cardText}>{line}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:          theme.spacing.md,
    backgroundColor:  '#000',               // full black background
    flexGrow:         1,
    alignItems:       'center',
  },
  center: {
    flex:             1,
    justifyContent:   'center',
    alignItems:       'center',
    padding:          theme.spacing.md,
    backgroundColor:  '#000',
  },
  msg: {
    fontSize:    theme.fontSizes.md,
    color:       theme.colors.textSecondary,
    textAlign:   'center',
  },
  orb: {
    width:        150,
    height:       150,
    marginBottom: theme.spacing.md,
  },
  header: {
    fontSize:     theme.fontSizes.xl,
    fontWeight:   '600',
    color:        '#fff',
    marginBottom: theme.spacing.lg,
    textAlign:    'center',
  },
  card: {
    backgroundColor: '#111',             // dark card
    borderRadius:     theme.radii.md,
    padding:          theme.spacing.md,
    marginBottom:     theme.spacing.sm,
    width:            '100%',
    shadowColor:      '#000',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius:  4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardText: {
    color:      '#fff',
    fontSize:   theme.fontSizes.md,
    lineHeight: Platform.OS === 'ios' ? 22 : 20,
  },
});
