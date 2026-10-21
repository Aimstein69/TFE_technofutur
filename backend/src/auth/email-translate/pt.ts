export const pt = {
  verification: {
    subject: 'Confirma a tua conta PrivateChat',
    title: (username: string) => `Bem-vindo ao PrivateChat, ${username}`,
    introduction: 'Obrigado por criares a tua conta.',
    instruction: 'Para confirmares o teu endereço de email, clica no botão abaixo:',
    button: 'Confirmar o meu endereço de email',
    expiration: 'Este link expira dentro de 24 horas.',
    ignore: 'Se não criaste esta conta, podes ignorar este email.',
  },
  passwordReset: {
    subject: 'Redefinição da palavra-passe do PrivateChat',
    title: (username: string) => `Olá ${username},`,
    introduction: 'Pediste para redefinir a tua palavra-passe do PrivateChat.',
    instruction: 'Clica no botão abaixo para escolheres uma nova palavra-passe:',
    button: 'Redefinir a minha palavra-passe',
    expiration: 'Este link expira em 30 minutos e só pode ser utilizado uma vez.',
    ignore: 'Se não pediste esta redefinição, ignora este email.',
  },
};