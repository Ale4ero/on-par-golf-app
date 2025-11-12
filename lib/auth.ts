import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { User } from './types';

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update profile with display name
    await updateProfile(firebaseUser, { displayName: name });

    // Create user document in Firestore
    const userData: User = {
      uid: firebaseUser.uid,
      name: name,
      email: firebaseUser.email!,
      tournaments: [],
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('User data not found');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Create new user document
      const userData: User = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email!,
        tournaments: [],
        createdAt: new Date(),
      };

      await setDoc(userDocRef, userData);
      return userData;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
