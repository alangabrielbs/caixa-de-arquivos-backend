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
}

export default new FileController();
