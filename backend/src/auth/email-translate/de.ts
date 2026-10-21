export const de = {
  verification: {
    subject: 'Bestätige dein PrivateChat-Konto',
    title: (username: string) => `Willkommen bei PrivateChat, ${username}`,
    introduction: 'Vielen Dank, dass du dein Konto erstellt hast.',
    instruction: 'Klicke auf die Schaltfläche unten, um deine E-Mail-Adresse zu bestätigen:',
    button: 'Meine E-Mail-Adresse bestätigen',
    expiration: 'Dieser Link läuft in 24 Stunden ab.',
    ignore: 'Wenn du dieses Konto nicht erstellt hast, kannst du diese E-Mail ignorieren.',
  },
  passwordReset: {
    subject: 'Setze dein PrivateChat-Passwort zurück',
    title: (username: string) => `Hallo ${username},`,
    introduction: 'Du hast eine Zurücksetzung deines PrivateChat-Passworts angefordert.',
    instruction: 'Klicke auf die Schaltfläche unten, um ein neues Passwort festzulegen:',
    button: 'Mein Passwort zurücksetzen',
    expiration: 'Dieser Link läuft in 30 Minuten ab und kann nur einmal verwendet werden.',
    ignore: 'Wenn du diese Passwortzurücksetzung nicht angefordert hast, ignoriere diese E-Mail.',
  },
};