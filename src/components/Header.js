"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useContext } from "react";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineSparkles,
  HiOutlineGift,
} from "react-icons/hi";
import CartDrawer from "./CartDrawer";
import { CartContext } from "../context/CartContext";

const categories = [
  {
    name: "Mujer",
    href: "/collections/women",
    icon: <HiOutlineSparkles className="w-5 h-5 inline-block mr-1" />,
  },
  {
    name: "Hombre",
    href: "/collections/men",
    icon: <HiOutlineTag className="w-5 h-5 inline-block mr-1" />,
  },
  {
    name: "Accesorios",
    href: "/collections/accessories",
    icon: <HiOutlineGift className="w-5 h-5 inline-block mr-1" />,
  },
  {
    name: "Ofertas",
    href: "/sales",
    icon: <HiOutlineTag className="w-5 h-5 inline-block mr-1" />,
  },
];

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [menuOpen, setMenuOpen] = useState(false);
  const { setDrawerOpen, cart } = useContext(CartContext);

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-2 md:py-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/">
            <Image
              src="/LogoNegro.png"
              alt="Squat Logo"
              width={80}
              height={30}
              priority
              className="h-8 w-auto md:h-10 md:w-auto"
            />
          </Link>
        </div>

        {/* Categorías - Desktop */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center text-gray-700 hover:text-black font-medium text-lg px-3 py-2 transition-colors duration-200"
            >
              {cat.icon}
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/search" className="text-gray-700 hover:text-black p-2">
            <HiOutlineSearch className="w-6 h-6" />
          </Link>
          <button
            className="relative text-gray-700 hover:text-black p-2 focus:outline-none"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir carrito"
          >
            <HiOutlineShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {cart.length}
              </span>
            )}
          </button>
          <CartDrawer />
          {/* Ícono usuario solo en mobile, sin texto */}
          {!isLoading && (
            <Link
              href={session?.user ? "/profile" : "/login"}
              className="block md:hidden text-gray-700 hover:text-black p-2"
              aria-label={session?.user ? "Perfil" : "Iniciar Sesión"}
            >
              <HiOutlineUser className="w-6 h-6" />
            </Link>
          )}
          {/* Acceso usuario solo en desktop */}
          {!isLoading &&
            (session?.user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1 text-black text-sm md:text-base font-medium hover:underline"
                >
                  <HiOutlineUser className="w-6 h-6" />
                  Perfil
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-black hover:text-gray-500 transition-colors duration-200 text-sm md:text-base"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1 text-black hover:text-gray-500 transition-colors duration-200 text-sm md:text-base"
              >
                <HiOutlineUser className="w-6 h-6" />
                Iniciar Sesión
              </Link>
            ))}
          {/* Menú hamburguesa - solo móvil */}
          <button
            className="md:hidden text-gray-700 hover:text-black p-2 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? (
              <HiOutlineX className="w-7 h-7" />
            ) : (
              <HiOutlineMenu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Menú lateral móvil */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col gap-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl">Categorías</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <HiOutlineX className="w-7 h-7 text-gray-700" />
              </button>
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex items-center text-gray-700 hover:text-black font-medium text-lg px-2 py-2 rounded transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {cat.icon}
                {cat.name}
              </Link>
            ))}
            <div className="border-t pt-4 mt-4 flex flex-col gap-2">
              <Link
                href="/search"
                className="flex items-center gap-2 text-gray-700 hover:text-black px-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineSearch className="w-5 h-5" /> Buscar
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-700 hover:text-black px-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineShoppingBag className="w-5 h-5" /> Carrito
              </Link>
              {session?.user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-black px-2 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <HiOutlineUser className="w-5 h-5" /> Perfil
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-black px-2 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <HiOutlineUser className="w-5 h-5" /> Iniciar Sesión
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
