// weather-app-mobile/components/WeatherCard.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { createRecord } from '../api/api';
import theme from '../theme';

export default function WeatherCard({ record, onSaved }) {
  const [saving, setSaving] = useState(false);
  const {
    locationName,
    startDate,
    endDate,
    current,
    weatherData,
    lat,
    lon
  } = record;

  const handleSave = async () => {
    setSaving(true);
    await createRecord({
      locationName,
      lat,
      lon,
      startDate,
      endDate,
      weatherData,
      notes: ''
    });
    setSaving(false);
    onSaved();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {locationName} ({startDate} → {endDate})
      </Text>
      <Text style={styles.current}>
        {current.weather[0].description}, {current.main.temp}°C
      </Text>

      <ScrollView horizontal style={styles.forecast}>
        {weatherData.map(item => (
          <View key={item.dt} style={styles.day}>
            <Text style={styles.dayDate}>{item.dt_txt.slice(0, 10)}</Text>
            <Text style={styles.dayTemp}>{item.main.temp}°C</Text>
            <Text style={styles.dayDesc}>
              {item.weather[0].description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Button
        title={saving ? 'Saving…' : 'Save Record'}
        onPress={handleSave}
        disabled={saving}
        color={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding:          theme.spacing.md,
    backgroundColor:  theme.colors.cardBackground,
    borderRadius:     theme.radii.md,
    marginBottom:     theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius:  4,
      },
      android: {
        elevation: 2,
      },
    })
  },
  title: {
    fontSize:     theme.fontSizes.lg,
    fontWeight:   '600',
    marginBottom: theme.spacing.sm,
    color:        theme.colors.textPrimary,
  },
  current: {
    marginBottom: theme.spacing.md,
    color:        theme.colors.textSecondary,
  },
  forecast: {
    marginBottom: theme.spacing.md,
  },
  day: {
    alignItems:       'center',
    marginRight:      theme.spacing.sm,
    padding:          theme.spacing.sm,
    backgroundColor:  theme.colors.cardBackground,
    borderRadius:     theme.radii.sm,
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius:  3,
      },
      android: {
        elevation: 1,
      },
    })
  },
  dayDate: {
    color:      theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dayTemp: {
    color:      theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  dayDesc: {
    color:      theme.colors.textSecondary,
    textTransform: 'capitalize',
  }
});
