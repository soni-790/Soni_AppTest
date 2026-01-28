import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="setting" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="about" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="addresses" />
    </Stack>
  );
}
