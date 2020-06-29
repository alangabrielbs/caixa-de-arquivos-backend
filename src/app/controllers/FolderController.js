import * as Yup from "yup";
import Folder from "../models/Folder";

class FolderController {
  async createNewFolder(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { parentFolderId } = req.params;

    const folder = await Folder.create({
      ...req.body,
      owner: req.userId,
      parentFolder: parentFolderId,
    });

    const parentFolder = await Folder.findById(parentFolderId);

    parentFolder.folders.addToSet(folder._id);
    parentFolder.save();

    return res.json(folder);
  }

  async showFiles(req, res) {
    const { page = 1, limit = 10 } = req.query;

    const folder = await Folder.findById(req.params.id)
      .populate({
        path: "files",
        select: ["path", "title", "owner", "url", "createdAt"],
        options: { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit },
      })
      .populate({
        path: "folders",
        select: [
          "favorite",
          "sharedUsers",
          "title",
          "owner",
          "parentFolder",
          "lastVisit",
          "createdAt",
        ],
        options: { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit },
      });

    folder.set({ lastVisit: Date.now() });
    folder.save();

    return res.json(folder);
  }

  async showAllFoldersAndFiles(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const folders = await Folder.findOne({ owner: req.userId, root: true })
      .populate({
        path: "files",
        select: ["path", "title", "owner", "url", "createdAt"],
        options: { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit },
      })
      .populate({
        path: "folders",
        select: [
          "favorite",
          "sharedUsers",
          "title",
          "owner",
          "parentFolder",
          "lastVisit",
          "createdAt",
        ],
        options: { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit },
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json(folders);
  }

  async favorite(req, res) {
    const { id } = req.params;
    const { isFavorite } = req.query;

    const folder = await Folder.findOneAndUpdate(
      { _id: id },
      { favorite: isFavorite },
      { new: true }
    );

    return res.json(folder);
  }

  async updateTitle(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { id } = req.params;
    const { title } = req.body;

    const folder = await Folder.findOneAndUpdate(
      { _id: id },
      { title },
      { new: true }
    );

    return res.json(folder);
  }
}

export default new FolderController();
