import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Search, X, Filter, Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useServices } from "@/providers/ServicesProvider";

export default function SearchScreen() {
  const router = useRouter();
  const { searchServices, categories } = useServices();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    return searchServices(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, searchServices]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategory && styles.filterChipActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.filterText,
              !selectedCategory && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              selectedCategory === category.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category.id && styles.filterTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 && !selectedCategory ? (
          <View style={styles.emptyState}>
            <Search size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Start Searching</Text>
            <Text style={styles.emptyStateText}>
              Find services, providers, and more
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {searchResults.length} results found
            </Text>
            {searchResults.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.resultCard}
                onPress={() => router.push(`/service/${service.id}`)}
              >
                <Image source={{ uri: service.image }} style={styles.resultImage} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{service.name}</Text>
                  <Text style={styles.resultCategory}>{service.category}</Text>
                  <View style={styles.resultMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFC107" fill="#FFC107" />
                      <Text style={styles.ratingText}>{service.rating}</Text>
                    </View>
                    <Text style={styles.resultPrice}>₹{service.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 10,
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: "#3B82F6",
  },
  filterText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 15,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 4,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});