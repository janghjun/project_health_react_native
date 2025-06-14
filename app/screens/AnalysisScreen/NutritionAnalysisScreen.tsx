import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutritionAnalysisScreen({ route }) {
  const food = route?.params?.food;

  const analyzeNutrition = () => {
    if (!food) return '분석할 음식 정보가 없습니다.';
    const protein = food.protein ?? 0;
    const calories = food.calories ?? 0;
    return `단백질: ${protein}g, 칼로리: ${calories}kcal`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>영양소 분석</Text>
      <Text style={styles.analysisResult}>{analyzeNutrition()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  analysisResult: { fontSize: 18, color: '#333' },
});
