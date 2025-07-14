"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t mt-10 text-sm text-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Company Info */}
        <div className="md:col-span-1">
          <Link href="/" className="inline-block mb-4">
          <h1 className="text-xl">My<span className="font-bold">Gadgets</span>Nepal</h1>
          </Link>
          <p className="text-neutral-600 mb-4">
            Nepal’s #1 destination for premium electronics and gadgets. Trusted by thousands.
          </p>
          <div className="flex gap-3 text-lg text-neutral-600">
            <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-semibold mb-3 text-neutral-800">Shop</h3>
          <ul className="space-y-2">
            <li><Link href="/categories/mobiles">Mobiles</Link></li>
            <li><Link href="/categories/laptops">Laptops</Link></li>
            <li><Link href="/categories/accessories">Accessories</Link></li>
            <li><Link href="/categories/headphones">Headphones</Link></li>
            <li><Link href="/categories/smartwatch">Smartwatches</Link></li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-semibold mb-3 text-neutral-800">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-3 text-neutral-800">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link href="/support">Help Center</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/track-order">Track Order</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold mb-3 text-neutral-800">Policies</h3>
          <ul className="space-y-2">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/shipping">Shipping Policy</Link></li>
            <li><Link href="/payment-methods">Payment Methods</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} MyGadgetNepal. All rights reserved.
      </div>
    </footer>
  );
}
