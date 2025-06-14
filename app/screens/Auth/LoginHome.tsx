import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const cardTexts = [
  '여러분의 건강 상태를\n확인해주세요!',
  '매일의 복약과 운동을\n기록해보세요!',
  'AI가 건강 습관을\n추천해드립니다!',
  '지금 바로 시작해볼까요?',
];

interface LoginHomeProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function LoginHome({ navigation }: LoginHomeProps) {
  const [page, setPage] = useState(0);

  const nextPage = () => {
    if (page < cardTexts.length - 1) {
      setPage((prev) => prev + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const currentText = cardTexts[page] ?? '정보를 불러올 수 없습니다.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.span}>건강 걱정 끝, {'\n'}</Text>
        <Text style={styles.orange}>바디</Text>
        <Text style={styles.blue}>케어</Text>
        <Text style={styles.span}>에 오신 것을{'\n'}환영합니다!</Text>
      </Text>

      <Text style={styles.subtext}>빠른 가입으로 시작해보세요</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{currentText}</Text>
      </View>

      <View style={styles.dots}>
        {cardTexts.map((_, i) => (
          <View
            key={i}
            style={i === page ? styles.dotActive : styles.dotInactive}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextPage}>
        <Text style={styles.buttonText}>다 음</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.prevButton, page === 0 && styles.disabledButton]}
        onPress={prevPage}
        disabled={page === 0}
      >
        <Text style={styles.buttonText}>이 전</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 852,
    width: 393,
    backgroundColor: '#F0F3F6',
    position: 'relative',
  },
  title: {
    position: 'absolute',
    top: 126,
    left: 22,
    width: 311,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    letterSpacing: -0.5,
    color: '#151515',
  },
  span: { color: '#151515', letterSpacing: -0.16 },
  orange: { color: '#F05636', letterSpacing: -0.16 },
  blue: { color: '#2678E4', letterSpacing: -0.16 },
  subtext: {
    position: 'absolute',
    top: 250,
    left: 22,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 40,
    color: '#F05636B2',
  },
  card: {
    position: 'absolute',
    top: 317,
    left: 52,
    width: 288,
    height: 281,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151515',
    lineHeight: 28,
    left: 17,
    top: 22,
    position: 'absolute',
  },
  dots: {
    position: 'absolute',
    top: 624,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dotActive: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#2678E4',
    marginHorizontal: 10,
  },
  dotInactive: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  nextButton: {
    position: 'absolute',
    bottom: 108,
    left: 22,
    width: 348,
    height: 48,
    borderRadius: 5,
    backgroundColor: '#2678E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    position: 'absolute',
    bottom: 40,
    left: 22,
    width: 348,
    height: 48,
    borderRadius: 5,
    backgroundColor: '#F05636',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 8,
    marginTop: -7,
    marginBottom: -5,
    lineHeight: 40,
  },
  disabledButton: {
    opacity: 0.4,
  },
});