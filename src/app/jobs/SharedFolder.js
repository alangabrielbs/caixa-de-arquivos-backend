import Mail from "../../lib/Mail";

class SharedFolder {
  get key() {
    return "SharedFolder";
  }

  get options() {
    return {
      attempts: 3,
    };
  }

  async handle({ data }) {
    const { user, owner, folderName } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: `${folderName} - Convite para ver`,
      from: `${owner.name} (via Caixa de Arquivos) <${owner.email}>`,
      template: "sharedFolder",
      context: {
        folderName,
        ownerEmail: owner.email,
      },
    });
  }
}

export default new SharedFolder();
