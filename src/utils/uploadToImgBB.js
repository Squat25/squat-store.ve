export async function uploadToImgBB(file, apiKey) {
  // Convierte el archivo a base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Quita el prefijo "data:image/xxx;base64,"
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });

  const imageBase64 = await toBase64(file);

  // Sube la imagen a ImgBB
  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", imageBase64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    return data.data.url; // URL de la imagen subida
  } else {
    throw new Error("Error al subir la imagen a ImgBB");
  }
}
