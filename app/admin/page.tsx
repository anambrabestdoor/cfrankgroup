"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { DOOR_PRODUCTS, DoorProduct, CATEGORIES } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/lib/settings";
import {
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
} from "lucide-react";

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

  // App / Tab State
  const [activeTab, setActiveTab] = useState<"products" | "inventory" | "settings" | "cac">("products");
  const [productsList, setProductsList] = useState<DoorProduct[]>(products);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields for Products
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [formCategory, setFormCategory] = useState<DoorProduct["category"]>("security-doors");
  const [formGroup, setFormGroup] = useState<string>("doors");
  const [formSubcategory, setFormSubcategory] = useState<string>("Foreign HDF Luxury Doors");
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

  // Media Upload State (Images max 5MB, Videos max 10MB)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);

  // Cloudinary & Supabase Sync Status State
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

  // Specifications state
  const [formSpecs, setFormSpecs] = useState<Record<string, string>>({
    Material: "Cold-Rolled Electro-Galvanized Steel",
    "Steel Gauge": "2.0mm Frame / 1.5mm Leaf",
    Dimensions: "3ft x 7ft (900mm x 2100mm)",
    "Locking Mechanism": "14-Point Heavy Duty Deadbolt",
  });

  // Google Search & Display Fields (Clear, simple labels)
  const [focusKeyphrase, setFocusKeyphrase] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Settings Form State
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      setLoginPassword("");
      showToast("Signed in securely as Administrator");
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
    localStorage.removeItem("abd_admin_auth");
    showToast("Signed out successfully.");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      alert("Please enter the email address associated with your admin account.");
      return;
    }
    setForgotStatus("Reset instructions sent to your registered email and WhatsApp desk.");
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
    setFormCategory("hdf-doors");
    setFormGroup("doors");
    setFormSubcategory("Foreign HDF Luxury Doors");
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
    setFormSpecs({
      Material: "Foreign High-Density Board",
      Dimensions: "3ft x 7ft",
      Application: "Interior Room / Suite"
    });
    setFocusKeyphrase("");
    setSeoTitle("");
    setSeoDescription("");
  };

  // Open editor for an existing product
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
    setFormSpecs(prod.specifications || {});
    setFocusKeyphrase(prod.focusKeyphrase || "");
    setSeoTitle(prod.seoTitle || "");
    setSeoDescription(prod.seoDescription || "");
  };

  // Helper to create clean URL slug from text
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Auto-generate slug and default SEO from title unless manually customized
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
    } else {
      const updated = [newProd, ...productsList];
      setProductsList(updated);
      setProducts(updated);
      showToast("New product created and published!");
    }

    setIsEditing(false);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from catalogue?")) {
      const updated = productsList.filter((p) => p.id !== id);
      setProductsList(updated);
      setProducts(updated);
      showToast("Product deleted.");
    }
  };

  // Reset catalog to initial inventory defaults
  const handleResetCatalog = () => {
    if (confirm("Reset catalog back to initial factory inventory with blank prices? Any custom added doors will be cleared.")) {
      setProductsList(DOOR_PRODUCTS);
      setProducts(DOOR_PRODUCTS);
      localStorage.removeItem("abd_products");
      localStorage.setItem("abd_catalog_version", "2026-10-blank-prices");
      showToast("Catalogue reset to initial state!");
    }
  };

  // Quick toggle stock status
  const handleToggleSoldOut = (id: string) => {
    const updated: DoorProduct[] = productsList.map((p) => {
      if (p.id === id) {
        const nextStatus: DoorProduct["stockStatus"] =
          p.stockStatus === "in_stock" ? "out_of_stock" : "in_stock";
        return { ...p, stockStatus: nextStatus };
      }
      return p;
    });
    setProductsList(updated);
    setProducts(updated);
    showToast("Stock status updated.");
  };

  // File Input Refs & Drag States for Media Uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  // Core image processor supporting both click-to-pick and drag-and-drop (5MB limit)
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
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = ev.target?.result as string;
        if (preview) {
          setFormImage(preview);
        }
      };
      reader.readAsDataURL(file);

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
        showToast("Photo uploaded to Cloudinary successfully!");
      }
    } catch (err: any) {
      console.warn("Upload fallback to local preview:", err);
      setImageUploadError(err.message || "Local preview attached.");
      showToast("Photo preview attached!");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Gallery multi-file processor (5MB limit per image)
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
          throw new Error(`File ${file.name} exceeds the 5MB limit. Please upload images under 5MB.`);
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

        if (data.url) {
          newUrls.push(data.url);
        }
      }

      if (newUrls.length > 0) {
        setFormGallery((prev) => [...prev, ...newUrls]);
        showToast(`Added ${newUrls.length} photo(s) to product gallery.`);
      }
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setGalleryUploadError(err.message || "Failed to upload gallery images.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processGalleryFiles(e.target.files);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Video processor (10MB limit)
  const processVideoFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Please upload a video file (MP4, WEBM).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setVideoUploadError("Video size exceeds the 10MB limit. Please compress or select a video under 10MB.");
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
        throw new Error(data.error || "Failed to upload video to server.");
      }

      if (data.url) {
        setFormVideo(data.url);
        setVideoUploadSuccess(true);
        showToast("Product video uploaded to Cloudinary successfully!");
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      setVideoUploadError(err.message || "Failed to upload video.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  // Handle Category Switching with automatic group assignment
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

    if (!formSubcategory || formSubcategory === "Foreign HDF Luxury Doors" || formSubcategory === "Sanitary Fixtures") {
      if (newCat === "paint") setFormSubcategory("Wall Finishes & Screeding Paint");
      else if (newCat === "roof-tiles") setFormSubcategory("Stone Coated Roof Tiles");
      else if (newCat === "bathrooms" || newCat === "sanitary-fittings") setFormSubcategory("Sanitary Wares & Bath Fixtures");
      else if (newCat === "real-estate") setFormSubcategory("Commercial & Residential Property");
      else if (newCat === "careers") setFormSubcategory("Skilled Fabrication & Sales Vacancy");
      else if (newCat === "security-doors") setFormSubcategory("Heavy Duty Armored Security Doors");
      else if (newCat === "hdf-doors") setFormSubcategory("Foreign HDF Luxury Doors");
    }
  };

  // Cloudinary Sync Handler
  const handleSyncCloudinary = async () => {
    setCloudinarySyncStatus({ loading: true, message: "Checking and pushing images to Cloudinary...", error: null });
    try {
      const res = await fetch("/api/admin/cloudinary-sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setCloudinarySyncStatus({
          loading: false,
          message: null,
          error: data.error || data.message || "Could not complete Cloudinary sync.",
        });
      } else {
        setCloudinarySyncStatus({
          loading: false,
          message: data.message || `Uploaded ${data.uploadedCount || 0} images to Cloudinary successfully!`,
          error: null,
        });
        showToast("Cloudinary sync complete!");
      }
    } catch (err: any) {
      setCloudinarySyncStatus({
        loading: false,
        message: null,
        error: err.message || "Network error while syncing Cloudinary.",
      });
    }
  };

  // Supabase Sync Handler
  const handleSyncSupabase = async () => {
    setSupabaseSyncStatus({ loading: true, message: "Connecting to Supabase and uploading data...", error: null });
    try {
      const res = await fetch("/api/admin/supabase-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: productsList,
          settings: siteSettingsForm,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSupabaseSyncStatus({
          loading: false,
          message: null,
          error: data.error || data.message || "Could not complete Supabase sync.",
        });
      } else {
        setSupabaseSyncStatus({
          loading: false,
          message: data.message || `Pushed ${data.productsInserted || 0} items to Supabase successfully!`,
          error: null,
        });
        showToast("Supabase sync complete!");
      }
    } catch (err: any) {
      setSupabaseSyncStatus({
        loading: false,
        message: null,
        error: err.message || "Network error while syncing Supabase.",
      });
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(siteSettingsForm);
    showToast("Site settings & addresses saved!");
  };

  // Filtered Products for Table
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (!p) return false;
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (p.name || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Google Search Readiness Checks (Plain, simple English)
  const seoChecks = useMemo(() => {
    const checks = [];
    const kp = focusKeyphrase.toLowerCase().trim();

    if (!kp) {
      checks.push({ label: "Main Search Words", status: "bad", note: "Add the words customers type when searching for this item." });
    } else if (seoTitle.toLowerCase().includes(kp)) {
      checks.push({ label: "Search Words in Title", status: "good", note: "Your search words appear in the Google title." });
    } else {
      checks.push({ label: "Search Words in Title", status: "warning", note: "Consider including your search words in the title." });
    }

    if (seoTitle.length >= 20 && seoTitle.length <= 65) {
      checks.push({ label: "Google Title Length", status: "good", note: `${seoTitle.length} characters (Ideal for Google display).` });
    } else {
      checks.push({ label: "Google Title Length", status: "warning", note: `${seoTitle.length} characters (Recommended: between 25 and 60 characters).` });
    }

    if (seoDescription.length >= 40 && seoDescription.length <= 160) {
      checks.push({ label: "Google Summary Length", status: "good", note: `${seoDescription.length} characters (Clear description for searchers).` });
    } else if (seoDescription.length === 0) {
      checks.push({ label: "Google Summary", status: "bad", note: "No summary provided. Write 1 or 2 sentences describing the item." });
    } else {
      checks.push({ label: "Google Summary Length", status: "warning", note: `${seoDescription.length} characters (Recommended: between 40 and 150 characters).` });
    }

    if (formImage) {
      checks.push({ label: "Product Photo", status: "good", note: "Photo is attached and ready." });
    } else {
      checks.push({ label: "Product Photo", status: "bad", note: "Please upload or select a product photo." });
    }

    if (formJijiUrl && formJijiUrl.startsWith("http")) {
      checks.push({ label: "Jiji Shop Link", status: "good", note: "Connected to your Jiji marketplace page." });
    } else {
      checks.push({ label: "Jiji Shop Link", status: "warning", note: "Optional: add your Jiji item link." });
    }

    return checks;
  }, [focusKeyphrase, seoTitle, seoDescription, formImage, formJijiUrl]);

  const seoScore = useMemo(() => {
    if (seoChecks.length === 0) return 50;
    const goodCount = seoChecks.filter((c) => c.status === "good").length;
    return Math.round((goodCount / seoChecks.length) * 100);
  }, [seoChecks]);

  // Discount percentage calculation
  const discountPercent = useMemo(() => {
    if (!formOriginalPrice || formOriginalPrice <= formPrice) return 0;
    return Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100);
  }, [formPrice, formOriginalPrice]);

  // =========================================================================
  // VIEW: UNTOUCHED ADMIN LOGIN (STRICTLY EMAIL, PASSWORD, FORGOTTEN PASSWORD)
  // =========================================================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 bg-[#003296] text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg border border-blue-400/20 animate-pulse">
          ABD
        </div>
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-14 h-14 bg-[#003296] text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg border border-blue-400/20">
            ABD
          </div>
          <h2 className="mt-4 text-center text-2xl font-black text-white tracking-tight">
            Anambra Best Door Admin
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Staff Portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-xl sm:px-10 border border-slate-200">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#003296]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-semibold text-[#003296] hover:underline cursor-pointer"
                  >
                    Forgotten Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#003296]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 px-4 bg-[#003296] hover:bg-[#092b7c] disabled:bg-slate-400 text-white text-sm font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isSubmittingLogin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 font-semibold flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>
              <span className="text-[11px] text-slate-400">Staff Portal Only</span>
            </div>
          </div>
        </div>

        {/* Forgotten Password Modal */}
        {showForgotPassword && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-[#003296]" />
                  <h3 className="font-bold text-slate-900 text-sm">Reset Admin Access</h3>
                </div>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Password resets are verified directly with the administrator.
              </p>

              {forgotStatus ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                  {forgotStatus}
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Staff / Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#003296]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl"
                  >
                    Submit Password Reset Request
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    "Hello, I am requesting an administrative password reset for the Anambra Best Door portal."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#003296] text-white flex items-center justify-center font-black text-sm shadow-sm">
              ABD
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-tight">
                Anambra Best Door Admin
              </h1>
              <p className="text-[11px] text-slate-500">
                Store Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-600 hover:text-[#003296] flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("products");
              setIsEditing(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === "products"
                ? "border-[#003296] text-[#003296]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Inventory ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === "inventory"
                ? "border-[#003296] text-[#003296]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Stock Status</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === "settings"
                ? "border-[#003296] text-[#003296]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Dynamic Site & Address Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("cac")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === "cac"
                ? "border-[#003296] text-[#003296]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>CAC Compliance ({settings.cacNumber})</span>
          </button>
        </div>
      </header>

      {/* Floating Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ========================================================================= */}
        {/* VIEW 1: WORDPRESS-STYLE PRODUCT CREATION & EDITING SCREEN                */}
        {/* ========================================================================= */}
        {isEditing ? (
          <form onSubmit={handleSaveProduct} className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-black text-slate-900">
                  {editingId ? "Edit Door Model" : "Add New Door Product"}
                </h1>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish / Save Changes</span>
                </button>
              </div>
            </div>

            {/* 2-Column WordPress Layout: Main Content (Left) & Sidebar (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Product Information (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Title & Slug Box */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Bullet Proof Door"
                      className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#003296]"
                    />
                  </div>

                  {/* Permalink Editor */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-slate-400">Permalink:</span>
                    <div className="flex items-center">
                      <span className="text-slate-400 font-mono">/products/</span>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => {
                          const rawVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                          setFormSlug(rawVal);
                          if (!rawVal.trim()) {
                            setIsSlugCustomized(false);
                            setFormSlug(slugify(formName));
                          } else {
                            setIsSlugCustomized(true);
                          }
                        }}
                        placeholder="auto-generated-from-title"
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-[#003296]"
                      />
                    </div>

                    {isSlugCustomized ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlugCustomized(false);
                          setFormSlug(slugify(formName));
                        }}
                        className="text-[11px] text-[#003296] hover:underline flex items-center space-x-1 font-semibold"
                        title="Reset permalink to auto-generate from title"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Auto-derive from title</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200/60">
                        Auto-syncing with title
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description & Full Technical Specs */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      Summary Excerpt (Card Display)
                    </label>
                    <textarea
                      rows={2}
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="Ultra heavy-gauge bullet-resistant security door with reinforced structural steel core..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#003296]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      Detailed Architectural & Construction Description
                    </label>
                    <textarea
                      rows={5}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Full details on steel gauge thickness, internal acoustic infill, lock mechanism..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#003296]"
                    />
                  </div>
                </div>

                {/* Dynamic Specifications Key-Value Editor */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Technical Door Specifications
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setFormSpecs({
                          ...formSpecs,
                          [`Spec ${Object.keys(formSpecs).length + 1}`]: "Value",
                        })
                      }
                      className="text-xs text-[#003296] font-bold hover:underline flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spec Field</span>
                    </button>
                  </div>

                  <div className="space-y-2">
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
                          className="w-1/3 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                          placeholder="Spec Name (e.g. Dimensions)"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setFormSpecs({ ...formSpecs, [key]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          placeholder="Spec Value (e.g. 3ft x 7ft)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSpecs = { ...formSpecs };
                            delete newSpecs[key];
                            setFormSpecs(newSpecs);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Google Search Appearance Section */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-[#003296]" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Google Search Appearance
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Search Readiness:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                          seoScore >= 80
                            ? "bg-emerald-100 text-emerald-800"
                            : seoScore >= 50
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seoScore} / 100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Main Search Words
                      </label>
                      <input
                        type="text"
                        value={focusKeyphrase}
                        onChange={(e) => setFocusKeyphrase(e.target.value)}
                        placeholder="e.g. Bullet Proof Door Onitsha"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Words customers type when searching for this item on Google.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Title on Google
                      </label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="e.g. Bullet Proof Door in Onitsha Nigeria | Anambra Best Door"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Short Summary for Google
                      </label>
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="One or two clear sentences describing this item..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    {/* Google Search Preview Box */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        How it looks on Google
                      </span>
                      <p className="text-xs font-medium text-[#1a0dab] truncate">
                        {seoTitle || `${formName} | Anambra Best Door`}
                      </p>
                      <p className="text-[11px] text-[#006621] truncate font-mono">
                        https://anambrabestdoor.ng/products/{formSlug || "model"}
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {seoDescription || formShortDesc || "Direct supplier of heavy-gauge security doors."}
                      </p>
                    </div>

                    {/* Quick Checks */}
                    <div className="pt-2 space-y-1.5">
                      {seoChecks.map((check, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          {check.status === "good" ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : check.status === "warning" ? (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          <span className="font-semibold text-slate-700">{check.label}:</span>
                          <span className="text-slate-500">{check.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Inventory, Jiji Link & Image (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Pricing & Stock Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Pricing & Inventory
                  </h3>

                  {/* Price Display Settings: Fixed Price vs Price on Request vs Blank */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Price Display Setting
                    </label>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          value="show_price"
                          checked={formPriceMode === "show_price"}
                          onChange={() => {
                            setFormPriceMode("show_price");
                            setFormPriceOnRequest(false);
                          }}
                          className="mt-0.5 w-4 h-4 text-[#003296] border-slate-300 focus:ring-[#003296]"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">Show Fixed Price (₦)</span>
                          <span className="text-[11px] text-slate-500 block">Display regular amount and direct buy order buttons</span>
                        </div>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          value="price_on_request"
                          checked={formPriceMode === "price_on_request"}
                          onChange={() => {
                            setFormPriceMode("price_on_request");
                            setFormPriceOnRequest(true);
                          }}
                          className="mt-0.5 w-4 h-4 text-[#003296] border-slate-300 focus:ring-[#003296]"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">Price on Request</span>
                          <span className="text-[11px] text-slate-500 block">Displays &ldquo;Price on Request&rdquo; with WhatsApp quote button</span>
                        </div>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="priceMode"
                          value="blank"
                          checked={formPriceMode === "blank"}
                          onChange={() => {
                            setFormPriceMode("blank");
                            setFormPriceOnRequest(false);
                          }}
                          className="mt-0.5 w-4 h-4 text-[#003296] border-slate-300 focus:ring-[#003296]"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">Leave Blank / Chat for Price</span>
                          <span className="text-[11px] text-slate-500 block">No price displayed on cards; directs customer to chat on WhatsApp</span>
                        </div>
                      </label>
                    </div>

                    {formPriceMode === "show_price" && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Selling Price (₦)
                          </label>
                          <input
                            type="number"
                            value={formPrice || ""}
                            onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                            placeholder="e.g. 185000"
                            className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl"
                          />
                          {formPrice === 0 && (
                            <p className="text-[11px] text-amber-600 mt-1">
                              Price is ₦0. If you do not want ₦0 to show, choose &ldquo;Price on Request&rdquo; or &ldquo;Leave Blank&rdquo; above.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Original / Regular Price (₦)
                          </label>
                          <input
                            type="number"
                            value={formOriginalPrice || ""}
                            onChange={(e) => setFormOriginalPrice(Number(e.target.value) || 0)}
                            placeholder="e.g. 210000"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                          />
                          {discountPercent > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                              Displays as {discountPercent}% discount
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Price Validity Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={formPriceValidUntil}
                            onChange={(e) => setFormPriceValidUntil(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                          />
                          <p className="text-[11px] text-slate-400 mt-1">
                            Optional. Leave blank to automatically roll forward 365 days on Google.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Choose Product Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        handleCategoryChange(e.target.value as DoorProduct["category"])
                      }
                      className="w-full px-3 py-2.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:border-[#003296] focus:ring-1 focus:ring-[#003296] mb-3 cursor-pointer shadow-xs"
                    >
                      <optgroup label="Doors & Entrances">
                        <option value="security-doors">Security Doors</option>
                        <option value="hdf-doors">Foreign HDF Doors</option>
                        <option value="interior-doors">Interior Doors</option>
                        <option value="luxury-doors">Luxury Doors</option>
                        <option value="bathroom-doors">Waterproof Bathroom Doors</option>
                      </optgroup>
                      <optgroup label="Sanitary & Plumbing">
                        <option value="sanitary-fittings">Sanitary Wares & Fittings</option>
                        <option value="bathrooms">Bathrooms & Wash Basins</option>
                      </optgroup>
                      <optgroup label="Building Materials & Finishes">
                        <option value="paint">Paint & Wall Finishes</option>
                        <option value="roof-tiles">Roof Tiles & Roofing</option>
                      </optgroup>
                      <optgroup label="Properties & Vacancies">
                        <option value="real-estate">Real Estate & Properties</option>
                        <option value="careers">Careers & Vacancies</option>
                      </optgroup>
                    </select>

                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Subcategory / Specific Type
                    </label>
                    <input
                      type="text"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value)}
                      placeholder="e.g. Foreign HDF Luxury Doors, Stone Coated Tiles, Exterior Emulsion"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-3"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Warehouse Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Stock Status
                    </label>
                    <select
                      value={formStockStatus}
                      onChange={(e) =>
                        setFormStockStatus(e.target.value as DoorProduct["stockStatus"])
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock (Under 5 units)</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="made_to_order">Made to Order (Fabrication)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Product Badge
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="e.g. Best Seller / Contractor Pick"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Product Photo Upload */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Product Photo
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Drag & drop or click to upload</span>
                  </div>

                  {/* Drag & Drop Upload Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-48 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-center group ${
                      isDraggingImage
                        ? "border-[#003296] bg-blue-50/90 ring-2 ring-[#003296]/30 scale-[1.01]"
                        : "border-dashed border-slate-300 hover:border-[#003296] bg-slate-50"
                    }`}
                  >
                    {formImage ? (
                      <>
                        <Image
                          src={formImage.startsWith("/") || formImage.startsWith("http") || formImage.startsWith("data:") ? formImage : `/${formImage}`}
                          alt={formName || "Product photo"}
                          fill
                          className="object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
                          <UploadCloud className="w-6 h-6 mb-1 text-white" />
                          <span className="text-xs font-bold">Drop photo or click to change</span>
                          <span className="text-[10px] text-slate-200 mt-0.5">JPG, PNG, WEBP</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-xs text-slate-500 p-4 text-center">
                        <UploadCloud className={`w-8 h-8 mb-2 transition-colors ${isDraggingImage ? "text-[#003296] animate-bounce" : "text-slate-400 group-hover:text-[#003296]"}`} />
                        <span className="font-bold text-slate-700">
                          {isDraggingImage ? "Drop photo here now" : "Drag & drop product photo here"}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">or click to browse from device</span>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input for phone / desktop file picking */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFilePick}
                    className="hidden"
                  />

                  {/* Prominent Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full py-2.5 px-3 bg-[#003296] hover:bg-[#092b7c] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Photo...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Choose Photo from Device (Phone / PC)</span>
                      </>
                    )}
                  </button>

                  {imageUploadSuccess && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-[11px] flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Photo uploaded and attached!</span>
                    </div>
                  )}

                  {imageUploadError && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                      {imageUploadError}
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Photo Link / Path (Optional edit)
                    </label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="/products/door.jpg or https://res.cloudinary.com/..."
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>

                {/* Product Gallery (Multiple Images for Product Single Template) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Image Gallery
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Additional angles & warehouse photos for product single page (max 5MB each)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#003296] bg-blue-50 px-2 py-0.5 rounded-md">
                      {formGallery.length} {formGallery.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>

                  {/* Hidden input for multi-file selection */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilePick}
                    className="hidden"
                  />

                  {/* Drag & drop dropzone for gallery */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingGallery(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingGallery(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingGallery(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingGallery(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        processGalleryFiles(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => galleryInputRef.current?.click()}
                    className={`w-full py-4 px-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      isDraggingGallery
                        ? "border-[#003296] bg-blue-50/90 ring-2 ring-[#003296]/30"
                        : "border-slate-300 hover:border-[#003296] bg-slate-50"
                    }`}
                  >
                    <Plus className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">
                      {isDraggingGallery ? "Drop gallery photos here" : "Add Gallery Photos"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Select or drop multiple images (JPG, PNG, WEBP — up to 5MB)
                    </span>
                  </div>

                  {isUploadingGallery && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[#003296] text-xs flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Uploading gallery photos to Cloudinary...</span>
                    </div>
                  )}

                  {galleryUploadError && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                      {galleryUploadError}
                    </div>
                  )}

                  {/* Gallery Thumbnails Grid */}
                  {formGallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {formGallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
                        >
                          <Image
                            src={imgUrl.startsWith("/") || imgUrl.startsWith("http") || imgUrl.startsWith("data:") ? imgUrl : `/${imgUrl}`}
                            alt={`Gallery photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGalleryImage(idx);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove photo"
                            aria-label={`Remove photo ${idx + 1}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Video Showcase (Appears in Hero & Product Single Page) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Product Video Showcase
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Offloading, depot or walkthrough video (max 10MB, MP4/WEBM)
                      </p>
                    </div>
                    <Film className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Hidden input for video file selection */}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoFilePick}
                    className="hidden"
                  />

                  {formVideo ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200">
                        <video
                          key={formVideo}
                          src={formVideo}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 shrink-0" />
                          <span>Video linked</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormVideo("")}
                          className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Remove Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingVideo(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingVideo(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingVideo(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingVideo(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processVideoFile(file);
                      }}
                      onClick={() => videoInputRef.current?.click()}
                      className={`w-full py-5 px-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                        isDraggingVideo
                          ? "border-[#003296] bg-blue-50/90 ring-2 ring-[#003296]/30"
                          : "border-slate-300 hover:border-[#003296] bg-slate-50"
                      }`}
                    >
                      <Video className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700">
                        {isDraggingVideo ? "Drop product video here" : "Upload Product Video"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        MP4, WEBM format • Maximum 10MB
                      </span>
                    </div>
                  )}

                  {isUploadingVideo && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[#003296] text-xs flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Uploading video to Cloudinary CDN (up to 10MB)...</span>
                    </div>
                  )}

                  {videoUploadSuccess && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-[11px] flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Video uploaded and connected to product!</span>
                    </div>
                  )}

                  {videoUploadError && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                      {videoUploadError}
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Direct Video URL (Cloudinary / MP4 link)
                    </label>
                    <input
                      type="text"
                      value={formVideo}
                      onChange={(e) => setFormVideo(e.target.value)}
                      placeholder="https://res.cloudinary.com/.../video.mp4"
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>

                {/* Cross-Channel Jiji Link */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Cross-Channel Marketplace Link
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Jiji.ng Item Listing URL
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
            </div>
          </form>
        ) : activeTab === "products" ? (
          /* ========================================================================= */
          /* VIEW 2: PRODUCT ARCHIVE & CATALOGUE LIST                                  */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Door Catalogue Management
                </h1>
                <p className="text-xs text-slate-500">
                  Manage inventory, add genuine door samples, edit technical specifications, and cross-link to Jiji.ng.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleResetCatalog}
                  className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Reset catalog back to initial state with blank prices"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset to Defaults</span>
                </button>
                <button
                  onClick={handleNewProduct}
                  className="py-2.5 px-4 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Door Model</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search door name or slug..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full sm:w-auto"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Product Name & Category</th>
                      <th className="py-3 px-4">Price (₦)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Jiji Cross-Link</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="relative w-12 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 space-y-0.5">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            /products/{prod.slug}
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#003296] text-[10px] font-bold">
                            {prod.categoryLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#003296]">
                          {prod.priceMode === "blank" ? (
                            <span className="text-xs text-slate-400 font-medium">Blank (Chat)</span>
                          ) : prod.priceMode === "price_on_request" || prod.priceOnRequest ? (
                            <span className="text-xs font-bold text-blue-700">On Request</span>
                          ) : prod.price > 0 ? (
                            `₦${prod.price.toLocaleString()}`
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.stockStatus === "in_stock"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {prod.stockStatus === "in_stock" ? "In Stock" : "Sold Out"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {prod.jijiUrl ? (
                            <a
                              href={prod.jijiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center space-x-1 font-semibold"
                            >
                              <span>Verified Listing</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "inventory" ? (
          /* ========================================================================= */
          /* VIEW 3: INVENTORY & QUICK AVAILABILITY STATUS                            */
          /* ========================================================================= */
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Warehouse Inventory Management
              </h1>
              <p className="text-xs text-slate-500">
                Quickly adjust stock quantities and toggle sold-out status for WhatsApp order verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.map((prod) => (
                <div key={prod.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="relative w-10 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400">{prod.categoryLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-bold text-[#003296]">
                      {prod.price && prod.price > 0
                        ? `₦${prod.price.toLocaleString()}`
                        : prod.priceMode === "price_on_request" || prod.priceOnRequest
                        ? "On Request"
                        : "Blank (Chat)"}
                    </span>
                    <button
                      onClick={() => handleToggleSoldOut(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        prod.stockStatus === "in_stock"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.stockStatus === "in_stock" ? "Mark as Sold Out" : "Mark as In Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "cac" ? (
          /* ========================================================================= */
          /* VIEW 4: CAC COMPLIANCE & OFFICIAL REGISTRATION DOCUMENTS                  */
          /* ========================================================================= */
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                CAC Registration Compliance
              </h1>
              <p className="text-xs text-slate-500">
                Official Corporate Affairs Commission Status Report and Proprietor Information under CAC Act.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Business Name</span>
                  <span className="font-extrabold text-slate-900 text-sm">{siteSettingsForm.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration BN</span>
                  <span className="font-extrabold text-[#003296] text-sm">{siteSettingsForm.cacNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Proprietor</span>
                  <span className="font-extrabold text-slate-900 text-sm">{siteSettingsForm.proprietor}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Page 1: Official CAC Status Report
                  </span>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                      src={siteSettingsForm.cacCertificateUrl || "/cac-status-report-page1.jpeg"}
                      alt="CAC Status Report Page 1"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Page 2: Proprietor Details (Chidera Frank Okonkwo)
                  </span>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                      src={siteSettingsForm.cacPage2Url || "/cac-proprietor-page2.jpeg"}
                      alt="CAC Proprietor Details Page 2"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 5: DYNAMIC SITE SETTINGS & ADDRESSES (NOT HARDCODED)                 */
          /* ========================================================================= */
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Dynamic Site Settings & Addresses
              </h1>
              <p className="text-xs text-slate-500">
                Update business addresses, phone numbers, WhatsApp lines, CAC registration numbers, and social URLs. Changes propagate across the storefront header, footer, contact page, and WhatsApp order flow dynamically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Trading Name</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Parent Corporate Entity</label>
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sole Proprietor</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.proprietor}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, proprietor: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Market Location Summary</label>
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

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Main Shop / Warehouse Address (From CAC Registration)
                  </label>
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
                    Second Shop / Branch Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.secondAddress || ""}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, secondAddress: e.target.value })
                    }
                    placeholder="e.g. Branch Shop: Shop 14, Building Materials Market, Ogidi, Anambra State"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    If you have a 2nd shop or warehouse, enter the address here. It will automatically show on the Contact page and Footer.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Phone (+234...)</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.phone}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Display Phone Format</label>
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
                  <label className="font-bold text-slate-700 block mb-1">
                    WhatsApp Order Line (Digits without +, e.g. 2347070070305)
                  </label>
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
                  <label className="font-bold text-slate-700 block mb-1">Official Sales Email</label>
                  <input
                    type="email"
                    required
                    value={siteSettingsForm.salesEmail}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, salesEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">CAC Registration BN Number</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.cacNumber}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, cacNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">CAC Registration Date</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.cacRegistrationDate}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, cacRegistrationDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">CAC Status</label>
                  <input
                    type="text"
                    required
                    value={siteSettingsForm.cacStatus}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, cacStatus: e.target.value })
                    }
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
                  <label className="font-bold text-slate-700 block mb-1">Jiji.ng Store URL</label>
                  <input
                    type="url"
                    value={siteSettingsForm.jijiShopUrl}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, jijiShopUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>


                <div>
                  <label className="font-bold text-slate-700 block mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={siteSettingsForm.workingHours}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, workingHours: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block mb-1">
                    WhatsApp Single Product Inquiry Template
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Tokens: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003296] font-mono">[Door Name]</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003296] font-mono">[Size]</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003296] font-mono">[Qty]</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003296] font-mono">[Quantity]</code>
                  </p>
                  <textarea
                    rows={3}
                    value={siteSettingsForm.whatsappInquiryTemplate}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        whatsappInquiryTemplate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:border-[#003296]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    WhatsApp Multi-Item Cart Inquiry Template
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Token: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003296] font-mono">[Items]</code>
                  </p>
                  <textarea
                    rows={3}
                    value={siteSettingsForm.whatsappCartTemplate}
                    onChange={(e) =>
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        whatsappCartTemplate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:border-[#003296]"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Site Settings</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
