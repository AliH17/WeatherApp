// weather-app-mobile/components/EditRecordModal.jsx
import React, { useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateRecord } from '../api/api';

export default function EditRecordModal({ record, onClose }) {
  const [endDate, setEndDate] = useState(new Date(record.endDate));
  const [notes, setNotes] = useState(record.notes || '');
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatDate = d => d.toISOString().split('T')[0];

  const handleSave = async () => {
    setSaving(true);
    await updateRecord(record._id, { endDate: formatDate(endDate), notes });
    setSaving(false);
    onClose();
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>Edit Record</Text>

          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.date}>End Date: {formatDate(endDate)}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, d) => {
                setShowPicker(false);
                if (d) setEndDate(d);
              }}
            />
          )}

          <TextInput
            style={styles.notes}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.actions}>
            <Button title="Cancel" onPress={onClose} />
            <Button title={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:1, justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.3)'
  },
  modal: {
    width:'80%', backgroundColor:'#fff', padding:16,
    borderRadius:6
  },
  header: { fontSize:18, fontWeight:'bold', marginBottom:12 },
  date: {
    padding:8, borderWidth:1, borderColor:'#ccc',
    borderRadius:4, marginBottom:12
  },
  notes: {
    borderWidth:1, borderColor:'#ccc', borderRadius:4,
    padding:8, height:80, textAlignVertical:'top', marginBottom:12
  },
  actions: { flexDirection:'row', justifyContent:'space-between' }
});
