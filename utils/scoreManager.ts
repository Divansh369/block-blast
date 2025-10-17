
import { ScoreEntry, SavedScores, GameMode } from '../types';

const SCORES_KEY = 'gemini-block-blast-scores';

const getDefaultScores = (): SavedScores => ({
  top: [],
  recent: [],
  saved: []
});

export const loadScores = (): SavedScores => {
  try {
    const saved = localStorage.getItem(SCORES_KEY);
    if (saved) {
      const scores = JSON.parse(saved) as SavedScores;
      // Basic validation
      if (scores && Array.isArray(scores.top) && Array.isArray(scores.recent) && Array.isArray(scores.saved)) {
        return scores;
      }
    }
  } catch (error) {
    console.error("Failed to load scores from localStorage", error);
  }
  return getDefaultScores();
};

export const saveScores = (scores: SavedScores) => {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error("Failed to save scores to localStorage", error);
  }
};

export const addScore = (
  score: number,
  playerName: string,
  mode: GameMode,
  isSaved: boolean = false
): ScoreEntry => {
  const allScores = loadScores();
  
  const newEntry: ScoreEntry = {
    id: `score_${Date.now()}_${Math.random()}`,
    score,
    timestamp: Date.now(),
    playerName,
    mode,
  };

  // Add to recent scores
  allScores.recent.unshift(newEntry);
  allScores.recent = allScores.recent.slice(0, 3);

  // Add to top scores if applicable
  allScores.top.push(newEntry);
  allScores.top.sort((a, b) => b.score - a.score);
  allScores.top = allScores.top.slice(0, 3);
  
  if (isSaved) {
    // Prevent duplicates in saved list
    if(!allScores.saved.find(s => s.id === newEntry.id)){
        allScores.saved.unshift(newEntry);
        allScores.saved = allScores.saved.slice(0, 10); // Keep last 10 saved
    }
  }

  saveScores(allScores);
  return newEntry;
};