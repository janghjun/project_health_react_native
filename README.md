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

## 3. 🖼 주요 화면 구성

> 아래 항목에 맞는 실제 앱 스크린샷을 삽입해 주세요:

- 온보딩 / 로그인 / 회원가입 화면 – `이미지 삽입 위치`
- 식단 등록 및 요약 화면 – `이미지 삽입 위치`
- 운동 기록 및 분석 화면 – `이미지 삽입 위치`
- 복약 등록 및 OCR 결과 화면 – `이미지 삽입 위치`
- 설정 / 백업 / 알림 화면 – `이미지 삽입 위치`

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
