import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'react-native-uuid'; // ✅ 수정됨

interface ExerciseItem {
  id: string;
  name: string;
  part: string;
  date: string;
  duration: number;
  sets?: string;
  reps?: string;
  weight?: string;
  favorite?: boolean;
}

interface ManualExerciseItem {
  id: string;
  name: string;
  part: string;
  duration: number;
  createdAt: string;
}

interface FavoriteExerciseItem {
  id: string;
  name: string;
  part: string;
  duration: number;
  met?: number;
  description?: string;
}

interface ExerciseContextType {
  addRecord: (record: Omit<ExerciseItem, 'id'> & Partial<Pick<ExerciseItem, 'id'>>) => void;
  addExercise: typeof addRecord;
  removeRecord: (id: string, date: string) => void;
  toggleFavorite: (exerciseId: string) => void;
  getExerciseByDate: (date: string) => ExerciseItem[];
  getExerciseByRange: (startDate: string, endDate: string) => ExerciseItem[];
  getExerciseByPart: (date: string, part: string) => ExerciseItem[];
  addManualExercise: (item: Omit<ManualExerciseItem, 'id' | 'createdAt'>) => Promise<void>;
  removeManualExercise: (id: string) => Promise<void>;
  addFavoriteExercise: (item: FavoriteExerciseItem) => void;
  removeFavoriteExercise: (id: string) => void;
  manualExercises: ManualExerciseItem[];
  favoriteExercises: FavoriteExerciseItem[];
  records: ExerciseItem[];
  exercises: ExerciseItem[];
  exerciseGoal: number;
  setExerciseGoal: (goal: number) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: React.ReactNode }) {
  const [exerciseData, setExerciseData] = useState<Record<string, ExerciseItem[]>>({});
  const [manualExercises, setManualExercises] = useState<ManualExerciseItem[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<FavoriteExerciseItem[]>([]);
  const [exerciseGoal, setExerciseGoalState] = useState<number>(60);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [saved, manual, goal, favs] = await Promise.all([
        AsyncStorage.getItem('exerciseData'),
        AsyncStorage.getItem('manualExercises'),
        AsyncStorage.getItem('exerciseGoal'),
        AsyncStorage.getItem('favoriteExercises'),
      ]);

      if (saved) setExerciseData(JSON.parse(saved));
      if (manual) setManualExercises(JSON.parse(manual));
      if (goal) setExerciseGoalState(Number(goal));
      if (favs) setFavoriteExercises(JSON.parse(favs));
    } catch (e) {
      console.error('운동 데이터 로드 실패', e);
    }
  };

  const persistExerciseData = (data: Record<string, ExerciseItem[]>) => {
    setExerciseData(data);
    AsyncStorage.setItem('exerciseData', JSON.stringify(data));
  };

  const setExerciseGoal = async (goal: number) => {
    setExerciseGoalState(goal);
    try {
      await AsyncStorage.setItem('exerciseGoal', goal.toString());
    } catch (e) {
      console.error('운동 목표 저장 실패', e);
    }
  };

  const addRecord = (record: Omit<ExerciseItem, 'id'> & Partial<Pick<ExerciseItem, 'id'>>) => {
    const id = record.id || uuidv4();
    const dateKey = record.date;
    const newItem: ExerciseItem = { ...record, id } as ExerciseItem;

    const updated = {
      ...exerciseData,
      [dateKey]: [...(exerciseData[dateKey] || []), newItem],
    };

    persistExerciseData(updated);
  };

  const removeRecord = (id: string, date: string) => {
    if (!exerciseData[date]) return;
    const updated = {
      ...exerciseData,
      [date]: exerciseData[date].filter((item) => item.id !== id),
    };
    persistExerciseData(updated);
  };

  const addExercise = addRecord;

  const toggleFavorite = (exerciseId: string) => {
    const newData: Record<string, ExerciseItem[]> = {};

    for (const date in exerciseData) {
      newData[date] = exerciseData[date].map((item) =>
        item.id === exerciseId ? { ...item, favorite: !item.favorite } : item
      );
    }

    persistExerciseData(newData);
  };

  const addManualExercise = async (
    item: Omit<ManualExerciseItem, 'id' | 'createdAt'>
  ) => {
    const newItem: ManualExerciseItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...manualExercises, newItem];
    setManualExercises(updated);
    await AsyncStorage.setItem('manualExercises', JSON.stringify(updated));
  };

  const removeManualExercise = async (id: string) => {
    const updated = manualExercises.filter((item) => item.id !== id);
    setManualExercises(updated);
    await AsyncStorage.setItem('manualExercises', JSON.stringify(updated));
  };

  const addFavoriteExercise = (item: FavoriteExerciseItem) => {
    const exists = favoriteExercises.some(
      (f) => f.name === item.name && f.part === item.part
    );
    if (exists) return;
    const newItem = { ...item, id: item.id || uuidv4() };
    const updated = [...favoriteExercises, newItem];
    setFavoriteExercises(updated);
    AsyncStorage.setItem('favoriteExercises', JSON.stringify(updated));
  };

  const removeFavoriteExercise = (id: string) => {
    const updated = favoriteExercises.filter((item) => item.id !== id);
    setFavoriteExercises(updated);
    AsyncStorage.setItem('favoriteExercises', JSON.stringify(updated));
  };

  const getExerciseByDate = (date: string): ExerciseItem[] => {
    return exerciseData?.[date] || [];
  };

  const getExerciseByRange = (startDate: string, endDate: string): ExerciseItem[] => {
    const result: ExerciseItem[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const key = current.toISOString().split('T')[0];
      if (exerciseData[key]) result.push(...exerciseData[key]);
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  const getExerciseByPart = (date: string, part: string): ExerciseItem[] => {
    return (exerciseData[date] || []).filter((item) => item.part === part);
  };

  return (
    <ExerciseContext.Provider
      value={{
        addRecord,
        addExercise,
        removeRecord,
        toggleFavorite,
        getExerciseByDate,
        getExerciseByRange,
        getExerciseByPart,
        addManualExercise,
        removeManualExercise,
        addFavoriteExercise,
        removeFavoriteExercise,
        manualExercises,
        favoriteExercises,
        records: Object.values(exerciseData).flat(),
        exercises: Object.values(exerciseData).flat(),
        exerciseGoal,
        setExerciseGoal,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export const useExercise = (): ExerciseContextType => {
  const context = useContext(ExerciseContext);
  if (!context) throw new Error('useExercise must be used within an ExerciseProvider');
  return context;
};