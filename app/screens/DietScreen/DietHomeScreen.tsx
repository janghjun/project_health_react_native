// DietHomeScreen.tsx (리팩터링된 전체 코드)
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert
} from 'react-native';
import WeeklyCalendar from '../../components/common/Calendar/WeeklyCalendar';
import MonthlyCalendar from '../../components/common/Calendar/MonthlyCalendar';
import { addMonths, subMonths } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDiet } from '../../context/DietContext';

const TIME_KEYS = ['아침', '점심', '저녁', '기타'];

export default function DietHomeScreen() {
  const navigation = useNavigation();
  const { getMealsByDate, hasRecordOnDate, goals, setGoals, removeFoodItem } = useDiet();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthView, setIsMonthView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [tapCount, setTapCount] = useState(0);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [editedGoals, setEditedGoals] = useState(goals);

  useFocusEffect(
    useCallback(() => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setMeals(getMealsByDate(dateStr));
    }, [selectedDate])
  );

  useEffect(() => {
    const marks = hasRecordOnDate();
    setMarkedDates(marks);
  }, [hasRecordOnDate]);

  useEffect(() => {
    setEditedGoals(goals);
  }, [goals]);

  const summary = calculateSummary(meals);

  const handleSaveGoals = () => {
    setGoals(editedGoals);
    setShowGoalEditor(false);
  };

  const handleChartTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 300);
    if (tapCount === 1) setShowGoalEditor(true);
  };

  const handleDeleteItem = (mealKey, index) => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const dateStr = selectedDate.toISOString().split('T')[0];
          removeFoodItem(dateStr, mealKey, index);
          setMeals(getMealsByDate(dateStr));
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('DietDetail', { date: selectedDate })}>
            <Text style={styles.detailButton}>상세</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DailySummary', { date: selectedDate })}>
            <Text style={styles.summaryButton}>한눈에</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar */}
      {isMonthView ? (
        <MonthlyCalendar
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth(prev => subMonths(prev, 1))}
          onNextMonth={() => setCurrentMonth(prev => addMonths(prev, 1))}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
        />
      ) : (
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
        />
      )}
      <TouchableOpacity onPress={() => setIsMonthView(prev => !prev)} style={styles.expandToggle}>
        <Text style={styles.expandText}>{isMonthView ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Summary Chart */}
      <TouchableOpacity onPress={handleChartTap} activeOpacity={1}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 식단 🍽️</Text>
          <View style={styles.summaryCard}>
            <View style={styles.kcalBlock}>
              <Text style={styles.kcalTitle}>총 섭취량</Text>
              <Text style={styles.kcalValue}>{summary.kcal} Kcal</Text>
            </View>
            <View style={styles.macroInfo}>
              <Text style={styles.macroText}>● 탄수 {summary.carbPercent}%</Text>
              <Text style={[styles.macroText, { color: '#F05636' }]}>● 단백 {summary.proteinPercent}%</Text>
              <Text style={[styles.macroText, { color: '#2678E4' }]}>● 지방 {summary.fatPercent}%</Text>
            </View>
          </View>

          {/* Macro Bars */}
          <View style={styles.macroBars}>
            {renderMacroBar('탄수', summary.carb, goals?.carb, 'black')}
            {renderMacroBar('단백', summary.protein, goals?.protein, '#F05636')}
            {renderMacroBar('지방', summary.fat, goals?.fat, '#2678E4')}
          </View>

          {showGoalEditor && (
            <View style={styles.goalEditor}>
              {['kcal', 'carb', 'protein', 'fat'].map((key) => (
                <View key={key} style={styles.goalRow}>
                  <Text style={styles.goalLabel}>{key.toUpperCase()}:</Text>
                  <TextInput
                    style={styles.goalInput}
                    keyboardType="numeric"
                    value={String(editedGoals?.[key] ?? '')}
                    onChangeText={(text) =>
                      setEditedGoals(prev => ({ ...prev, [key]: Number(text) }))
                    }
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGoals}>
                <Text style={styles.saveBtnText}>저장</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Meals Section - FIXED to 한글 TIME_KEYS */}
      {TIME_KEYS.map((mealKey, idx) => {
        const label = mealKey;
        const items = meals[mealKey] || [];
        const totalKcal = items.reduce((sum, item) => sum + (item.kcal || 0), 0);
        return (
          <View key={idx} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>🍴 {label}</Text>
              <Text style={styles.kcalTotal}>{totalKcal} kcal</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FoodSearch', { date: selectedDate, time: mealKey })}>
                <Image source={require('../../assets/images/edit_icon.png')} style={styles.iconSmall} />
              </TouchableOpacity>
            </View>
            {items.length === 0 ? (
              <Text style={styles.emptyText}>아직 계획되지 않았어요</Text>
            ) : (
              items.map((item, i) => (
                <View key={i} style={styles.foodCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDetail}>
                      {item.weight}g · {item.kcal}kcal · 탄수 {item.carb}g · 단백 {item.protein}g · 지방 {item.fat}g · 나트륨 {item.sodium}mg
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteItem(mealKey, i)}>
                      <Image source={require('../../assets/images/del.png')} style={styles.iconSmall} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function renderMacroBar(label, current, goal, color) {
  const percent = goal ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.bar}><View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} /></View>
      <Text style={styles.gramText}>{Math.round(current)} / {goal}g</Text>
    </>
  );
}

function calculateSummary(meals) {
  let kcal = 0, carb = 0, protein = 0, fat = 0;
  Object.values(meals).forEach((meal) => {
    meal.forEach((item) => {
      kcal += item.kcal || 0;
      carb += item.carb || 0;
      protein += item.protein || 0;
      fat += item.fat || 0;
    });
  });
  const total = carb + protein + fat;
  return {
    kcal,
    carb,
    protein,
    fat,
    carbPercent: total ? Math.round((carb / total) * 100) : 0,
    proteinPercent: total ? Math.round((protein / total) * 100) : 0,
    fatPercent: total ? Math.round((fat / total) * 100) : 0,
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F6', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 },
  logo: { width: 64, height: 22, resizeMode: 'contain' },
  headerButtons: { flexDirection: 'row', gap: 16 },
  detailButton: { fontSize: 16, color: '#2678E4', fontWeight: '600' },
  summaryButton: { fontSize: 16, color: '#F05636', fontWeight: '600' },
  expandToggle: { marginVertical: 8 },
  expandText: { fontSize: 18, color: '#F05636', fontWeight: 'bold' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  summaryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kcalBlock: { alignItems: 'center' },
  kcalTitle: { color: '#888' },
  kcalValue: { fontSize: 20, fontWeight: 'bold', color: '#2678E4' },
  macroInfo: { alignItems: 'flex-end' },
  macroText: { fontSize: 14, color: '#000', marginVertical: 8 },
  macroBars: { marginTop: 16 },
  barLabel: { fontSize: 14, marginBottom: 4, fontWeight: '600' },
  bar: { height: 6, backgroundColor: '#eee', borderRadius: 4, marginBottom: 4 },
  barFill: { height: 6, borderRadius: 4 },
  gramText: { fontSize: 12, color: '#2678E4', marginBottom: 12 },
  goalEditor: { marginTop: 16, backgroundColor: '#f4f4f4', padding: 10, borderRadius: 8 },
  goalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  goalLabel: { fontWeight: '600', width: 60 },
  goalInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 8, height: 36, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#2678E4', padding: 10, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  mealCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 16 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealTitle: { fontSize: 16, fontWeight: 'bold' },
  iconSmall: { width: 18, height: 18 },
  emptyText: { fontSize: 14, color: '#2678E4', marginVertical: 8 },
  foodCard: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 8, marginBottom: 6 },
  foodName: { fontSize: 14, fontWeight: 'bold' },
  foodDetail: { fontSize: 12, color: '#555' },
});