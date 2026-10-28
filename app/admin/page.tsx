"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { DOOR_PRODUCTS, DoorProduct, CATEGORIES } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/lib/settings";
import {
  LayoutDashboard,
  Package,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Globe,
  Settings,
  BadgeCheck,
  Search,
  ArrowLeft,
  Save,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ExternalLink,
  Building2,
  MapPin,
  Phone,
  MessageSquare,
  TrendingUp,
  X,
  Copy,
  RotateCcw,
  UploadCloud,
  Loader2,
  Database,
  RefreshCw,
  Film,
  Play,
  Video,
  Users,
  UserPlus,
  Shield,
  Truck,
  ChevronDown,
  ChevronRight,
  Menu,
  Image as ImageIcon,
  Layers,
  FolderOpen,
  Calendar,
  Check,
} from "lucide-react";

export const CATEGORY_DEFAULT_SPECS: Record<string, Record<string, string>> = {
  "security-doors": {
    "Material": "Cold-Rolled Electro-Galvanized Steel",
    "Steel Gauge": "2.0mm Frame / 1.5mm Leaf",
    "Dimensions": "3ft x 7ft (900mm x 2100mm)",
    "Locking Mechanism": "14-Point Heavy Duty Deadbolt System",
    "Infill Core": "High-Density Rockwool Acoustic Insulation",
    "Frame Depth": "150mm Reinforced Structural Jamb",
  },
  "luxury-doors": {
    "Material": "Cast Aluminium Composite & Armoured Steel Core",
    "Leaf Thickness": "80mm Heavy Security Slab",
    "Dimensions": "4ft x 7ft or 4.5ft x 7ft Double Leaf",
    "Locking System": "Multi-Point Concealed Master Locking System",
    "Weather Finish": "Rust-Resistant UV Architectural Coating",
  },
  "hdf-doors": {
    "Material": "High-Density Fiberboard (HDF) with Solid Wood Infill",
    "Door Leaf Thickness": "45mm",
    "Finish": "Scratch-Resistant Melamine Finish",
    "Frame Included": "Matching Pre-Hung Frame Set with Architraves",
    "Dimensions": "3ft x 7ft (840mm x 2100mm)",
  },
  "interior-doors": {
    "Material": "Solid Wood Infill with Engineered Veneer Face",
    "Door Leaf Thickness": "40mm - 45mm",
    "Hardware Included": "Mortise Lockset with 3 Stainless Steel Hinges",
    "Dimensions": "3ft x 7ft (840mm x 2100mm)",
  },
  "bathroom-doors": {
    "Material": "100% Waterproof WPC / Polymer Composite",
    "Moisture Resistance": "100% Waterproof, Termite-Proof & Rot-Free",
    "Dimensions": "2.5ft x 7ft (750mm x 2100mm)",
    "Locking Hardware": "Corrosion-Proof Bathroom Privacy Lockset",
  },
  "sanitary-fittings": {
    "Product Type": "Executive Ceramic Water Closet (WC)",
    "Flushing System": "Dual-Flush Tornado Rimless Siphon",
    "Roughing-in": "300mm / 400mm Floor S-Trap Outlet",
    "Material": "Nanotech Self-Cleaning Glazed Ceramic",
    "Seat Mechanism": "Soft-Closing Heavy-Duty UF Seat Cover",
  },
  "bathrooms": {
    "Product Type": "Luxury Vanity Cabinet / Ceramic Wash Basin",
    "Material": "Waterproof Solid Plywood / High-Gloss Ceramic",
    "Mounting Type": "Wall-Hung or Free-Standing",
    "Hardware": "Soft-Close DTC Stainless Steel Hinges",
  },
  "paint": {
    "Product Type": "Premium Architectural Wall Finish",
    "Coverage": "10 - 12 sq meters per litre",
    "Drying Time": "Touch dry in 2 hours / Recoat in 4 hours",
    "Application": "Interior and Exterior Masonry Surfaces",
  },
  "roof-tiles": {
    "Material": "Stone Coated Galvanized Steel Sheet",
    "Gauge / Thickness": "0.45mm - 0.55mm",
    "Profile": "Bond / Classic / Shingle / Roman",
    "Durability": "50 Years Anti-Rust Guarantee",
  },
};

interface CloudinaryAsset {
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  resource_type: string;
}

const getAdminThumbnailUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/w_300,h_300,c_fill,q_auto,f_auto/");
  }
  return url;
};

