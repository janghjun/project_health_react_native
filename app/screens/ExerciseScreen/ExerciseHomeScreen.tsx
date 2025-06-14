import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';
import WeeklyCalendar from '../../components/common/Calendar/WeeklyCalendar';
import MonthlyCalendar from '../../components/common/Calendar/MonthlyCalendar';
import { addMonths, subMonths } from 'date-fns';
import { BarChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';

export default function ExerciseHomeScreen() {
  const navigation = useNavigation();
  const { getExerciseByDate, exerciseGoal, setExerciseGoal, removeRecord } = useExercise();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthView, setIsMonthView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editedGoal, setEditedGoal] = useState(exerciseGoal);

  const partList = ['가슴', '등', '하체', '어깨', '복근', '유산소', '기타'];

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate));
  }, [selectedDate]);

  const { todayTotalTime, groupedByPart, weeklyStats } = useMemo(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const todayRecords = getExerciseByDate?.(dateKey) || [];
    const total = todayRecords.reduce((sum, r) => sum + Number(r.duration || 0), 0);

    const grouped: { [key: string]: any[] } = {};
    partList.forEach((p) => (grouped[p] = []));
    todayRecords.forEach((r) => {
      if (partList.includes(r.part)) grouped[r.part].push(r);
    });

    const stats = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const y = getExerciseByDate?.(key)?.reduce((sum, r) => sum + Number(r.duration || 0), 0) || 0;
      return { x: key.slice(5), y };
    });

    return { todayTotalTime: total, groupedByPart: grouped, weeklyStats: stats };
  }, [selectedDate, getExerciseByDate]);

  const screenWidth = Dimensions.get('window').width;
  const kcalPerMinute = 6;
  const burnedCalories = todayTotalTime * kcalPerMinute;
  const progress = Math.min(todayTotalTime / exerciseGoal, 1);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(87, 119, 204, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
  };

  const handleEditGoal = () => {
    if (editedGoal > 0) {
      setExerciseGoal(editedGoal);
      setIsEditingGoal(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.topButtonRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ExerciseDetail')}>
            <Text style={styles.detailButton}>상세</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ExerciseSummary')}>
            <Text style={styles.summaryButton}>한눈에</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isMonthView ? (
        <MonthlyCalendar
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          onNextMonth={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      ) : (
        <WeeklyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}

      <TouchableOpacity onPress={() => setIsMonthView((prev) => !prev)} style={styles.expandToggle}>
        <Text style={styles.expandText}>{isMonthView ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>나의 운동 🏋️‍♀️</Text>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLabel}>총 운동 시간</Text>
          <Text style={styles.cardValue}>{todayTotalTime}분</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLabel}>소모 칼로리</Text>
          <Text style={styles.cardValue}>{burnedCalories}kcal</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLabel}>목표 {exerciseGoal}분</Text>
          <TouchableOpacity onPress={() => setIsEditingGoal(true)}>
            <Image source={require('../../assets/images/edit_icon.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Progress.Bar
          progress={progress}
          width={screenWidth - 80}
          height={10}
          color="#2678E4"
          unfilledColor="#E0E0E0"
          borderWidth={0}
          style={{ marginTop: 10 }}
        />
      </View>

      {isEditingGoal && (
        <View style={styles.goalEditRow}>
          <TextInput
            keyboardType="numeric"
            style={styles.goalInput}
            value={String(editedGoal)}
            onChangeText={(text) => setEditedGoal(Number(text))}
          />
          <TouchableOpacity onPress={handleEditGoal}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>
      )}

      {partList.map((part) => {
        const records = groupedByPart[part];
        const total = records.reduce((sum, r) => sum + Number(r.duration || 0), 0);
        return (
          <View key={part} style={styles.timeSlotCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{part}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ExerciseSearch', { selectedPart: part })}>
                <Image source={require('../../assets/images/edit_icon.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
            {records.length === 0 ? (
              <Text style={styles.emptyText}>아직 기록되지 않았어요</Text>
            ) : (
              <>
                <Text style={styles.totalPartTime}>총 {total}분</Text>
                {records.map((item, i) => (
                  <View key={i} style={styles.recordRow}>
                    <Text style={styles.recordText}>• {item.name} ({item.duration}분)</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert('운동 삭제', `'${item.name}'을(를) 삭제할까요?`, [
                          { text: '취소', style: 'cancel' },
                          {
                            text: '삭제',
                            style: 'destructive',
                            onPress: () => removeRecord(item.id, item.date),
                          },
                        ])
                      }
                    >
                      <Image source={require('../../assets/images/del.png')} style={styles.iconSmall} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        );
      })}

      <Text style={styles.chartTitle}>주간 운동 시간</Text>
      <BarChart
        data={{
          labels: weeklyStats.map((d) => d.x),
          datasets: [{ data: weeklyStats.map((d) => d.y) }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        style={{ marginVertical: 16, borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F6', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 },
  logo: { width: 64, height: 22, resizeMode: 'contain' },
  topButtonRow: { flexDirection: 'row', alignItems: 'left' },
  detailButton: { fontSize: 16, color: '#2678E4', fontWeight: '600', marginRight: 16 },
  summaryButton: { fontSize: 16, color: '#F05636', fontWeight: '600' },
  expandToggle: { marginTop: 4, marginBottom: 12, alignSelf: 'flex-start' },
  expandText: { fontSize: 18, color: '#F05636', fontWeight: 'bold' },
  sectionTitleRow: { marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#151515' },
  totalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardLabel: { fontSize: 14, color: '#888' },
  cardValue: { fontSize: 16, fontWeight: '700', color: '#2678E4' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  icon: { width: 20, height: 20 },
  iconSmall: { width: 18, height: 18, tintColor: '#F05636', marginLeft: 8 },
  goalEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  goalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    width: 100,
    backgroundColor: '#fff',
  },
  saveText: { fontSize: 16, fontWeight: '600', color: '#2678E4' },
  timeSlotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#151515' },
  emptyText: { fontSize: 14, color: '#999', marginTop: 6 },
  totalPartTime: { fontSize: 14, fontWeight: '600', color: '#2678E4', marginTop: 6, marginBottom: 6 },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  recordText: { fontSize: 14, color: '#333' },
  chartTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});