"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdSpaceDashboard, MdInventory } from "react-icons/md";
import { FaBookmark, FaShoppingBag } from "react-icons/fa";
import { BsBoxes } from "react-icons/bs";
import clsx from "clsx";

const navItems = [
  {
    label: "Overview",
    icon: <MdSpaceDashboard size={20} />,
    href: "/admin",
  },
  {
    label: "Products",
    icon: <BsBoxes size={20} />,
    href: "/admin/products",
  },
  {
    label: "Categories",
    icon: <MdInventory size={20} />,
    href: "/admin/categories",
  },
  {
    label: "Orders",
    icon: <FaShoppingBag size={20} />,
    href: "/admin/orders",
  },
  {
    label:"Manage Banners",
    icon:<FaBookmark size={20} />,
    href:"/admin/banner",

  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-4 text-xl font-bold">Admin Panel</div>
      <nav className="flex flex-col px-2 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200",
                isActive
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
