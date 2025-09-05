import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useServices } from "@/providers/ServicesProvider";
import { ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { categories } = useServices();
  
  const category = categories.find(cat => cat.id === id);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: category.name }} />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={category.gradient}
          style={styles.header}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryDescription}>
            Explore our {category.subcategories.length} service categories
          </Text>
        </LinearGradient>

        <View style={styles.subcategoriesContainer}>
          {category.subcategories.map((subcategory) => (
            <TouchableOpacity
              key={subcategory.id}
              style={styles.subcategoryCard}
              onPress={() => router.push(`/(tabs)/(home)/subcategory/${subcategory.id}`)}
            >
              <Image 
                source={{ uri: subcategory.image }} 
                style={styles.subcategoryImage}
              />
              <View style={styles.subcategoryInfo}>
                <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                <Text style={styles.subcategoryDetails} numberOfLines={2}>
                  {subcategory.details}
                </Text>
                <Text style={styles.providerCount}>
                  {subcategory.providerCount} providers available
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 50,
  },
  header: {
    padding: 30,
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
  },
  subcategoriesContainer: {
    padding: 20,
  },
  subcategoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  subcategoryImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  subcategoryInfo: {
    flex: 1,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  subcategoryDetails: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    lineHeight: 18,
  },
  providerCount: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
});