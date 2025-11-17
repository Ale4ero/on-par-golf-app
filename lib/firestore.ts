import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Tournament, Score, Course, User, PlayerScore, HoleScore } from './types';

// ===== TOURNAMENT CRUD =====

export const createTournament = async (
  tournamentData: Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'tournaments'), {
      ...tournamentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating tournament: ${error.message}`);
  }
};

export const getTournament = async (tournamentId: string): Promise<Tournament | null> => {
  try {
    const docRef = doc(db, 'tournaments', tournamentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        startDate: docSnap.data().startDate.toDate(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as Tournament;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Error fetching tournament: ${error.message}`);
  }
};

export const updateTournament = async (
  tournamentId: string,
  updates: Partial<Tournament>
): Promise<void> => {
  try {
    const docRef = doc(db, 'tournaments', tournamentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Error updating tournament: ${error.message}`);
  }
};

export const deleteTournament = async (tournamentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tournaments', tournamentId));
  } catch (error: any) {
    throw new Error(`Error deleting tournament: ${error.message}`);
  }
};

export const getUserTournaments = async (userId: string): Promise<Tournament[]> => {
  try {
    // Get all tournaments and filter on the client side
    // This is necessary because Firestore array-contains doesn't work well with objects
    const querySnapshot = await getDocs(collection(db, 'tournaments'));

    const tournaments = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Tournament[];

    // Filter tournaments where user is in players array
    return tournaments.filter(tournament =>
      tournament.players.some(player => player.uid === userId)
    );
  } catch (error: any) {
    throw new Error(`Error fetching user tournaments: ${error.message}`);
  }
};

export const getTournamentByJoinCode = async (joinCode: string): Promise<Tournament | null> => {
  try {
    const q = query(
      collection(db, 'tournaments'),
      where('joinCode', '==', joinCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Tournament;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Error finding tournament: ${error.message}`);
  }
};

// ===== SCORE CRUD =====

export const submitScore = async (
  scoreData: Omit<Score, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'scores'), {
      ...scoreData,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error submitting score: ${error.message}`);
  }
};

export const getPlayerScores = async (
  tournamentId: string,
  playerId: string
): Promise<Score[]> => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('tournamentId', '==', tournamentId),
      where('playerId', '==', playerId),
      orderBy('hole', 'asc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Score[];
  } catch (error: any) {
    throw new Error(`Error fetching player scores: ${error.message}`);
  }
};

export const getTournamentScores = async (tournamentId: string): Promise<Score[]> => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('tournamentId', '==', tournamentId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Score[];
  } catch (error: any) {
    throw new Error(`Error fetching tournament scores: ${error.message}`);
  }
};

export const updateScore = async (scoreId: string, strokes: number): Promise<void> => {
  try {
    const docRef = doc(db, 'scores', scoreId);
    await updateDoc(docRef, {
      strokes,
      timestamp: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Error updating score: ${error.message}`);
  }
};

// ===== COURSE CRUD =====

export const createCourse = async (
  courseData: Omit<Course, 'courseId' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating course: ${error.message}`);
  }
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  try {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        courseId: docSnap.id,
        ...docSnap.data(),
      } as Course;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Error fetching course: ${error.message}`);
  }
};

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));

    return querySnapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error: any) {
    throw new Error(`Error fetching courses: ${error.message}`);
  }
};

// ===== REAL-TIME LISTENERS =====

export const subscribeTournamentScores = (
  tournamentId: string,
  callback: (scores: Score[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'scores'),
    where('tournamentId', '==', tournamentId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Score[];
    callback(scores);
  });
};

export const subscribeTournament = (
  tournamentId: string,
  callback: (tournament: Tournament | null) => void
): (() => void) => {
  const docRef = doc(db, 'tournaments', tournamentId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const tournament = {
        id: docSnap.id,
        ...docSnap.data(),
        startDate: docSnap.data().startDate.toDate(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as Tournament;
      callback(tournament);
    } else {
      callback(null);
    }
  });
};

// ===== UTILITY FUNCTIONS =====

export const generateJoinCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const addPlayerToTournament = async (
  tournamentId: string,
  player: any
): Promise<void> => {
  try {
    const docRef = doc(db, 'tournaments', tournamentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentPlayers = docSnap.data().players || [];
      await updateDoc(docRef, {
        players: [...currentPlayers, player],
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error: any) {
    throw new Error(`Error adding player to tournament: ${error.message}`);
  }
};
