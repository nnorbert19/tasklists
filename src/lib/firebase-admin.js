import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = {
  project_id: process.env.PROJECT_ID,
  client_email: process.env.CLIENT_EMAIL,
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCXY5biTzCBd40I\nXMP0vA/0N9zmVU/Sb4AV9k85+tOg6e1cFXp8gTgXF8I7VghDvInNSEJoc3YsYXLa\nlgyHtzInXbGJnAsL7tpEc5/7raae9HAswe1t+tCcUknGku1P+di8fF3Kfff5fqjG\nObtxJccjomU77H930+HIhdyhm60+cog9mQbDm6auA2YM/eVoOKdNbz7YGwYCzFZK\nyRoBqnU/g0ZHJ/OTFwo+KYAv95AXZWkREthxt3lj+wWkAIZjj5jNepgqKfoXx0E0\nHujYFRWoxMiSb+B4PV9tK3ko7eS1PtV+pM8g2G5yyBfF3zkAMmPGfidw4vD2rbVK\nK8iaImjdAgMBAAECggEAHD9gZXzaM6YfgipxA+bdYTfVN4M+oCje8PojIVHskA9m\nEzMMxlOEKEbuHo04gI8a9VtgzMWSjMhoGmI6F063BIJmgKNFqmXYg0JB3T+zIeDB\nV5Cd4VIV/70Y9/ztW+lmKBFanNBxZzPbgRU/pOakKEGCezJvPGgkLnrPxrXaFxcV\nHR4O0Hy2cQD9QkPmgzE8f9pG0IBS1GuAAWN2zHrFXDmNaAG3cLKtd21DS0al9SUC\nFQu0CK/cMNa0wf9Neo9A9OKdiWjjPnxwlZUFJFh5ugWb8dPOEhITsn+vx8n9+Gim\nuddlV4TkZte7KxO+QruJKCnGxCpcjdRPSyO+DP5vIQKBgQDV9I1w3mtGU9JMsTJv\nYrZERoEheh0gYyAL57y7aLoL0MrXGg5+nXt3lxXi6xDVXu/JCMzD2sMMvpj1AzgD\npU6iar1GEomTBzzU6KP5rKGAoH0aanv4tyuiKl9iiuqr+4OCiotQU0oWO+8T/tES\nvsLBDvEqCBVuA3Q9inpk9KZuMQKBgQC1I4QmYAsv97oUbFHDBHUW2rMmDJrxMg1Q\nYxSSbtPW3mYAS1ZIpHZbpP/Q4gHIV8ijDmbSFRlbE+DqsKviDSF/S7W5FyrnQspl\n42wOMqEv2DJJJb/Xwz5Qa3nMdOFyz5hxqjVAOxzmrjGUKw/r+//7kfbA42zUmhZe\nQFtapmfebQKBgQCPJfgcNDQB8cManNPpwlnAhIuRImqqaKfgT0Pu/7q6fQ+5qy1X\neXZKJUP3dt7kY4h7MPAPeiZWOI+OHoEzrz5VXKUWZQC25njE2oIbYm0L6lTJf8VC\nOwtujHsVK2yndLggdyGOtKs1BRSIhEzOBeO3149zV8U+vgDfy+7n7OgNgQKBgFUm\nlQDVNW0fL0JaiTT7628K8Bx64Htx5ABeE1Wi88KWWazZvX34kgsSzY8ML3pWieLc\n6kjn0juWZKzu0F47ffuxQ4P2+Bwusaaj+i/SbSNopnrsW/q5tZlobKFIcJLgM/F6\n6f1/zF5ElNnqRFnS5MsGGtEiGA75QHqeFlPO1hUhAoGBAJ5go/e0f1c9F+0Jr/YY\nCrFVspCNPnwHYDgijAD3yTAS/DFB+gDvEieSwHLBnspvY6szyK83PjTXcGvu4F73\nmpUsBXAFw+smE1gJdQwGeQ+HkSrRkNNlFWzb3KNU0vu2LfSjtcp+XQ6EUWBM9oyO\nw0kUtSGLv6U/udQBBvUh1eGY\n-----END PRIVATE KEY-----\n',
};

const firebaseAdminConfig = {
  credential: cert(serviceAccount),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
