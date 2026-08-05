import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';

import { environment } from '../../environments/environment';

export const firebaseConfig = environment.firebase;
export const emulatorConfig = environment.emulators;

/**
 * Returns Angular environment providers for Firebase and Emulator connections
 */
export function provideFirebaseServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(
          firestore,
          environment.emulators.firestore.host,
          environment.emulators.firestore.port
        );
      }
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(
          storage,
          environment.emulators.storage.host,
          environment.emulators.storage.port
        );
      }
      return storage;
    }),
    provideDatabase(() => {
      const database = getDatabase();
      if (environment.useEmulators) {
        connectDatabaseEmulator(
          database,
          environment.emulators.database.host,
          environment.emulators.database.port
        );
      }
      return database;
    }),
  ]);
}
