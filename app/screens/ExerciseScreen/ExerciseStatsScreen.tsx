// ExerciseStatsScreen.tsx
import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Share,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useExercise } from '../../context/ExerciseContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';

const screenWidth = Dimensions.get('window').width;

export default function ExerciseStatsScreen() {
  const navigation = useNavigation();
  const { getExerciseByDate, getExerciseByRange } = useExercise();
  const viewRef = useRef();
  const [tab, setTab] = useState<'time' | 'part'>('time');

  const today = new Date();
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const {
    totalDays, totalTime, weeklyChart, partChart,
  } = useMemo(() => {
    const rangeRecords = getExerciseByRange(weekDays[0], weekDays[6]);
    const uniqueDates = new Set(rangeRecords.map(r => r.date));
    const totalTime = rangeRecords.reduce((sum, r) => sum + parseInt(r.duration || '0'), 0);

    const weeklyChart = {
      labels: weekDays.map(d => d.slice(5)),
      datasets: [{
        data: weekDays.map(d => {
          return getExerciseByDate(d).reduce((s, r) => s + parseInt(r.duration || '0'), 0);
        })
      }]
    };

    const partMap = {};
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

    return { totalDays: uniqueDates.size, totalTime, weeklyChart, partChart };
  }, [getExerciseByDate, getExerciseByRange]);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(58, 112, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
  };

  const share = async () => {
    try {
      const uri = await captureRef(viewRef, { format: 'png', quality: 0.9 });
      await Share.share({ url: uri });
    } catch (e) {
      console.error('공유 실패', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} ref={viewRef}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>운동 한눈에 보기</Text>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity onPress={() => setTab('time')} style={[styles.tab, tab === 'time' && styles.activeTab]}>
              <Text style={tab === 'time' ? styles.activeTabText : styles.tabText}>일별</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('part')} style={[styles.tab, tab === 'part' && styles.activeTab]}>
              <Text style={tab === 'part' ? styles.activeTabText : styles.tabText}>부위별</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {tab === 'time' ? (
              <>
                <Text style={styles.metric}>총 운동일 수: {totalDays}일</Text>
                <Text style={styles.metric}>총 운동 시간: {totalTime}분</Text>
                <Text style={styles.chartTitle}>주간 운동 시간</Text>
                <BarChart
                  data={weeklyChart}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={chartConfig}
                  fromZero
                  showValuesOnTopOfBars
                  style={{ borderRadius: 12 }}
                />
              </>
            ) : (
              <>
                <Text style={styles.chartTitle}>부위별 운동 비율</Text>
                {partChart.length > 0 ? (
                  <PieChart
                    data={partChart}
                    width={screenWidth - 32}
                    height={180}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                ) : (
                  <Text style={styles.emptyText}>운동 부위 기록이 없습니다</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.shareBtn} onPress={share}>
          <Text style={styles.shareText}>통계 이미지 공유하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { color: '#F05636', fontSize: 20 },
  title: { marginLeft: 8, fontWeight: 'bold', fontSize: 18, color: '#3A70FF' },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tab: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'white', borderRadius: 8, marginRight: 8 },
  activeTab: { backgroundColor: '#F05636' },
  tabText: { color: '#888' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  metric: { fontSize: 16, textAlign: 'center', marginBottom: 6 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 6, color: '#111' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 14 },
  shareBtn: {
    position: 'absolute',
    bottom: 20, left: 20, right: 20,
    backgroundColor: '#3A70FF',
    borderRadius: 12,
    padding: 14,
  },
  shareText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});