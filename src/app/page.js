"use client";
import { useSession } from "next-auth/react";
import HeroSlider from "../components/HeroSlider";
import HomeClient from "../components/HomeClient";
import CategoriasDestacadas from "../components/CategoriasDestacadas";

export default function HomePage() {
  const { data: session } = useSession();
  return (
    <>
      {session?.user && (
        <div className="bg-green-100 text-green-800 py-4 text-center font-semibold">
          ¡Bienvenido, {session.user.name}!
        </div>
      )}
      <div className="relative">
        <HeroSlider />
      </div>
      <HomeClient />
      <CategoriasDestacadas />
    </>
  );
}
