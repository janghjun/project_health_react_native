// notifications.js - Expo 알림 예약 모듈
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleNotification({ title, body, hour, minute, identifier }) {
  return await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { hour, minute, repeats: true },
    identifier,
  });
}

export async function cancelNotification(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleMedicationNotification({ title, body, hour, minute }) {
  return scheduleNotification({ title, body, hour, minute, identifier: `medication-${hour}-${minute}` });
}

export async function scheduleDietNotification({ title, body, hour, minute }) {
  return scheduleNotification({ title, body, hour, minute, identifier: `diet-${hour}-${minute}` });
}

export async function scheduleExerciseNotification({ title, body, hour, minute }) {
  return scheduleNotification({ title, body, hour, minute, identifier: `exercise-${hour}-${minute}` });
}
