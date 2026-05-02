export interface User { id:string; username:string; email:string; created_at:string; }

export type ThemeSlug = 'dashavatara' | 'ramayana' | 'geopolitics';
export interface Theme { id:string; slug:ThemeSlug; name:string; description:string; total_suits:number; cards_per_suit:number; total_cards:number; card_base_url:string; }

export interface GanjifaCard {
  id: string; suit: string; rank: string; type: 'bishbar'|'kambar';
  strength: number; isCourt: boolean; imageUrl: string;
  suitName: string; bgColor: string; borderColor: string; pipSymbol: string;
}

export type GamePhase = 'hukm' | 'playing' | 'round_end' | 'game_over';

export interface GameState {
  themeSlug: ThemeSlug;
  playerIds: string[];
  numRounds: number;
  currentRound: number;
  roundScores: Record<string, number[]>;
  sessionScores: Record<string, number>;
  hukm: string | null;
  hukmDeclaredBy: string | null;
  hukmPhase: boolean;
  currentTrick: { playerId:string; card:GanjifaCard }[];
  trickNumber: number;
  ledSuit: string | null;
  currentLeader: string;
  tricksWon: Record<string, number>;
  roundWinner: string | null;
  gameWinner: string | null;
  phase: GamePhase;
  moveCount: number;
  // Personalised fields (added by server)
  myHand?: GanjifaCard[];
  legalPlays?: string[];
  nextToPlay?: string;
  handSizes?: Record<string, number>;
}

export interface Room {
  id:string; room_code:string; host_id:string;
  theme_slug:ThemeSlug; theme_name:string; host_username:string;
  max_players:number; num_rounds:number; is_vs_ai:boolean;
  ai_difficulty:string|null; hukm_allowed:boolean;
  status:'waiting'|'active'|'finished'|'abandoned';
}

export interface RoomPlayer { id:string; username:string; seat_index:number; is_ready:boolean; }

export interface SuitDef {
  slug:string; name:string; nameHindi?:string; type:'bishbar'|'kambar';
  bgColor:string; borderColor:string; pipSymbol:string;
  avatar?:string; character?:string; label?:string; nation?:string;
}

export type Difficulty = 'easy'|'medium'|'hard';

export interface LeaderboardEntry {
  rank:number; id:string; username:string; wins:number; losses:number;
  total_games:number; total_tricks:number; win_rate:number; rating:number;
}

export interface HistoryEntry {
  session_id:string; room_code:string; theme_slug:ThemeSlug; theme_name:string;
  total_rounds:number; duration_secs:number|null;
  final_scores:Record<string,number>; result:'win'|'loss'|'draw';
  winner_username:string|null; started_at:string;
}
