// weather-app-mobile/components/RecordList.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Platform
} from 'react-native';
import theme from '../theme';
import { getAllRecords as getRecords, deleteRecord } from '../api/api';
import EditRecordModal from './EditRecordModal';

export default function RecordList({ refreshKey }) {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records', err);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      load();
    } catch (err) {
      console.error('Failed to delete record', err);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.loc}>
                {item.locationName} ({item.startDate.slice(0,10)}→{item.endDate.slice(0,10)})
              </Text>
              <Text style={styles.count}>
                {item.weatherData.length} entries
              </Text>
            </View>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => setEditing(item)} />
              <Button title="Delete" onPress={() => handleDelete(item._id)} color="red" />
            </View>
          </View>
        )}
      />

      {editing && (
        <EditRecordModal
          record={editing}
          onClose={() => { setEditing(null); load(); }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.sm,
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius:  3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loc: {
    fontWeight: '600',
    color:      theme.colors.textPrimary,
  },
  count: {
    color:     theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  buttons: {
    flexDirection: 'row',
    alignItems:    'center',
  },
});
