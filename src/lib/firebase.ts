import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if valid Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
);

const app = isFirebaseConfigured
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export interface AuthUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'password';
}

/**
 * Sign in directly with Google account using Firebase
 */
export async function signInWithGoogle(): Promise<AuthUserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: FirebaseUser = result.user;
      return {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User Google',
        email: user.email || '',
        avatar: user.photoURL || undefined,
        provider: 'google',
      };
    } catch (error: any) {
      console.error('Firebase Google Auth error:', error);
      throw error;
    }
  }

  // Graceful Interactive Simulation (if user hasn't added Firebase keys yet)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'google-user-' + Date.now(),
        name: 'Om Bobi (Google)',
        email: 'ibobatsuga@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        provider: 'google',
      });
    }, 600);
  });
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, pass: string): Promise<AuthUserProfile> {
  if (isFirebaseConfigured && auth) {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return {
      id: res.user.uid,
      name: res.user.displayName || email.split('@')[0],
      email: res.user.email || email,
      provider: 'password',
    };
  }

  // Simulation mode
  return {
    id: 'user-' + Date.now(),
    name: email.split('@')[0],
    email,
    provider: 'password',
  };
}

/**
 * Register with email and password
 */
export async function registerWithEmail(email: string, pass: string, name: string): Promise<AuthUserProfile> {
  if (isFirebaseConfigured && auth) {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(res.user, { displayName: name });
    }
    return {
      id: res.user.uid,
      name: name || email.split('@')[0],
      email: res.user.email || email,
      provider: 'password',
    };
  }

  // Simulation mode
  return {
    id: 'user-' + Date.now(),
    name: name || email.split('@')[0],
    email,
    provider: 'password',
  };
}

/**
 * Logout
 */
export async function logOut(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
}
