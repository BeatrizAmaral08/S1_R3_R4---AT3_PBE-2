import multer from "multer"; // usar para manipular arquivos, word etc
import path from "path";
import crypto from "crypto";
import fs from "fs"; // biblioteca que cria arquivos, biblioteca de diretórios etc

const baseUploadDir = path.resolve(process.cwd(), 'uploads');

const verificarDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });

    }
}

const creatMulter = ({ pasta, tipoPermitidos, tamanhoArquivo }) => {
    const pastaFinal = path.join(baseUploadDir, pasta);
    verificarDir(pastaFinal);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pastaFinal);
        },
        filename: (req, file, cb) => {
            const hash = crypto.randomBytes(12).toString('hex');
            cb(null, `${hash}-${file.originalname}`);
            // no lugar do hash deve ficar o id do produto
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!tipoPermitidos.includes(file.mimetype)) {
            return cb(new Error("tipo de arquivo não permitido"));
        }
        cb(null, true);
    }

    return multer({
        storage,
        limits: (tamanhoArquivo),
        fileFilter
    })
}

export default creatMulter; 