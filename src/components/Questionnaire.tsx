"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FunctionComponent, useState } from "react";
// import styles from "./Questionnaire.module.css";

interface QuestionnaireData {
  name: string;
  email: string;
  age: string;
  preferences: string[];
  feedback: string;
  rating: number;
}

const Questionnaire: FunctionComponent = () => {
  const router = useRouter();

  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>(
    {
      name: "",
      email: "",
      age: "",
      preferences: [],
      feedback: "",
      rating: 0,
    }
  );

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitAttempt, setSubmitAttempt] = useState(false);

  // Validaciones
  const isNameValid = questionnaireData.name.length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    questionnaireData.email
  );
  const isAgeValid =
    questionnaireData.age !== "" && parseInt(questionnaireData.age) >= 18;
  const isPreferencesValid = questionnaireData.preferences.length > 0;
  const isFeedbackValid = questionnaireData.feedback.length >= 10;
  const isRatingValid = questionnaireData.rating > 0;

  const preferencesOptions = [
    "Ropa deportiva",
    "Calzado casual",
    "Accesorios",
    "Ropa formal",
    "Ropa de temporada",
  ];

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestionnaireData({
      ...questionnaireData,
      name: e.target.value,
    });
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestionnaireData({
      ...questionnaireData,
      email: e.target.value,
    });
  }

  function handleAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestionnaireData({
      ...questionnaireData,
      age: e.target.value.replace(/\D/g, "").slice(0, 3),
    });
  }

  function handlePreferenceChange(preference: string) {
    const currentPreferences = [...questionnaireData.preferences];
    const index = currentPreferences.indexOf(preference);

    if (index > -1) {
      currentPreferences.splice(index, 1);
    } else {
      currentPreferences.push(preference);
    }

    setQuestionnaireData({
      ...questionnaireData,
      preferences: currentPreferences,
    });
  }

  function handleFeedbackChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuestionnaireData({
      ...questionnaireData,
      feedback: e.target.value,
    });
  }

  function handleRatingChange(rating: number) {
    setQuestionnaireData({
      ...questionnaireData,
      rating,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempt(true);
    setLoadingSubmit(true);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isAgeValid ||
      !isPreferencesValid ||
      !isFeedbackValid ||
      !isRatingValid
    ) {
      setLoadingSubmit(false);
      window.alert("Por favor completa todos los campos correctamente");
      return;
    }

    try {
      // Aquí puedes enviar los datos a tu API
      console.log("Datos del cuestionario:", questionnaireData);

      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 2000));

      window.alert("¡Cuestionario enviado exitosamente!");
      setLoadingSubmit(false);
      router.push("/");
    } catch (error) {
      window.alert("Error al enviar el cuestionario");
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="grid">
          {/* Columna izquierda */}
          <div className="leftColumn">
            <div className="titleContainer">
              <button className="backButton" onClick={() => router.back()}>
                <svg
                  className="backIcon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="title">Cuestionario de Satisfacción</h2>
            </div>
            <div className="infoSection">
              <div className="infoItem">
                <div className="infoIconBg">
                  <svg
                    className="infoIcon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="infoTitle">Tu opinión es importante</p>
                  <p className="infoSubtitle">Ayúdanos a mejorar</p>
                </div>
              </div>
              <div className="infoItem">
                <div className="infoIconBg">
                  <svg
                    className="infoIcon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="infoTitle">Datos seguros</p>
                  <p className="infoSubtitle">Información protegida</p>
                </div>
              </div>
            </div>
          </div>
          {/* Columna derecha */}
          <div className="rightColumn">
            <div className="headerRight">
              <div className="avatarBg">
                <svg
                  className="avatarIcon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="headerLabel">Cuestionario de Cliente</span>
            </div>
            <form onSubmit={handleSubmit} className="form">
              {/* Nombre */}
              <div className="formGroup">
                <label className="label">Nombre completo *</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className={`input ${
                      isNameValid
                        ? "inputValid"
                        : !isNameValid && submitAttempt
                        ? "inputInvalid"
                        : "inputDefault"
                    }`}
                    value={questionnaireData.name}
                    placeholder="Ingresa tu nombre completo"
                    onChange={handleNameChange}
                  />
                  {isNameValid && (
                    <div className="inputSuccessIcon">
                      <svg
                        className="successIcon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {/* Email */}
              <div className="formGroup">
                <label className="label">Correo electrónico *</label>
                <div className="inputWrapper">
                  <input
                    type="email"
                    className={`input ${
                      isEmailValid
                        ? "inputValid"
                        : !isEmailValid && submitAttempt
                        ? "inputInvalid"
                        : "inputDefault"
                    }`}
                    value={questionnaireData.email}
                    placeholder="tu@email.com"
                    onChange={handleEmailChange}
                  />
                  {isEmailValid && (
                    <div className="inputSuccessIcon">
                      <svg
                        className="successIcon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {/* Edad */}
              <div className="formGroup">
                <label className="label">Edad *</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className={`input ${
                      isAgeValid
                        ? "inputValid"
                        : !isAgeValid && submitAttempt
                        ? "inputInvalid"
                        : "inputDefault"
                    }`}
                    value={questionnaireData.age}
                    placeholder="Ingresa tu edad"
                    onChange={handleAgeChange}
                  />
                  {isAgeValid && (
                    <div className="inputSuccessIcon">
                      <svg
                        className="successIcon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {/* Preferencias */}
              <div className="formGroup">
                <label className="label">
                  ¿Qué tipo de productos prefieres? *
                </label>
                <div className="checkboxGrid">
                  {preferencesOptions.map((preference) => (
                    <label key={preference} className="checkboxLabel">
                      <input
                        type="checkbox"
                        checked={questionnaireData.preferences.includes(
                          preference
                        )}
                        onChange={() => handlePreferenceChange(preference)}
                        className="checkbox"
                      />
                      <span>{preference}</span>
                    </label>
                  ))}
                </div>
                {!isPreferencesValid && submitAttempt && (
                  <p className="errorText">
                    Selecciona al menos una preferencia
                  </p>
                )}
              </div>
              {/* Calificación */}
              <div className="formGroup">
                <label className="label">
                  ¿Cómo calificarías tu experiencia? *
                </label>
                <div className="starsRow">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`starButton ${
                        questionnaireData.rating >= star
                          ? "starActive"
                          : "starInactive"
                      }`}
                    >
                      <svg
                        className="starIcon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {!isRatingValid && submitAttempt && (
                  <p className="errorText">Selecciona una calificación</p>
                )}
              </div>
              {/* Comentarios */}
              <div className="formGroup">
                <label className="label">Comentarios adicionales *</label>
                <div className="inputWrapper">
                  <textarea
                    rows={4}
                    className={`textarea ${
                      isFeedbackValid
                        ? "inputValid"
                        : !isFeedbackValid && submitAttempt
                        ? "inputInvalid"
                        : "inputDefault"
                    }`}
                    value={questionnaireData.feedback}
                    placeholder="Comparte tus comentarios y sugerencias..."
                    onChange={handleFeedbackChange}
                  />
                  {isFeedbackValid && (
                    <div className="inputSuccessIcon">
                      <svg
                        className="successIcon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="helperText">
                  Mínimo 10 caracteres ({questionnaireData.feedback.length}/10)
                </p>
              </div>
              {/* Botones */}
              <div className="buttonRow">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="cancelButton"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="submitButton"
                >
                  {loadingSubmit ? (
                    <div className="loadingSpinner"></div>
                  ) : (
                    <>
                      <svg
                        className="submitIcon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Enviar Cuestionario</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
