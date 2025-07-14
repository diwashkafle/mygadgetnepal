"use client";

import Image from "next/image";

const paymentOptions = [
  { id: "COD", label: "Cash on Delivery",image:"/cod.png" },
  { id: "ESEWA", label: "eSewa",image:"/esewa.png" },
  { id: "FONEPAY", label: "Fonepay",image:"/fonepay.png" },
  { id: "KHALTI", label: "Khalti",image:"/khaki.png" },
];

export default function PaymentMethodSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid py-10 grid-cols-1 gap-4">
      {paymentOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`cursor-pointer border flex space-x-5 rounded-md p-4 transition-all ${
            selected === option.id
              ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
            <Image 
            src={option.image}
            alt={option.label}
            height={20}
            width={80}
            />
          <p className="text-center font-medium text-lg">{option.label}</p>
        </div>
      ))}
    </div>
  );
}
