import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert,
} from 'react-native';
import WeeklyCalendar from '../../components/common/Calendar/WeeklyCalendar';
import MonthlyCalendar from '../../components/common/Calendar/MonthlyCalendar';
import { addMonths, subMonths } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useMedication } from '../../context/MedicationContext';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

export default function MedicationHomeScreen() {
  const navigation = useNavigation();
  const {
    getMedicineByDate,
    toggleChecked,
    deleteMedicine,
    medications,
  } = useMedication();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthView, setIsMonthView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [totalForDay, setTotalForDay] = useState([]);

  const timeSlots = ['아침', '점심', '저녁', '자기 전'];

  const updateDayMeds = useCallback(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const data = getMedicineByDate(dateKey) || [];
    setTotalForDay(data.filter((m) => !m.deleted));
  }, [selectedDate, medications, getMedicineByDate]);

  useFocusEffect(updateDayMeds);
  useEffect(updateDayMeds, [selectedDate, medications]);

  const getMedsByTime = (time) =>
    totalForDay.filter((m) => m.times.includes(time));

  const handleCardPress = (time) => {
    navigation.navigate('MedicationStats', { timeSlot: time });
  };

  const handleAddPress = (time) => {
    navigation.navigate('MedicationSearch', { defaultTime: time });
  };

  const handleCheck = (id) => {
    toggleChecked(selectedDate.toISOString().split('T')[0], id);
  };

  const handleDelete = (id) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteMedicine(selectedDate.toISOString().split('T')[0], id),
      },
    ]);
  };

  const checkedCount = totalForDay.filter(m => m.checked).length;
  const totalCount = totalForDay.length;
  const progress = totalCount ? checkedCount / totalCount : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.topButtonRow}>
          <TouchableOpacity onPress={() => navigation.navigate('MedicationSummary')}>
            <Text style={styles.summaryButton}>한눈에</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MedicationDetail')}>
            <Text style={styles.detailButton}>상세</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 캘린더 */}
      {isMonthView ? (
        <MonthlyCalendar
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth(prev => subMonths(prev, 1))}
          onNextMonth={() => setCurrentMonth(prev => addMonths(prev, 1))}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      ) : (
        <WeeklyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}
      <TouchableOpacity onPress={() => setIsMonthView(prev => !prev)} style={styles.expandToggle}>
        <Text style={styles.expandText}>{isMonthView ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* 진행률 */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>복약 진행률</Text>
        <Progress.Bar
          progress={progress}
          width={null}
          height={12}
          borderRadius={8}
          color="#F05636"
          unfilledColor="#EDEDED"
          borderWidth={0}
        />
        <Text style={styles.progressLabel}>{checkedCount} / {totalCount} 복약 완료</Text>
      </View>

      <Text style={styles.sectionTitle}>오늘의 복약 💊</Text>

      {timeSlots.map((slot, idx) => {
        const meds = getMedsByTime(slot);
        const doneCount = meds.filter(m => m.checked).length;

        return (
          <TouchableOpacity key={idx} onPress={() => handleCardPress(slot)} activeOpacity={0.9}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{slot}</Text>
                <TouchableOpacity onPress={() => handleAddPress(slot)}>
                  <Image source={require('../../assets/images/edit_icon.png')} style={styles.iconSmall} />
                </TouchableOpacity>
              </View>

              {meds.length === 0 ? (
                <Text style={styles.planText}>아직 계획되지 않았어요</Text>
              ) : (
                meds.map((m) => (
                  <View key={m.id} style={styles.medBlock}>
                    <View style={styles.medRow}>
                      <TouchableOpacity onPress={() => handleCheck(m.id)}>
                        <Ionicons
                          name={m.checked ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={m.checked ? '#F05636' : '#999'}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.medItem, m.checked && styles.checked]}>{m.name}</Text>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(m.id)}>
                        <Ionicons name="close" size={18} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    {m.dosage ? <Text style={styles.metaText}>용량: {m.dosage}</Text> : null}
                    {m.usage ? <Text style={styles.metaText}>복용법: {m.usage}</Text> : null}
                    {m.memo ? <Text style={styles.metaText}>메모: {m.memo}</Text> : null}
                  </View>
                ))
              )}

              <Text style={styles.cardStatus}>{doneCount} / {meds.length} 복약 완료</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F6', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 },
  logo: { width: 64, height: 22, resizeMode: 'contain' },
  topButtonRow: { flexDirection: 'row', alignItems: 'center' },
  summaryButton: { fontSize: 16, color: '#F05636', fontWeight: '600', marginRight: 16 },
  detailButton: { fontSize: 16, color: '#2678E4', fontWeight: '600' },
  expandToggle: { marginVertical: 8, alignItems: 'flex-start' },
  expandText: { fontSize: 18, color: '#F05636', fontWeight: 'bold' },
  summaryBar: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 12 },
  summaryText: { fontSize: 14, fontWeight: '500', color: '#444', marginBottom: 8 },
  progressLabel: { marginTop: 6, fontSize: 13, color: '#999', textAlign: 'right' },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#151515', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#151515' },
  iconSmall: { width: 20, height: 20 },
  planText: { fontSize: 14, color: '#2678E4', marginBottom: 8 },
  medBlock: { marginBottom: 10 },
  medRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  medItem: { fontSize: 14, color: '#333', marginLeft: 6 },
  checked: { textDecorationLine: 'line-through', color: '#999' },
  metaText: { fontSize: 13, color: '#555', marginLeft: 26, marginBottom: 2 },
  deleteBtn: { marginLeft: 'auto' },
  cardStatus: { fontSize: 13, color: '#999', marginTop: 10 },
});