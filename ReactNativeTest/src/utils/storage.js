import * as SecureStore from "expo-secure-store";

export const saveToken = async (token) => {
  return SecureStore.setItemAsync("token", token);
};

export const getToken = async () => {
  return SecureStore.getItemAsync("token");
};

export const removeToken = async () => {
  return SecureStore.deleteItemAsync("token");
};
