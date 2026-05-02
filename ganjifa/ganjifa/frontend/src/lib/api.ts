// src/lib/api.ts
import axios from 'axios';
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const api = axios.create({ baseURL:`${BASE}/api`, headers:{'Content-Type':'application/json'} });
api.interceptors.request.use(cfg=>{
  if(typeof window!=='undefined'){const t=localStorage.getItem('gj_access');if(t)cfg.headers.Authorization=`Bearer ${t}`;}
  return cfg;
});
let refreshing=false,q:any[]=[];
const flush=(e:any,t:string|null)=>{q.forEach(p=>e?p.reject(e):p.resolve(t));q=[];};
api.interceptors.response.use(r=>r,async err=>{
  const orig=err.config;
  if(err.response?.status===401&&err.response?.data?.code==='TOKEN_EXPIRED'&&!orig._retry){
    if(refreshing)return new Promise((res,rej)=>q.push({resolve:res,reject:rej})).then(t=>{orig.headers.Authorization=`Bearer ${t}`;return api(orig);});
    orig._retry=true;refreshing=true;
    try{const rt=localStorage.getItem('gj_refresh');if(!rt)throw new Error('no rt');
      const{data}=await axios.post(`${BASE}/api/auth/refresh`,{refreshToken:rt});
      localStorage.setItem('gj_access',data.accessToken);localStorage.setItem('gj_refresh',data.refreshToken);
      flush(null,data.accessToken);return api(orig);
    }catch(e){flush(e,null);localStorage.removeItem('gj_access');localStorage.removeItem('gj_refresh');window.location.href='/auth/login';return Promise.reject(e);}
    finally{refreshing=false;}
  }
  return Promise.reject(err);
});
export default api;
