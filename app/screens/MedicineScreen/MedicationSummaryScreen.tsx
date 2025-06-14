import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { useMedication } from '../../context/MedicationContext';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shareAsync } from 'expo-sharing';

const screenWidth = Dimensions?.get?.('window')?.width || 360;
const timeSlots = ['아침', '점심', '저녁', '자기 전'];
const colors = ['#F87171', '#60A5FA', '#FBBF24', '#34D399'];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(58, 112, 255, ${opacity})`,
  labelColor: () => '#000',
};

export default function MedicationSummaryScreen() {
  const { medications } = useMedication();
  const navigation = useNavigation();
  const [typeTab, setTypeTab] = useState<'영양제' | '의약품'>('영양제');
  const viewRef = useRef<View>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayMeds = useMemo(() => (medications[today] || []).filter(m => m.type === typeTab), [medications, typeTab]);
  const checkedMeds = useMemo(() => todayMeds.filter(m => m.checked), [todayMeds]);

  const slotStats = useMemo(() =>
    timeSlots.map((slot, idx) => {
      const total = todayMeds.filter(m => m.times.includes(slot)).length;
      const done = todayMeds.filter(m => m.times.includes(slot) && m.checked).length;
      return { slot, total, done, color: colors[idx] };
    }), [todayMeds]);

  const pieChartData = useMemo(() =>
    slotStats.map(s => ({
      name: s.slot,
      population: s.total,
      color: s.color,
      legendFontColor: '#333',
      legendFontSize: 14,
    })), [slotStats]);

  const barChartData = useMemo(() => ({
    labels: slotStats.map(s => s.slot),
    datasets: [
      {
        data: slotStats.map(s => s.done),
        color: () => '#3A70FF',
      },
      {
        data: slotStats.map(s => s.total - s.done),
        color: () => '#CBD5E1',
      },
    ],
    legend: ['완료', '미완료'],
  }), [slotStats]);

  const handleShare = async () => {
    try {
      if (!viewRef.current) return;
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });

      await shareAsync(uri, { UTI: 'public.png', mimeType: 'image/png' });
    } catch (err: any) {
      console.error('공유 실패:', err);
      Alert.alert('공유 오류', '이미지를 공유하는 도중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container} ref={viewRef}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>한눈에 보기</Text>
          </View>

          <View style={styles.tabRow}>
            {['영양제', '의약품'].map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => setTypeTab(label)}
                style={[styles.tabBtn, typeTab === label && styles.activeTab]}
              >
                <Text style={typeTab === label ? styles.activeTabText : styles.tabText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.summaryText}>
              <Text style={styles.highlight}>{checkedMeds.length}</Text> / {todayMeds.length}회 복약 완료
            </Text>

            <Text style={styles.chartTitle}>시간대별 복약 비율</Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 32}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />

            <Text style={styles.chartTitle}>시간대별 완료/미완료</Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
              style={{ borderRadius: 12 }}
            />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>오늘 하루 공유하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  wrapper: { flex: 1 },
  container: { padding: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { fontSize: 20, color: '#3A70FF', marginRight: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#151515' },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: { backgroundColor: '#F05636' },
  tabText: { color: '#888' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
  },
  summaryText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  highlight: {
    color: '#3A70FF',
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 6,
  },
  shareBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#3A70FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});