import { Stack } from "expo-router";

export default function CategoriesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "All Categories",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
    </Stack>
  );
}