import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { servicesData } from "@/data/services";

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface Subcategory {
  id: string;
  name: string;
  details: string;
  image: string;
  providerCount: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string[];
  subcategories: Subcategory[];
}

interface Service {
  id: string;
  name: string;
  category: string;
  subcategoryId: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  timing: string;
  phone?: string;
  features?: string[];
}

interface ServicesContextType {
  categories: Category[];
  banners: Banner[];
  services: Service[];
  featuredServices: Service[];
  addBanner: (banner: Omit<Banner, "id">) => void;
  removeBanner: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subcategory: Omit<Subcategory, "id">) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => void;
  removeSubcategory: (categoryId: string, subcategoryId: string) => void;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;
  searchServices: (query: string, categoryId: string | null) => Service[];
  getServicesBySubcategory: (subcategoryId: string) => Service[];
  getServiceById: (id: string) => Service | undefined;
  getSubcategoryById: (id: string) => Subcategory | undefined;
}

export const [ServicesProvider, useServices] = createContextHook<ServicesContextType>(() => {
  const [categories, setCategories] = useState<Category[]>(servicesData.categories);
  const [services, setServices] = useState<Service[]>(servicesData.services);
  const [banners, setBanners] = useState<Banner[]>(servicesData.banners);

  const loadData = useCallback(async () => {
    try {
      const storedBanners = await AsyncStorage.getItem("banners");
      if (storedBanners) {
        setBanners(JSON.parse(storedBanners));
      }
      
      const storedCategories = await AsyncStorage.getItem("categories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
      
      const storedServices = await AsyncStorage.getItem("services");
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveBanners = async (newBanners: Banner[]) => {
    try {
      await AsyncStorage.setItem("banners", JSON.stringify(newBanners));
    } catch (error) {
      console.error("Error saving banners:", error);
    }
  };

  const saveCategories = async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem("categories", JSON.stringify(newCategories));
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const saveServices = async (newServices: Service[]) => {
    try {
      await AsyncStorage.setItem("services", JSON.stringify(newServices));
    } catch (error) {
      console.error("Error saving services:", error);
    }
  };

  const addBanner = useCallback((banner: Omit<Banner, "id">) => {
    const newBanner: Banner = {
      ...banner,
      id: Date.now().toString(),
    };
    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    saveBanners(updatedBanners);
  }, [banners]);

  const removeBanner = useCallback((id: string) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    setBanners(updatedBanners);
    saveBanners(updatedBanners);
  }, [banners]);

  // Category management
  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  }, [categories]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  }, [categories]);

  const removeCategory = useCallback((id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    // Also remove services in this category
    const categoryName = categories.find(cat => cat.id === id)?.name;
    if (categoryName) {
      const updatedServices = services.filter(service => service.category !== categoryName);
      setServices(updatedServices);
      saveServices(updatedServices);
    }
  }, [categories, services]);

  // Subcategory management
  const addSubcategory = useCallback((categoryId: string, subcategory: Omit<Subcategory, "id">) => {
    const newSubcategory: Subcategory = {
      ...subcategory,
      id: `sub_${Date.now()}`,
    };
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSubcategory]
        };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  }, [categories]);

  const updateSubcategory = useCallback((categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub => 
            sub.id === subcategoryId ? { ...sub, ...updates } : sub
          )
        };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  }, [categories]);

  const removeSubcategory = useCallback((categoryId: string, subcategoryId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
        };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    // Also remove services in this subcategory
    const updatedServices = services.filter(service => service.subcategoryId !== subcategoryId);
    setServices(updatedServices);
    saveServices(updatedServices);
  }, [categories, services]);

  // Service management
  const addService = useCallback((service: Omit<Service, "id">) => {
    const newService: Service = {
      ...service,
      id: `srv_${Date.now()}`,
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveServices(updatedServices);
  }, [services]);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    );
    setServices(updatedServices);
    saveServices(updatedServices);
  }, [services]);

  const removeService = useCallback((id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveServices(updatedServices);
  }, [services]);

  const searchServices = useCallback((query: string, categoryId: string | null) => {
    return services.filter(service => {
      const matchesQuery = query.length === 0 || 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !categoryId || 
        categories.find(cat => cat.id === categoryId)?.name === service.category;
      
      return matchesQuery && matchesCategory;
    });
  }, [services, categories]);

  const getServicesBySubcategory = useCallback((subcategoryId: string) => {
    return services.filter(service => service.subcategoryId === subcategoryId);
  }, [services]);

  const getServiceById = useCallback((id: string) => {
    return services.find(service => service.id === id);
  }, [services]);

  const getSubcategoryById = useCallback((id: string) => {
    for (const category of categories) {
      const subcategory = category.subcategories.find(sub => sub.id === id);
      if (subcategory) return subcategory;
    }
    return undefined;
  }, [categories]);

  const featuredServices = useMemo(() => services.slice(0, 5), [services]);

  return useMemo(() => ({
    categories,
    banners,
    services,
    featuredServices,
    addBanner,
    removeBanner,
    addCategory,
    updateCategory,
    removeCategory,
    addSubcategory,
    updateSubcategory,
    removeSubcategory,
    addService,
    updateService,
    removeService,
    searchServices,
    getServicesBySubcategory,
    getServiceById,
    getSubcategoryById,
  }), [
    categories,
    banners,
    services,
    featuredServices,
    addBanner,
    removeBanner,
    addCategory,
    updateCategory,
    removeCategory,
    addSubcategory,
    updateSubcategory,
    removeSubcategory,
    addService,
    updateService,
    removeService,
    searchServices,
    getServicesBySubcategory,
    getServiceById,
    getSubcategoryById,
  ]);
});