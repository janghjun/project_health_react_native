import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { shareAsync } from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

export default function ExerciseSummaryScreen() {
  const navigation = useNavigation();
  const { getExerciseByDate, getExerciseByRange } = useExercise();
  const [tab, setTab] = useState<'time' | 'part'>('time');
  const viewRef = useRef();

  const today = new Date();
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const {
    totalDays,
    totalTime,
    partChart,
    timeChart
  } = useMemo(() => {
    const rangeRecords = getExerciseByRange(weekDays[0], weekDays[6]);
    const uniqueDates = new Set(rangeRecords.map(r => r.date));
    const totalTime = rangeRecords.reduce((sum, r) => sum + parseInt(r.duration || '0'), 0);

    const partMap: Record<string, number> = {};
    rangeRecords.forEach(r => {
      partMap[r.part] = (partMap[r.part] || 0) + parseInt(r.duration || '0');
    });

    const partChart = Object.entries(partMap).map(([name, val], i) => ({
      name,
      population: val,
      color: ['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#A78BFA', '#FB923C'][i % 6],
      legendFontColor: '#333',
      legendFontSize: 14,
    }));

    const timeChart = {
      labels: weekDays.map(d => d.slice(5)),
      datasets: [{
        data: weekDays.map(d => {
          const daily = getExerciseByDate(d) ?? [];
          return daily.reduce((s, r) => s + parseInt(r.duration || '0'), 0);
        })
      }],
    };

    return { totalDays: uniqueDates.size, totalTime, partChart, timeChart };
  }, [getExerciseByRange, getExerciseByDate]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(87, 119, 204, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef.current, { format: 'png', quality: 1.0 });
      await shareAsync(uri);
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>운동 한눈에 보기</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab('time')} style={[styles.tabButton, tab === 'time' && styles.activeTab]}>
            <Text style={tab === 'time' ? styles.activeTabText : styles.tabText}>시간</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('part')} style={[styles.tabButton, tab === 'part' && styles.activeTab]}>
            <Text style={tab === 'part' ? styles.activeTabText : styles.tabText}>부위</Text>
          </TouchableOpacity>
        </View>

        <ViewShot ref={viewRef} options={{ format: 'png', quality: 1.0 }}>
          <View style={styles.card}>
            {tab === 'time' ? (
              <>
                <Text style={styles.centerText}>총 운동일 {totalDays}일 · {totalTime}분</Text>
                <Text style={styles.chartTitle}>주간 운동 시간</Text>
                <BarChart
                  data={timeChart}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={chartConfig}
                  fromZero
                  style={styles.chart}
                />
              </>
            ) : (
              <>
                <Text style={styles.chartTitle}>부위별 운동 비율</Text>
                {partChart.length > 0 ? (
                  <PieChart
                    data={partChart}
                    width={screenWidth - 32}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                  />
                ) : (
                  <Text style={styles.emptyText}>운동 기록이 없습니다</Text>
                )}
              </>
            )}
          </View>
        </ViewShot>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>오늘 운동 공유하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F3F6' },
  container: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { fontSize: 18, color: '#F05636', marginRight: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#2678E4' },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'white', borderRadius: 8, marginRight: 8 },
  activeTab: { backgroundColor: '#3A70FF' },
  tabText: { color: '#888', fontSize: 14 },
  activeTabText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  centerText: { textAlign: 'center', fontSize: 16, marginVertical: 8 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  chart: { borderRadius: 12 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 },
  shareBtn: { marginTop: 20, backgroundColor: '#3A70FF', padding: 14, borderRadius: 12 },
  shareText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});