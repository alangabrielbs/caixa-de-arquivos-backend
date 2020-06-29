import * as Yup from "yup";
import { extname } from "path";

import Folder from "../models/Folder";
import File from "../models/File";

class FileController {
  async uploadFile(req, res) {
    const { originalname, key } = req.file;

    const folder = await Folder.findById(req.params.id);

    const isOwner = folder.owner === req.userId;

    if (!isOwner) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para acessar esta pasta" });
    }

    const file = await File.create({
      name: originalname,
      path: key,
      owner: req.userId,
      folder: req.params.id,
    });

    folder.files.push(file);
    folder.save();

    const { _id, title, owner, url, createdAt } = file;

    return res.json({ _id, title, owner, url, createdAt });
  }

  async updateName(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { id } = req.params;
    const { name } = req.body;

    const file = await File.findById(id);

    file.name = `${name}${extname(file.path)}`;
    file.save();

    return res.json(file);
  }
}

export default new FileController();
