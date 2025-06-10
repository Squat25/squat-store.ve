import Link from "next/link";

const categorias = [
  {
    nombre: "Damas",
    imagen: "/damas.png",
    href: "/collections/women",
    area: "damas",
  },
  {
    nombre: "Caballeros",
    imagen: "/caballeros.png",
    href: "/collections/men",
    area: "caballeros",
  },
  {
    nombre: "Calzados",
    imagen: "/zapatos.png",
    href: "/collections/shoes",
    area: "calzados",
  },
  {
    nombre: "Bolsos y Accesorios",
    imagen: "/bolsos.png",
    href: "/collections/accessories",
    area: "accesorios",
  },
  {
    nombre: "Nuevas Temporadas",
    imagen: "/nuevasTemporadas.png",
    href: "/collections/new-season",
    area: "nuevas_temporadas",
  },
];

export default function CategoriasDestacadas() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Explora por Categoría
      </h2>
      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateAreas:
            '"damas nuevas_temporadas caballeros" "accesorios nuevas_temporadas calzados"',
          gridTemplateColumns: "1fr 2fr 1fr",
          gridTemplateRows: "200px 200px",
        }}
      >
        {categorias.map((cat) => (
          <Link
            key={cat.nombre}
            href={cat.href}
            className="relative rounded-xl overflow-hidden group flex items-end shadow-lg"
            style={{ gridArea: cat.area, minHeight: 0 }}
          >
            <img
              src={cat.imagen}
              alt={cat.nombre}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
            <span className="relative z-10 text-white text-2xl sm:text-3xl font-extrabold p-6 drop-shadow-lg">
              {cat.nombre}
            </span>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-areas"] {
            display: flex !important;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
