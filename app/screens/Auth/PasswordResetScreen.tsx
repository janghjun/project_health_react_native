import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

export default function PasswordResetScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('유효한 이메일을 입력해주세요.');
      return;
    }

    setTimeout(() => {
      Alert.alert('비밀번호 재설정 이메일을 보냈습니다.');
      navigation.navigate('Login');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.step}>1/1</Text>
      <Text style={styles.title}>비밀번호를 잊어버리셨나요?</Text>
      <Text style={styles.subtitle}>사용자 이메일로{"\n"}안내메일 발송 예정이에요~</Text>

      <TextInput
        style={styles.input}
        placeholder="사용자 이메일을 입력해주세요"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>보 내 기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F4F9',
    alignItems: 'center',
    paddingTop: 60,
  },
  step: {
    alignSelf: 'flex-end',
    marginRight: 30,
    fontSize: 20,
    color: '#6199F7',
    fontWeight: '600',
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: '#F05636',
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    marginTop: 80,
    width: 292,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    marginTop: 40,
    width: 348,
    height: 48,
    backgroundColor: '#2678E4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 6,
  },
});