// ── roomController.js ─────────────────────────────────────────
const db=require('../config/db'),logger=require('../utils/logger');
const genCode=()=>Math.random().toString(36).substring(2,8).toUpperCase();

async function createRoom(req,res,next){
  try{
    const{themeSlug='dashavatara',maxPlayers=3,numRounds=3,isVsAi=false,aiDifficulty='medium',hukmAllowed=true}=req.body;
    const hostId=req.user.id;
    const{rows:[theme]}=await db.query('SELECT id FROM themes WHERE slug=$1 AND is_active=true',[themeSlug]);
    if(!theme)return res.status(404).json({error:'Theme not found'});
    let roomCode;
    for(let i=0;i<10;i++){roomCode=genCode();const d=await db.query("SELECT id FROM game_rooms WHERE room_code=$1 AND status IN('waiting','active')",[roomCode]);if(!d.rows.length)break;}
    const{rows:[room]}=await db.query(
      'INSERT INTO game_rooms(room_code,host_id,theme_id,max_players,num_rounds,is_vs_ai,ai_difficulty,hukm_allowed)VALUES($1,$2,$3,$4,$5,$6,$7,$8)RETURNING *',
      [roomCode,hostId,theme.id,maxPlayers,numRounds,isVsAi,isVsAi?aiDifficulty:null,hukmAllowed]
    );
    await db.query('INSERT INTO room_players(room_id,user_id,seat_index)VALUES($1,$2,0)',[room.id,hostId]);
    logger.info(`Room ${roomCode} created`);
    res.status(201).json({room,roomCode});
  }catch(err){next(err);}
}

async function joinRoom(req,res,next){
  try{
    const{code}=req.params,guestId=req.user.id;
    const{rows:[room]}=await db.query("SELECT * FROM game_rooms WHERE room_code=$1 AND status='waiting'",[code]);
    if(!room)return res.status(404).json({error:'Room not found or not accepting players'});
    if(room.is_vs_ai)return res.status(400).json({error:'Cannot join AI room'});
    const{rows:players}=await db.query('SELECT * FROM room_players WHERE room_id=$1',[room.id]);
    if(players.length>=room.max_players)return res.status(409).json({error:'Room is full'});
    if(players.find(p=>p.user_id===guestId))return res.status(409).json({error:'Already in room'});
    await db.query('INSERT INTO room_players(room_id,user_id,seat_index)VALUES($1,$2,$3)',[room.id,guestId,players.length]);
    res.json({message:'Joined',roomCode:code});
  }catch(err){next(err);}
}

async function getRoom(req,res,next){
  try{
    const{rows:[room]}=await db.query(
      `SELECT gr.*,t.slug AS theme_slug,t.name AS theme_name,u.username AS host_username
       FROM game_rooms gr JOIN themes t ON t.id=gr.theme_id JOIN users u ON u.id=gr.host_id
       WHERE gr.room_code=$1`,[req.params.code]);
    if(!room)return res.status(404).json({error:'Room not found'});
    const{rows:players}=await db.query(
      `SELECT rp.seat_index,rp.is_ready,u.id,u.username FROM room_players rp JOIN users u ON u.id=rp.user_id
       WHERE rp.room_id=$1 ORDER BY rp.seat_index`,[room.id]);
    res.json({room,players});
  }catch(err){next(err);}
}

// ── leaderboardController.js ──────────────────────────────────
async function getLeaderboard(req,res,next){
  try{
    const{themeSlug='dashavatara'}=req.params;
    const limit=Math.min(parseInt(req.query.limit||'30'),100);
    const{rows}=await db.query(
      `SELECT ROW_NUMBER()OVER(ORDER BY lb.rating DESC)AS rank,u.id,u.username,
         lb.wins,lb.losses,lb.total_games,lb.total_tricks,lb.win_rate,lb.rating
       FROM leaderboard lb JOIN users u ON u.id=lb.user_id JOIN themes t ON t.id=lb.theme_id
       WHERE t.slug=$1 ORDER BY lb.rating DESC LIMIT $2`,[themeSlug,limit]);
    res.json({leaderboard:rows});
  }catch(err){next(err);}
}

async function getHistory(req,res,next){
  try{
    const userId=req.user.id,limit=Math.min(parseInt(req.query.limit||'20'),50);
    const{rows}=await db.query(
      `SELECT gs.id AS session_id,gr.room_code,t.slug AS theme_slug,t.name AS theme_name,
         gs.total_rounds,gs.duration_secs,gs.final_scores,gs.started_at,gs.ended_at,
         CASE WHEN gs.winner_id=$1 THEN 'win' WHEN gs.winner_id IS NULL THEN 'draw' ELSE 'loss' END AS result,
         uw.username AS winner_username
       FROM game_sessions gs JOIN game_rooms gr ON gr.id=gs.room_id
       JOIN themes t ON t.id=gs.theme_id LEFT JOIN users uw ON uw.id=gs.winner_id
       JOIN room_players rp ON rp.room_id=gs.room_id AND rp.user_id=$1
       ORDER BY gs.started_at DESC LIMIT $2`,[userId,limit]);
    res.json({history:rows});
  }catch(err){next(err);}
}

async function updateStats(sessionId){
  const{rows:[session]}=await db.query('SELECT * FROM game_sessions WHERE id=$1',[sessionId]);
  if(!session||session.is_vs_ai)return;
  const{rows:players}=await db.query('SELECT user_id FROM room_players WHERE room_id=(SELECT room_id FROM game_sessions WHERE id=$1)',[sessionId]);
  const K=32;
  for(const p of players){
    const isWinner=p.user_id===session.winner_id,isDraw=!session.winner_id;
    const score=isDraw?0.5:isWinner?1:0;
    const{rows:[cur]}=await db.query('SELECT rating FROM leaderboard lb JOIN themes t ON t.id=lb.theme_id WHERE lb.user_id=$1 AND t.id=$2',[p.user_id,session.theme_id]);
    const rating=cur?.rating||1000,newRating=Math.max(100,Math.round(rating+K*(score-0.5)));
    const scores=session.final_scores||{};
    const myTricks=scores[p.user_id]||0;
    await db.query(
      `INSERT INTO leaderboard(user_id,theme_id,wins,losses,total_games,total_tricks,rating)
       VALUES($1,$2,$3,$4,1,$5,$6)ON CONFLICT(user_id,theme_id)DO UPDATE SET
         wins=leaderboard.wins+$3,losses=leaderboard.losses+$4,
         total_games=leaderboard.total_games+1,
         total_tricks=leaderboard.total_tricks+$5,rating=$6`,
      [p.user_id,session.theme_id,isWinner?1:0,(!isWinner&&!isDraw)?1:0,myTricks,newRating]
    );
  }
}

module.exports={createRoom,joinRoom,getRoom,getLeaderboard,getHistory,updateStats};
