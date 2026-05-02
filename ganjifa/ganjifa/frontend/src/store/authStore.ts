// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import type { User } from '@/types';

interface AuthState {
  user:User|null; accessToken:string|null; refreshToken:string|null;
  isLoading:boolean; isHydrated:boolean;
  login:(email:string,password:string)=>Promise<void>;
  register:(username:string,email:string,password:string)=>Promise<void>;
  logout:()=>Promise<void>;
  setHydrated:()=>void;
}

export const useAuthStore = create<AuthState>()(persist((set,get)=>({
  user:null,accessToken:null,refreshToken:null,isLoading:false,isHydrated:false,
  setHydrated:()=>set({isHydrated:true}),
  login:async(email,password)=>{
    set({isLoading:true});
    try{const{data}=await api.post('/auth/login',{email,password});
      localStorage.setItem('gj_access',data.accessToken);localStorage.setItem('gj_refresh',data.refreshToken);
      set({user:data.user,accessToken:data.accessToken,refreshToken:data.refreshToken});
      connectSocket(data.accessToken);}
    finally{set({isLoading:false});}
  },
  register:async(username,email,password)=>{
    set({isLoading:true});
    try{const{data}=await api.post('/auth/register',{username,email,password});
      localStorage.setItem('gj_access',data.accessToken);localStorage.setItem('gj_refresh',data.refreshToken);
      set({user:data.user,accessToken:data.accessToken,refreshToken:data.refreshToken});
      connectSocket(data.accessToken);}
    finally{set({isLoading:false});}
  },
  logout:async()=>{
    try{await api.post('/auth/logout',{refreshToken:get().refreshToken});}catch{}
    localStorage.removeItem('gj_access');localStorage.removeItem('gj_refresh');
    disconnectSocket();set({user:null,accessToken:null,refreshToken:null});
  },
}),{name:'gj-auth',partialize:s=>({user:s.user,accessToken:s.accessToken,refreshToken:s.refreshToken}),
  onRehydrateStorage:()=>s=>s?.setHydrated()}));
