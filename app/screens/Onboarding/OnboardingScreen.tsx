import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserInfo } from '../../context/UserInfoContext';

export default function OnboardingScreen({ navigation }) {
  const { setUserInfo } = useUserInfo();
  const [step, setStep] = useState(1);

  const [nickname, setNickname] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const services = ['수면 관리', '운동 관리', '식단 관리'];

  const handleNext = () => {
    if (step === 1 && nickname.trim()) {
      setUserInfo(prev => ({ ...prev, nickname }));
      setStep(2);
    } else if (
      step === 2 &&
      birth.trim() && gender.trim() && height.trim() && weight.trim()
    ) {
      setUserInfo(prev => ({ ...prev, birth, gender, height, weight }));
      setStep(3);
    } else if (step === 3 && selectedService) {
      setUserInfo(prev => ({ ...prev, mainService: selectedService }));
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  const handlePrev = () => setStep(prev => Math.max(1, prev - 1));

  return (
    <View style={styles.container}>
      <Text style={styles.stepIndicator}>{step}/3</Text>

      {step === 1 && (
        <>
          <Text style={styles.title}>반갑습니다!{"\n"}어떻게 불러드리면 될까요?</Text>
          <TextInput
            style={styles.input}
            placeholder="5글자 내로 입력해주세요"
            maxLength={5}
            value={nickname}
            onChangeText={setNickname}
            placeholderTextColor="#aaa"
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>{nickname}님의 신체정보를{"\n"}알려주세요.</Text>
          <TextInput
            style={[styles.input, { top: 268 }]}
            placeholder="생년월일 (예: 2001/08/04)"
            value={birth}
            onChangeText={setBirth}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { top: 373 }]}
            placeholder="성별 : 남 / 여"
            value={gender}
            onChangeText={setGender}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { top: 478 }]}
            placeholder="키 : cm"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { top: 583 }]}
            placeholder="몸무게 : kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor="#aaa"
          />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>가장 필요한 서비스가{"\n"}무엇인가요?</Text>
          {services.map((service, index) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.option,
                { top: 326 + index * 95 },
                selectedService === service && styles.selectedOption,
              ]}
              onPress={() => setSelectedService(service)}
            >
              <Text style={[
                styles.optionText,
                selectedService === service && styles.selectedOptionText,
              ]}>
                {service}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다 음</Text>
      </TouchableOpacity>

      {step > 1 && (
        <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
          <Text style={styles.prevButtonText}>이 전</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 393,
    height: 852,
    backgroundColor: '#F1F4F9',
    position: 'relative',
    alignItems: 'center',
  },
  stepIndicator: {
    position: 'absolute',
    top: 70,
    right: 30,
    fontSize: 20,
    color: '#6199F7',
    fontWeight: '600',
  },
  title: {
    position: 'absolute',
    top: 127,
    left: 22,
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 40,
    color: '#121212',
  },
  input: {
    position: 'absolute',
    top: 399,
    left: 51,
    width: 292,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#AAA',
    elevation: 2,
    textAlign: 'left',
    fontWeight: 'bold',

  },
  option: {
    position: 'absolute',
    left: 50,
    width: 292,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#6199F7',
  },
  optionText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    width: 348,
    height: 48,
    backgroundColor: '#2F80ED',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  nextButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 6,
  },
  prevButton: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    width: 348,
    height: 48,
    backgroundColor: '#EB5757',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  prevButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 6,
  },
});
