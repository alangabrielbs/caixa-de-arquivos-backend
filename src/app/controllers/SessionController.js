import * as Yup from "yup";
import jwt from "jsonwebtoken";
import User from "../models/User";

import authConfig from "../../config/auth";

class SessionController {
  async createSession(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Senha não corresponde" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
