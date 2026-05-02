// ── routes/auth.js ────────────────────────────────────────────
const r1=require('express').Router(),ac=require('../controllers/authController');
const{authenticate}=require('../middleware/auth'),rateLimit=require('express-rate-limit');
const lim=rateLimit({windowMs:15*60*1000,max:20,message:{error:'Too many attempts'}});
r1.post('/register',lim,ac.registerRules,ac.register);
r1.post('/login',lim,ac.loginRules,ac.login);
r1.post('/refresh',ac.refresh);r1.post('/logout',ac.logout);r1.get('/me',authenticate,ac.me);
module.exports=r1;
