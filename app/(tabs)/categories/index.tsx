import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useServices } from "@/providers/ServicesProvider";
import { ChevronRight } from "lucide-react-native";

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories } = useServices();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse All Categories</Text>
        <Text style={styles.headerSubtitle}>
          Find the perfect service for your needs
        </Text>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/(tabs)/(home)/category/${category.id}`)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={category.gradient}
              style={styles.categoryGradient}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.subcategoryCount}>
                {category.subcategories.length} services
              </Text>
              <View style={styles.arrowContainer}>
                <ChevronRight size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  categoriesGrid: {
    padding: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryGradient: {
    padding: 20,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  subcategoryCount: {
    fontSize: 12,
    color: "#E0E7FF",
  },
  arrowContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
});