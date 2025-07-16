"use client";
import Link from "next/link";
import Image from "next/image";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="w-full mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-base font-medium">
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href && !item.isCurrent ? (
              <Link
                href={item.href}
                style={{ color: "rgba(0,0,0,0.6)" }}
                className="hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black" aria-current="page">
                {item.label}
              </span>
            )}
            {idx < items.length - 1 && (
              <span className="flex items-center select-none">
                <Image
                  src="/flecha.svg"
                  alt=">"
                  width={16}
                  height={16}
                  className="inline-block align-middle"
                />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
