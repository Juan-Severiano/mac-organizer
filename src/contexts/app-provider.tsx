'use client';

import { CurrentUserProvider } from "./current-user-context";
import { ScheduleProvider } from "./schedule-context";
import { UserProvider } from "./user-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CurrentUserProvider>
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </CurrentUserProvider>
    </UserProvider>
  );
}
