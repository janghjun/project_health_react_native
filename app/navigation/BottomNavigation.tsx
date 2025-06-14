import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../screens/Main/HomeScreen';
import DietScreen from '../screens/DietScreen/DietHomeScreen';
import MedicineScreen from '../screens/MedicineScreen/MedicationHomeScreen';
import ExerciseScreen from '../screens/ExerciseScreen/ExerciseHomeScreen';
import SettingScreen from '../screens/SettingsScreen/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#F0F3F6',
          width: 390,
          height: 80,
          justifyContent: 'center',
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 14,
          paddingBottom: 14,
        },
      }}
    >
      {[
        {
          name: '식단',
          component: DietScreen,
          activeIcon: require('../assets/images/bottom_diet_active.png'),
          inactiveIcon: require('../assets/images/bottom_diet_inactive.png'),
        },
        {
          name: '복약',
          component: MedicineScreen,
          activeIcon: require('../assets/images/bottom_medicine_active.png'),
          inactiveIcon: require('../assets/images/bottom_medicine_inactive.png'),
        },
        {
          name: '홈',
          component: HomeScreen,
          activeIcon: require('../assets/images/bottom_home_active.png'),
          inactiveIcon: require('../assets/images/bottom_home_inactive.png'),
        },
        {
          name: '운동',
          component: ExerciseScreen,
          activeIcon: require('../assets/images/bottom_exercise_active.png'),
          inactiveIcon: require('../assets/images/bottom_exercise_inactive.png'),
        },
        {
          name: '설정',
          component: SettingScreen,
          activeIcon: require('../assets/images/bottom_profile_active.png'),
          inactiveIcon: require('../assets/images/bottom_profile_inactive.png'),
        },
      ].map(({ name, component, activeIcon, inactiveIcon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? activeIcon : inactiveIcon}
                style={{ width: 26, height: 26, marginBottom: -4 }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: focused ? '#F05636' : '#AAAAAA',
                }}
              >
                {name}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}