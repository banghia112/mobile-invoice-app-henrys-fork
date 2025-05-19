import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFromStorage = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn('Error parsing stored value:', error);
    }
  }
  return null;
};

export const setToStorage = async <T>(key: string, value: T): Promise<void> => {
    try {
      const stringifiedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error(`Error setting value for key "${key}" in storage:`, error);
      throw error;
    }
  };