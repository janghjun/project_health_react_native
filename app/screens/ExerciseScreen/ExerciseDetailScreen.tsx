import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  subDays,
  addMonths,
  subMonths,
} from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Bar } from 'react-native-progress';

export default function ExerciseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { getExerciseByDate } = useExercise();
  const initialDate = typeof route.params?.date === 'string' ? new Date(route.params.date) : new Date();

  const [range, setRange] = useState<'일간' | '주간' | '월간'>('일간');
  const [currentDate, setCurrentDate] = useState(initialDate);

  const getRange = () => {
    if (range === '주간') return [startOfWeek(currentDate), endOfWeek(currentDate)];
    if (range === '월간') return [startOfMonth(currentDate), endOfMonth(currentDate)];
    return [currentDate, currentDate];
  };

  const [startDate, endDate] = getRange();
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  const allRecords = useMemo(() => {
    let combined = [];
    daysInRange.forEach((d) => {
      const dateKey = d.toISOString().split('T')[0];
      const records = getExerciseByDate(dateKey);
      combined = combined.concat(records);
    });
    return combined;
  }, [daysInRange, getExerciseByDate]);

  const totalTime = useMemo(() => allRecords.reduce((sum, r) => sum + Number(r.duration || 0), 0), [allRecords]);
  const calories = totalTime * 6; // 기본 kcal 계산 방식

  const partMap = useMemo(() => {
    const map = {};
    allRecords.forEach((r) => {
      map[r.part] = (map[r.part] || 0) + Number(r.duration || 0);
    });
    return map;
  }, [allRecords]);

  const moveDate = (dir: 'prev' | 'next') => {
    const delta = dir === 'prev' ? -1 : 1;
    let next = new Date(currentDate);
    if (range === '일간') next = addDays(currentDate, delta);
    else if (range === '주간') next = addDays(currentDate, delta * 7);
    else next = addMonths(currentDate, delta);
    setCurrentDate(next);
  };

  const exportCSV = async () => {
    let csv = '운동명,부위,시간(분),날짜\n';
    allRecords.forEach((r) => {
      csv += `${r.name},${r.part},${r.duration},${r.date}\n`;
    });
    csv += `\n총 시간:,${totalTime}분\n예상 소모 칼로리:,${calories}kcal`;

    const uri = FileSystem.documentDirectory + 'exercise_summary.csv';
    await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await shareAsync(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F3F6' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>운동 상세</Text>
        </View>

        {/* 기간 탭 */}
        <View style={styles.tabRow}>
          {['일간', '주간', '월간'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRange(r as '일간' | '주간' | '월간')}
              style={[styles.tabBtn, range === r && styles.activeTab]}
            >
              <Text style={range === r ? styles.activeTabText : styles.tabText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 날짜 */}
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => moveDate('prev')}><Text style={styles.arrow}>{'<'}</Text></TouchableOpacity>
          <Text style={styles.dateText}>{format(startDate, 'yyyy.MM.dd')} ~ {format(endDate, 'MM.dd')}</Text>
          <TouchableOpacity onPress={() => moveDate('next')}><Text style={styles.arrow}>{'>'}</Text></TouchableOpacity>
        </View>

        {/* 통계 */}
        <View style={styles.card}>
          <Text style={styles.statText}>총 운동 시간: {totalTime}분</Text>
          <Text style={styles.statText}>예상 소모 칼로리: {calories}kcal</Text>
          <Bar
            progress={totalTime / 60}
            width={null}
            height={10}
            borderRadius={6}
            color="#2678E4"
            unfilledColor="#E0E0E0"
            borderWidth={0}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* 부위별 통계 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>부위별 분포</Text>
          {Object.entries(partMap).map(([part, time], idx) => (
            <Text key={idx} style={styles.partText}>- {part}: {time}분</Text>
          ))}
        </View>

        <TouchableOpacity style={styles.exportBtn} onPress={exportCSV}>
          <Text style={styles.exportText}>CSV 저장 및 공유</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { fontSize: 22, color: '#F05636', marginRight: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#2678E4' },
  tabRow: { flexDirection: 'row', marginBottom: 10 },
  tabBtn: { paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#fff', borderRadius: 8, marginRight: 8 },
  activeTab: { backgroundColor: '#F05636' },
  tabText: { color: '#888' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 10 },
  arrow: { fontSize: 18, color: '#2678E4', fontWeight: 'bold' },
  dateText: { fontSize: 15, color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20 },
  statText: { fontSize: 15, marginBottom: 8, color: '#111' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#111' },
  partText: { fontSize: 14, color: '#444', marginBottom: 4 },
  exportBtn: {
    backgroundColor: '#2678E4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  exportText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});