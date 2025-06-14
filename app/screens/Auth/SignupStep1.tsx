import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useUserInfo } from '../../context/UserInfoContext';

export default function SignupStep1({ navigation }) {
  const { setUserInfo } = useUserInfo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = async () => {
    if (step === 1) {
      if (!email) {
        Alert.alert('오류', '이메일을 입력해주세요');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password || password.length < 6) {
        Alert.alert('오류', '비밀번호를 6자 이상 입력해주세요');
        return;
      }

      // 서버에 회원가입 정보 전송
      try {
        const response = await fetch('http://10.0.2.2:8080/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const text = await response.text();

        if (response.ok) {
          setUserInfo((prev) => ({ ...prev, email, password }));
          Alert.alert('가입 성공', text);
          navigation.navigate('OnboardingScreen');
        } else {
          Alert.alert('가입 실패', text);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('서버 오류', '회원가입 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBack = () => setStep(1);

  return (
    <View style={styles.container}>
      <Text style={styles.stepIndicator}>{step}/2</Text>
      <Text style={styles.welcomeText}>환영합니다{'\n'}빠른 가입으로 시작해봐요</Text>

      <TextInput
        style={styles.input}
        placeholder="사용자 이메일을 입력해주세요"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />

      {step === 2 && (
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="사용하실 비밀번호 6자 이상 입력해주세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>다 음</Text>
      </TouchableOpacity>

      {step === 2 && (
        <TouchableOpacity style={styles.prevButton} onPress={handleBack}>
          <Text style={styles.buttonText}>이 전</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 393,
    height: 852,
    backgroundColor: '#F0F3F6',
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
  welcomeText: {
    position: 'absolute',
    top: 135,
    left: 21,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
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
    elevation: 2,
    textAlign: 'left',
  },
  passwordInput: {
    top: 474,
  },
  nextButton: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    width: 348,
    height: 48,
    backgroundColor: '#2678E4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  prevButton: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    width: 348,
    height: 48,
    backgroundColor: '#F87171',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 8,
  },
});