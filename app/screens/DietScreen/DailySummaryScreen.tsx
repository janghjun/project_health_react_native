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
import { useDiet } from '../../context/DietContext';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { shareAsync } from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;
const TIME_SLOTS = ['아침', '점심', '저녁', '기타'];
const TIME_LABELS = {
  아침: '아침',
  점심: '점심',
  저녁: '저녁',
  기타: '간식',
};

export default function DailySummaryScreen() {
  const navigation = useNavigation();
  const { getMealsByDate } = useDiet();
  const [tab, setTab] = useState('nutrition');
  const viewRef = useRef();

  const today = new Date().toISOString().split('T')[0];
  const meals = getMealsByDate(today);

  const {
    totalKcal,
    totalCarb,
    totalProtein,
    totalFat,
    totalSodium,
    macroChart,
    timeChart,
    groupedFoods,
  } = useMemo(() => {
    const safe = (n) => typeof n === 'number' ? n : parseFloat(n) || 0;

    const grouped = {};
    TIME_SLOTS.forEach(slot => grouped[slot] = meals[slot] || []);

    let totalKcal = 0, totalCarb = 0, totalProtein = 0, totalFat = 0, totalSodium = 0;
    Object.values(meals).forEach((list) => {
      list.forEach(item => {
        totalKcal += safe(item.kcal);
        totalCarb += safe(item.carb);
        totalProtein += safe(item.protein);
        totalFat += safe(item.fat);
        totalSodium += safe(item.sodium);
      });
    });

    const macroChart = [
      { name: '탄수화물', population: totalCarb, color: '#fcbf49', legendFontColor: '#333', legendFontSize: 14 },
      { name: '단백질', population: totalProtein, color: '#90be6d', legendFontColor: '#333', legendFontSize: 14 },
      { name: '지방', population: totalFat, color: '#577590', legendFontColor: '#333', legendFontSize: 14 }
    ];

    const timeChart = {
      labels: TIME_SLOTS.map(slot => TIME_LABELS[slot]),
      datasets: [
        {
          data: TIME_SLOTS.map(slot =>
            grouped[slot].reduce((sum, f) => sum + safe(f.kcal), 0)
          )
        }
      ]
    };

    return {
      totalKcal,
      totalCarb,
      totalProtein,
      totalFat,
      totalSodium,
      macroChart,
      timeChart,
      groupedFoods: grouped,
    };
  }, [meals]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(87, 119, 204, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
  };

  const handleCaptureAndShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.95,
      });
      await shareAsync(uri);
    } catch (error) {
      console.error('캡쳐 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>한눈에 보기</Text>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity onPress={() => setTab('nutrition')} style={[styles.tabButton, tab === 'nutrition' && styles.activeTab]}>
              <Text style={tab === 'nutrition' ? styles.activeTabText : styles.tabText}>영양</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('food')} style={[styles.tabButton, tab === 'food' && styles.activeTab]}>
              <Text style={tab === 'food' ? styles.activeTabText : styles.tabText}>음식</Text>
            </TouchableOpacity>
          </View>

          <ViewShot ref={viewRef} options={{ format: 'png', quality: 1.0 }}>
            {tab === 'nutrition' ? (
              <View style={styles.card}>
                <Text style={styles.centerText}><Text style={{ color: '#2678E4' }}>{totalKcal} Kcal</Text> 먹었어요</Text>
                <View style={styles.nutrientRow}>
                  <Text style={styles.dotLabel}>● 탄수 <Text style={styles.valText}>{totalCarb.toFixed(1)}g</Text></Text>
                  <Text style={[styles.dotLabel, { color: '#F05636' }]}>● 단백 <Text style={styles.valText}>{totalProtein.toFixed(1)}g</Text></Text>
                  <Text style={[styles.dotLabel, { color: '#2678E4' }]}>● 지방 <Text style={styles.valText}>{totalFat.toFixed(1)}g</Text></Text>
                </View>

                <Text style={styles.chartTitle}>시간대별 섭취 칼로리</Text>
                <BarChart data={timeChart} width={screenWidth - 32} height={220} chartConfig={chartConfig} fromZero style={styles.chart} />

                <Text style={styles.chartTitle}>탄단지 섭취량</Text>
                <PieChart data={macroChart} width={screenWidth - 32} height={200} chartConfig={chartConfig} accessor="population" backgroundColor="transparent" paddingLeft="15" />

                <Text style={styles.sodiumText}>총 나트륨: {totalSodium} mg</Text>
              </View>
            ) : (
              <View style={styles.card}>
                {TIME_SLOTS.map((slot, idx) => (
                  <View key={idx} style={styles.mealCard}>
                    <Text style={styles.mealTitle}>🍴 {TIME_LABELS[slot]}</Text>
                    {groupedFoods[slot].length > 0 ? (
                      <View style={styles.foodBadgeRow}>
                        {groupedFoods[slot].map((food, i) => (
                          <Text key={i} style={styles.foodBadge}>
                            {food.name} ({food.kcal}kcal)
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.emptyText}>아직 먹은 {TIME_LABELS[slot]}이 없어요</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ViewShot>
        </ScrollView>

        <TouchableOpacity style={styles.shareBtn} onPress={handleCaptureAndShare}>
          <Text style={styles.shareText}>오늘 하루 공유하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F3F6' },
  wrapper: { flex: 1 },
  container: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { fontSize: 18, color: '#F05636', marginRight: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2678E4' },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'white', borderRadius: 8, marginRight: 8 },
  activeTab: { backgroundColor: '#F05636' },
  tabText: { color: '#888', fontSize: 14 },
  activeTabText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  centerText: { textAlign: 'center', fontSize: 16, marginVertical: 8 },
  nutrientRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  dotLabel: { color: 'black', fontSize: 14 },
  valText: { color: '#2678E4', fontWeight: 'bold', fontSize: 14 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  sodiumText: { fontSize: 14, textAlign: 'center', marginTop: 20, color: '#c33', fontWeight: '600' },
  mealCard: { marginBottom: 16 },
  mealTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  foodBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodBadge: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 6, marginBottom: 6, fontSize: 14 },
  emptyText: { fontSize: 14, color: '#999' },
  shareBtn: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#3A70FF', borderRadius: 12, padding: 14 },
  shareText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});