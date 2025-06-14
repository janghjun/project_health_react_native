import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ManualMedicationTab() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedTimeSlot = route?.params?.timeSlot ?? '아침'; // 기본값 지정

  const handleManualRegister = () => {
    navigation.navigate('MedicationRegister', { timeSlot: passedTimeSlot });
  };

  const handleOCRRegister = () => {
    navigation.navigate('CameraScreen', {
      timeSlot: passedTimeSlot,
      redirectTo: 'MedicationRegister',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleManualRegister}>
        <Text style={styles.buttonText}>복약 수동 등록</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.ocrButton]} onPress={handleOCRRegister}>
        <Text style={styles.buttonText}>복약 사진 등록 (OCR)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  button: {
    backgroundColor: '#3A70FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ocrButton: {
    backgroundColor: '#F05636',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});