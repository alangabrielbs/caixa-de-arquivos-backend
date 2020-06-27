import * as Yup from "yup";
import User from "../models/User";
import Folder from "../models/Folder";

class UserController {
  async createUser(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    const { id, name, email } = await User.create(req.body);

    await Folder.create({
      name: "Root",
      root: true,
      owner: id,
    });

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findById(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: "Usuário já existe." });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha não corresponde" });
    }

    if (oldPassword) {
      user.password = req.body.password;
      user.save();

      delete req.body.oldPassword;
      delete req.body.password;
      delete req.body.confirmPassword;
    }

    const userUpdade = await User.findOneAndUpdate(
      req.userId,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    return res.json(userUpdade);
  }
}

export default new UserController();
