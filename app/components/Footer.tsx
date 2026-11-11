"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { BadgeCheck, Phone, Mail, Clock, Store, Instagram, MessageSquare, MapPin } from "lucide-react";
import { brand, colors, whatsappDefaults } from "@/lib/brand";

export default function Footer() {
  const { settings, setCacModalOpen } = useApp();
  const currentYear = new Date().getFullYear();

  return (
      <footer className="bg-[#121518] text-[#D1D1CC] pt-16 pb-12 border-t border-[#22262B] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Brand & Corporate Summary Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                  <div className="relative h-11 w-48">
                    <Image
                      src="/cfranklogo-light.png"
                      alt={`${brand.name} Logo`}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
              </Link>

                <p className="text-[#A0A09B] text-xs sm:text-sm leading-relaxed max-w-sm">
                  {brand.description}
                </p>

                {/* CAC Trust Badge */}
                  <div className="inline-flex items-center space-x-2 py-2 px-3.5 bg-[#22262B] border border-[#3A4047] rounded-full text-xs font-medium text-[#F7F6F2]">
                    <BadgeCheck className="w-4 h-4 text-[#F3661B]" />
                    <span>CAC: {settings.cacNumber || brand.cacNumber}</span>
                    <button
                      type="button"
                      onClick={() => setCacModalOpen(true)}
                      className="underline hover:text-[#F3661B] ml-1 cursor-pointer font-semibold text-[#F3661B]"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {/* Links & Contact Sections */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                  {/* Category A: Product Catalog */}
                  <div className="space-y-3">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                      Categories
                    </h3>
                    <ul className="space-y-2.5 text-[#A0A09B] font-medium">
                      <li>
                        <Link href="/shop?category=doors" className="hover:text-[#F3661B] transition-colors font-semibold text-white">
                          Security &amp; Entrance Doors
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=hdf-doors" className="hover:text-[#F3661B] transition-colors">
                          Foreign HDF Interior Doors
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=sanitary-fittings" className="hover:text-[#F3661B] transition-colors">
                          Sanitary Wares &amp; WC Suites
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=building-materials" className="hover:text-[#F3661B] transition-colors">
                          Stone-Coated Roofing Tiles
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop" className="hover:text-[#F3661B] transition-colors text-white font-semibold">
                          View Full Shop →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category B: Corporate & Resources */}
                  <div className="space-y-3">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                      Information
                    </h3>
                    <ul className="space-y-2.5 text-[#A0A09B] font-medium">
                      <li>
                        <Link href="/about" className="hover:text-[#F3661B] transition-colors">
                          About CFrank Group
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="hover:text-[#F3661B] transition-colors">
                          Contact &amp; Showroom
                        </Link>
                      </li>
                      <li>
                        <Link href="/wholesale" className="hover:text-[#F3661B] transition-colors">
                          Project BOQ Sourcing
                        </Link>
                      </li>
                      <li>
                        <Link href="/downloads" className="hover:text-[#F3661B] transition-colors">
                          Trade Catalogues (PDF)
                        </Link>
                      </li>
                      <li>
                        <Link href="/tracking" className="hover:text-[#F3661B] transition-colors">
                          Order Tracking
                        </Link>
                      </li>
                      <li>
                        <Link href="/shipping" className="hover:text-[#F3661B] transition-colors">
                          Shipping &amp; Logistics
                        </Link>
                      </li>
                      <li>
                        <Link href="/returns" className="hover:text-[#F3661B] transition-colors">
                          Warranty &amp; Returns
                        </Link>
                      </li>
                      <li>
                        <Link href="/faq" className="hover:text-[#F3661B] transition-colors">
                          FAQ
                        </Link>
                      </li>
                    </ul>
                  </div>

                          {/* Warehouse Contact & Socials */}
                            <div className="col-span-2 sm:col-span-1 space-y-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#22262B]">
                              <div className="space-y-3">
                                  <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                                    Contact
                                  </h3>
                                    <div className="space-y-2.5 text-[#A0A09B] text-xs">
                                      <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-[#F3661B] shrink-0" />
                                          <a href={`tel:${settings.phone || brand.phone}`} className="hover:text-[#F3661B] font-semibold text-white">
                                            {settings.phoneDisplay || brand.phoneDisplay}
                                          </a>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                          <Mail className="w-4 h-4 text-[#F3661B] shrink-0" />
                                          <a href={`mailto:${settings.salesEmail || brand.email}`} className="hover:text-[#F3661B] truncate">
                                            {settings.salesEmail || brand.email}
                                          </a>
                                      </div>
                                        <div className="flex items-start space-x-2">
                                          <MapPin className="w-4 h-4 text-[#F3661B] shrink-0 mt-0.5" />
                                          <div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73787E] block">Headquarters</span>
                                            <span className="leading-tight text-xs text-[#D1D1CC]">{settings.address || brand.address}</span>
                                          </div>
                                        </div>
                                          <div className="flex items-center space-x-2 text-[#73787E]">
                                            <Clock className="w-4 h-4 text-[#F3661B] shrink-0" />
                                            <span>{settings.workingHours || brand.workingHours}</span>
                                          </div>
                                        </div>
                                      </div>

                                          {/* Social Channels */}
                                          <div className="pt-2 border-t border-[#22262B]">
                                            <span className="text-[11px] font-semibold text-[#73787E] uppercase tracking-wider block mb-2.5">
                                              Connect With Us
                                            </span>
                                            <div className="flex items-center gap-2.5">
                                              {settings.jijiShopUrl && (
                                                <a
                                                  href={settings.jijiShopUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  aria-label="Verified Store on Jiji.ng"
                                                  className="w-9 h-9 rounded-full bg-[#22262B] hover:bg-[#32383F] text-[#D1D1CC] hover:text-white flex items-center justify-center transition-all border border-[#3A4047]"
                                                  title="Jiji.ng Store"
                                                >
                                                  <Store className="w-4 h-4" />
                                                </a>
                                              )}

                                              {settings.facebookUrl && (
                                                <a
                                                  href={settings.facebookUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  aria-label="Follow on Facebook"
                                                  className="w-9 h-9 rounded-full bg-[#22262B] hover:bg-[#32383F] text-[#D1D1CC] hover:text-white flex items-center justify-center transition-all border border-[#3A4047]"
                                                  title="Facebook"
                                                >
                                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                  </svg>
                                                </a>
                                              )}

                                              {settings.instagramUrl && (
                                                <a
                                                  href={settings.instagramUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  aria-label="Follow on Instagram"
                                                  className="w-9 h-9 rounded-full bg-[#22262B] hover:bg-[#32383F] text-[#D1D1CC] hover:text-white flex items-center justify-center transition-all border border-[#3A4047]"
                                                  title="Instagram"
                                                >
                                                  <Instagram className="w-4 h-4" />
                                                </a>
                                              )}

                                              <a
                                                href={`https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${encodeURIComponent(whatsappDefaults.generalGreeting)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Direct WhatsApp Customer Care Agent"
                                                className="w-9 h-9 rounded-full bg-[#22262B] hover:bg-[#25D366] text-[#D1D1CC] hover:text-white flex items-center justify-center transition-all border border-[#3A4047]"
                                                title="WhatsApp"
                                              >
                                                <MessageSquare className="w-4 h-4" />
                                              </a>
                                            </div>
                                          </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bottom Attribution Line */}
                                      <div className="pt-8 border-t border-[#22262B] flex items-center justify-between flex-col sm:flex-row gap-4 text-center sm:text-left text-[11px] text-[#73787E]">
                                        <div>
                                          © {currentYear} {brand.name}. All rights reserved. Anambra Best Door Enterprises (CAC BN: {settings.cacNumber || brand.cacNumber}) is an operating property of {brand.name}.
                                        </div>
                                        <div className="flex items-center gap-4 text-[#A0A09B]">
                                          <Link href="/privacy" className="hover:text-white transition-colors">
                                            Privacy Policy
                                          </Link>
                                          <span>&bull;</span>
                                          <Link href="/returns" className="hover:text-white transition-colors">
                                            Return Policy
                                          </Link>
                                          <span>&bull;</span>
                                          <Link href="/terms" className="hover:text-white transition-colors">
                                            Terms &amp; Conditions
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </footer>
                                  );
}
