import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function GalleryOCRScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const sendOCRRequest = async (base64: string) => {
    try {
      const response = await fetch('https://30b1-203-237-200-32.ngrok-free.app/ocr_and_guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      console.log('응답 상태 코드:', response.status);
      const text = await response.text();
      console.log('응답 본문 내용:', text);

      try {
        const data = JSON.parse(text);
        console.log('🧾 OCR 최종 데이터 구조:', JSON.stringify(data, null, 2));
        return data;
      } catch (jsonError) {
        console.error('JSON 파싱 실패:', jsonError);
        Alert.alert('서버 응답 파싱 실패', 'JSON 데이터가 올바르지 않습니다.');
        return null;
      }
    } catch (error) {
      console.error('❌ OCR 실패:', error);
      Alert.alert('OCR 실패', '이미지를 처리하지 못했습니다.');
      return null;
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert('실패', '이미지를 선택하지 않았습니다.');
        return;
      }

      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('실패', '이미지를 base64로 변환하지 못했습니다.');
        return;
      }

      const ocrData = await sendOCRRequest(asset.base64);
      if (ocrData) {
        navigation.navigate('MedicationRegister', {
          ocrData: { ...ocrData, imageBase64: asset.base64 },
        });
      }
    } catch (e) {
      console.error('📷 처리 오류:', e);
      Alert.alert('실패', '갤러리 이미지 처리 중 오류가 발생했습니다.');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centered}><Text>권한 요청 중...</Text></View>;
  }

  if (!hasPermission) {
    return <View style={styles.centered}><Text>갤러리 접근 권한이 필요합니다.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePickFromGallery}>
        <Text style={styles.buttonText}>갤러리에서 이미지 선택</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  button: {
    backgroundColor: '#3A70FF',
    padding: 16,
    borderRadius: 12,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});