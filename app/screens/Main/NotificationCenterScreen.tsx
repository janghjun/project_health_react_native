import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationCenterScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem('notificationLogs');
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          setNotifications([]);
        }
      } catch (e) {
        Alert.alert('오류', '알림 데이터를 불러오지 못했습니다.');
      }
    };
    loadNotifications();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = notifications.filter((n) => n.date === today);
  const past = notifications.filter((n) => n.date !== today);

  const getIcon = (type) => {
    switch (type) {
      case '식단': return require('../../assets/images/bottom_diet.png');
      case '복약': return require('../../assets/images/bottom_medicine.png');
      case '운동': return require('../../assets/images/bottom_exercise.png');
      default: return require('../../assets/images/icon_alarm.png');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notifCard}>
      <View style={styles.cardRow}>
        <Image source={getIcon(item.type)} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.type} • {item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 뒤로가기 및 타이틀 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('홈')}>
            <Image source={require('../../assets/images/back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>알림 센터</Text>
        </View>

        {/* 오늘 알림 */}
        <Text style={styles.sectionTitle}>🔔 오늘 예정된 알림</Text>
        {upcoming.length === 0 ? (
          <Text style={styles.emptyText}>오늘 예정된 알림이 없습니다.</Text>
        ) : (
          <FlatList data={upcoming} renderItem={renderItem} keyExtractor={(item) => item.id} />
        )}

        {/* 과거 알림 */}
        <Text style={styles.sectionTitle}>📜 지난 알림 기록</Text>
        {past.length === 0 ? (
          <Text style={styles.emptyText}>과거 알림 내역이 없습니다.</Text>
        ) : (
          <FlatList data={past} renderItem={renderItem} keyExtractor={(item) => item.id} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F3F6' },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  backIcon: { width: 24, height: 24, marginRight: 12, tintColor: '#2678E4' },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151515',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 8,
    marginTop: 20,
  },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 28, height: 28, resizeMode: 'contain' },
  title: { fontSize: 16, fontWeight: '700', color: '#151515' },
  meta: { fontSize: 13, color: '#666', marginTop: 4 },
  emptyText: { fontSize: 14, color: '#999', marginVertical: 12 },
});