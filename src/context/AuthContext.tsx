import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AdminUser } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  adminProfile: AdminUser | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync admin user profile in Firestore
  const syncAdminProfile = async (user: FirebaseUser, displayName?: string) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as AdminUser;
        setAdminProfile(data);
      } else {
        const newProfile: AdminUser = {
          uid: user.uid,
          name: displayName || user.displayName || user.email?.split('@')[0] || 'Admin User',
          email: user.email || '',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, {
          ...newProfile,
          updatedAt: new Date().toISOString(),
        });

        setAdminProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile to Firestore yet:', err);
      // Fallback local profile for uninterrupted dashboard session
      setAdminProfile({
        uid: user.uid,
        name: displayName || user.displayName || user.email?.split('@')[0] || 'Admin User',
        email: user.email || '',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncAdminProfile(user);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await syncAdminProfile(cred.user);
    } catch (error: any) {
      console.error('Firebase Auth Login Error:', error);
      let message = 'Failed to sign in. Please verify your email and password.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please check your credentials or register an account.';
      } else if (error.code === 'auth/operation-not-allowed') {
        message =
          'Email/Password sign-in is not yet enabled in the Firebase Console. You can also sign in with Google or enable Email/Password provider in the Firebase Authentication console.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please wait a moment and try again.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await syncAdminProfile(cred.user, name);
    } catch (error: any) {
      console.error('Firebase Auth Register Error:', error);
      let message = 'Failed to create user account.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        message =
          'Email/Password registration is not yet enabled in Firebase Console. Please enable Email/Password provider in Authentication settings.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      await syncAdminProfile(cred.user);
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      setAuthError(error.message || 'Google authentication failed.');
      throw error;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAdminProfile(null);
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      setAuthError('Failed to sign out.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminProfile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
