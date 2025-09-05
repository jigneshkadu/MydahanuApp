import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "My Dahanu",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }} 
      />
      <Stack.Screen 
        name="category/[id]" 
        options={{ 
          title: "Category",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
      <Stack.Screen 
        name="subcategory/[id]" 
        options={{ 
          title: "Services",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
    </Stack>
  );
}