const jwt=require('jsonwebtoken'),{v4:uuidv4}=require('uuid'),db=require('../config/db');
const AS=process.env.JWT_SECRET,RS=process.env.JWT_REFRESH_SECRET;
const signAccess=(p)=>jwt.sign(p,AS,{expiresIn:process.env.JWT_EXPIRES_IN||'15m',issuer:'ganjifa-api'});
const verifyAccess=(t)=>jwt.verify(t,AS,{issuer:'ganjifa-api'});
const verifyRefresh=async(t)=>{const d=jwt.verify(t,RS,{issuer:'ganjifa-api'});const{rows}=await db.query('SELECT * FROM refresh_tokens WHERE token=$1 AND user_id=$2 AND expires_at>NOW()',[t,d.sub]);if(!rows.length)throw new Error('Invalid');return d;};
const signRefresh=async(uid)=>{const t=jwt.sign({sub:uid,jti:uuidv4()},RS,{expiresIn:process.env.JWT_REFRESH_EXPIRES_IN||'7d',issuer:'ganjifa-api'});const d=jwt.decode(t);await db.query('INSERT INTO refresh_tokens(user_id,token,expires_at)VALUES($1,$2,$3)',[uid,t,new Date(d.exp*1000)]);return t;};
const revokeRefresh=(t)=>db.query('DELETE FROM refresh_tokens WHERE token=$1',[t]);
module.exports={signAccess,signRefresh,verifyAccess,verifyRefresh,revokeRefresh};
