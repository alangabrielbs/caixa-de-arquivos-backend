import jwt from "jsonwebtoken";
import { promisify } from "util";

import authConfig from "../../config/auth";

import File from "../models/File";
import Folder from "../models/Folder";

export default async (req, res, next) => {
  const [, filePath] = req._parsedUrl.pathname.split("files/");
  const { t: token } = req.query;

  if (!token) {
    return res.status(401).json({ error: "Sem permissão para acessar" });
  }

  const fileExists = await File.findOne({ path: filePath });

  if (!fileExists) {
    return res.status(400).json({ error: "Arquivo não existe" });
  }

  const folder = await Folder.findById(fileExists.folder);

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);
    const isPermission =
      folder.owner === id ||
      folder.sharedUsers.find((shareId) => shareId.toString() === id);

    if (!isPermission) {
      return res.status(401).json({ error: "Sem permissão para acessar" });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
