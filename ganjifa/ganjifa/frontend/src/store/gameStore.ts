import { create } from 'zustand';
import type { GameState, Room, RoomPlayer, GanjifaCard } from '@/types';

interface TrickEndEvent { trickWinner:string; trick:{playerId:string;card:GanjifaCard}[]; tricksWon:Record<string,number>; }

interface GameStore {
  room: Room|null;
  players: RoomPlayer[];
  gameState: GameState|null;
  lastTrick: TrickEndEvent|null;
  roundWinner: string|null;
  gameOver: { winner:string|null; finalScores:Record<string,number> }|null;
  hukmEvent: { suit:string|null; declaredBy:string }|null;
  chatMessages: { userId:string; username:string; message:string; ts:string }[];
  dealingAnimation: boolean;

  setRoom:        (room:Room, players:RoomPlayer[]) => void;
  setPlayers:     (players:RoomPlayer[]) => void;
  setGameState:   (state:GameState) => void;
  setLastTrick:   (evt:TrickEndEvent|null) => void;
  setRoundWinner: (winner:string|null) => void;
  setGameOver:    (evt:{winner:string|null;finalScores:Record<string,number>}|null) => void;
  setHukmEvent:   (evt:{suit:string|null;declaredBy:string}|null) => void;
  setDealing:     (v:boolean) => void;
  addChat:        (msg:GameStore['chatMessages'][0]) => void;
  reset:          () => void;
}

export const useGameStore = create<GameStore>((set)=>({
  room:null, players:[], gameState:null, lastTrick:null,
  roundWinner:null, gameOver:null, hukmEvent:null,
  chatMessages:[], dealingAnimation:false,

  setRoom:(room,players)=>set({room,players}),
  setPlayers:(players)=>set({players}),
  setGameState:(state)=>set({gameState:state,dealingAnimation:false}),
  setLastTrick:(evt)=>set({lastTrick:evt}),
  setRoundWinner:(winner)=>set({roundWinner:winner}),
  setGameOver:(evt)=>set({gameOver:evt}),
  setHukmEvent:(evt)=>set({hukmEvent:evt}),
  setDealing:(v)=>set({dealingAnimation:v}),
  addChat:(msg)=>set(s=>({chatMessages:[...s.chatMessages.slice(-100),msg]})),
  reset:()=>set({room:null,players:[],gameState:null,lastTrick:null,
    roundWinner:null,gameOver:null,hukmEvent:null,chatMessages:[],dealingAnimation:false}),
}));
