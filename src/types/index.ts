// types/index.ts
export interface User {
  id: number;
  name: string;
}

export interface CurrentUser {
  id: number;
  userId: number;
  user: User;
}

export interface Schedule {
  id: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  user: User;
}
