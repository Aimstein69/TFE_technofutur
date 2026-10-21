export const en = {
  verification: {
    subject: 'Confirm your PrivateChat account',
    title: (username: string) => `Welcome to PrivateChat, ${username}`,
    introduction: 'Thank you for creating your account.',
    instruction: 'To verify your email address, click the button below:',
    button: 'Verify my email address',
    expiration: 'This link expires in 24 hours.',
    ignore: "If you did not create this account, you can ignore this email.",
  },
  passwordReset: {
    subject: 'Reset your PrivateChat password',
    title: (username: string) => `Hello ${username},`,
    introduction: 'You requested to reset your PrivateChat password.',
    instruction: 'Click the button below to choose a new password:',
    button: 'Reset my password',
    expiration: 'This link expires in 30 minutes and can only be used once.',
    ignore: "If you did not request this password reset, please ignore this email.",
  },
};