import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Heart,
  Share2,
  CheckCircle
} from "lucide-react-native";
import { useServices } from "@/providers/ServicesProvider";

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getServiceById } = useServices();
  
  const service = getServiceById(id as string);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Service not found</Text>
      </SafeAreaView>
    );
  }

  const handleBooking = () => {
    Alert.alert(
      "Booking Confirmation",
      `Would you like to book ${service.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Book Now", 
          onPress: () => Alert.alert("Success", "Booking confirmed!")
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.headerImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.ratingBadge}>
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.rating}>{service.rating}</Text>
              <Text style={styles.reviews}>({service.reviews})</Text>
            </View>
          </View>

          <Text style={styles.category}>{service.category}</Text>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.infoText}>{service.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.infoText}>{service.timing}</Text>
            </View>
            <View style={styles.infoItem}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.infoText}>{service.phone || "+91 98765 43210"}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {service.features?.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>₹{service.price}</Text>
            <Text style={styles.priceNote}>*Prices may vary based on requirements</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity style={styles.callButton}>
          <Phone size={20} color="#3B82F6" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.bookGradient}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 50,
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 10,
  },
  actionButtons: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#92400E",
    marginLeft: 2,
  },
  category: {
    fontSize: 14,
    color: "#3B82F6",
    marginBottom: 15,
  },
  quickInfo: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 10,
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 10,
  },
  pricingSection: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  priceNote: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 15,
    marginRight: 10,
    flex: 1,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 8,
  },
  bookButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  bookGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});