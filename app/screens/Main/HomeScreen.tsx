import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WeeklyCalendar from '../../components/common/Calendar/WeeklyCalendar';
import MonthlyCalendar from '../../components/common/Calendar/MonthlyCalendar';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isMonthView, setIsMonthView] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderSection = (
    title: string,
    percentage: number,
    description: string,
    onPress: () => void
  ) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Image source={require('../../assets/images/edit_icon.png')} style={styles.iconSmall} />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.sectionSubtitle}>{description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('NotificationCenter')}>
          <Image
            source={require('../../assets/images/icon_alarm.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {isMonthView ? (
        <MonthlyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => {}}
          onNextMonth={() => {}}
        />
      ) : (
        <WeeklyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}

      <TouchableOpacity
        onPress={() => setIsMonthView((prev) => !prev)}
        style={styles.calendarToggle}
      >
        <Text style={styles.calendarToggleText}>
          {isMonthView ? '주간 보기' : '월간 보기'}
        </Text>
      </TouchableOpacity>

      {renderSection('나의 식단', 80, '칼로리 목표의 80% 섭취', () =>
        navigation.navigate('DietSearch')
      )}
      {renderSection('나의 복약', 60, '복약 완료율 60%', () =>
        navigation.navigate('MedicationSearch')
      )}
      {renderSection('나의 운동', 45, '오늘 목표의 45% 달성', () =>
        navigation.navigate('ExerciseSearch')
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F3F6',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151515',
  },
  logo: { width: 64, height: 22, resizeMode: 'contain' },
  icon: { width: 32, height: 32, tintColor: '#F05636', },
  iconSmall: {
    width: 20,
    height: 20,
    tintColor: '#F05636',
  },
  calendarToggle: {
    alignSelf: 'flex-end',
    marginVertical: 12,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calendarToggleText: {
    fontSize: 13,
    color: '#666',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151515',
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#2678E4',
    borderRadius: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});