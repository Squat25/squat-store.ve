"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

interface SquatQuestionnaireData {
  name: string;
  email: string;
  interests: string[];
  rating: number;
  feedback: string;
  subscribe: boolean;
}

const interestsOptions = [
  "Ropa",
  "Zapatos",
  "Accesorios",
  "Nuevas temporadas",
  "Ofertas",
];

export default function SquatQuestionnaire() {
  const router = useRouter();
  const [data, setData] = useState<SquatQuestionnaireData>({
    name: "",
    email: "",
    interests: [],
    rating: 0,
    feedback: "",
    subscribe: false,
  });
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validaciones
  const isNameValid = data.name.length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isInterestsValid = data.interests.length > 0;
  const isRatingValid = data.rating > 0;
  const isFeedbackValid = data.feedback.length >= 10;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleInterestChange(interest: string) {
    setData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  }

  function handleRating(rating: number) {
    setData((prev) => ({ ...prev, rating }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempt(true);
    setLoading(true);
    if (
      !isNameValid ||
      !isEmailValid ||
      !isInterestsValid ||
      !isRatingValid ||
      !isFeedbackValid
    ) {
      setLoading(false);
      return;
    }
    // Aquí puedes enviar los datos a una API si quieres
    console.log("Cuestionario Squat:", data);
    setLoading(false);
    alert("¡Gracias por tu opinión!");
    router.push("/");
  }

  return (
    <div className={styles.sContainer}>
      <div className={styles.sBackground} aria-hidden="true" />
      <div className={styles.sLeft}>
        <h1 className={styles.sTitle}>¡Queremos saber tu opinión!</h1>
        <ul className={styles.sList}>
          <li className={styles.sListItem}>
            <svg
              className="w-6 h-6 text-purple-500 flex-shrink-0 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Participa en sorteos exclusivos
          </li>
          <li className={styles.sListItem}>
            <svg
              className="w-6 h-6 text-purple-500 flex-shrink-0 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            ¡Solo te tomará 1 minuto!
          </li>
          <li className={styles.sListItem}>
            <svg
              className="w-6 h-6 text-purple-500 flex-shrink-0 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Tu opinión nos ayuda a mejorar
          </li>
        </ul>
      </div>
      <div className={styles.sFormCard}>
        <form
          className={styles.sForm}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label className={styles.sLabel} htmlFor="name">
            Nombre completo *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className={styles.sInput}
            placeholder="Nombre completo"
            autoComplete="off"
          />
          <label className={styles.sLabel} htmlFor="email">
            Correo electrónico *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className={styles.sInput}
            placeholder="Correo electrónico"
            autoComplete="off"
          />
          <label className={styles.sLabel}>
            ¿Qué productos te interesan? *
          </label>
          <div className={styles.sCheckboxGroup}>
            {interestsOptions.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <input
                  type="checkbox"
                  checked={data.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className={styles.sCheckbox}
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
          <label className={styles.sLabel}>
            ¿Cómo calificarías tu experiencia? *
          </label>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className={
                  data.rating >= star
                    ? "text-yellow-400 w-8 h-8"
                    : "text-gray-300 w-8 h-8"
                }
                aria-label={`Calificar ${star}`}
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <label className={styles.sLabel} htmlFor="feedback">
            ¿Qué mejorarías de nuestra tienda? *
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={data.feedback}
            onChange={handleChange}
            rows={3}
            className={styles.sInput}
            placeholder="¿Qué mejorarías de nuestra tienda?"
          />
          <div className={styles.sCheckboxRow}>
            <input
              type="checkbox"
              name="subscribe"
              checked={data.subscribe}
              onChange={handleChange}
              className={styles.sCheckbox}
            />
            <span className={styles.sTerms}>
              Quiero recibir novedades y ofertas de Squat
            </span>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border-2 border-purple-500 text-purple-700 font-bold px-7 py-3 bg-white hover:bg-purple-50 transition shadow-sm min-w-[120px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-7 py-3 transition shadow-sm min-w-[120px]"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
