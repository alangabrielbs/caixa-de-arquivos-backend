import User from "../models/User";

class VerifyEmail {
  async verifyEmail(req, res) {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token não fornecido" });
    }

    const user = await User.findOne({ tokenCheckEmail: token });

    if (!user) {
      return res.status(400).json({ error: "E-mail já verificado" });
    }

    user.verifiedEmail = true;
    user.tokenCheckEmail = null;
    user.save();

    return res.json({
      message: `Obrigado por verificar seu endereço de e-mail ${user.email}.`,
    });
  }
}

export default new VerifyEmail();
