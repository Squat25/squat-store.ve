import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Logo/Descripción */}
          <div>
            <h2 className="text-2xl font-bold mb-2">SQUAT</h2>
            <p className="text-gray-300">
              Ropa deportiva de calidad para tu mejor versión. Vive el
              movimiento, vive SQUAT.
            </p>
          </div>
          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Enlaces Rápidos</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/collections" className="hover:underline">
                  Colecciones
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>
          {/* Columna 3: Información de Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contacto</h3>
            <p className="text-gray-300">Av. Principal, Caracas, Venezuela</p>
            <p className="text-gray-300">Tel: +58 123-4567890</p>
            <p className="text-gray-300">Email: info@squat.com</p>
          </div>
          {/* Columna 4: Redes Sociales / Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Síguenos</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  TikTok
                </a>
              </li>
            </ul>
            <div className="mt-4 text-gray-400 text-sm">
              Próximamente: Newsletter
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-gray-400">
          &copy; {new Date().getFullYear()} Squat. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
