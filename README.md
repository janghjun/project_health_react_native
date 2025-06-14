# 📱 건강관리 앱 (Health Tracker App)

> React Native 기반 건강관리 종합 앱  
> 식단 관리 / 운동 기록 / 복약 알림 / 건강 데이터 요약 / CSV 내보내기까지 통합 지원하는 개인 건강관리 솔루션

---

## 🔗 배포 및 저장소

- GitHub Repository: [project_health_react_native](https://github.com/janghjun/project_health_react_native)

---

## 🗂️ 목차

1. 프로젝트 개요  
2. 핵심 기능  
3. 주요 화면 (이미지)  
4. 기술 스택  
5. 폴더 구조  
6. 주요 코드 흐름  
7. 데이터 관리 구조  
8. 기타 기능 및 설계 포인트  
9. 향후 확장 가능성  
10. 느낀 점  
11. 라이선스  

---

## 1. 📌 프로젝트 개요

- **개발 기간**: 2025년 4월 ~ 6월  
- **목적**: 실사용 가능한 개인 건강관리 앱 구현 및 배포를 위한 포트폴리오 프로젝트  
- **주요 특징**:  
  - 오프라인에서도 동작 (AsyncStorage)  
  - OCR을 통한 복약 정보 자동 입력  
  - CSV 기반 건강 데이터 저장 및 공유 기능  
  - 온보딩 → 메인 → 기록 → 요약 분석까지 전 흐름 구현  

---

## 2. 🔧 핵심 기능

| 기능 분류   | 주요 기능 내용 |
|-------------|----------------|
| 🔑 인증     | 이메일 로그인/회원가입, Firebase 연동, 비밀번호 변경/재설정 |
| 🥗 식단     | 검색, 즐겨찾기, 직접 입력, 영양정보 계산, 요약, 차트 시각화 |
| 💊 복약     | OCR 자동입력, 복약 리스트 관리, 알림 설정 |
| 🏃 운동     | 운동 검색/직접입력, 기록 저장, 시각화 |
| 🔔 알림     | 기능별 알림 개별 설정, 로그 기록 |
| 📊 요약     | 주간/월간 분석, CSV 저장 및 이미지 캡처 |
| ⚙️ 설정     | 계정 관리, 백업/복원, 정책 링크, 고객센터 |

---

## 🖼 주요 화면 구성

### ✅ 온보딩 (Onboarding)
<img src="./app/assets/readme_images/onboarding/onboarding_1.png" alt="Onboarding Step 1" width="300"/>
<img src="./app/assets/readme_images/onboarding/onboarding_2.png" alt="Onboarding Step 2" width="300"/>
<img src="./app/assets/readme_images/onboarding/onboarding_3.png" alt="Onboarding Step 3" width="300"/>
<img src="./app/assets/readme_images/onboarding/onboarding_loading.png" alt="Onboarding Loading" width="300"/>

---

### ✅ 로그인 (Login)
<img src="./app/assets/readme_images/onboarding/login_home.png" alt="Login Home Screen" width="300"/>
<img src="./app/assets/readme_images/onboarding/login.png" alt="Login Screen" width="300"/>
<img src="./app/assets/readme_images/onboarding/find_password.png" alt="Find Password Screen" width="300"/>

---

### ✅ 회원가입 (Signup)
<img src="./app/assets/readme_images/onboarding/signup_step1.png" alt="Signup Step 1" width="300"/>
<img src="./app/assets/readme_images/onboarding/signup_step2.png" alt="Signup Step 2" width="300"/>

## 🥗 식단 기능 소개

사용자의 식사 정보를 기록하고, 영양 정보를 분석하며, 시각화된 데이터를 CSV 및 이미지로 저장/공유할 수 있는 통합 식단 관리 기능입니다.

---

### 📅 식단 홈 화면

- 하루 식단 요약 및 칼로리 설정
- 달력 기반 날짜별 기록 확인

<div align="center">
  <img src="./app/assets/readme_images/diet/Diet_Home.png" width="250" />
  <img src="./app/assets/readme_images/diet/Diet_Home_Calendar.png" width="250" />
  <img src="./app/assets/readme_images/diet/Diet_Home_CalorieSetting.png" width="250" />
</div>

---

### 🔍 식단 등록 방법 (탭별)

- **검색 탭**: 음식명으로 빠르게 검색 가능  
- **즐겨찾기 탭**: 자주 먹는 음식 빠르게 추가  
- **직접입력 탭**: 사용자가 직접 음식 정보를 입력 가능

<div align="center">
  <img src="./app/assets/readme_images/diet/diet_tab_search.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_tab_favorites.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_tab_manual_input.png" width="250" />
</div>

---

### ✍️ 직접 입력 과정 예시

<div align="center">
  <img src="./app/assets/readme_images/diet/diet_manual_input_screen.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_manual_input_screen2.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_manual_input_complete.png" width="250" />
</div>

---

### 📄 상세 식단 정보 확인 및 CSV 저장

- 영양소, 음식 항목 확인
- `CSV 저장` 클릭 시 파일 생성

<div align="center">
  <img src="./app/assets/readme_images/diet/diet_detail_screen.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_detail_csv_save_click.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_detail_csv_sample.png" width="250" />
</div>

---

### 📊 한눈에 보는 식단 요약

- 음식별/영양소별 요약 정보 제공
- 이미지 저장 및 공유 기능 포함

<div align="center">
  <img src="./app/assets/readme_images/diet/diet_summary_nutrition_tab.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_summary_food_tab.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_summary_share_click.png" width="250" />
  <img src="./app/assets/readme_images/diet/diet_summary_image_save.png" width="250" />
</div>

## 🏃 운동 기능 소개

사용자의 운동 기록을 효율적으로 관리할 수 있는 기능입니다. 검색, 즐겨찾기, 직접 입력을 통한 등록부터 요약, 분석, 공유까지 통합 지원합니다.

---

### 🏠 운동 홈 화면

- 최근 운동 기록 확인
- 요약 분석 및 바로가기 기능 제공

<div align="center">
  <img src="./app/assets/readme_images/exercise/exercise_home.png" width="250" />
</div>

---

### 📌 운동 등록 방법 (탭별)

- **검색 탭**: 운동 이름으로 검색 후 기록
- **즐겨찾기 탭**: 자주 사용하는 운동을 바로 선택
- **직접입력 탭**: 사용자 정의 운동 기록 가능

<div align="center">
  <img src="./app/assets/readme_images/exercise/exercise_tab_search.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_tab_favorites.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_tab_manual.png" width="250" />
</div>

---

### 📝 직접 입력 예시

- 운동명, 시간, 칼로리 등 수동 입력 가능

<div align="center">
  <img src="./app/assets/readme_images/exercise/exercise_manual_input_screen.png" width="250" />
</div>

---

### 📊 오늘의 운동 한눈에 보기

- 요약 카드로 주요 정보 확인
- 이미지로 저장하거나 CSV 내보내기 가능

<div align="center">
  <img src="./app/assets/readme_images/exercise/exercise_today_summary.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_today_share_click.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_today_share_image.png" width="250" />
</div>

---

### 📄 상세 운동 정보 & CSV 저장

- 운동 항목별 상세 기록 열람
- 저장/공유 버튼으로 내보내기 가능

<div align="center">
  <img src="./app/assets/readme_images/exercise/exercise_detail_screen.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_detail_csv_click.png" width="250" />
  <img src="./app/assets/readme_images/exercise/exercise_detail_csv_sample.png" width="250" />
</div>

## 💊 복약 기능 소개

약 복용 정보를 쉽고 빠르게 기록하고 관리할 수 있도록, OCR 자동 등록과 수동 입력, 즐겨찾기, 데이터 요약 및 공유까지 완전한 흐름을 제공합니다.

---

### 🏠 복약 홈 화면

- 오늘 복약 현황 요약 표시
- 복약 등록으로 이동 가능

<div align="center">
  <img src="./app/assets/readme_images/medication/medication_home.png" width="250" />
</div>

---

### 🤖 OCR 자동 등록

- 카메라로 처방전 또는 약 봉투를 촬영
- OCR 서버로 전송 후 약 이름, 용량 자동 입력

<div align="center">
  <img src="./app/assets/readme_images/medication/ocr_auto_register.jpeg" width="250" />
  <img src="./app/assets/readme_images/medication/ocr_fetch_preview.png" width="250" />
</div>

---

### 📌 복약 등록 방법 (탭별)

- **검색 탭**: 약 이름으로 검색 후 등록
- **즐겨찾기 탭**: 자주 복용하는 약 저장 후 간편 등록
- **직접입력 탭**: 이름, 용량, 횟수 등 사용자 정의 입력

<div align="center">
  <img src="./app/assets/readme_images/medication/medication_tab_search.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_tab_favorites.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_tab_manual.png" width="250" />
</div>

---

### 📝 직접 입력 예시

- 약 이름, 복용량, 복용 시간 등을 수동으로 등록

<div align="center">
  <img src="./app/assets/readme_images/medication/medication_manual_input.png" width="250" />
</div>

---

### 📊 오늘의 복약 한눈에 보기

- 오늘 복용한 약 정보 요약
- 이미지 저장 및 공유 기능 포함

<div align="center">
  <img src="./app/assets/readme_images/medication/medication_today_summary.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_today_share_click.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_today_share_preview.png" width="250" />
</div>

---

### 📄 상세 복약 정보 & CSV 저장

- 기록된 약 복용 내역 확인
- CSV 파일로 저장 및 공유 가능

<div align="center">
  <img src="./app/assets/readme_images/medication/medication_detail_screen.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_detail_csv_click.png" width="250" />
  <img src="./app/assets/readme_images/medication/medication_detail_csv_sample.png" width="250" />
</div>

## 🏠 홈 화면 구성

앱 실행 시 진입하는 홈 화면에서는 전체 건강 활동 요약 정보를 한눈에 확인할 수 있습니다.

- 오늘의 **식단, 운동, 복약** 진행 현황을 시각적으로 표현  
- 탭 메뉴를 통해 각 기능(식단/운동/복약/설정)으로 빠르게 이동  
- 사용자 맞춤 환영 메시지 및 요약 피드백 제공

<div align="center">
  <img src="./app/assets/readme_images/home/home_screen.png" width="250" />
</div>

## ⚙️ 설정 화면

앱의 사용자 환경 설정 기능은 다음과 같은 세부 메뉴로 구성되어 있으며, 모든 설정은 로컬 저장 기반으로 처리됩니다.

| 기능 | 설명 | 예시 이미지 |
|------|------|--------------|
| 🔐 계정 설정 | 비밀번호 변경, 로그아웃, 회원 탈퇴 지원 | <img src="./app/assets/readme_images/settings/account_settings_screen.png" width="200" /> |
| 🛠️ 백업 및 기기 관리 | AsyncStorage 데이터 백업/복원, 기기명 및 앱 버전 확인 | <img src="./app/assets/readme_images/settings/backup_and_device_screen.png" width="200" /> |
| 🔔 알림 설정 | 식단/운동/복약 알림 개별 설정, 토글 방식 | <img src="./app/assets/readme_images/settings/notification_setting_screen.png" width="200" /> |
| 📑 정책 및 고객지원 | 이용약관, 개인정보처리방침 링크 제공, 고객센터 이메일 연결 | <img src="./app/assets/readme_images/settings/policy_support_screen.png" width="200" /> |

홈 화면에서 설정 버튼 진입 → 세부 항목별 화면 구성은 다음과 같이 구현됩니다:

<div align="center">
  <img src="./app/assets/readme_images/settings/settings_home.png" width="250" />
</div>
---

## 4. 🛠 기술 스택

| 범주        | 사용 기술 |
|-------------|-----------|
| 프론트엔드  | React Native (Expo), TypeScript |
| 상태관리    | Context API |
| 저장소      | AsyncStorage |
| 인증        | Firebase Auth |
| 네비게이션  | React Navigation |
| 시각화      | react-native-chart-kit, view-shot |
| OCR         | 커스텀 서버 fetch 전송 (base64) |
| 공유        | expo-sharing, expo-file-system |

---

## 5. 📁 폴더 구조

```
📦 project_health_react_native
├─ assets/
├─ components/
├─ context/
├─ screens/
│  ├─ Diet/
│  ├─ Exercise/
│  ├─ Medication/
│  ├─ Settings/
│  └─ Auth/
├─ utils/
├─ App.tsx
└─ ...
```

---

## 6. 🔄 주요 코드 흐름

### ▶ Context 기반 상태관리
```tsx
<UserContextProvider>
  <DietContextProvider>
    <ExerciseContextProvider>
      <MedicationContextProvider>
        <AppNavigator />
      </MedicationContextProvider>
    </ExerciseContextProvider>
  </DietContextProvider>
</UserContextProvider>
```

### ▶ OCR 통한 복약 자동입력 흐름
1. 사진 촬영(CameraScreen)
2. base64 전송
3. JSON 결과 수신 및 MedicationRegisterScreen에 자동입력

---

## 7. 📊 데이터 저장 및 공유

- CSV 내보내기 및 `expo-sharing` 통한 공유 지원  
- view-shot으로 분석 화면 캡처 기능 포함  
- 운동/식단/복약 기능별 CSV 저장 구분 가능

---

## 8. ✨ 설계 포인트 요약

- 전 기능 모듈화 및 화면별 흐름 분리
- 유효성 검사 및 Alert 처리
- 디자인 통일 (Figma 기반 UI)
- 로컬 환경 데이터 관리 최적화

---

## 9. 🚀 향후 계획

- GPT 연동 건강 챗봇 추가  
- 건강 상태 평가 AI 모델 탑재  
- Google Fit / Apple HealthKit 연동  
- 클라우드 기반 동기화 및 웹 대시보드 개발

---

## 10. 💬 느낀 점

> 기능 설계부터 데이터 흐름, UI/UX까지 실질적 서비스 수준 구현을 목표로 작업하였고, 실제 배포를 염두에 두며 구조화된 앱을 설계할 수 있었습니다. 각 기능마다 사용자의 실질적 편의성을 고려한 접근이 핵심이었습니다.

---

## 📜 라이선스

MIT License
