import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Search Services",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
    </Stack>
  );
}