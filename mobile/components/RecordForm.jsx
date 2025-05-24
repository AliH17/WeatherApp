// weather-app-mobile/components/RecordForm.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { geocode, getCurrent, getForecast } from '../api/api';

export default function RecordForm({ onFetched }) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleFetch = async () => {
    if (!location || !startDate || !endDate) {
      return setError('All fields are required');
    }
    setError(''); setLoading(true);
    try {
      const geo = await geocode(location);
      if (!geo.length) throw new Error('Location not found');
      const { lat, lon, name } = geo[0];
      const current = await getCurrent(lat, lon);
      const forecast = await getForecast(lat, lon);
      onFetched({
        locationName: name,
        lat, lon,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        current, weatherData: forecast
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity onPress={() => setShowStartPicker(true)}>
        <Text style={styles.dateText}>Start: {formatDate(startDate)}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndPicker(true)}>
        <Text style={styles.dateText}>End: {formatDate(endDate)}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <Button
        title={loading ? 'Fetching…' : 'Fetch Weather'}
        onPress={handleFetch}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, borderRadius: 4, marginBottom: 12
  },
  dateText: {
    padding: 8, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 4, marginBottom: 12
  },
  error: { color: 'red', marginBottom: 8 }
});
