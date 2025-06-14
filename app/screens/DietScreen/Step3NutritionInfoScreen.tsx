import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDiet } from '../../context/DietContext';

export default function Step3NutritionInfoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ingredients, totalNutrition = {}, mealType, name, editItem = null } = route.params || {};
  const { addFood, addManualFood } = useDiet();

  const safeNumber = (val) =>
    typeof val === 'string' ? parseFloat(val) || 0 : typeof val === 'number' ? val : 0;

  const handleSave = async () => {
    if (!name || !mealType) {
      Alert.alert('오류', '음식 이름 또는 시간 정보가 누락되었습니다.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const foodItem = {
      name,
      weight: safeNumber(totalNutrition.weight),
      kcal: safeNumber(totalNutrition.kcal),
      carb: safeNumber(totalNutrition.carb),
      protein: safeNumber(totalNutrition.protein),
      fat: safeNumber(totalNutrition.fat),
      sodium: safeNumber(totalNutrition.sodium),
    };

    try {
      await addFood(currentDate, mealType, foodItem);
      await addManualFood(foodItem);
      Alert.alert('완료', '음식이 성공적으로 저장되었습니다.');
      navigation.navigate('Diet');
    } catch (e) {
      console.error('addFood failed:', e);
      Alert.alert('실패', '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.step}>3/3</Text>
        <Text style={styles.title}>입력된 정보를{'\n'}확인해주세요</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📝 음식명: {name}</Text>
          <Text style={styles.infoText}>🕘 시간대: {mealType}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.item}>총 중량: {totalNutrition.weight} g</Text>
          <Text style={styles.item}>칼로리: {totalNutrition.kcal} kcal</Text>
          <Text style={styles.item}>탄수화물: {totalNutrition.carb} g</Text>
          <Text style={styles.item}>단백질: {totalNutrition.protein} g</Text>
          <Text style={styles.item}>지방: {totalNutrition.fat} g</Text>
          <Text style={styles.item}>나트륨: {totalNutrition.sodium} mg</Text>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleSave}>
          <Text style={styles.nextBtnText}>등록 완료</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  step: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8FA1C3',
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginVertical: 16,
    lineHeight: 30,
  },
  infoBox: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  item: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  nextBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    marginTop: 12,
    backgroundColor: '#F05636',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});