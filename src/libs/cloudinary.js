import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: "dfpb6voqm",
  api_key: "343757199466714",
  api_secret: "UcrYlatQ36t1IOiofOOWf4fBZ38",
});

export const uploadImage = async (filePath, customFileName) => {
  try {
    console.log(filePath);
    return await cloudinary.uploader.upload(filePath, {
      public_id: customFileName,
      folder: "products",
    });
  } catch (error) {
    console.error(error);

    if (error.message.includes("getaddrinfo ENOTFOUND")) {
      throw new Error(
        "No hay conexión a Internet. No se puede cargar la imagen."
      );
    } else {
      throw error;
    }
  }
};
export const deleteImage = async (id) => {
  return await cloudinary.uploader.destroy(id);
};

// Configurar el almacenamiento de Cloudinary para multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "mern-tasks-auth", // Carpeta donde se guardarán las imágenes
//     allowed_formats: ["jpg", "jpeg", "png", "gif"], // Formatos permitidos
//   },
// });

// Configurar multer con el almacenamiento de Cloudinary
// const upload = multer({ storage: storage });
