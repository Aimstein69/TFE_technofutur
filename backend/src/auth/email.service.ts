import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ClientSecretCredential } from '@azure/identity';
import { getEmailTranslations } from './email-translate/email-translate.js';

@Injectable()
export class EmailService {
  private readonly credential: ClientSecretCredential;

  constructor() {
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      throw new Error(
        'Configuration Microsoft Graph incomplète.',
      );
    }

    this.credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret,
    );
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    token: string,
    language: string,
  ): Promise<void> {
    const translations = getEmailTranslations(language);
    const texts = translations.verification;

    const frontendUrl = process.env.FRONTEND_URL;
    const senderId = process.env.AZURE_MAIL_USER_ID;

    if (!frontendUrl) {
      throw new Error('FRONTEND_URL est manquant dans le fichier .env.');
    }

    if (!senderId) {
      throw new Error(
        'AZURE_MAIL_USER_ID est manquant dans le fichier .env.',
      );
    }

    const verificationUrl =
      `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    try {
      const accessToken = await this.credential.getToken(
        'https://graph.microsoft.com/.default',
      );

      if (!accessToken) {
        throw new Error(
          'Impossible d’obtenir le token Microsoft Graph.',
        );
      }

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${senderId}/sendMail`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              subject: texts.subject,
              body: {
                contentType: 'HTML',
                content: `
                  <h2>${texts.title(username)}</h2>

                  <p>${texts.introduction}</p>

                  <p>${texts.instruction}</p>

                  <p>
                    <a
                      href="${verificationUrl}"
                      style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:6px;
                      "
                    >
                      ${texts.button}
                    </a>
                  </p>

                  <p>${texts.expiration}</p>

                  <p>${texts.ignore}</p>
                `,
              },
              toRecipients: [
                {
                  emailAddress: {
                    address: email,
                  },
                },
              ],
            },
            saveToSentItems: true,
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();

        console.error(
          'Erreur Microsoft Graph :',
          response.status,
          errorBody,
        );

        throw new Error(
          `Microsoft Graph a retourné ${response.status}.`,
        );
      }
    } catch (error) {
      console.error(
        'Erreur lors de l’envoi de l’email de confirmation :',
        error,
      );

      throw new InternalServerErrorException(
        'Impossible d’envoyer l’email de confirmation.',
      );
    }
  }

  async sendPasswordResetEmail(
    email: string,
    username: string,
    token: string,
    language: string,
  ): Promise<void> {
    const translations = getEmailTranslations(language);
    const texts = translations.passwordReset;

    const frontendUrl = process.env.FRONTEND_URL;
    const senderId = process.env.AZURE_MAIL_USER_ID;

    if (!senderId) {
      throw new Error(
        'AZURE_MAIL_USER_ID est manquant dans le fichier .env.',
      );
    }

    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_URL est manquant dans le fichier .env.',
      );
    }

    const resetUrl =
      `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      const accessToken = await this.credential.getToken(
        'https://graph.microsoft.com/.default',
      );

      if (!accessToken) {
        throw new Error(
          'Impossible d’obtenir le token Microsoft Graph.',
        );
      }

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${senderId}/sendMail`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              subject: texts.subject,
              body: {
                contentType: 'HTML',
                content: `
                  <h2>${texts.title(username)}</h2>

                  <p>${texts.introduction}</p>

                  <p>${texts.instruction}</p>

                  <p>
                    <a
                      href="${resetUrl}"
                      style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:6px;
                      "
                    >
                      ${texts.button}
                    </a>
                  </p>

                  <p>${texts.expiration}</p>

                  <p>${texts.ignore}</p>
                `,
              },
              toRecipients: [
                {
                  emailAddress: {
                    address: email,
                  },
                },
              ],
            },
            saveToSentItems: true,
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();

        console.error(
          'Erreur Microsoft Graph :',
          response.status,
          errorBody,
        );

        throw new Error(
          `Microsoft Graph a retourné ${response.status}.`,
        );
      }
    } catch (error) {
      console.error(
        'Erreur lors de l’envoi de l’email de réinitialisation :',
        error,
      );

      throw new InternalServerErrorException(
        'Impossible d’envoyer l’email de réinitialisation.',
      );
    }
  }
}