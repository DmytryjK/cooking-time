// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

import { getDatabase } from 'firebase/database';

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAvMZXEUHGIAljF829YoMZRF07El9EvGJE',

    authDomain: 'recipe-list-beta.firebaseapp.com',

    databaseURL:
        'https://recipe-list-beta-default-rtdb.europe-west1.firebasedatabase.app',

    projectId: 'recipe-list-beta',

    storageBucket: 'recipe-list-beta.appspot.com',

    messagingSenderId: '823186553203',

    appId: '1:823186553203:web:e28f439995d638463aad06',

    measurementId: 'G-5M9K1KBNGG',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const database = getDatabase(app);

export const auth = getAuth(app);
