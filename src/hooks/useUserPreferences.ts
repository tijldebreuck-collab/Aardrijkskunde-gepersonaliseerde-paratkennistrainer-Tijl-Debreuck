import { useState, useEffect } from 'react';
import { auth, db, doc, getDoc, setDoc, updateDoc } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface UserPreferences {
  selectedRegions: string[];
  selectedCategories: string[];
  difficulty: 'all' | 'makkelijk' | 'gemiddeld' | 'moeilijk';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedRegions: ['belgium'],
  selectedCategories: ['province'],
  difficulty: 'all',
};

const GUEST_STORAGE_KEY = 'geoTrainerGuestData';

export function useUserPreferences() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [stats, setStats] = useState<any>({});
  const [progress, setProgress] = useState<any>({});

  const [pendingMigration, setPendingMigration] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // User logged in, fetch from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.preferences) setPreferences(data.preferences);
            
            // Sync cloud data to local storage for useQuizEngine
            if (data.geoStats) {
              localStorage.setItem('geo_trainer_stats', JSON.stringify(data.geoStats));
              setStats(data.geoStats);
            }
            if (data.geoProgress) {
              localStorage.setItem('geo_trainer_progress', JSON.stringify(data.geoProgress));
              setProgress(data.geoProgress);
            }
          } else {
            // New user! Check if there is local guest data
            const localData = localStorage.getItem(GUEST_STORAGE_KEY);
            const localStatsStr = localStorage.getItem('geo_trainer_stats');
            const localProgressStr = localStorage.getItem('geo_trainer_progress');
            
            // Has the user done anything locally? Let's check stats.
            const hasLocalStats = localStatsStr && JSON.parse(localStatsStr).totalAnswered > 0;
            const hasLocalPrefs = localData !== null;
            
            if (hasLocalStats || hasLocalPrefs) {
               // We have local data. Prompt the user.
               setCurrentUserData(currentUser);
               setPendingMigration(true);
            } else {
               // No local data, just initialize quietly
               await setDoc(userDocRef, {
                 email: currentUser.email,
                 displayName: currentUser.displayName,
                 createdAt: new Date().toISOString(),
                 preferences: DEFAULT_PREFERENCES,
                 geoStats: {},
                 geoProgress: {},
               });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Guest mode
        const localData = localStorage.getItem(GUEST_STORAGE_KEY);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.preferences) setPreferences(parsed.preferences);
          } catch (e) {
            console.error("Invalid local storage data");
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMigrationChoice = async (shouldMigrate: boolean) => {
      if (!currentUserData) return;
      const userDocRef = doc(db, 'users', currentUserData.uid);
      
      let initialPrefs = DEFAULT_PREFERENCES;
      let localStats = {};
      let localProgress = {};
      
      if (shouldMigrate) {
          const localData = localStorage.getItem(GUEST_STORAGE_KEY);
          if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.preferences) initialPrefs = parsed.preferences;
          }
          localStats = JSON.parse(localStorage.getItem('geo_trainer_stats') || '{}');
          localProgress = JSON.parse(localStorage.getItem('geo_trainer_progress') || '{}');
      } else {
         // Wipe the local stuff so they start fresh
         localStorage.removeItem(GUEST_STORAGE_KEY);
         localStorage.removeItem('geo_trainer_stats');
         localStorage.removeItem('geo_trainer_progress');
      }

      await setDoc(userDocRef, {
        email: currentUserData.email,
        displayName: currentUserData.displayName,
        createdAt: new Date().toISOString(),
        preferences: initialPrefs,
        geoStats: localStats,
        geoProgress: localProgress,
      });
      
      setPreferences(initialPrefs);
      setStats(localStats);
      setProgress(localProgress);
      setPendingMigration(false);
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          preferences: updated,
          'preferences.lastUpdated': new Date().toISOString()
        });
      } catch (error) {
        console.error("Error saving preferences to Firestore:", error);
      }
    } else {
      const currentData = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || '{}');
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({
        ...currentData,
        preferences: updated
      }));
    }
  };

  // Call this after a quiz session to sync local stats to cloud
  const syncLocalStatsToCloud = async () => {
    if (user) {
      try {
        const localStats = JSON.parse(localStorage.getItem('geo_trainer_stats') || '{}');
        const localProgress = JSON.parse(localStorage.getItem('geo_trainer_progress') || '{}');
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          geoStats: localStats,
          geoProgress: localProgress
        });
        setStats(localStats);
        setProgress(localProgress);
      } catch (error) {
        console.error("Error syncing stats to Firestore:", error);
      }
    }
  };

  return { user, loading, preferences, stats, progress, updatePreferences, syncLocalStatsToCloud, pendingMigration, handleMigrationChoice };
}
