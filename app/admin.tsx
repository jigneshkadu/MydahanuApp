import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useServices } from "@/providers/ServicesProvider";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Save, Upload, Database, Settings } from "lucide-react-native";

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    banners, 
    addBanner, 
    removeBanner, 
    categories, 
    addCategory,
    updateCategory,
    removeCategory,
    addSubcategory,
    updateSubcategory,

    services,
    addService,
    updateService,
    removeService
  } = useServices();
  
  const [activeTab, setActiveTab] = useState<"banners" | "categories" | "services" | "database">("banners");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"banner" | "category" | "subcategory" | "service" | "import">("banner");
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState<any>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  if (!user || user.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorized}>
          <Text style={styles.unauthorizedText}>Unauthorized Access</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openModal = (type: typeof modalType, item?: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = () => {
    try {
      switch (modalType) {
        case "banner":
          if (!formData.title || !formData.description) {
            Alert.alert("Error", "Please fill in all fields");
            return;
          }
          if (editingItem) {
            // Update banner logic would go here
            Alert.alert("Info", "Banner update functionality coming soon");
          } else {
            addBanner({
              title: formData.title,
              description: formData.description,
              image: formData.image || `https://picsum.photos/400/200?random=${Date.now()}`,
            });
          }
          break;
          
        case "category":
          if (!formData.name || !formData.icon) {
            Alert.alert("Error", "Please fill in all fields");
            return;
          }
          if (editingItem) {
            updateCategory(editingItem.id, formData);
          } else {
            addCategory({
              name: formData.name,
              icon: formData.icon,
              gradient: formData.gradient || ["#3B82F6", "#60A5FA"],
              subcategories: []
            });
          }
          break;
          
        case "subcategory":
          if (!formData.name || !formData.details || !selectedCategoryId) {
            Alert.alert("Error", "Please fill in all fields and select a category");
            return;
          }
          if (editingItem) {
            updateSubcategory(selectedCategoryId, editingItem.id, formData);
          } else {
            addSubcategory(selectedCategoryId, {
              name: formData.name,
              details: formData.details,
              image: formData.image || `https://picsum.photos/400/300?random=${Date.now()}`,
              providerCount: 0
            });
          }
          break;
          
        case "service":
          if (!formData.name || !formData.description || !formData.subcategoryId) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
          }
          const categoryName = categories.find(cat => 
            cat.subcategories.some(sub => sub.id === formData.subcategoryId)
          )?.name || "";
          
          if (editingItem) {
            updateService(editingItem.id, { ...formData, category: categoryName });
          } else {
            addService({
              ...formData,
              category: categoryName,
              image: formData.image || `https://picsum.photos/400/300?random=${Date.now()}`,
              rating: formData.rating || 4.0,
              reviews: formData.reviews || 0,
              features: formData.features ? formData.features.split(',').map((f: string) => f.trim()) : []
            });
          }
          break;
      }
      
      closeModal();
      Alert.alert("Success", `${modalType} ${editingItem ? 'updated' : 'added'} successfully`);
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleDeleteBanner = (id: string) => {
    Alert.alert(
      "Delete Banner",
      "Are you sure you want to delete this banner?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            removeBanner(id);
            Alert.alert("Success", "Banner deleted");
          }
        },
      ]
    );
  };

  const renderDatabaseStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Database size={24} color="#3B82F6" />
        <Text style={styles.statNumber}>{categories.length}</Text>
        <Text style={styles.statLabel}>Categories</Text>
      </View>
      <View style={styles.statCard}>
        <Settings size={24} color="#10B981" />
        <Text style={styles.statNumber}>{categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}</Text>
        <Text style={styles.statLabel}>Subcategories</Text>
      </View>
      <View style={styles.statCard}>
        <Upload size={24} color="#F59E0B" />
        <Text style={styles.statNumber}>{services.length}</Text>
        <Text style={styles.statLabel}>Services</Text>
      </View>
      <View style={styles.statCard}>
        <ImageIcon size={24} color="#EF4444" />
        <Text style={styles.statNumber}>{banners.length}</Text>
        <Text style={styles.statLabel}>Banners</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Admin Panel", headerShown: true }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage your marketplace content</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {["banners", "categories", "services", "database"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab as any)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === "database" && renderDatabaseStats()}
          
          {/* Add Button */}
          {activeTab !== "database" && (
            <TouchableOpacity 
              style={styles.floatingAddButton} 
              onPress={() => openModal(activeTab === "banners" ? "banner" : activeTab === "categories" ? "category" : "service")}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {activeTab === "banners" && (
            <View>
              <Text style={styles.sectionTitle}>Banners ({banners.length})</Text>
              {banners.map((banner) => (
                <View key={banner.id} style={styles.listItem}>
                  <Image source={{ uri: banner.image }} style={styles.itemImage} />
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{banner.title}</Text>
                    <Text style={styles.listItemSubtitle}>{banner.description}</Text>
                  </View>
                  <View style={styles.listItemActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openModal("banner", banner)}
                    >
                      <Edit2 size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteBanner(banner.id)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === "categories" && (
            <View>
              <Text style={styles.sectionTitle}>Categories ({categories.length})</Text>
              {categories.map((category) => (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.subcategoryCount}>
                        {category.subcategories.length} subcategories
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryActions}>
                    <TouchableOpacity 
                      style={styles.addSubButton}
                      onPress={() => {
                        setSelectedCategoryId(category.id);
                        openModal("subcategory");
                      }}
                    >
                      <Plus size={16} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openModal("category", category)}
                    >
                      <Edit2 size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          "Delete Category",
                          "Are you sure? This will delete all subcategories too.",
                          [
                            { text: "Cancel", style: "cancel" },
                            { 
                              text: "Delete", 
                              style: "destructive",
                              onPress: () => removeCategory(category.id)
                            },
                          ]
                        );
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === "services" && (
            <View>
              <Text style={styles.sectionTitle}>Services ({services.length})</Text>
              {services.map((service: any) => (
                <View key={service.id} style={styles.listItem}>
                  <Image source={{ uri: service.image }} style={styles.itemImage} />
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{service.name}</Text>
                    <Text style={styles.listItemSubtitle}>{service.category}</Text>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                  </View>
                  <View style={styles.listItemActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openModal("service", service)}
                    >
                      <Edit2 size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          "Delete Service",
                          "Are you sure?",
                          [
                            { text: "Cancel", style: "cancel" },
                            { 
                              text: "Delete", 
                              style: "destructive",
                              onPress: () => removeService(service.id)
                            },
                          ]
                        );
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === "database" && (
            <View>
              <Text style={styles.sectionTitle}>Database Management</Text>
              <TouchableOpacity 
                style={styles.databaseButton}
                onPress={() => openModal("import")}
              >
                <Upload size={20} color="#FFFFFF" />
                <Text style={styles.databaseButtonText}>Import Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.databaseButton, { backgroundColor: "#10B981" }]}
                onPress={() => {
                  Alert.alert("Export Data", "Export functionality coming soon");
                }}
              >
                <Database size={20} color="#FFFFFF" />
                <Text style={styles.databaseButtonText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {modalType === "banner" && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Banner Title"
                  value={formData.title || ""}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Banner Description"
                  value={formData.description || ""}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL (optional)"
                  value={formData.image || ""}
                  onChangeText={(text) => setFormData({...formData, image: text})}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            
            {modalType === "category" && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Category Name"
                  value={formData.name || ""}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Icon (emoji)"
                  value={formData.icon || ""}
                  onChangeText={(text) => setFormData({...formData, icon: text})}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            
            {modalType === "subcategory" && (
              <View>
                <Text style={styles.inputLabel}>Select Category:</Text>
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categorySelector,
                        selectedCategoryId === item.id && styles.selectedCategory
                      ]}
                      onPress={() => setSelectedCategoryId(item.id)}
                    >
                      <Text style={styles.categorySelectorIcon}>{item.icon}</Text>
                      <Text style={styles.categorySelectorText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  style={styles.categoryList}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Subcategory Name"
                  value={formData.name || ""}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Details"
                  value={formData.details || ""}
                  onChangeText={(text) => setFormData({...formData, details: text})}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL (optional)"
                  value={formData.image || ""}
                  onChangeText={(text) => setFormData({...formData, image: text})}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            
            {modalType === "service" && (
              <View>
                <Text style={styles.inputLabel}>Select Subcategory:</Text>
                <FlatList
                  data={categories.flatMap(cat => 
                    cat.subcategories.map(sub => ({...sub, categoryName: cat.name}))
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.subcategorySelector,
                        formData.subcategoryId === item.id && styles.selectedSubcategory
                      ]}
                      onPress={() => setFormData({...formData, subcategoryId: item.id})}
                    >
                      <Text style={styles.subcategorySelectorText}>{item.name}</Text>
                      <Text style={styles.subcategorySelectorCategory}>({item.categoryName})</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  style={styles.subcategoryList}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Service Name"
                  value={formData.name || ""}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  value={formData.description || ""}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={formData.price || ""}
                  onChangeText={(text) => setFormData({...formData, price: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={formData.location || ""}
                  onChangeText={(text) => setFormData({...formData, location: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Timing"
                  value={formData.timing || ""}
                  onChangeText={(text) => setFormData({...formData, timing: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone (optional)"
                  value={formData.phone || ""}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Features (comma separated)"
                  value={formData.features || ""}
                  onChangeText={(text) => setFormData({...formData, features: text})}
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL (optional)"
                  value={formData.image || ""}
                  onChangeText={(text) => setFormData({...formData, image: text})}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            
            {modalType === "import" && (
              <View style={styles.importSection}>
                <Text style={styles.importTitle}>Import Data</Text>
                <Text style={styles.importDescription}>
                  You can import data from JSON files or external sources. This feature allows you to bulk upload categories, services, and banners.
                </Text>
                <TouchableOpacity style={styles.importButton}>
                  <Upload size={20} color="#3B82F6" />
                  <Text style={styles.importButtonText}>Select JSON File</Text>
                </TouchableOpacity>
                <Text style={styles.importNote}>
                  Note: Import functionality is coming soon. For now, you can add items individually using the forms above.
                </Text>
              </View>
            )}
          </ScrollView>
          
          {modalType !== "import" && (
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  unauthorized: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unauthorizedText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3B82F6",
  },
  content: {
    padding: 20,
  },
  addSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  listSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  listItemActions: {
    flexDirection: "row",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  categoryItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  subcategoryCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  categoryActions: {
    flexDirection: "row",
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  floatingAddButton: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    marginTop: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  addSubButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  databaseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  databaseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  categoryList: {
    marginBottom: 16,
  },
  categorySelector: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedCategory: {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF8FF",
  },
  categorySelectorIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categorySelectorText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  subcategoryList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  subcategorySelector: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedSubcategory: {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF8FF",
  },
  subcategorySelectorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  subcategorySelectorCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  importSection: {
    alignItems: "center",
    padding: 20,
  },
  importTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  importDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#3B82F6",
    marginBottom: 16,
  },
  importButtonText: {
    fontSize: 16,
    color: "#3B82F6",
    marginLeft: 8,
  },
  importNote: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    fontStyle: "italic",
  },
});