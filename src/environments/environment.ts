const getEnv = (key: string, fallback = ''): string => {
  try {
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env[key] || fallback;
    }
  } catch {
    // Ignore in browser context
  }
  return fallback;
};

export const environment = {
  production: true,
  firebase: {
    apiKey: getEnv('FIREBASE_API_KEY'),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
    databaseURL: getEnv('FIREBASE_DATABASE_URL'),
    projectId: getEnv('FIREBASE_PROJECT_ID', 'myagentcommerce-01'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('FIREBASE_APP_ID'),
  },
  useEmulators: false,
  emulators: {
    firestore: { host: '127.0.0.1', port: 8080 },
    storage: { host: '127.0.0.1', port: 9199 },
    database: { host: '127.0.0.1', port: 9000 },
  },
};
