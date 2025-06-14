import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { useMedication } from '../../context/MedicationContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

export default function MedicationStatsScreen() {
  const { getMedicineByRange } = useMedication();
  const navigation = useNavigation();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();

  const meds = useMemo(() => getMedicineByRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  ), []);

  const stats = useMemo(() => {
    const timeMap = { 아침: 0, 점심: 0, 저녁: 0, '자기 전': 0 };
    const checkMap = { 아침: 0, 점심: 0, 저녁: 0, '자기 전': 0 };
    const topMap = {};
    let taken = 0;
    let total = 0;

    meds.forEach((m) => {
      total++;
      if (m.checked) taken++;
      if (!topMap[m.name]) topMap[m.name] = 0;
      topMap[m.name]++;
      (m.times || []).forEach(t => {
        timeMap[t]++;
        if (m.checked) checkMap[t]++;
      });
    });

    const topMeds = Object.entries(topMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return { total, taken, topMeds, timeMap, checkMap };
  }, [meds]);

  const percent = stats.total ? stats.taken / stats.total : 0;

  const chartData = {
    labels: Object.keys(stats.timeMap),
    datasets: [
      {
        data: Object.values(stats.timeMap),
        color: () => '#60A5FA',
      },
      {
        data: Object.values(stats.checkMap),
        color: () => '#34D399',
      },
    ],
    legend: ['전체 복약', '복약 완료'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: () => '#3A70FF',
    labelColor: () => '#000',
    barPercentage: 0.5,
  };

  const exportStatsToCSV = async () => {
    const headers = ['시간대', '전체 복약 횟수', '복약 완료 횟수'];
    const rows = Object.keys(stats.timeMap).map(time => [
      time,
      stats.timeMap[time],
      stats.checkMap[time] || 0,
    ]);

    const topRows = stats.topMeds.map((m, i) => [`Top ${i + 1}`, m.name, `${m.count}회`]);

    const csvContent = [
      ['복약 통계'],
      ['전체 복약 완료 비율', `${stats.taken}/${stats.total}`],
      [],
      headers,
      ...rows,
      [],
      ['자주 복용한 약'],
      ['순위', '약 이름', '복용 횟수'],
      ...topRows,
    ]
      .map(row => row.join(','))
      .join('\n');

    const fileUri = FileSystem.documentDirectory + 'medication_stats.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await shareAsync(fileUri)) {
      await shareAsync(fileUri);
    } else {
      Alert.alert('공유 불가', '파일을 공유할 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F3F6' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>복약 통계</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>복약 성공률</Text>
          <Progress.Bar
            progress={percent}
            width={null}
            height={14}
            borderRadius={7}
            color="#F05636"
            unfilledColor="#E0E0E0"
            borderWidth={0}
          />
          <Text style={styles.statusText}>{stats.taken} / {stats.total} 복약 완료</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>시간대별 복약 분석</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            fromZero
            withHorizontalLabels
            withInnerLines={false}
            showBarTops={false}
            style={{ borderRadius: 12 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>자주 복용한 약</Text>
          {stats.topMeds.length === 0 ? (
            <Text style={styles.emptyText}>복약 데이터가 부족합니다.</Text>
          ) : (
            stats.topMeds.map((m, i) => (
              <Text key={i} style={styles.recordItem}>{i + 1}. {m.name} ({m.count}회)</Text>
            ))
          )}
        </View>

        <TouchableOpacity onPress={exportStatsToCSV} style={styles.exportButton}>
          <Text style={styles.exportText}>CSV로 내보내기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { fontSize: 22, marginRight: 12, color: '#2563eb' },
  header: { fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  statusText: { marginTop: 10, fontSize: 14, color: '#333' },
  emptyText: { color: '#999', fontSize: 14 },
  recordItem: { fontSize: 14, marginVertical: 4 },
  exportButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  exportText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});