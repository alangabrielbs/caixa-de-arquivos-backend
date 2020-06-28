import Mail from "../../lib/Mail";

class PasswordRedefinedMail {
  get key() {
    return "PasswordRedefinedMail";
  }

  get options() {
    return {
      attempts: 3,
    };
  }

  async handle({ data }) {
    const { name, email } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: "A sua senha da Caixa de Arquivos foi redefinida",
      template: "passwordRedefined",
      context: {
        name,
      },
    });
  }
}

export default new PasswordRedefinedMail();
