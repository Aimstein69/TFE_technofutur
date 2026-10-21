import 'dotenv/config';

import { ClientSecretCredential } from '@azure/identity';

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

console.log('--- TEST AZURE ---');

console.log('Tenant ID :', tenantId);
console.log('Client ID :', clientId);
console.log(
    'Client Secret présent :',
    Boolean(clientSecret),
);

if (!tenantId || !clientId || !clientSecret) {
    console.error(
        'Configuration Azure incomplète.',
    );

    process.exit(1);
}

const credential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret,
);

try {
    console.log('Demande du token Microsoft Graph...');

    const accessToken = await credential.getToken(
        'https://graph.microsoft.com/.default',
    );

    if (!accessToken) {
        throw new Error(
            'Aucun token reçu.',
        );
    }

    console.log('Token obtenu avec succès.');
    console.log(
        'Expiration :',
        new Date(
            accessToken.expiresOnTimestamp,
        ).toISOString(),
    );

    console.log('--- TEST RÉUSSI ---');
} catch (error) {
    console.error('--- TEST ÉCHOUÉ ---');
    console.error(error);
}