import * as Yup from "yup";
import { isBefore, addHours } from "date-fns";
import { uuid } from "uuidv4";
import User from "../models/User";

import Queue from "../../lib/Queue";
import ForgotMail from "../jobs/ForgotMail";
import PasswordRedefinedMail from "../jobs/PasswordRedefinedMail";

class ForgotPasswordController {
  async createTokenForgotPassword(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "E-mail obrigátorio" });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Não foi possível recuperar a senha. Tente novamente.",
      });
    }

    user.tokenForgotPassword = uuid();
    user.tokenForgotPasswordExpire = addHours(new Date(), 8);
    user.save();

    await Queue.add(ForgotMail.key, {
      user,
    });

    return res.json({ message: "Quase lá, dê uma checada em seu e-mail :)" });
  }

  async updatePassword(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string(),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { token, password } = req.body;

    const user = await User.findOne({ tokenForgotPassword: token });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token de redefinição de senha inválido." });
    }

    if (isBefore(Date.parse(user.tokenForgotPasswordExpire), new Date())) {
      return res
        .status(400)
        .json({ error: "Token de redefinição de senha expirado." });
    }

    user.password = password;
    user.tokenForgotPassword = null;
    user.tokenForgotPasswordExpire = null;
    user.save();

    await Queue.add(PasswordRedefinedMail.key, {
      name: user.name,
      email: user.email,
    });

    return res.json({ message: "Boa, agora é só fazer login :)" });
  }
}

export default new ForgotPasswordController();
