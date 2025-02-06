// lib/temp-user.ts
import { v4 as uuidv4 } from 'uuid';

const TEMP_USER_KEY = 'temp_user_id';

export function getTempUserId(): string {
  let tempId = localStorage.getItem(TEMP_USER_KEY);
  
  if (!tempId) {
    tempId = uuidv4();
    localStorage.setItem(TEMP_USER_KEY, tempId);
  }
  
  return tempId;
}

export function clearTempUserId(): void {
  localStorage.removeItem(TEMP_USER_KEY);
}