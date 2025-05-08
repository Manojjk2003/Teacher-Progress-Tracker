import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyBFPG2Kq7ykw4oVWpmKzQWUKuzhym-y7DY",
        authDomain: "teacher-tracker-fce52.firebaseapp.com",
        projectId: "teacher-tracker-fce52",
        storageBucket: "teacher-tracker-fce52.firebasestorage.app",
        messagingSenderId: "197151859318",
        appId: "1:197151859318:web:8f6f7548c2dba9eb857557",
        measurementId: "G-H8VKLJENW4"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
