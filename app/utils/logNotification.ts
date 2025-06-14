import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * 새 알림 로그를 기록합니다.
 * @param {Object} log - 알림 정보 { title, date, time, type }
 */
export const logNotification = async ({ title, date, time, type }) => {
  try {
    const newEntry = {
      id: uuidv4(),
      title,
      date,
      time,
      type,
    };

    const stored = await AsyncStorage.getItem('notificationLogs');
    const logs = stored ? JSON.parse(stored) : [];

    logs.push(newEntry);
    await AsyncStorage.setItem('notificationLogs', JSON.stringify(logs));
  } catch (error) {
    console.error(' 알림 로그 저장 실패:', error);
  }
};