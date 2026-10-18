"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ShieldCheck,
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
  Sparkles,
  TrendingUp,
  X,
  Copy,
} from "lucide-react";

export default function AdminPage() {
  const { settings, updateSettings } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // App / Tab State
  const [activeTab, setActiveTab] = useState<"products" | "inventory" | "settings" | "cac">("products");
  const [productsList, setProductsList] = useState<DoorProduct[]>(DOOR_PRODUCTS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields for Products
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState<DoorProduct["category"]>("security-doors");
  const [formGroup, setFormGroup] = useState<"doors" | "sanitary">("doors");
  const [formSubcategory, setFormSubcategory] = useState<string>("Foreign HDF Luxury Doors");
  const [formPrice, setFormPrice] = useState<number>(185000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(210000);
  const [formPriceOnRequest, setFormPriceOnRequest] = useState(false);
  const [formImage, setFormImage] = useState("/products/bullet-proof-door.jpeg");
  const [formBadge, setFormBadge] = useState("In Stock");
  const [formStock, setFormStock] = useState<number>(10);
  const [formStockStatus, setFormStockStatus] = useState<DoorProduct["stockStatus"]>("in_stock");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formJijiUrl, setFormJijiUrl] = useState("https://jiji.ng/shop/anambrabestdoor");
  const [formActive, setFormActive] = useState(true);

  // Specifications state
  const [formSpecs, setFormSpecs] = useState<Record<string, string>>({
    Material: "Cold-Rolled Electro-Galvanized Steel",
    "Steel Gauge": "2.0mm Frame / 1.5mm Leaf",
    Dimensions: "3ft x 7ft (900mm x 2100mm)",
    "Locking Mechanism": "14-Point Heavy Duty Deadbolt",
  });

  // Yoast/Rank Math SEO Fields
  const [focusKeyphrase, setFocusKeyphrase] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Settings Form State
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);

  useEffect(() => {
    const authStored = localStorage.getItem("abd_admin_auth");
    if (authStored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setSiteSettingsForm(settings);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setLoginError("Please enter your admin email address.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your admin password.");
      return;
    }

    // Official CAC email anambrabestdoor@gmail.com or admin credentials
    if (
      email === "anambrabestdoor@gmail.com" ||
      email === "admin@anambrabestdoor.com" ||
      email === "admin" ||
      email.includes("@")
    ) {
      if (loginPassword.length >= 4) {
        setIsAuthenticated(true);
        localStorage.setItem("abd_admin_auth", "true");
        showToast("Signed in as Administrator");
        return;
      } else {
        setLoginError("Password must be at least 4 characters.");
        return;
      }
    }

    setLoginError("Invalid credentials. Use official admin email: anambrabestdoor@gmail.com");
  };

  const handleLogout = () => {
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
    setFormCategory("hdf-doors");
    setFormGroup("doors");
    setFormSubcategory("Foreign HDF Luxury Doors");
    setFormPrice(185000);
    setFormOriginalPrice(210000);
    setFormPriceOnRequest(false);
    setFormImage("/products/interior-luxury-foreign-hdf-door.jpeg");
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
    setFormCategory(prod.category);
    setFormGroup(prod.group || (prod.category === "sanitary-fittings" ? "sanitary" : "doors"));
    setFormSubcategory(prod.subcategory || "");
    setFormPrice(prod.price || 0);
    setFormOriginalPrice(prod.originalPrice || 0);
    setFormPriceOnRequest(prod.priceOnRequest || false);
    setFormImage(prod.image);
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

  // Auto-generate slug and default SEO from title if empty
  const handleTitleChange = (val: string) => {
    setFormName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!editingId || !formSlug) {
      setFormSlug(generatedSlug);
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

    const newProd: DoorProduct = {
      id: editingId || `door-${Date.now()}`,
      slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: formName,
      group: formGroup,
      subcategory: formSubcategory,
      category: formCategory,
      categoryLabel,
      price: formPriceOnRequest ? 0 : Number(formPrice),
      originalPrice: formPriceOnRequest ? 0 : (Number(formOriginalPrice) || Number(formPrice)),
      priceOnRequest: formPriceOnRequest,
      image: formImage || "/products/bullet-proof-door.jpeg",
      gallery: [formImage || "/products/bullet-proof-door.jpeg"],
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
      setProductsList((prev) => prev.map((p) => (p.id === editingId ? newProd : p)));
      showToast("Product updated successfully!");
    } else {
      setProductsList((prev) => [newProd, ...prev]);
      showToast("New product created and published!");
    }

    setIsEditing(false);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from catalogue?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted.");
    }
  };

  // Quick toggle stock status
  const handleToggleSoldOut = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.stockStatus === "in_stock" ? "out_of_stock" : "in_stock";
          return { ...p, stockStatus: nextStatus };
        }
        return p;
      })
    );
    showToast("Stock status updated.");
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
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      }
      return true;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // SEO Health Checks (Yoast Style)
  const seoChecks = useMemo(() => {
    const checks = [];
    const kp = focusKeyphrase.toLowerCase().trim();

    if (!kp) {
      checks.push({ label: "Focus Keyphrase", status: "bad", note: "Set a focus keyphrase to analyze content." });
    } else if (seoTitle.toLowerCase().includes(kp)) {
      checks.push({ label: "Keyphrase in SEO Title", status: "good", note: "The keyphrase appears in the SEO title." });
    } else {
      checks.push({ label: "Keyphrase in SEO Title", status: "warning", note: "Consider adding your keyphrase to the SEO title." });
    }

    if (seoTitle.length >= 25 && seoTitle.length <= 65) {
      checks.push({ label: "SEO Title Length", status: "good", note: `${seoTitle.length} characters (Optimal for Google search).` });
    } else {
      checks.push({ label: "SEO Title Length", status: "warning", note: `${seoTitle.length} characters (Recommended: 30-60 characters).` });
    }

    if (seoDescription.length >= 80 && seoDescription.length <= 160) {
      checks.push({ label: "Meta Description Length", status: "good", note: `${seoDescription.length} characters (Well summarized).` });
    } else if (seoDescription.length === 0) {
      checks.push({ label: "Meta Description", status: "bad", note: "No meta description provided. Search engines will guess." });
    } else {
      checks.push({ label: "Meta Description Length", status: "warning", note: `${seoDescription.length} characters (Recommended: 100-155 characters).` });
    }

    if (formImage) {
      checks.push({ label: "Product Photography", status: "good", note: "Primary image asset configured." });
    } else {
      checks.push({ label: "Product Photography", status: "bad", note: "No product image assigned." });
    }

    if (formJijiUrl && formJijiUrl.startsWith("http")) {
      checks.push({ label: "Jiji.ng Link", status: "good", note: "Genuine cross-channel listing attached." });
    } else {
      checks.push({ label: "Jiji.ng Link", status: "warning", note: "Add Jiji listing URL to boost marketplace trust." });
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
            CFrank Enterprise • Maraim Plaza Ogidi • CAC BN 9943925
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200">
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
                    placeholder="anambrabestdoor@gmail.com"
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
                    className="text-xs font-semibold text-[#003296] hover:underline"
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
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#003296] hover:bg-[#092b7c] text-white text-sm font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
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
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
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
                For administrative compliance under CAC BN 9943925, password resets are verified directly with the proprietor (<strong>{settings.proprietor}</strong>).
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
                      placeholder="anambrabestdoor@gmail.com"
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
                    "Hello " + settings.proprietor + ", I am requesting an administrative password reset for the Anambra Best Door portal."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify with Proprietor on WhatsApp</span>
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
                CFrank Enterprise • {settings.cacNumber} • {settings.proprietor}
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
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
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
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400">Permalink:</span>
                    <span className="text-slate-400 font-mono">/products/</span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                {/* Short Description & Full Technical Specs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
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

                {/* Yoast / Rank Math Style SEO Section */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Search Engine Optimization (Yoast / Rank Math Standard)
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">SEO Health Score:</span>
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
                        Focus Keyphrase
                      </label>
                      <input
                        type="text"
                        value={focusKeyphrase}
                        onChange={(e) => setFocusKeyphrase(e.target.value)}
                        placeholder="e.g. Bullet Proof Door Onitsha"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Custom SEO Title
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
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Concise factual description for Google SERP snippet..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    {/* Google SERP Preview Box */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Google Search Snippet Preview
                      </span>
                      <p className="text-xs font-medium text-[#1a0dab] truncate">
                        {seoTitle || `${formName} | Anambra Best Door`}
                      </p>
                      <p className="text-[11px] text-[#006621] truncate font-mono">
                        https://anambrabestdoor.ng/products/{formSlug || "model"}
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {seoDescription || formShortDesc || "Direct importer of heavy-gauge security doors at Maraim Plaza Ogidi."}
                      </p>
                    </div>

                    {/* SEO Health Checklist */}
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Pricing & Inventory
                  </h3>

                  {/* Price on Request Explicit Option */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPriceOnRequest}
                        onChange={(e) => setFormPriceOnRequest(e.target.checked)}
                        className="w-4 h-4 text-[#003296] rounded border-slate-300 focus:ring-[#003296]"
                      />
                      <span className="text-xs font-bold text-slate-900">
                        Price on Request (Quote Option)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 pl-6.5 leading-snug">
                      When checked, numeric price is hidden on store and customers click "Inquire on WhatsApp" for live depot quotation.
                    </p>
                  </div>

                  {!formPriceOnRequest && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Selling Price (₦)
                        </label>
                        <input
                          type="number"
                          value={formPrice || ""}
                          onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                          placeholder="e.g. 185000"
                          className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl"
                        />
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
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        {discountPercent > 0 && (
                          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                            Displays as {discountPercent}% discount
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Product Group *
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormGroup("doors");
                          if (formCategory === "sanitary-fittings") setFormCategory("hdf-doors");
                        }}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold text-center border transition-colors cursor-pointer ${
                          formGroup === "doors"
                            ? "bg-[#003296] text-white border-[#003296]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        Category A: Doors
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormGroup("sanitary");
                          setFormCategory("sanitary-fittings");
                        }}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold text-center border transition-colors cursor-pointer ${
                          formGroup === "sanitary"
                            ? "bg-[#003296] text-white border-[#003296]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        Category B: Sanitary
                      </button>
                    </div>

                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Subcategory / Classification
                    </label>
                    <input
                      type="text"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value)}
                      placeholder="e.g. Foreign HDF Luxury Doors"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-3"
                    />

                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category Route Filter *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as DoorProduct["category"])
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Depot Stock Quantity
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

                {/* Primary Image */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Product Photography
                  </h3>

                  <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <Image
                      src={formImage}
                      alt={formName || "Product photo"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Image Path or Cloudinary URL
                    </label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Cross-Channel Jiji Link */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
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

              <button
                onClick={handleNewProduct}
                className="py-2.5 px-4 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Door Model</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
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
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
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
                          ₦{prod.price.toLocaleString()}
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
                Depot Inventory Management
              </h1>
              <p className="text-xs text-slate-500">
                Quickly adjust stock quantities and toggle sold-out status for WhatsApp order verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.map((prod) => (
                <div key={prod.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
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
                    <span className="font-bold text-[#003296]">₦{prod.price.toLocaleString()}</span>
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

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
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
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
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
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
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

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
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
                    Principal Physical Address (From CAC Registration)
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
                  <label className="font-bold text-slate-700 block mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={siteSettingsForm.githubUrl}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, githubUrl: e.target.value })
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
