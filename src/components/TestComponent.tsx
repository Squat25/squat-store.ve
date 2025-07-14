"use client";
import styles from "./TestComponent.module.css";

export default function TestComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test Component</h1>
      <p className={styles.description}>
        Este es un componente de prueba para verificar que @apply funciona en
        CSS Modules.
      </p>
      <button className={styles.button}>Botón de Prueba</button>
    </div>
  );
}
