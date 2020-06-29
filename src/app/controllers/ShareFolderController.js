import Folder from "../models/Folder";
import User from "../models/User";

import Queue from "../../lib/Queue";
import SharedFolder from "../jobs/SharedFolder";

class ShareFolderController {
  async shareFolder(req, res) {
    const { folderId } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ email });
    const owner = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const folder = await Folder.findById(folderId);
    const isOwner = folder.owner === req.userId;

    if (!folder) {
      return res.status(400).json({ error: "Pasta não existe" });
    }

    if (!isOwner) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para acessar esta pasta" });
    }

    const added = folder.sharedUsers.addToSet(user._id);

    if (added.length < 1) {
      return res
        .status(400)
        .json({ error: "Pasta já compartilhada com esse usuário" });
    }

    folder.save();

    await Queue.add(SharedFolder.key, {
      user,
      owner,
      folderName: folder.title,
    });

    return res.json(folder);
  }

  async removeShare(req, res) {
    const { folderId } = req.params;
    const { email } = req.body;

    const folder = await Folder.findById(folderId);
    const isOwner = folder.owner === req.userId;

    if (!folder) {
      return res.status(400).json({ error: "Pasta não existe" });
    }

    if (!isOwner) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para acessar esta pasta" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    folder.sharedUsers.pull(user.id);
    folder.save();

    return res.status(204).send();
  }

  async showFolderShare(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const allFolders = await Folder.find()
      .populate({
        path: "sharedUsers",
        select: ["name", "email", "sharedUsers"],
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const folders = allFolders.filter((folder) => {
      return folder.sharedUsers.some((s) => s.id === req.userId);
    });

    return res.json(folders);
  }
}

export default new ShareFolderController();
