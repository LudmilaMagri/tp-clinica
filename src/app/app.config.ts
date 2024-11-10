import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient  } from '@angular/common/http';
import { environment } from './environment';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"test-e76d9","appId":"1:623805625070:web:6564480b98cf67d4e2b9ff","storageBucket":"test-e76d9.firebasestorage.app","apiKey":"AIzaSyBZn3nP9wKNxt3iyUlH2HEWgt2ZfEh3aDw","authDomain":"test-e76d9.firebaseapp.com","messagingSenderId":"623805625070"})), provideStorage(() => getStorage())]
};
