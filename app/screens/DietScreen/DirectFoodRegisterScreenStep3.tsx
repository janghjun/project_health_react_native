import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DirectFoodRegisterScreenStep3() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params || {};
  const mealType = params.mealType || '아침';
  const name = params.name || '';
  const weight = params.weight || '';
  const editItem = params.editItem || null;

  const [nutrition, setNutrition] = useState({
    kcal: '',
    carb: '',
    protein: '',
    fat: '',
    sodium: '',
  });

  useEffect(() => {
    if (editItem) {
      setNutrition({
        kcal: editItem.kcal?.toString() || '',
        carb: editItem.carb?.toString() || '',
        protein: editItem.protein?.toString() || '',
        fat: editItem.fat?.toString() || '',
        sodium: editItem.sodium?.toString() || '',
      });
    }
  }, [editItem]);

  const handleChange = (field, value) => {
    setNutrition(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const { kcal, carb, protein, fat, sodium } = nutrition;

    if (!kcal.trim()) {
      Alert.alert('입력 오류', '칼로리는 필수 입력 항목입니다.');
      return;
    }

    const parsed = {
      weight: parseFloat(weight) || 0,
      kcal: parseFloat(kcal) || 0,
      carb: parseFloat(carb) || 0,
      protein: parseFloat(protein) || 0,
      fat: parseFloat(fat) || 0,
      sodium: parseFloat(sodium) || 0,
    };

    if (Object.values(parsed).some(val => isNaN(val))) {
      Alert.alert('입력 오류', '숫자 형식이 잘못된 항목이 있습니다.');
      return;
    }

    navigation.navigate('Step3NutritionInfoScreen', {
      ingredients: [],
      totalNutrition: parsed,
      name: name || '직접입력',
      mealType,
      editItem,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.step}>2/2</Text>
        <Text style={styles.title}>영양 정보를{'\n'}입력해주세요</Text>

        {[
          { key: 'kcal', label: '칼로리(kcal)', placeholder: '예: 250' },
          { key: 'carb', label: '탄수화물(g)', placeholder: '예: 30' },
          { key: 'protein', label: '단백질(g)', placeholder: '예: 20' },
          { key: 'fat', label: '지방(g)', placeholder: '예: 10' },
          { key: 'sodium', label: '나트륨(mg)', placeholder: '예: 500' },
        ].map(({ key, label, placeholder }) => (
          <View key={key} style={styles.inputRow}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={nutrition[key]}
              onChangeText={(text) => handleChange(key, text)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
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
  safe: { flex: 1, backgroundColor: '#F4F7FA' },
  container: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  step: { alignSelf: 'flex-end', color: '#8FA1C3', fontWeight: '600', fontSize: 14 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 24,
    color: '#1A1A1A',
    lineHeight: 32,
  },
  inputRow: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: '#2678E4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backBtn: {
    marginTop: 12,
    backgroundColor: '#F05636',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});