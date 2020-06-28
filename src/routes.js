import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";

import authMiddlewares from "./app/middlewares/auth";

const routes = new Router();

import FolderController from "./app/controllers/FolderController";
import FileController from "./app/controllers/FileController";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ShareFolderController from "./app/controllers/ShareFolderController";
import ForgotPasswordController from "./app/controllers/ForgotPasswordController";
import VerifyEmailController from "./app/controllers/VerifyEmailController";

routes.get("/", (req, res) => res.json({ name: "Caixa de Arquivos - API" }));

routes.post("/users", UserController.createUser);
routes.post("/sessions", SessionController.createSession);

routes.post(
  "/passwords/forgot",
  ForgotPasswordController.createTokenForgotPassword
);

routes.put("/passwords/reset", ForgotPasswordController.updatePassword);

routes.get("/verify", VerifyEmailController.verifyEmail);

routes.use(authMiddlewares);

routes.put("/users", UserController.update);

routes.get("/folders", FolderController.showAllFoldersAndFiles);
routes.post("/folders/:parentFolderId", FolderController.createNewFolder);
routes.get("/folder/:id", FolderController.showFiles);
routes.put("/folder/:id", FolderController.favorite);

routes.get("/folders/shared", ShareFolderController.showFolderShare);
routes.post("/share/:folderId", ShareFolderController.shareFolder);
routes.delete("/share/:folderId", ShareFolderController.removeShare);

routes.post(
  "/folder/:id/files",
  multer(multerConfig).single("file"),
  FileController.uploadFile
);

export default routes;
