import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMedication } from '../../context/MedicationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { BarChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, format,
} from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function MedicationDetailScreen() {
  const navigation = useNavigation();
  const { getMedicineByRange } = useMedication();

  const [tab, setTab] = useState<'영양제' | '의약품'>('영양제');
  const [rangeTab, setRangeTab] = useState<'일간' | '주간' | '월간'>('일간');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getRange = () => {
    if (rangeTab === '주간') return [startOfWeek(currentDate), endOfWeek(currentDate)];
    if (rangeTab === '월간') return [startOfMonth(currentDate), endOfMonth(currentDate)];
    return [currentDate, currentDate];
  };

  const [startDate, endDate] = getRange();

  const filtered = useMemo(() => {
    const all = getMedicineByRange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    );
    return all.filter((m) => m.type === tab);
  }, [tab, currentDate, rangeTab]);

  const total = filtered.length;
  const taken = filtered.filter((m) => m.checked).length;
  const percent = total ? taken / total : 0;

  const timeSlots = ['아침', '점심', '저녁', '자기 전'];
  const timeStats = useMemo(() => {
    const map = { 아침: 0, 점심: 0, 저녁: 0, '자기 전': 0 };
    filtered.forEach((m) => {
      (m.times || []).forEach((t) => {
        if (map[t] !== undefined) map[t]++;
      });
    });
    return timeSlots.map((label) => map[label]);
  }, [filtered]);

  const topItems = useMemo(() => {
    const map = {};
    filtered.forEach((m) => {
      map[m.name] = (map[m.name] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [filtered]);

  const moveDate = (dir: -1 | 1) => {
    const newDate = new Date(currentDate);
    if (rangeTab === '주간') newDate.setDate(newDate.getDate() + dir * 7);
    else if (rangeTab === '월간') newDate.setMonth(newDate.getMonth() + dir);
    else newDate.setDate(newDate.getDate() + dir);
    setCurrentDate(newDate);
  };

  const exportToCSV = async () => {
    let csv = '약 이름,복용 횟수\n';
    topItems.forEach((f) => {
      csv += `${f.name},${f.count}\n`;
    });
    csv += `\n요약,총 복약,복약 완료\n,${total},${taken}\n`;
    csv += `\n시간대별 통계,아침,점심,저녁,자기 전\n,${timeStats.join(',')}`;

    const fileUri = FileSystem.documentDirectory + 'medication_detail.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await shareAsync(fileUri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>복약 상세</Text>
        </View>

        {/* 약 종류 탭 */}
        <View style={styles.tabRow}>
          {['영양제', '의약품'].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.tabButton, tab === label && styles.activeTab]}
              onPress={() => setTab(label as '영양제' | '의약품')}
            >
              <Text style={tab === label ? styles.activeTabText : styles.tabText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 기간 탭 */}
        <View style={styles.tabRow}>
          {['일간', '주간', '월간'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.tabButton, rangeTab === r && styles.activeTab]}
              onPress={() => setRangeTab(r as '일간' | '주간' | '월간')}
            >
              <Text style={rangeTab === r ? styles.activeTabText : styles.tabText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => moveDate(-1)}>
            <Text style={styles.navBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {format(startDate, 'yyyy.MM.dd')} ~ {format(endDate, 'yyyy.MM.dd')}
          </Text>
          <TouchableOpacity onPress={() => moveDate(1)}>
            <Text style={styles.navBtn}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>복약 완료율</Text>
          <View style={styles.progressCard}>
            <Progress.Bar
              progress={percent}
              width={null}
              height={18}
              borderRadius={8}
              color="#3A70FF"
              unfilledColor="#eee"
            />
            <Text style={styles.percentText}>{Math.round(percent * 100)}%</Text>
          </View>
          <Text style={styles.statLabel}>
            총 복약 <Text style={styles.strong}>{total}</Text>회 중{' '}
            <Text style={styles.strong}>{taken}</Text>회 완료
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>복약 시간대별 통계</Text>
          <BarChart
            data={{
              labels: timeSlots,
              datasets: [{ data: timeStats }],
            }}
            width={screenWidth - 60}
            height={180}
            fromZero
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(58, 112, 255, ${opacity})`,
              labelColor: () => '#444',
            }}
            style={{ marginVertical: 10 }}
            showBarTops={false}
            withInnerLines={false}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>자주 복용한 항목</Text>
          {topItems.length > 0 ? (
            topItems.map((item, idx) => (
              <Text key={idx} style={styles.medItem}>
                {idx + 1}. {item.name} ({item.count}회)
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>복용 기록이 없습니다.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.csvBtn} onPress={exportToCSV}>
          <Text style={styles.csvText}>CSV 저장 및 공유</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F3F6' },
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { fontSize: 20, color: '#F05636', marginRight: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#2678E4' },
  tabRow: { flexDirection: 'row', marginBottom: 10 },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 10,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: { backgroundColor: '#F05636' },
  tabText: { color: '#888' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  navBtn: { fontSize: 18, color: '#2678E4', fontWeight: 'bold' },
  dateText: { fontSize: 15, color: '#333' },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#111' },
  progressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8,
  },
  percentText: {
    fontSize: 16, fontWeight: '600', color: '#3A70FF', width: 50, textAlign: 'right',
  },
  statLabel: { fontSize: 14, color: '#333' },
  strong: { fontWeight: '700', color: '#3A70FF' },
  medItem: { fontSize: 14, marginBottom: 6, color: '#444' },
  emptyText: { fontSize: 14, color: '#999' },
  csvBtn: {
    backgroundColor: '#2678E4',
    padding: 10,
    borderRadius: 6,
  },
  csvText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});