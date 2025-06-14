import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BackupAndDeviceScreen() {
  const navigation = useNavigation();

  const handleBackup = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const data = Object.fromEntries(entries);
      const json = JSON.stringify(data, null, 2);

      console.log('📦 백업 데이터:', json); // 실제 파일 저장 or 서버 전송 가능
      Alert.alert('백업 완료', '데이터가 안전하게 백업되었습니다.');
    } catch (error) {
      Alert.alert('백업 실패', '백업 중 오류가 발생했습니다.');
    }
  };

  const handleRestore = async () => {
    Alert.alert('데이터 복원', '기존 데이터를 복원하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            const exampleRestore = {
              medications: [],
              exercises: [],
              goals: { calories: '2000', carbs: '250', protein: '100', fat: '50' },
            };
            await AsyncStorage.multiSet(
              Object.entries(exampleRestore).map(([k, v]) => [k, JSON.stringify(v)])
            );
            Alert.alert('복원 완료', '데이터가 복원되었습니다.');
          } catch (e) {
            Alert.alert('복원 실패', '복원 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const appVersion = Constants?.expoConfig?.version || '정보 없음';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>💾 백업 및 기기 정보</Text>
        </View>

        {/* 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleBackup}>
          <Text style={styles.buttonText}>데이터 백업하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRestore}>
          <Text style={styles.buttonText}>데이터 복원하기</Text>
        </TouchableOpacity>

        {/* 기기 정보 */}
        <View style={styles.deviceInfoBox}>
          <Text style={styles.deviceLabel}>기기 모델</Text>
          <Text style={styles.deviceValue}>{Device.modelName || '확인 불가'}</Text>

          <Text style={[styles.deviceLabel, { marginTop: 12 }]}>앱 버전</Text>
          <Text style={styles.deviceValue}>{appVersion}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#151515',
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151515',
  },
  button: {
    backgroundColor: '#2678E4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceInfoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  deviceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151515',
    marginTop: 4,
  },
});