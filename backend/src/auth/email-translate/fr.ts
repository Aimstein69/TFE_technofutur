export const fr = {
  verification: {
    subject: 'Confirmez votre compte PrivateChat',
    title: (username: string) => `Bienvenue sur PrivateChat ${username}`,
    introduction: "Merci d'avoir créé votre compte.",
    instruction: 'Pour confirmer votre adresse email, cliquez sur le bouton ci-dessous :',
    button: 'Confirmer mon adresse email',
    expiration: 'Ce lien expire dans 24 heures.',
    ignore: "Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.",
  },
  passwordReset: {
    subject: 'Réinitialisation de votre mot de passe PrivateChat',
    title: (username: string) => `Bonjour ${username},`,
    introduction: 'Vous avez demandé à réinitialiser votre mot de passe PrivateChat.',
    instruction: 'Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :',
    button: 'Réinitialiser mon mot de passe',
    expiration: "Ce lien expire dans 30 minutes et ne peut être utilisé qu'une seule fois.",
    ignore: "Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.",
  },
};