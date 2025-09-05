import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { 
  User, 
  Settings, 
  Heart, 
  Clock, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit,
  Star
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/(auth)/login");
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: Heart,
      title: "Favorites",
      subtitle: "Your saved services",
      onPress: () => console.log("Favorites"),
      color: "#EF4444",
    },
    {
      icon: Clock,
      title: "Booking History",
      subtitle: "View past bookings",
      onPress: () => console.log("History"),
      color: "#3B82F6",
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences",
      onPress: () => console.log("Settings"),
      color: "#6B7280",
    },
    {
      icon: Shield,
      title: "Admin Panel",
      subtitle: "Manage content",
      onPress: () => router.push("/admin"),
      color: "#10B981",
      adminOnly: true,
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Get assistance",
      onPress: () => console.log("Help"),
      color: "#F59E0B",
    },
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginTitle}>You're not logged in</Text>
          <Text style={styles.loginSubtitle}>
            Login to access your profile and bookings
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user.avatar || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.statNumber}>4.8</Text>
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          if (item.adminOnly && user.role !== "admin") return null;
          
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                <Icon size={20} color={item.color} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <View style={[styles.iconContainer, { backgroundColor: "#FEE2E2" }]}>
            <LogOut size={20} color="#EF4444" />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loginPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  profileInfo: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#3B82F6",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3B82F6",
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
  },
});