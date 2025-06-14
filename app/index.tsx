import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserInfoProvider } from './context/UserInfoContext';
import { UserProvider } from './context/UserContext';
import { DietProvider } from './context/DietContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { MedicationProvider } from './context/MedicationContext';

import SplashScreen from './screens/Auth/SplashScreen';
import LoginHome from './screens/Auth/LoginHome';
import LoginScreen from './screens/Auth/LoginScreen';
import SignupStep1 from './screens/Auth/SignupStep1';
import PasswordResetScreen from './screens/Auth/PasswordResetScreen';

import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import BottomNavigation from './navigation/BottomNavigation';

import DietHomeScreen from './screens/DietScreen/DietHomeScreen';
import DailySummary from './screens/DietScreen/DailySummaryScreen';
import FoodSearch from './screens/DietScreen/FoodSearchScreen';
import DietDetail from './screens/DietScreen/DietDetailScreen';
import FoodRegister from './screens/DietScreen/FoodRegisterScreen';
import DirectFoodRegisterScreen from './screens/DietScreen/DirectFoodRegisterScreen';
import DirectFoodRegisterScreenStep2 from './screens/DietScreen/DirectFoodRegisterScreenStep2';
import DirectFoodRegisterScreenStep3 from './screens/DietScreen/DirectFoodRegisterScreenStep3';
import Step3NutritionInfoScreen from './screens/DietScreen/Step3NutritionInfoScreen';

import ExerciseHomeScreen from './screens/ExerciseScreen/ExerciseHomeScreen';
import ExerciseDetailScreen from './screens/ExerciseScreen/ExerciseDetailScreen';
import ExerciseRegisterScreen from './screens/ExerciseScreen/ExerciseRegisterScreen';
import ExerciseSummaryScreen from './screens/ExerciseScreen/ExerciseSummaryScreen';
import ExerciseSearch from './screens/ExerciseScreen/ExerciseSearchScreen';

import MedicationHomeScreen from './screens/MedicineScreen/MedicationHomeScreen';
import MedicationRegisterScreen from './screens/MedicineScreen/MedicationRegisterScreen';
import MedicationSearchScreen from './screens/MedicineScreen/MedicationSearchScreen';
import MedicationSummaryScreen from './screens/MedicineScreen/MedicationSummaryScreen';
import MedicationDetailScreen from './screens/MedicineScreen/MedicationDetailScreen';
import MedicationStatsScreen from './screens/MedicineScreen/MedicationStatsScreen';

import CameraScreen from './screens/MedicineScreen/CameraScreen';

import Setting from './screens/SettingsScreen/SettingsScreen';
import EditAccountScreen from './screens/SettingsScreen/EditAccountScreen';
import GoalSettingScreen from './screens/SettingsScreen/GoalSettingScreen';
import BackupAndDeviceScreen from './screens/SettingsScreen/BackupAndDeviceScreen';
import AccountSettingsScreen from './screens/SettingsScreen/AccountSettingsScreen';
import NotificationSettingScreen from './screens/SettingsScreen/NotificationSettingScreen';
import SupportAndPolicyScreen from './screens/SettingsScreen/SupportAndPolicyScreen';

import HomeScreen from './screens/Main/HomeScreen';
import NotificationCenterScreen from './screens/Main/NotificationCenterScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <UserInfoProvider>
      <MedicationProvider>
        <ExerciseProvider>
          <UserProvider>
            <DietProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {/* Auth */}
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen name="LoginHome" component={LoginHome} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Signup1" component={SignupStep1} />
                  <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />

                  {/* Onboarding */}
                  <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

                  {/* Main */}
                  <Stack.Screen name="Main" component={BottomNavigation} />

                  {/* Diet */}
                  <Stack.Screen name="Diet" component={DietHomeScreen} />
                  <Stack.Screen name="DailySummary" component={DailySummary} />
                  <Stack.Screen name="FoodSearch" component={FoodSearch} />
                  <Stack.Screen name="DietDetail" component={DietDetail} />
                  <Stack.Screen name="FoodRegister" component={FoodRegister} />
                  <Stack.Screen name="DirectFoodRegisterScreen" component={DirectFoodRegisterScreen} />
                  <Stack.Screen name="DirectFoodRegisterScreenStep2" component={DirectFoodRegisterScreenStep2} />
                  <Stack.Screen name="DirectFoodRegisterScreenStep3" component={DirectFoodRegisterScreenStep3} />
                  <Stack.Screen name="Step3NutritionInfoScreen" component={Step3NutritionInfoScreen} />

                  {/* Exercise */}
                  <Stack.Screen name="Exercise" component={ExerciseHomeScreen} />
                  <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
                  <Stack.Screen name="ExerciseRegisterScreen" component={ExerciseRegisterScreen} />
                  <Stack.Screen name="ExerciseSummary" component={ExerciseSummaryScreen} />
                  <Stack.Screen name="ExerciseSearch" component={ExerciseSearch} />

                  {/* Medication */}
                  <Stack.Screen name="Medication" component={MedicationHomeScreen} />
                  <Stack.Screen name="MedicationRegister" component={MedicationRegisterScreen} />
                  <Stack.Screen name="MedicationSearch" component={MedicationSearchScreen} />
                  <Stack.Screen name="MedicationSummary" component={MedicationSummaryScreen} />
                  <Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} />
                  <Stack.Screen name="MedicationStats" component={MedicationStatsScreen} />
                  <Stack.Screen name="CameraScreen" component={CameraScreen} />

                  {/* Settings */}
                  <Stack.Screen name="Setting" component={Setting} />
                  <Stack.Screen name="EditAccount" component={EditAccountScreen} />
                  <Stack.Screen name="BackupAndDevice" component={BackupAndDeviceScreen} />
                  <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
                  <Stack.Screen name="NotificationSetting" component={NotificationSettingScreen} />
                  <Stack.Screen name="SupportAndPolicy" component={SupportAndPolicyScreen} />

                  {/* Additional Screens */}
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />

                </Stack.Navigator>
              </NavigationContainer>
            </DietProvider>
          </UserProvider>
        </ExerciseProvider>
      </MedicationProvider>
    </UserInfoProvider>
  );
}

registerRootComponent(App);
