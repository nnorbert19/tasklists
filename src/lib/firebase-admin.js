import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = {
  project_id: process.env.PROJECT_ID,
  client_email: process.env.CLIENT_EMAIL,
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnF1raIzMqRHCc\nwVFmkDXzhUtXlB0f1pXm5X+MI9hyk1q+Cn9grPrjjMFE1BaswbhbEj9SUw0GMMph\nC3Q1xfKDYqvJ1VeO4i3PVQNMF2tN+/I706OpCos/nZlIykV8p0J1hZvoK9wnTOjr\nyiRrI++vVhbdmklwy9Dbv1BR96viDpk277hMWtpXbckFlnueLBRKflYmryQyNbgr\nDgCo4pRPqz6J0NR9cEruyak7ql/uh4f2U6CDndMtqX3cR4HDbVYP2/vknlZcxlJD\nMvwFp1/d/ga8QOTxx6UHjlWsAYN91fgXh3kl3duaAVyi1bX/ahUvo4/6Q5XFLEFz\ncTBT27IJAgMBAAECggEAGmg9AgudGvl9CLEewcRZ2nY+/YTZg34g68Bqg4Xov9bc\n+Prkva0o64yDwPJ58Oyey7nbCxI4FTnhyiuKvrLdjHksKDZQ47KIReOsJTrwSP9f\n/aeJjn4tmqy4HIJnL/epL7SherRv00A68YTdc5dW2pGTBIvNPoffptMaCRJI9m1R\nvxpU0yRJE7RD87FJHdMdVXmkWOMm0eAGxLUJKJ834CR39KVLFnzsGURu/OBC7pMT\nB++3Md7pNd6TOADPnQb9IQ+0zMUkdHmv3hfduiWB/MuVn8g6r7HxpDwR3FKm3n3A\nVFqAM2ZBeL9BkGmkt4wQNQ6/+tjnnRXnqD6BgL5S7wKBgQDaKoyE05Bm8pciCdaR\n2Vsv+RvABALWD2s1vAiqEccNw6Laos6CVBNkeV8AndBQtJxRNoSqt6Pptgjd9i2t\ntwcXuudcitilM6x2aO7I1N7PgshODvjB++2EEGs+21PCWOZUfLhePaNdrihWHED+\nabrTcyI7EFANSHwIP+HUSa8axwKBgQDEEVdZ8Y1oga+4WQLWZpqPsvp18Q4Q1q5E\neez1dpvHaynwuJ9jSHfdGUxATkiYjfd7ojEuCWsl6qmuVM4LhBkshb/xYoxIXDLZ\n1/lv9JsIchuZITSMsu3hlpCeEN3sBg/1zxBLEcpIXF0NgQCThM8JKFTdsSS+lEFH\nJm57ClB8rwKBgCo72G4SQr8bMVS+kNI1QKjd0ZhvblkgLQH+/7JktKMef1VR9SZX\nvlVSBakp49zryeMS6cXevRWOTtMhSCB78RyP6yAIJP5+LWHS2H76bpO/XqV10oRD\nD+zj/M7zSJiz+wraBhsAVbLZ9ycMWyylLSyn+jVy5/xaTuCN9VrSVNqbAoGALgMz\n0LPTT7c/ma+p7s7dbuO9y3fqqSD4fLFwXpqbLE2F5iwtm4siNgz9zAmTF9oZPjZt\n/DPRpXBQqczVHfa+QaiRxwAtk72vYVhB/XgV+gFtYJ5eSrajBNHk1nN24TD7BeC2\nHifqpNioLcccb4I3ZBrG78/mo6L/PsdSHiXphZkCgYEAhCxDHt0WR/zAk0iQkfDW\npcGb34Q0oafuXrQfBftpNekkykv44n78sszF764mQUF9OYHoR0H1bqO4XvMtJyRJ\nvqGktdeZWl2EMVHJAXViXtnihXHwqnvPxpwDBiKQpCnGUvDG4LtQ/K1MSEsINhjN\nPBzY67hrJvEVUKtR13PLg0Y=\n-----END PRIVATE KEY-----\n',
};

const firebaseAdminConfig = {
  credential: cert(serviceAccount),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
