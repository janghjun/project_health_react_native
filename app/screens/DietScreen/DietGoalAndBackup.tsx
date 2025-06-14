// DietGoalAndBackup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDiet } from '../../context/DietContext';

export default function DietGoalAndBackupScreen() {
  const { foods } = useDiet();
  const [goalKcal, setGoalKcal] = useState('2000');
  const [goalCarb, setGoalCarb] = useState('250');
  const [goalProtein, setGoalProtein] = useState('100');
  const [goalFat, setGoalFat] = useState('60');

  const handleBackup = async () => {
    try {
      const data = JSON.stringify({ foods });
      const today = new Date().toISOString().split('T')[0];
      const path = FileSystem.documentDirectory + `diet_backup_${today}.json`;
      await FileSystem.writeAsStringAsync(path, data);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
      }
    } catch (err) {
      Alert.alert('백업 실패', '파일 저장 중 오류 발생');
    }
  };

  const handleRestore = async () => {
    Alert.alert('복원 안내', '현재는 수동 JSON 삽입 기반 복원만 지원됩니다.');
  };

  const handleSaveGoals = () => {
    Alert.alert('목표 저장 완료', `칼로리: ${goalKcal}, 탄: ${goalCarb}g, 단: ${goalProtein}g, 지: ${goalFat}g`);
    // TODO: 추후 Context에 목표 저장 및 DailySummary 연동 구현 예정
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 목표 설정</Text>
      <TextInput style={styles.input} placeholder="목표 칼로리 (kcal)" value={goalKcal} onChangeText={setGoalKcal} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="탄수화물 (g)" value={goalCarb} onChangeText={setGoalCarb} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="단백질 (g)" value={goalProtein} onChangeText={setGoalProtein} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="지방 (g)" value={goalFat} onChangeText={setGoalFat} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSaveGoals}>
        <Text style={styles.buttonText}>목표 저장</Text>
      </TouchableOpacity>

      <Text style={styles.title}>데이터 백업 / 복원</Text>
      <TouchableOpacity style={styles.button} onPress={handleBackup}>
        <Text style={styles.buttonText}>데이터 백업하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={handleRestore}>
        <Text style={styles.buttonText}>복원 (준비 중)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    borderRadius: 6, marginBottom: 10, textAlign: 'right',
  },
  button: {
    backgroundColor: '#57c', padding: 15,
    borderRadius: 8, alignItems: 'center', marginTop: 15,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});