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
import { Star, MapPin, Clock, Phone } from "lucide-react-native";

export default function SubcategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getServicesBySubcategory, getSubcategoryById } = useServices();
  
  const subcategory = getSubcategoryById(id as string);
  const services = getServicesBySubcategory(id as string);

  if (!subcategory) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Subcategory not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: subcategory.name }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{subcategory.name}</Text>
          <Text style={styles.description}>{subcategory.details}</Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>{services.length} Services Available</Text>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => router.push(`/service/${service.id}`)}
            >
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
              <View style={styles.serviceContent}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFC107" fill="#FFC107" />
                    <Text style={styles.rating}>{service.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.detailItem}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.detailText}>{service.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.detailText}>{service.timing}</Text>
                  </View>
                </View>
                
                <View style={styles.serviceFooter}>
                  <Text style={styles.price}>₹{service.price}</Text>
                  <TouchableOpacity style={styles.contactButton}>
                    <Phone size={14} color="#FFFFFF" />
                    <Text style={styles.contactText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
  },
  statText: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
  },
  servicesContainer: {
    padding: 15,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: "100%",
    height: 150,
  },
  serviceContent: {
    padding: 15,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
});