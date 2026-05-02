const bcrypt=require('bcryptjs'),{body,validationResult}=require('express-validator');
const db=require('../config/db'),{signAccess,signRefresh,verifyRefresh,revokeRefresh}=require('../utils/jwt');
const logger=require('../utils/logger');
const registerRules=[body('username').trim().isLength({min:3,max:30}).matches(/^[a-zA-Z0-9_]+$/),body('email').isEmail().normalizeEmail(),body('password').isLength({min:8}).matches(/^(?=.*[A-Z])(?=.*[0-9])/)];
const loginRules=[body('email').isEmail().normalizeEmail(),body('password').notEmpty()];
function validate(req,res){const e=validationResult(req);if(!e.isEmpty()){res.status(422).json({errors:e.array()});return false;}return true;}

async function register(req,res,next){
  if(!validate(req,res))return;
  try{
    const{username,email,password}=req.body;
    const dup=await db.query('SELECT id FROM users WHERE email=$1 OR username=$2',[email,username]);
    if(dup.rows.length)return res.status(409).json({error:'Email or username already in use'});
    const hash=await bcrypt.hash(password,12);
    const{rows:[user]}=await db.query('INSERT INTO users(username,email,password_hash)VALUES($1,$2,$3)RETURNING id,username,email,created_at',[username,email,hash]);
    // Seed leaderboard
    const{rows:themes}=await db.query('SELECT id FROM themes WHERE is_active=true');
    for(const t of themes)await db.query('INSERT INTO leaderboard(user_id,theme_id)VALUES($1,$2)ON CONFLICT DO NOTHING',[user.id,t.id]);
    const accessToken=signAccess({sub:user.id,username:user.username});
    const refreshToken=await signRefresh(user.id);
    logger.info(`Registered: ${username}`);
    res.status(201).json({user,accessToken,refreshToken});
  }catch(err){next(err);}
}

async function login(req,res,next){
  if(!validate(req,res))return;
  try{
    const{email,password}=req.body;
    const{rows}=await db.query('SELECT * FROM users WHERE email=$1',[email]);
    const user=rows[0];
    if(!user||!(await bcrypt.compare(password,user.password_hash)))return res.status(401).json({error:'Invalid credentials'});
    const accessToken=signAccess({sub:user.id,username:user.username});
    const refreshToken=await signRefresh(user.id);
    const{password_hash,...safe}=user;
    res.json({user:safe,accessToken,refreshToken});
  }catch(err){next(err);}
}

async function refresh(req,res,next){
  try{
    const{refreshToken}=req.body;
    if(!refreshToken)return res.status(400).json({error:'Refresh token required'});
    const decoded=await verifyRefresh(refreshToken);
    await revokeRefresh(refreshToken);
    const{rows:[user]}=await db.query('SELECT id,username,email FROM users WHERE id=$1',[decoded.sub]);
    if(!user)return res.status(401).json({error:'User not found'});
    const accessToken=signAccess({sub:user.id,username:user.username});
    const newRefresh=await signRefresh(user.id);
    res.json({accessToken,refreshToken:newRefresh});
  }catch(err){next(err);}
}

async function logout(req,res,next){
  try{if(req.body.refreshToken)await revokeRefresh(req.body.refreshToken);res.json({message:'Logged out'});}
  catch(err){next(err);}
}

const me=(req,res)=>res.json({user:req.user});
module.exports={register,login,refresh,logout,me,registerRules,loginRules};
