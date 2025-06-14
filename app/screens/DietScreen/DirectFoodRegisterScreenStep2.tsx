import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DirectFoodRegisterScreenStep2() {
  const navigation = useNavigation();
  const route = useRoute();
  const mealType = route?.params?.mealType || '아침';
  const editItem = route?.params?.editItem || {};

  const [name, setName] = useState(editItem.name || '');
  const [weight, setWeight] = useState(editItem.weight || '');

  const goNext = () => {
    if (!name.trim() || !weight.trim()) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    navigation.navigate('DirectFoodRegisterScreenStep3', {
      name,
      weight,
      mealType,
      editItem,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>음식 이름과 중량을 입력해주세요</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>음식 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 닭가슴살"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>총 중량 (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 100"
            placeholderTextColor="#aaa"
            value={String(weight)}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.buttonText}>다음 단계</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>이전</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#222',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
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
  buttonGroup: {
    flexDirection: 'column',
    gap: 12,
  },
  nextButton: {
    backgroundColor: '#2678E4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#F05636',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});