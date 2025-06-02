"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-24 h-24 rounded-full object-cover border mb-4 shadow"
          referrerPolicy="no-referrer"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          {session.user.name}
        </h2>
        <p className="text-gray-600 mb-6">{session.user.email}</p>
        <Link
          href="/profile/pedidos"
          className="w-full text-center bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mb-6"
        >
          Ver mis pedidos
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
        >
          Cerrar Sesión
        </button>
        <div className="mt-8 w-full border-t pt-6 text-center text-gray-400 text-sm">
          Próximamente: métodos de pago, historial de compras y más.
        </div>
      </div>
    </div>
  );
}
