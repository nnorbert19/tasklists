import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = {
  project_id: process.env.PROJECT_ID,
  client_email: process.env.CLIENT_EMAIL,
  privateKey: JSON.parse(process.env.PRIVATE_KEY),
};

const firebaseAdminConfig = {
  credential: cert(serviceAccount),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
