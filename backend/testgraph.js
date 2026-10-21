import 'dotenv/config';

import { ClientSecretCredential } from '@azure/identity';

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

const userId =
    '3e611bcf-7947-463f-bbc9-e0fb41d24cb1';

const recipient =
    'l.dequinze@stag.technofurtic.education';

const credential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret,
);

console.log('--- TEST MICROSOFT GRAPH SENDMAIL ---');
console.log('Expéditeur ID :', userId);
console.log('Destinataire :', recipient);

try {
    const accessToken = await credential.getToken(
        'https://graph.microsoft.com/.default',
    );

    if (!accessToken) {
        throw new Error(
            'Impossible d’obtenir le token Graph.',
        );
    }

    console.log('Token Graph obtenu : OK');

    const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${userId}/sendMail`,
        {
            method: 'POST',

            headers: {
                Authorization: `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                message: {
                    subject: 'Test PrivateChat - Microsoft Graph',

                    body: {
                        contentType: 'HTML',
                        content:
                            '<h2>Test PrivateChat</h2><p>Si tu reçois cet email, Microsoft Graph fonctionne correctement.</p>',
                    },

                    toRecipients: [
                        {
                            emailAddress: {
                                address: recipient,
                            },
                        },
                    ],
                },

                saveToSentItems: true,
            }),
        },
    );

    console.log('Status Graph :', response.status);

    const body = await response.text();

    if (body) {
        console.log('Réponse Graph :');
        console.log(body);
    }

    if (response.ok) {
        console.log('');
        console.log('================================');
        console.log('ENVOI RÉUSSI');
        console.log('================================');
    } else {
        console.log('');
        console.log('================================');
        console.log('ENVOI ÉCHOUÉ');
        console.log('================================');
    }

} catch (error) {
    console.error('');
    console.error('--- ERREUR ---');
    console.error(error);
}