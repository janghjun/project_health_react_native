import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'react-native-uuid'; // ✅ 수정

const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadData();
    loadFavorites();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('medications');
      if (stored) setMedications(JSON.parse(stored));

      const savedSymptoms = await AsyncStorage.getItem('symptoms');
      if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
    } catch (e) {
      console.error('복약 데이터 불러오기 실패:', e);
    }
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteMeds');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error('즐겨찾기 불러오기 실패:', e);
    }
  };

  const saveData = async (data) => {
    try {
      setMedications(data);
      await AsyncStorage.setItem('medications', JSON.stringify(data));
    } catch (e) {
      console.error('복약 데이터 저장 실패:', e);
    }
  };

  const saveFavorites = async (data) => {
    try {
      setFavorites(data);
      await AsyncStorage.setItem('favoriteMeds', JSON.stringify(data));
    } catch (e) {
      console.error('즐겨찾기 저장 실패:', e);
    }
  };

  const saveSymptoms = async (data) => {
    try {
      setSymptoms(data);
      await AsyncStorage.setItem('symptoms', JSON.stringify(data));
    } catch (e) {
      console.error('증상 저장 실패:', e);
    }
  };

  const addMedicine = async (date, item) => {
    if (!item.times || !Array.isArray(item.times) || item.times.length === 0) {
      console.warn('❗ times 필드 누락 – 저장 취소됨:', item);
      return;
    }

    const newItem = {
      id: uuidv4(), // ✅ 수정
      createdAt: new Date().toISOString(),
      checked: false,
      ...item,
    };

    const updated = {
      ...medications,
      [date]: [...(medications[date] || []), newItem],
    };

    await saveData(updated);
  };

  const updateMedicine = async (date, id, updates) => {
    const updated = {
      ...medications,
      [date]: (medications[date] || []).map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    };
    await saveData(updated);
  };

  const deleteMedicine = async (date, id) => {
    const filtered = (medications[date] || []).filter((m) => m.id !== id);
    const updated = { ...medications };
    if (filtered.length > 0) {
      updated[date] = filtered;
    } else {
      delete updated[date];
    }
    await saveData(updated);
  };

  const toggleChecked = async (date, id) => {
    const updated = {
      ...medications,
      [date]: (medications[date] || []).map((m) =>
        m.id === id ? { ...m, checked: !m.checked } : m
      ),
    };
    await saveData(updated);
  };

  const getMedicineByDate = (date) => medications[date] || [];

  const getMedicineByRange = (startDate, endDate) => {
    const result = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const key = current.toISOString().split('T')[0];
      if (medications[key]) {
        result.push(...medications[key]);
      }
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  const recommendSupplements = (inputSymptoms) => {
    const recommendations = [];
    inputSymptoms.forEach((sym) => {
      if (sym.includes('피로')) recommendations.push('비타민B군');
      if (sym.includes('면역')) recommendations.push('아연');
      if (sym.includes('소화')) recommendations.push('프로바이오틱스');
    });
    return [...new Set(recommendations)];
  };

  const isFavorite = (item) => {
    const id = item.ITEM_SEQ || item.id;
    return favorites.some((f) => f.id === id);
  };

  const addFavorite = async (item) => {
    const id = item.ITEM_SEQ;
    if (favorites.some((f) => f.id === id)) return;

    const newItem = {
      id,
      name: item.ITEM_NAME || '',
      company: item.ENTP_NAME || '',
      ingredient: item.ITEM_INGR_NAME || '',
      dosage: item.CHART || '',
      usage: item.ETC_OTC_NAME || '',
      image: item.BIG_PRDT_IMG_URL || '',
    };

    const updated = [...favorites, newItem];
    await saveFavorites(updated);
  };

  const removeFavorite = async (itemIdOrName) => {
    const updated = favorites.filter(
      (f) => f.id !== itemIdOrName && f.name !== itemIdOrName
    );
    await saveFavorites(updated);
  };

  const toggleFavorite = async (item) => {
    const id = item.ITEM_SEQ;
    if (isFavorite(item)) {
      await removeFavorite(id);
    } else {
      await addFavorite(item);
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        symptoms,
        favorites,
        setSymptoms: saveSymptoms,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleChecked,
        getMedicineByDate,
        getMedicineByRange,
        recommendSupplements,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => useContext(MedicationContext);