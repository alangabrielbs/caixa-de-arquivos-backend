import Mail from "../../lib/Mail";

class VerifyEmailMail {
  get key() {
    return "VerifyEmailMail";
  }

  get options() {
    return {
      attempts: 3,
    };
  }

  async handle({ data }) {
    const { name, email, tokenCheckEmail } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: "Verifique seu endereço de e-mail",
      template: "verifyEmail",
      context: {
        name,
        email,
        tokenCheckEmail,
      },
    });
  }
}

export default new VerifyEmailMail();
