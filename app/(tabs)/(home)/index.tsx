import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useServices } from "@/providers/ServicesProvider";
import { ChevronRight, Star, TrendingUp, Users, Award } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { categories, banners, featuredServices } = useServices();
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerScrollRef = useRef<ScrollView>(null);

  // Auto-scroll banners
  useEffect(() => {
    let scrollIndex = 0;
    const interval = setInterval(() => {
      if (bannerScrollRef.current && banners.length > 0) {
        scrollIndex = (scrollIndex + 1) % banners.length;
        bannerScrollRef.current.scrollTo({
          x: scrollIndex * (width - 40),
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Banners */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={["#3B82F6", "#60A5FA"]}
          style={styles.heroGradient}
        >
          <Text style={styles.heroTitle}>Welcome to My Dahanu</Text>
          <Text style={styles.heroSubtitle}>Your local service marketplace</Text>
        </LinearGradient>

        {/* Promotional Banners */}
        <View style={styles.bannersContainer}>
          <Text style={styles.sectionTitle}>Featured Promotions</Text>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {banners.map((banner, index) => (
              <TouchableOpacity
                key={banner.id}
                style={styles.bannerCard}
                activeOpacity={0.9}
              >
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.bannerOverlay}
                >
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerDescription}>{banner.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Banner Indicators */}
          <View style={styles.indicatorContainer}>
            {banners.map((_, index) => {
              const inputRange = [
                (index - 1) * (width - 40),
                index * (width - 40),
                (index + 1) * (width - 40),
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 20, 8],
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={[styles.indicator, { width: dotWidth, opacity }]}
                />
              );
            })}
          </View>
        </View>
      </View>

      {/* Quick Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/categories")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.slice(0, 6).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/(tabs)/(home)/category/${category.id}`)}
            >
              <LinearGradient
                colors={category.gradient}
                style={styles.categoryIcon}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </LinearGradient>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        {featuredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => router.push(`/service/${service.id}`)}
          >
            <Image source={{ uri: service.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <View style={styles.serviceRating}>
                <Star size={16} color="#FFC107" fill="#FFC107" />
                <Text style={styles.ratingText}>{service.rating}</Text>
                <Text style={styles.reviewCount}>({service.reviews} reviews)</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={32} color="#3B82F6" />
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Service Providers</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={32} color="#10B981" />
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Happy Customers</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={32} color="#F59E0B" />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  heroSection: {
    marginBottom: 20,
  },
  heroGradient: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
  },
  bannersContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  bannerCard: {
    width: width - 40,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#E5E7EB",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginHorizontal: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAll: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 15,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 30,
  },
  categoryName: {
    fontSize: 12,
    color: "#4B5563",
    textAlign: "center",
    width: 70,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
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
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
});