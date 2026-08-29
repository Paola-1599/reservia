import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/servicios');
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname)
        );
    },
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const esValido = 
    tiposPermitidos.test(file.mimetype) &&
    tiposPermitidos.test(path.extname(file.originalname).toLowerCase());

    if (esValido) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};

// Middleware de subida de archivos
const uploadServicio = multer({
    storage,
    fileFilter,
});
export default uploadServicio;