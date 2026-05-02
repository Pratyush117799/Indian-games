const{verifyAccess}=require('../utils/jwt'),db=require('../config/db');
async function authenticate(req,res,next){
  try{const h=req.headers.authorization;
    if(!h?.startsWith('Bearer '))return res.status(401).json({error:'Missing token'});
    const d=verifyAccess(h.split(' ')[1]);
    const{rows}=await db.query('SELECT id,username,email FROM users WHERE id=$1',[d.sub]);
    if(!rows.length)return res.status(401).json({error:'User not found'});
    req.user=rows[0];next();
  }catch(err){if(err.name==='TokenExpiredError')return res.status(401).json({error:'Token expired',code:'TOKEN_EXPIRED'});res.status(401).json({error:'Invalid token'});}
}
module.exports={authenticate};
