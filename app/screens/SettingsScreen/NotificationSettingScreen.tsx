import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logNotification } from '../../utils/logNotification';
import { useNavigation } from '@react-navigation/native';

export default function NotificationSettingScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    diet: true,
    medication: true,
    exercise: true,
  });

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('notificationSettings');
      if (stored) setSettings(JSON.parse(stored));
    })();
  }, []);

  const toggleNotification = async (type: 'diet' | 'medication' | 'exercise') => {
    const newSettings = { ...settings, [type]: !settings[type] };
    setSettings(newSettings);
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    if (newSettings[type]) {
      await logNotification({
        title: `${type === 'diet' ? '식단' : type === 'medication' ? '복약' : '운동'} 알림 설정`,
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        type: type === 'diet' ? '식단' : type === 'medication' ? '복약' : '운동',
      });
    }
    Alert.alert('설정 완료', '알림 설정이 변경되었습니다.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={{ width: 32 }} /> {/* placeholder for alignment */}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>🔔 알림 설정</Text>

        {['diet', 'medication', 'exercise'].map((type) => (
          <View key={type} style={styles.card}>
            <Text style={styles.label}>
              {type === 'diet' ? '식단 알림' : type === 'medication' ? '복약 알림' : '운동 알림'}
            </Text>
            <Switch
              value={settings[type]}
              onValueChange={() => toggleNotification(type as any)}
              trackColor={{ false: '#ccc', true: '#2678E4' }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F3F6' },
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  logo: {
    width: 64,
    height: 30,
    resizeMode: 'contain',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#121212',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});