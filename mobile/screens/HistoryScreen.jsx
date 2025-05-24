// mobile/screens/HistoryScreen.jsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Linking, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RecordList from '../components/RecordList';
import theme from '../theme';

export default function HistoryScreen({ navigation }) {
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(k => k + 1);
    }, [])
  );

  const handleExport = async (format) => {
    const fmt = encodeURIComponent(format.trim().toLowerCase());
    const url = `http://192.168.0.127:4000/records/export?format=${fmt}`;
    console.log('🔗 Export URL:', url);
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Export Failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Saved Records</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleExport('csv')}
            style={styles.exportButton}
          >
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleExport('md')}
            style={styles.exportButton}
          >
            <Text style={styles.exportText}>MD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RecordList refreshKey={refreshKey} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical:   theme.spacing.sm,
    backgroundColor:  theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderColor:      '#444', // darker divider in dark mode
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    flex:        1,
    textAlign:   'center',
    fontSize:    theme.fontSizes.lg,
    fontWeight:  '600',
    color:       theme.colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
  },
  exportButton: {
    marginLeft:     theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius:   theme.radii.sm,
    backgroundColor: theme.colors.primary,
  },
  exportText: {
    color:      '#fff',
    fontSize:   theme.fontSizes.md,
    fontWeight: '600',
  },
});
