import Mail from "../../lib/Mail";

class ForgotMail {
  get key() {
    return "ForgotMail";
  }

  get options() {
    return {
      attempts: 3,
    };
  }

  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Hora de recuperar sua senha",
      template: "forgot",
      context: {
        name: user.name,
        email: user.email,
        tokenForgotPassword: user.tokenForgotPassword,
      },
    });
  }
}

export default new ForgotMail();
