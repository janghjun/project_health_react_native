import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SupportAndPolicyScreen() {
  const navigation = useNavigation();

  const handleOpenURL = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('오류', '링크를 열 수 없습니다.');
        }
      })
      .catch(() => Alert.alert('오류', '링크를 여는 중 문제가 발생했습니다.'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 로고 + 뒤로가기 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        {/* 본문 */}
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => handleOpenURL('mailto:support@example.com')}
        >
          <Text style={styles.label}>고객센터 문의</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => handleOpenURL('https://example.com/terms')}
        >
          <Text style={styles.label}>이용약관</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => handleOpenURL('https://example.com/privacy')}
        >
          <Text style={styles.label}>개인정보 처리방침</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#151515',
    marginRight: 10,
  },
  logo: {
    width: 64,
    height: 22,
    resizeMode: 'contain',
  },
  itemRow: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151515',
  },
});