export default function AdminPage() {
  const { settings, updateSettings, products, setProducts } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // WordPress-Style Navigation State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "inventory" | "media" | "delivery" | "team" | "settings" | "cac"
  >("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [navDropdowns, setNavDropdowns] = useState<Record<string, boolean>>({
    products: true,
    media: true,
    delivery: false,
    team: false,
    settings: false,
  });

  const toggleDropdown = (key: string) => {
    setNavDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Products State
  const [productsList, setProductsList] = useState<DoorProduct[]>(products);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync productsList with latest products from context
  useEffect(() => {
    if (products && products.length > 0) {
      setProductsList(products);
    }
  }, [products]);

  // Team & Role Management State
  const [currentUser, setCurrentUser] = useState<{ email: string; role: "admin" | "editor" } | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    email: string;
    name: string;
    role: "admin" | "editor" | "user";
    joinDate: string;
    isSuperAdmin?: boolean;
  }>>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [newEditorName, setNewEditorName] = useState("");
  const [newEditorEmail, setNewEditorEmail] = useState("");
  const [newEditorPassword, setNewEditorPassword] = useState("");
  const [newEditorRole, setNewEditorRole] = useState<"editor" | "admin">("editor");
  const [isSubmittingEditor, setIsSubmittingEditor] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState<string | null>(null);

  // Cloudinary Media Library State
  const [mediaItems, setMediaItems] = useState<CloudinaryAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaResourceType, setMediaResourceType] = useState<"image" | "video">("image");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"main_photo" | "gallery">("main_photo");
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);

  // Form Fields for Products
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [formCategory, setFormCategory] = useState<DoorProduct["category"]>("security-doors");
  const [formGroup, setFormGroup] = useState<string>("doors");
  const [formSubcategory, setFormSubcategory] = useState<string>("Heavy Duty Armored Security Doors");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formPriceOnRequest, setFormPriceOnRequest] = useState(false);
  const [formPriceMode, setFormPriceMode] = useState<"show_price" | "price_on_request" | "blank">("blank");
  const [formPriceValidUntil, setFormPriceValidUntil] = useState<string>("");
  const [formImage, setFormImage] = useState("");
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formVideo, setFormVideo] = useState<string>("");
  const [formBadge, setFormBadge] = useState("In Stock");
  const [formStock, setFormStock] = useState<number>(10);
  const [formStockStatus, setFormStockStatus] = useState<DoorProduct["stockStatus"]>("in_stock");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formJijiUrl, setFormJijiUrl] = useState("https://jiji.ng/shop/anambrabestdoor");
  const [formActive, setFormActive] = useState(true);

  // Dynamic Specifications State
  const [formSpecs, setFormSpecs] = useState<Record<string, string>>({
    Material: "Cold-Rolled Electro-Galvanized Steel",
    "Steel Gauge": "2.0mm Frame / 1.5mm Leaf",
    Dimensions: "3ft x 7ft (900mm x 2100mm)",
    "Locking Mechanism": "14-Point Heavy Duty Deadbolt System",
  });

  // SEO Fields
  const [focusKeyphrase, setFocusKeyphrase] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Settings State
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);

  // Media Upload States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);

  // Sync statuses
  const [cloudinarySyncStatus, setCloudinarySyncStatus] = useState<{
    loading: boolean;
    message: string | null;
    error?: string | null;
  }>({ loading: false, message: null, error: null });

  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<{
    loading: boolean;
    message: string | null;
    error?: string | null;
  }>({ loading: false, message: null, error: null });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  // Check auth session
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setCurrentUser({ email: data.email, role: data.role });
            fetchTeamMembers();
            return;
          }
        }
        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    setSiteSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (activeTab === "media") {
      fetchCloudinaryMedia(mediaResourceType);
    }
  }, [activeTab, mediaResourceType]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTeamMembers = async () => {
    setLoadingTeam(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const fetchCloudinaryMedia = async (type: "image" | "video" = "image") => {
    setLoadingMedia(true);
    try {
      const res = await fetch(`/api/admin/cloudinary/resources?resource_type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.resources || []);
      }
    } catch (err) {
      console.error("Failed to fetch Cloudinary media:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleDeleteCloudinaryMedia = async (publicId: string, resourceType: string = "image") => {
    if (!confirm(`Are you sure you want to permanently delete this media file?`)) {
      return;
    }
    setDeletingPublicId(publicId);
    try {
      const res = await fetch(
        `/api/admin/cloudinary/resources?public_id=${encodeURIComponent(publicId)}&resource_type=${resourceType}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMediaItems((prev) => prev.filter((m) => m.public_id !== publicId));
        showToast("File deleted from media library!");
      } else {
        alert("Failed to delete media file.");
      }
    } catch {
      alert("Network error while deleting media.");
    } finally {
      setDeletingPublicId(null);
    }
  };

  const handleSelectMediaFromPicker = (item: CloudinaryAsset) => {
    if (mediaPickerMode === "main_photo") {
      setFormImage(item.url);
      setImageUploadSuccess(true);
      showToast("Photo selected from media library!");
    } else {
      setFormGallery((prev) => [...prev, item.url]);
      showToast("Photo added to product gallery!");
    }
    setMediaPickerOpen(false);
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEditorEmail.trim() || !newEditorPassword.trim()) {
      setTeamError("Email and password are required.");
      return;
    }
    setTeamError(null);
    setTeamSuccess(null);
    setIsSubmittingEditor(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEditorName.trim() || newEditorEmail.split("@")[0],
          email: newEditorEmail.trim().toLowerCase(),
          password: newEditorPassword,
          role: newEditorRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTeamError(data.error || "Failed to create team member.");
      } else {
        setTeamSuccess(`Account created for ${newEditorEmail} as ${newEditorRole === "admin" ? "Administrator" : "Editor"}.`);
        setNewEditorName("");
        setNewEditorEmail("");
        setNewEditorPassword("");
        fetchTeamMembers();
        showToast("New team member added!");
      }
    } catch {
      setTeamError("Network error while creating account.");
    } finally {
      setIsSubmittingEditor(false);
    }
  };

  const handleDeleteTeamMember = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}? They will no longer have access to the dashboard.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to remove user.");
      } else {
        showToast("Account removed.");
        fetchTeamMembers();
      }
    } catch {
      alert("Network error removing user.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const email = loginEmail.trim();
    if (!email) {
      setLoginError("Please enter your admin email address.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your admin password.");
      return;
    }

    setIsSubmittingLogin(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: loginPassword,
          rememberMe: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setLoginError(data.error || "Invalid credentials. Please verify your email and password.");
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser({ email: data.user?.email || email, role: data.user?.role || "admin" });
      setLoginPassword("");
      fetchTeamMembers();
      showToast(`Signed in as ${data.user?.role === "admin" ? "Administrator" : "Editor"}`);
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("abd_admin_auth");
    showToast("Signed out successfully.");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      alert("Please enter the email address associated with your admin account.");
      return;
    }
    setForgotStatus("Reset instructions sent to your registered email and WhatsApp line.");
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotStatus(null);
    }, 4000);
  };

  // Open editor for a new product
  const handleNewProduct = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setIsSlugCustomized(false);
    setFormCategory("security-doors");
    setFormGroup("doors");
    setFormSubcategory("Heavy Duty Armored Security Doors");
    setFormPrice(0);
    setFormOriginalPrice(0);
    setFormPriceOnRequest(false);
    setFormPriceMode("blank");
    setFormPriceValidUntil("");
    setFormImage("");
    setFormGallery([]);
    setFormVideo("");
    setFormBadge("In Stock");
    setFormStock(15);
    setFormStockStatus("in_stock");
    setFormShortDesc("");
    setFormDescription("");
    setFormJijiUrl("https://jiji.ng/shop/anambrabestdoor");
    setFormActive(true);
    setFormSpecs(CATEGORY_DEFAULT_SPECS["security-doors"]);
    setFocusKeyphrase("");
    setSeoTitle("");
    setSeoDescription("");
    setActiveTab("products");
  };

  // Open editor for existing product
  const handleEditProduct = (prod: DoorProduct) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setFormName(prod.name);
    setFormSlug(prod.slug);
    setIsSlugCustomized(true);
    setFormCategory(prod.category);
    setFormGroup(prod.group || (prod.category === "sanitary-fittings" ? "sanitary" : "doors"));
    setFormSubcategory(prod.subcategory || "");
    setFormPrice(prod.price || 0);
    setFormOriginalPrice(prod.originalPrice || 0);
    const initialPriceMode: "show_price" | "price_on_request" | "blank" =
      prod.priceMode || (prod.priceOnRequest ? "price_on_request" : (!prod.price || prod.price === 0 ? "blank" : "show_price"));
    setFormPriceMode(initialPriceMode);
    setFormPriceOnRequest(initialPriceMode === "price_on_request");
    setFormPriceValidUntil(prod.priceValidUntil || "");
    setFormImage(prod.image);
    setFormGallery(prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image]);
    setFormVideo(prod.video || (prod.videos && prod.videos[0]) || "");
    setFormBadge(prod.badge || "");
    setFormStock(prod.stock);
    setFormStockStatus(prod.stockStatus);
    setFormShortDesc(prod.shortDescription);
    setFormDescription(prod.description);
    setFormJijiUrl(prod.jijiUrl || "");
    setFormActive(prod.active);
    setFormSpecs(prod.specifications || CATEGORY_DEFAULT_SPECS[prod.category] || {});
    setFocusKeyphrase(prod.focusKeyphrase || "");
    setSeoTitle(prod.seoTitle || "");
    setSeoDescription(prod.seoDescription || "");
    setActiveTab("products");
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleTitleChange = (val: string) => {
    setFormName(val);
    if (!isSlugCustomized) {
      setFormSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(`${val} | Anambra Best Door`);
    }
    if (!focusKeyphrase) {
      setFocusKeyphrase(val.split(" ").slice(0, 3).join(" "));
    }
  };

  // Category change with adaptive specifications
  const handleCategoryChange = (newCat: DoorProduct["category"]) => {
    setFormCategory(newCat);
    if (newCat === "sanitary-fittings" || newCat === "bathrooms") {
      setFormGroup("sanitary");
    } else if (newCat === "paint" || newCat === "roof-tiles") {
      setFormGroup("materials");
    } else if (newCat === "real-estate") {
      setFormGroup("properties");
    } else if (newCat === "careers") {
      setFormGroup("careers");
    } else {
      setFormGroup("doors");
    }

    if (newCat === "paint") setFormSubcategory("Wall Finishes & Screeding Paint");
    else if (newCat === "roof-tiles") setFormSubcategory("Stone Coated Roof Tiles");
    else if (newCat === "bathrooms" || newCat === "sanitary-fittings") setFormSubcategory("Sanitary Wares & Bath Fixtures");
    else if (newCat === "real-estate") setFormSubcategory("Commercial & Residential Property");
    else if (newCat === "careers") setFormSubcategory("Skilled Fabrication & Sales Vacancy");
    else if (newCat === "security-doors") setFormSubcategory("Heavy Duty Armored Security Doors");
    else if (newCat === "hdf-doors") setFormSubcategory("Foreign HDF Luxury Doors");
    else if (newCat === "bathroom-doors") setFormSubcategory("Waterproof Polymer Bathroom Doors");

    // Automatically adapt specifications if current specs are empty or default
    if (!editingId && CATEGORY_DEFAULT_SPECS[newCat]) {
      setFormSpecs(CATEGORY_DEFAULT_SPECS[newCat]);
    }
  };

  const handleLoadDefaultSpecs = () => {
    if (CATEGORY_DEFAULT_SPECS[formCategory]) {
      setFormSpecs(CATEGORY_DEFAULT_SPECS[formCategory]);
      showToast(`Loaded standard specifications for ${formCategory}`);
    }
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Product name is required.");
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === formCategory);
    const categoryLabel = catObj ? catObj.name : "Doors";
    const cleanSlug = slugify(formSlug) || slugify(formName) || `door-${Date.now()}`;

    const newProd: DoorProduct = {
      id: editingId || `door-${Date.now()}`,
      slug: cleanSlug,
      name: formName.trim(),
      group: formGroup,
      subcategory: formSubcategory,
      category: formCategory,
      categoryLabel,
      price: formPriceMode === "show_price" && Number(formPrice) > 0 ? Number(formPrice) : undefined,
      originalPrice: formPriceMode === "show_price" && Number(formOriginalPrice) > 0 ? Number(formOriginalPrice) : undefined,
      priceOnRequest: formPriceMode === "price_on_request",
      priceMode: formPriceMode,
      priceValidUntil: formPriceMode === "show_price" && formPriceValidUntil.trim() ? formPriceValidUntil.trim() : undefined,
      image: formImage.trim() || (formGallery.length > 0 ? formGallery[0] : ""),
      gallery: formGallery.length > 0 ? formGallery : (formImage.trim() ? [formImage.trim()] : []),
      video: formVideo.trim() || undefined,
      videos: formVideo.trim() ? [formVideo.trim()] : undefined,
      badge: formBadge,
      stockStatus: formStockStatus,
      stock: Number(formStock),
      shortDescription: formShortDesc,
      description: formDescription,
      specifications: formSpecs,
      jijiUrl: formJijiUrl,
      seoTitle: seoTitle || `${formName} | Anambra Best Door`,
      seoDescription: seoDescription || formShortDesc,
      focusKeyphrase: focusKeyphrase || formName,
      active: formActive,
    };

    if (editingId) {
      const updated = productsList.map((p) => (p.id === editingId ? newProd : p));
      setProductsList(updated);
      setProducts(updated);
      showToast("Product updated successfully!");

      fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      }).catch((err) => console.error("Failed to update product on server:", err));
    } else {
      const updated = [newProd, ...productsList];
      setProductsList(updated);
      setProducts(updated);
      showToast("New product created and published!");

      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      }).catch((err) => console.error("Failed to persist new product to server:", err));
    }

    setIsEditing(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from catalogue?")) {
      const updated = productsList.filter((p) => p.id !== id);
      setProductsList(updated);
      setProducts(updated);
      showToast("Product deleted.");

      fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).catch((err) => console.error("Failed to delete product on server:", err));
    }
  };

  const handleResetCatalog = () => {
    if (confirm("Reset catalog back to initial factory inventory with blank prices? Any custom added doors will be cleared.")) {
      setProductsList(DOOR_PRODUCTS);
      setProducts(DOOR_PRODUCTS);
      localStorage.removeItem("abd_products");
      localStorage.setItem("abd_catalog_version", "2026-10-blank-prices");
      showToast("Catalogue reset to initial state!");
    }
  };

  const handleToggleSoldOut = (id: string) => {
    let changedProd: DoorProduct | null = null;
    const updated: DoorProduct[] = productsList.map((p) => {
      if (p.id === id) {
        const nextStatus: DoorProduct["stockStatus"] =
          p.stockStatus === "in_stock" ? "out_of_stock" : "in_stock";
        changedProd = { ...p, stockStatus: nextStatus };
        return changedProd;
      }
      return p;
    });
    setProductsList(updated);
    setProducts(updated);
    showToast("Stock status updated.");

    if (changedProd) {
      fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedProd),
      }).catch((err) => console.error("Failed to update stock status on server:", err));
    }
  };

  // Upload helpers
  const processImageFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Photo size exceeds the 5MB limit. Please upload an image under 5MB.");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);
    setImageUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anambra_best_door/products");

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload photo to server.");
      }

      if (data.url) {
        setFormImage(data.url);
        setImageUploadSuccess(true);
        showToast("Photo uploaded to media library successfully!");
      }
    } catch (err: any) {
      setImageUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processGalleryFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploadingGallery(true);
    setGalleryUploadError(null);

    try {
      const newUrls: string[] = [];
      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image (JPG, PNG, WEBP).`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds the 5MB limit.`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "anambra_best_door/products");

        const res = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
        if (data.url) newUrls.push(data.url);
      }

      if (newUrls.length > 0) {
        setFormGallery((prev) => [...prev, ...newUrls]);
        showToast(`Added ${newUrls.length} photo(s) to product gallery.`);
      }
    } catch (err: any) {
      setGalleryUploadError(err.message || "Failed to upload gallery images.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processGalleryFiles(e.target.files);
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setFormGallery((prev) => prev.filter((_, i) => i !== idxToRemove));
  };

  const processVideoFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Please upload a video file (MP4, WEBM).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setVideoUploadError("Video size exceeds the 10MB limit. Please compress under 10MB.");
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadError(null);
    setVideoUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anambra_best_door/videos");

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload video.");
      }
      if (data.url) {
        setFormVideo(data.url);
        setVideoUploadSuccess(true);
        showToast("Video uploaded and connected to product!");
      }
    } catch (err: any) {
      setVideoUploadError(err.message || "Failed to upload video.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(siteSettingsForm);
    showToast("Settings updated successfully!");
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [productsList, searchQuery, selectedCategory]);

  const discountPercent = useMemo(() => {
    if (formPriceMode !== "show_price") return 0;
    if (formOriginalPrice > 0 && formPrice > 0 && formOriginalPrice > formPrice) {
      return Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100);
    }
    return 0;
  }, [formPrice, formOriginalPrice, formPriceMode]);

  const seoScore = useMemo(() => {
    let score = 0;
    if (formName.trim().length >= 5) score += 20;
    if (seoTitle.trim().length >= 15 && seoTitle.trim().length <= 65) score += 25;
    if (seoDescription.trim().length >= 50 && seoDescription.trim().length <= 160) score += 25;
    if (focusKeyphrase.trim().length >= 3) score += 15;
    if (formImage.trim() || formGallery.length > 0) score += 15;
    return score;
  }, [formName, seoTitle, seoDescription, focusKeyphrase, formImage, formGallery]);

  // Loading Screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2563EB]" />
          <p className="text-xs font-semibold text-slate-300">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="relative w-14 h-14 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-md border border-slate-700/60 flex items-center justify-center">
              <Image
                src="/favicon.png"
                alt="Anambra Best Door"
                width={48}
                height={48}
                className="rounded-xl object-contain"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Anambra Best Door Admin
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to manage products, prices, media, and regional dispatch.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#003296]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#003296]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-slate-400 hover:text-white"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 px-4 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isSubmittingLogin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Reset Admin Password</h3>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Back to login
                </button>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003296] text-white text-xs font-bold rounded-xl"
                >
                  Send Reset Link
                </button>
              </form>
              {forgotStatus && (
                <p className="text-xs text-emerald-400">{forgotStatus}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED WORDPRESS-STYLE VERTICAL DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-3 py-2.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 h-14">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white p-0.5 shadow-xs border border-slate-700/60 flex items-center justify-center shrink-0">
            <Image
              src="/favicon-48x48.png"
              alt="Anambra Best Door"
              width={22}
              height={22}
              className="rounded-md object-contain"
            />
          </div>
          <span className="font-bold text-xs text-white">Anambra Best Door</span>
        </div>

        <Link
          href="/shop"
          target="_blank"
          className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center space-x-1 px-2.5 py-1 bg-slate-800 rounded-lg"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-[#2563EB]" />
        </Link>
      </div>

      {/* Mobile Drawer Backdrop (Anchored below header) */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-x-0 top-14 bottom-0 bg-black/60 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* WordPress-Style Left Vertical Sidebar (Anchored below header on mobile) */}
      <aside
        className={`fixed md:sticky top-14 md:top-0 left-0 z-40 h-[calc(100vh-3.5rem)] md:h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand / Logo Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-white p-1 shadow-xs border border-slate-700/60 flex items-center justify-center shrink-0">
              <Image
                src="/favicon-48x48.png"
                alt="Anambra Best Door"
                width={26}
                height={26}
                className="rounded-lg object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-xs text-white block leading-tight">Anambra Best Door</span>
              <span className="text-[10px] text-slate-400 block">CFrank Enterprise Admin</span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vertical Nav List with Collapsible Dropdowns */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsEditing(false);
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#003296] text-white shadow-xs"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Products Group */}
          <div>
            <button
              onClick={() => toggleDropdown("products")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Package className="w-3.5 h-3.5" />
                <span>Products</span>
              </div>
              {navDropdowns.products ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {navDropdowns.products && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "products" && !isEditing
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All Products ({productsList.length})
                </button>
                <button
                  onClick={() => {
                    handleNewProduct();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    isEditing && !editingId
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Add New Product</span>
                  <Plus className="w-3 h-3 text-[#2563EB]" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("inventory");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "inventory"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Stock & Availability
                </button>
              </div>
            )}
          </div>

          {/* Media Library Group */}
          <div>
            <button
              onClick={() => toggleDropdown("media")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library</span>
              </div>
              {navDropdowns.media ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {navDropdowns.media && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  onClick={() => {
                    setActiveTab("media");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "media"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Media Storage
                </button>
              </div>
            )}
          </div>

          {/* Warehouses & Delivery Group */}
          <div>
            <button
              onClick={() => toggleDropdown("delivery")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Truck className="w-3.5 h-3.5" />
                <span>Warehouses & Delivery</span>
              </div>
              {navDropdowns.delivery ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {navDropdowns.delivery && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  onClick={() => {
                    setActiveTab("delivery");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "delivery"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Regional Delivery Schedules
                </button>
              </div>
            )}
          </div>

          {/* Team Group */}
          <div>
            <button
              onClick={() => toggleDropdown("team")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-3.5 h-3.5" />
                <span>Team & Staff</span>
              </div>
              {navDropdowns.team ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {navDropdowns.team && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  onClick={() => {
                    setActiveTab("team");
                    fetchTeamMembers();
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "team"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All Users ({teamMembers.length})
                </button>
              </div>
            )}
          </div>

          {/* Settings & Compliance Group */}
          <div>
            <button
              onClick={() => toggleDropdown("settings")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </div>
              {navDropdowns.settings ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {navDropdowns.settings && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Store Info & Addresses
                </button>
                <button
                  onClick={() => {
                    setActiveTab("cac");
                    setIsEditing(false);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "cac"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  CAC Legal Verification
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer with User Profile and Storefront Link */}
        <div className="p-3 border-t border-slate-800 space-y-2 text-xs">
          <Link
            href="/shop"
            target="_blank"
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-semibold">View Storefront</span>
            </div>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">Live</span>
          </Link>

          <div className="px-2 py-1 flex items-center justify-between text-[11px]">
            <div className="truncate mr-2">
              <span className="font-bold text-white block truncate">{currentUser?.email || "Admin"}</span>
              <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                {currentUser?.role === "admin" ? "Administrator" : "Editor"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Floating Toast Notice */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Media Picker Modal */}
        {mediaPickerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMediaPickerOpen(false);
            }}
          >
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {mediaPickerMode === "main_photo" ? "Select Main Product Photo" : "Add Photos to Gallery"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Click any uploaded photo from your media library
                  </p>
                </div>
                <button
                  onClick={() => setMediaPickerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingMedia ? (
                  <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#003296]" />
                    <span>Loading media files...</span>
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                    <p className="font-bold text-slate-700">No media files found</p>
                    <p className="text-slate-400">Upload product photos from your device using the upload box.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {mediaItems.map((item) => (
                      <button
                        key={item.public_id}
                        type="button"
                        onClick={() => handleSelectMediaFromPicker(item)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-[#003296] hover:ring-2 hover:ring-[#003296]/30 group transition-all cursor-pointer bg-slate-100"
                      >
                        <Image
                          src={getAdminThumbnailUrl(item.url)}
                          alt={item.public_id}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                          Select
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-500 text-[11px]">
                  Showing {mediaItems.length} media files
                </span>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* VIEW: DASHBOARD OVERVIEW                                                  */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && !isEditing && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
                <p className="text-xs text-slate-500">
                  Quick operational metrics for Anambra Best Door and CFrank Enterprise.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Products
                  </span>
                  <span className="text-3xl font-black text-[#003296] block">
                    {productsList.length}
                  </span>
                  <span className="text-[11px] text-slate-400">Across all building categories</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    In Stock
                  </span>
                  <span className="text-3xl font-black text-emerald-600 block">
                    {productsList.filter((p) => p.stockStatus === "in_stock").length}
                  </span>
                  <span className="text-[11px] text-slate-400">Ready for warehouse loading</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Out of Stock / Sold
                  </span>
                  <span className="text-3xl font-black text-amber-600 block">
                    {productsList.filter((p) => p.stockStatus === "out_of_stock").length}
                  </span>
                  <span className="text-[11px] text-slate-400">Requires re-stocking</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Staff & Editors
                  </span>
                  <span className="text-3xl font-black text-slate-900 block">
                    {teamMembers.length || 1}
                  </span>
                  <span className="text-[11px] text-slate-400">Authorized portal users</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleNewProduct}
                    className="py-2.5 px-4 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("media");
                      fetchCloudinaryMedia();
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-600" />
                    <span>Open Media Library</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("delivery")}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-slate-600" />
                    <span>Update Regional Delivery Schedule</span>
                  </button>
                  <Link
                    href="/shop"
                    target="_blank"
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                    <span>View Public Storefront</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PRODUCT EDITING / CREATION SCREEN (WORDPRESS 2-COLUMN LAYOUT)       */}
          {/* ========================================================================= */}
          {isEditing && (
            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Sticky Top Action Header */}
              <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-xs py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 shadow-2xs -mt-2 mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-xl font-black text-slate-900">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h1>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingId ? "Update Product" : "Publish Product"}</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Main Column: Product Content & Specs */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Title & Slug */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Heavy-Gauge Turkish Steel Security Door or Luxury Water Closet"
                        className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        URL Slug
                      </label>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                        <span className="hidden sm:inline">/products/</span>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={(e) => {
                            setFormSlug(e.target.value);
                            setIsSlugCustomized(true);
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Short Summary Description
                      </label>
                      <input
                        type="text"
                        value={formShortDesc}
                        onChange={(e) => setFormShortDesc(e.target.value)}
                        placeholder="Key specifications summarized in one punchy sentence for product cards."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Full Product Details & Description
                      </label>
                      <textarea
                        rows={5}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Detailed construction specifications, steel thickness, locking hardware, and fitting notes."
                        className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Category-Adaptive Specifications & Custom Attribute Builder */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Product Specifications & Attributes
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Dynamic attributes adapted for {formCategory}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecs}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#003296] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                        >
                          Load Standard Specs
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormSpecs({
                              ...formSpecs,
                              [`Custom Spec ${Object.keys(formSpecs).length + 1}`]: "",
                            })
                          }
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Field</span>
                        </button>
                      </div>
                    </div>

                    {/* Specification Key-Value Rows */}
                    <div className="space-y-2.5">
                      {Object.entries(formSpecs).map(([key, value], idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => {
                              const newSpecs: Record<string, string> = {};
                              Object.entries(formSpecs).forEach(([k, v]) => {
                                if (k === key) {
                                  newSpecs[e.target.value] = v;
                                } else {
                                  newSpecs[k] = v;
                                }
                              });
                              setFormSpecs(newSpecs);
                            }}
                            className="w-1/3 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                            placeholder="Attribute Name (e.g. Material)"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              setFormSpecs({ ...formSpecs, [key]: e.target.value })
                            }
                            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                            placeholder="Specification Value (e.g. S-Trap 300mm / 2.0mm Steel)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = { ...formSpecs };
                              delete newSpecs[key];
                              setFormSpecs(newSpecs);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete Attribute"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Photos & Media Picker */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Main Product Photo
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Upload from device or pick directly from your media library
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Photo Preview Box */}
                      <div className="relative aspect-square max-w-xs rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                        {formImage ? (
                          <Image
                            src={formImage.startsWith("/") || formImage.startsWith("http") ? formImage : `/${formImage}`}
                            alt={formName || "Product photo"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 text-slate-400 text-xs">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                            <span>No photo selected</span>
                          </div>
                        )}
                      </div>

                      {/* Photo Actions */}
                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerMode("main_photo");
                            fetchCloudinaryMedia("image");
                            setMediaPickerOpen(true);
                          }}
                          className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#003296] border border-blue-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>Choose from Media Library</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="w-full py-2.5 px-3 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          {isUploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UploadCloud className="w-4 h-4" />
                          )}
                          <span>Upload from Phone / PC</span>
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFilePick}
                          className="hidden"
                        />

                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            Direct Image URL
                          </label>
                          <input
                            type="text"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Additional Gallery Photos
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Angles and warehouse offloading views ({formGallery.length} photos)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerMode("gallery");
                            fetchCloudinaryMedia("image");
                            setMediaPickerOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#003296] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                        >
                          Pick from Library
                        </button>
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 cursor-pointer"
                        >
                          Upload Files
                        </button>
                      </div>
                    </div>

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilePick}
                      className="hidden"
                    />

                    {formGallery.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {formGallery.map((url, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                          >
                            <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(i)}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">No gallery photos added yet.</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Category, Pricing, Stock, Jiji */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Category Selection */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
                    <label className="text-xs font-bold text-slate-900 block">
                      Product Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => handleCategoryChange(e.target.value as DoorProduct["category"])}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <optgroup label="Doors">
                        <option value="security-doors">Security Doors</option>
                        <option value="hdf-doors">Foreign HDF Doors</option>
                        <option value="interior-doors">Interior Doors</option>
                        <option value="luxury-doors">Luxury Doors</option>
                        <option value="bathroom-doors">Waterproof Bathroom Doors</option>
                      </optgroup>
                      <optgroup label="Sanitary & Bathroom Wares">
                        <option value="sanitary-fittings">Sanitary Wares & Water Closets</option>
                        <option value="bathrooms">Bathroom Vanities & Sinks</option>
                      </optgroup>
                      <optgroup label="Finishes">
                        <option value="paint">Paint & Screeding</option>
                        <option value="roof-tiles">Roof Tiles</option>
                      </optgroup>
                    </select>

                    <label className="text-xs font-bold text-slate-900 block pt-1">
                      Subcategory / Tag
                    </label>
                    <input
                      type="text"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Pricing Mode */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
                    <label className="text-xs font-bold text-slate-900 block">
                      Pricing Display Mode
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          checked={formPriceMode === "show_price"}
                          onChange={() => setFormPriceMode("show_price")}
                          className="w-4 h-4 text-[#003296]"
                        />
                        <span className="font-semibold text-slate-800">Show Specific Price</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          checked={formPriceMode === "price_on_request"}
                          onChange={() => setFormPriceMode("price_on_request")}
                          className="w-4 h-4 text-[#003296]"
                        />
                        <span className="font-semibold text-slate-800">Price on Request</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          checked={formPriceMode === "blank"}
                          onChange={() => setFormPriceMode("blank")}
                          className="w-4 h-4 text-[#003296]"
                        />
                        <span className="font-semibold text-slate-800">Leave Blank / Chat for Price</span>
                      </label>
                    </div>

                    {formPriceMode === "show_price" && (
                      <div className="pt-3 border-t border-slate-100 space-y-2.5">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Selling Price (₦)
                          </label>
                          <input
                            type="number"
                            value={formPrice || ""}
                            onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Original Price (₦)
                          </label>
                          <input
                            type="number"
                            value={formOriginalPrice || ""}
                            onChange={(e) => setFormOriginalPrice(Number(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock & Status */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">
                        Stock Status
                      </label>
                      <select
                        value={formStockStatus}
                        onChange={(e) => setFormStockStatus(e.target.value as DoorProduct["stockStatus"])}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock (Under 5 units)</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="made_to_order">Made to Order</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">
                        Warehouse Units Available
                      </label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Jiji Link */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      Jiji.ng Store Item URL
                    </label>
                    <input
                      type="url"
                      value={formJijiUrl}
                      onChange={(e) => setFormJijiUrl(e.target.value)}
                      placeholder="https://jiji.ng/shop/anambrabestdoor"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Persistent Action Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {editingId ? (
                    <span>Editing: <strong className="text-slate-900">{formName || "Untitled Product"}</strong></span>
                  ) : (
                    <span>Creating new catalogue item</span>
                  )}
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingId ? "Update Product" : "Publish Product"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW: ALL PRODUCTS LIST                                                   */}
          {/* ========================================================================= */}
          {activeTab === "products" && !isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-[#003296]" />
                  <h2 className="text-lg font-black text-slate-900">
                    Product Catalogue ({filteredProducts.length})
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleNewProduct}
                    className="py-2.5 px-4 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by door name, lock type, or category..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3 w-14">Photo</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="p-3">
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 m-auto text-slate-400 stroke-1" />
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                          {p.name}
                        </td>
                        <td className="p-3 text-slate-600">{p.categoryLabel}</td>
                        <td className="p-3 font-semibold text-slate-900">
                          {p.price && p.price > 0 ? `₦${p.price.toLocaleString()}` : "Price on Request"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stockStatus === "in_stock"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 text-slate-600 hover:text-[#003296] rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: STOCK & INVENTORY MANAGEMENT                                        */}
          {/* ========================================================================= */}
          {activeTab === "inventory" && !isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#003296]" />
                <h2 className="text-lg font-black text-slate-900">Stock & Availability Status</h2>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Units in Warehouse</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3 text-right">Quick Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productsList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3 text-slate-700 font-semibold">{p.stock} units</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stockStatus === "in_stock"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.stockStatus === "in_stock" ? "Available" : "Sold Out"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleSoldOut(p.id)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg cursor-pointer"
                          >
                            Mark {p.stockStatus === "in_stock" ? "Sold Out" : "In Stock"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: MEDIA LIBRARY                                                       */}
          {/* ========================================================================= */}
          {activeTab === "media" && !isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-[#003296]" />
                  <h2 className="text-lg font-black text-slate-900">
                    Media Library ({mediaItems.length})
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => setMediaResourceType("image")}
                      className={`px-3 py-1.5 font-bold cursor-pointer ${
                        mediaResourceType === "image"
                          ? "bg-[#003296] text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Images
                    </button>
                    <button
                      onClick={() => setMediaResourceType("video")}
                      className={`px-3 py-1.5 font-bold cursor-pointer ${
                        mediaResourceType === "video"
                          ? "bg-[#003296] text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Videos
                    </button>
                  </div>

                  <button
                    onClick={() => fetchCloudinaryMedia(mediaResourceType)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 cursor-pointer"
                    title="Refresh Media"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMedia ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {loadingMedia ? (
                <div className="py-20 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#003296]" />
                  <span>Fetching files from media storage...</span>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
                  <p className="font-bold text-slate-800">No {mediaResourceType}s found</p>
                  <p className="text-slate-400">Photos and videos uploaded will appear here permanently.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.public_id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square w-full bg-slate-100">
                        {item.resource_type === "video" ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2">
                            <Play className="w-8 h-8 text-white mb-1" />
                            <span className="text-[10px] font-bold uppercase">{item.format} video</span>
                          </div>
                        ) : (
                          <Image src={getAdminThumbnailUrl(item.url)} alt={item.public_id} fill className="object-cover" />
                        )}
                      </div>

                      <div className="p-3 text-[11px] space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block truncate" title={item.public_id}>
                            {item.public_id.split("/").pop()}
                          </span>
                          <span className="text-slate-400 text-[10px] block">
                            {item.width && item.height ? `${item.width}x${item.height} • ` : ""}
                            {item.bytes ? `${Math.round(item.bytes / 1024)} KB` : ""}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 pt-1 border-t border-slate-200">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              showToast("URL copied to clipboard!");
                            }}
                            className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[10px] flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button
                            disabled={deletingPublicId === item.public_id}
                            onClick={() => handleDeleteCloudinaryMedia(item.public_id, item.resource_type)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
                            title="Delete Media File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: REGIONAL DELIVERY & WAREHOUSE SETTINGS                              */}
          {/* ========================================================================= */}
          {activeTab === "delivery" && !isEditing && (
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Truck className="w-5 h-5 text-[#003296]" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Regional Delivery & Warehouse Transit Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Control the dispatch schedules and durations shown on your single product pages and /shipping page.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Delivery Notice Heading
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.deliverySummaryHeading || "Warehouse Direct Dispatch"}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        deliverySummaryHeading: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Delivery Summary Text (Appears on every product page)
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettingsForm.deliverySummaryText || "Same-day loading for South-East and Asaba; 24 to 48 hours for Lagos, Abuja, Port Harcourt and other states."}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        deliverySummaryText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Regional Delivery Schedule Blocks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(siteSettingsForm.deliveryRegions || DEFAULT_SITE_SETTINGS.deliveryRegions || []).map((reg, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Region Name</label>
                          <input
                            type="text"
                            value={reg.name}
                            onChange={(e) => {
                              const updated = [...(siteSettingsForm.deliveryRegions || DEFAULT_SITE_SETTINGS.deliveryRegions || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setSiteSettingsForm({ ...siteSettingsForm, deliveryRegions: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Estimated Duration Badge</label>
                          <input
                            type="text"
                            value={reg.duration}
                            onChange={(e) => {
                              const updated = [...(siteSettingsForm.deliveryRegions || DEFAULT_SITE_SETTINGS.deliveryRegions || [])];
                              updated[idx] = { ...updated[idx], duration: e.target.value };
                              setSiteSettingsForm({ ...siteSettingsForm, deliveryRegions: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Locations Covered</label>
                          <textarea
                            rows={2}
                            value={reg.coverage}
                            onChange={(e) => {
                              const updated = [...(siteSettingsForm.deliveryRegions || DEFAULT_SITE_SETTINGS.deliveryRegions || [])];
                              updated[idx] = { ...updated[idx], coverage: e.target.value };
                              setSiteSettingsForm({ ...siteSettingsForm, deliveryRegions: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    Protective Packaging Note
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettingsForm.deliveryPackagingNote || ""}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        deliveryPackagingNote: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Pre-Dispatch Video & Photo Verification Note
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettingsForm.preDispatchInspectionNote || ""}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        preDispatchInspectionNote: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Delivery Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW: TEAM & USERS                                                        */}
          {/* ========================================================================= */}
          {activeTab === "team" && !isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Users className="w-5 h-5 text-[#003296]" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Team & Content Editor Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create authorized accounts to help manage products, prices, and orders.
                  </p>
                </div>
              </div>

              {/* Add New Editor Form */}
              <form onSubmit={handleCreateTeamMember} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900">Add New Staff Member</h3>
                {teamError && <p className="text-red-600 font-semibold">{teamError}</p>}
                {teamSuccess && <p className="text-emerald-700 font-semibold">{teamSuccess}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={newEditorName}
                    onChange={(e) => setNewEditorName(e.target.value)}
                    placeholder="Staff Full Name"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="email"
                    required
                    value={newEditorEmail}
                    onChange={(e) => setNewEditorEmail(e.target.value)}
                    placeholder="staff@example.com"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="password"
                    required
                    value={newEditorPassword}
                    onChange={(e) => setNewEditorPassword(e.target.value)}
                    placeholder="Assign Password"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <select
                    value={newEditorRole}
                    onChange={(e) => setNewEditorRole(e.target.value as "editor" | "admin")}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEditor}
                  className="py-2 px-4 bg-[#003296] hover:bg-[#002266] text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSubmittingEditor ? "Creating Account..." : "Create Account"}</span>
                </button>
              </form>

              {/* Staff Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Staff Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Joined</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teamMembers.map((m) => (
                      <tr key={m.id || m.email} className="hover:bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-900">{m.name || m.email.split("@")[0]}</td>
                        <td className="p-3 text-slate-600">{m.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-[#003296]"
                            }`}
                          >
                            {m.role === "admin" ? "Administrator" : "Editor"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{m.joinDate || "Active"}</td>
                        <td className="p-3 text-right">
                          {m.isSuperAdmin ? (
                            <span className="text-[10px] text-slate-400 font-semibold">Primary</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteTeamMember(m.email)}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SETTINGS & GENERAL INFO                                             */}
          {/* ========================================================================= */}
          {activeTab === "settings" && !isEditing && (
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Settings className="w-5 h-5 text-[#003296]" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">Store Profile & Warehouse Addresses</h2>
                  <p className="text-xs text-slate-500">
                    Update business details, phone contacts, and physical branch locations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.companyName}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, companyName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent Business</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.parentCompany}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, parentCompany: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Primary Warehouse Address</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.address}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, address: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Second Warehouse / Branch Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.secondAddress || ""}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, secondAddress: e.target.value })
                    }
                    placeholder="e.g. Asaba Delivery Park or Onitsha Main Market Annex"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Market Location Description</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.marketLocation}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, marketLocation: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Sales Number</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Display Phone Number</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.phoneDisplay}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, phoneDisplay: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sales Email</label>
                  <input
                    type="email"
                    required
                    value={siteSettingsForm.salesEmail}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, salesEmail: e.target.value })
                    }
                    placeholder="sales@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={siteSettingsForm.instagramUrl}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, instagramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jiji.ng Shop URL</label>
                  <input
                    type="url"
                    value={siteSettingsForm.jijiShopUrl}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, jijiShopUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block mb-1">
                    WhatsApp Single Product Inquiry Template
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettingsForm.whatsappInquiryTemplate}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        whatsappInquiryTemplate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    WhatsApp Cart Order Template
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettingsForm.whatsappCartTemplate}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        whatsappCartTemplate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Site Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CAC LEGAL COMPLIANCE                                                */}
          {/* ========================================================================= */}
          {activeTab === "cac" && !isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Corporate Affairs Commission (CAC) Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Active legal credentials for CFrank Enterprise (BN 9943925).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registration Number</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">{settings.cacNumber}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className="text-sm font-black text-emerald-600 block mt-0.5">{settings.cacStatus}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Proprietor</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">{settings.proprietor}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2">Page 1: Status Report</span>
                  <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-slate-200">
                    <Image src="/cac-status-report-page1.jpeg" alt="CAC Status Report" fill className="object-cover" />
                  </div>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2">Page 2: Proprietor Particulars</span>
                  <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-slate-200">
                    <Image src="/cac-proprietor-page2.jpeg" alt="CAC Proprietor Particulars" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
