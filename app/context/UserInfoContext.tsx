import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserInfo {
  email: string;
  nickname: string;
  birth: string;
  gender: string;
}

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

// 1. Context 생성
const UserInfoContext = createContext<UserInfoContextType | null>(null);

// 2. Provider 정의
export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    nickname: '',
    birth: '',
    gender: '',
  });

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

// 3. 커스텀 훅: context 접근용
export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
};
