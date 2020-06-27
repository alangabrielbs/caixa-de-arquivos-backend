import multer from "multer";
import { resolve, extname } from "path";
import crypto from "crypto";

export default {
  dest: resolve(__dirname, "..", "..", "tmp"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${new Date().getTime()}${extname(
          file.originalname
        )}`;

        cb(null, file.key);
      });
    },
  }),
};
