import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const renderCard = (title: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.cardText}>{title}</Text>
      <Image
        source={require('../../assets/images/back.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        {renderCard('계정 설정', () => navigation.navigate('AccountSettings'))}
        {renderCard('알림 설정', () => navigation.navigate('NotificationSetting'))}
        {renderCard('백업 및 기기 관리', () => navigation.navigate('BackupAndDevice'))}
        {renderCard('고객지원 및 정책', () => navigation.navigate('SupportAndPolicy'))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  headerRow: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 36,
  },
  logo: {
    width: 90,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151515',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
});