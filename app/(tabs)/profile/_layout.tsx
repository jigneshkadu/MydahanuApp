import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profile",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
    </Stack>
  );
}