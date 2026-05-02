'use strict';
/*
 * game.js — Delhi Diaries: Ultimate Edition
 * Full game engine: map, player, NPCs, debates, modals, HUD, draw loop.
 * Improvements over original:
 *   • Canvas focus fix  — focus is ALWAYS reclaimed after any button click
 *   • NPC roaming AI    — Street Citizens walk randomly on ROAD tiles
 *   • Category questions — each debate type draws from the matching question pool
 *   • Save integration  — Ctrl+S / Save button calls saveGameToServer()
 */

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════ */

const TILE_SIZE = 40;
const MAP_COLS  = 300;
const MAP_ROWS  = 300;

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const CAM_COLS = Math.floor(canvas.width  / TILE_SIZE); // 20
const CAM_ROWS = Math.floor(canvas.height / TILE_SIZE); // 12

/* DOM refs */
const dialogueBox   = document.getElementById('dialogue-box');
const debateModal   = document.getElementById('debate-modal');
const resultModal   = document.getElementById('result-modal');
const tttModal      = document.getElementById('ttt-modal');
const travelModal   = document.getElementById('travel-modal');
const shopModal     = document.getElementById('shop-modal');
const wagerSlider   = document.getElementById('wager-slider');
const wagerValueTxt = document.getElementById('wager-value');

/* Tile colour palette */
const C = {
  GRASS:'#166534', ROAD:'#71717a', WALL:'#b45309', DOOR:'#fcd34d',
  PARL_WALL:'#94a3b8', PARL_FLOOR:'#e2e8f0', PARL_DOOR:'#fbbf24',
  JAIL_WALL:'#18181b', JAIL_FLOOR:'#27272a', JAIL_BARS:'#52525b',
  CLUB_WALL:'#6d28d9', CLUB_FLOOR:'#8b5cf6', CLUB_DOOR:'#d8b4fe',
  LIB_WALL:'#0369a1',  LIB_FLOOR:'#38bdf8',  LIB_DOOR:'#7dd3fc',
  DU_WALL:'#991b1b',   DU_FLOOR:'#fca5a5',   DU_DOOR:'#f87171', DU_ADMIN:'#ef4444',
  MALL_WALL:'#047857', MALL_FLOOR:'#34d399',  MALL_DOOR:'#6ee7b7',
  WATER:'#0284c7'
};

const WALKABLE = new Set([
  'GRASS','ROAD','DOOR','PARL_DOOR','CLUB_DOOR','CLUB_FLOOR','PARL_FLOOR',
  'JAIL_FLOOR','LIB_FLOOR','LIB_DOOR','DU_FLOOR','DU_DOOR','DU_ADMIN',
  'MALL_FLOOR','MALL_DOOR'
]);

/* ══════════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════════ */

let gameState     = 'PLAYING';
let currentOpp    = null;
let currentWager  = 200;
let debateType    = '';
let tttGameOver   = false;

const DEFAULT_PLAYER = {
  x:285, y:280, color:'#3b82f6', facing:'up',
  money:5000, xp:0, level:1, day:1,
  intellectScore:0, intellectAttempted:0,
  hasPaidClubFee:false, hasClubMembership:false,
  parliamentVisitsToday:0, hasLibraryPass:false,
  duStatus:'None', guestPassDay:0, duScore:0, duAttempted:0,
  assets:[]
};

let player = { ...DEFAULT_PLAYER };

/* ══════════════════════════════════════════════════════════════
   MAP
   ══════════════════════════════════════════════════════════════ */

let map = Array.from({length: MAP_ROWS}, () => Array(MAP_COLS).fill('GRASS'));

function drawRect(sx, sy, w, h, type) {
  for (let y = sy; y < sy+h; y++)
    for (let x = sx; x < sx+w; x++)
      if (y >= 0 && y < MAP_ROWS && x >= 0 && x < MAP_COLS) map[y][x] = type;
}

function buildMap() {
  map = Array.from({length: MAP_ROWS}, () => Array(MAP_COLS).fill('GRASS'));
  // Roads
  drawRect(0,15,300,6,'ROAD'); drawRect(0,150,300,6,'ROAD');
  drawRect(0,270,300,6,'ROAD'); drawRect(15,0,6,300,'ROAD');
  drawRect(150,0,6,300,'ROAD'); drawRect(275,0,6,300,'ROAD');
  // Buildings
  drawRect(20,20,16,16,'PARL_WALL'); drawRect(21,21,14,14,'PARL_FLOOR'); drawRect(27,35,2,1,'PARL_DOOR');
  drawRect(280,20,18,16,'JAIL_WALL'); drawRect(281,21,16,14,'JAIL_FLOOR'); drawRect(280,35,18,1,'JAIL_BARS');
  drawRect(130,130,20,12,'CLUB_WALL'); drawRect(131,131,18,10,'CLUB_FLOOR'); drawRect(139,141,2,1,'CLUB_DOOR');
  drawRect(160,130,20,15,'LIB_WALL'); drawRect(161,131,18,13,'LIB_FLOOR'); drawRect(169,144,2,1,'LIB_DOOR');
  drawRect(20,240,30,20,'MALL_WALL'); drawRect(21,241,28,18,'MALL_FLOOR'); drawRect(34,259,2,1,'MALL_DOOR');
  drawRect(50,25,160,100,'DU_WALL'); drawRect(51,26,158,98,'DU_FLOOR'); drawRect(129,124,4,1,'DU_DOOR');
  drawRect(60,30,20,20,'DU_ADMIN');
  drawRect(80,70,40,30,'PARL_WALL'); drawRect(81,71,38,28,'PARL_FLOOR');
  // Homes
  drawRect(280,280,8,8,'WALL'); map[287][284]='DOOR';
  drawRect(260,280,8,8,'WALL'); map[287][264]='DOOR';
  drawRect(240,280,8,8,'WALL'); map[287][244]='DOOR';
  drawRect(220,280,8,8,'WALL'); map[287][224]='DOOR';
}

buildMap();

const buildingLabels = [
  {text:'PARLIAMENT OF INDIA', x:28,  y:19},
  {text:'TIHAR JAIL',          x:289, y:19},
  {text:'DELHI UNIVERSITY',    x:130, y:24},
  {text:'INTELLECTS CLUB',     x:140, y:129},
  {text:'NATIONAL LIBRARY',    x:170, y:129},
  {text:'THE GREAT MALL',      x:35,  y:239},
  {text:'YOUR HOUSE',          x:284, y:279}
];

/* ══════════════════════════════════════════════════════════════
   NPCs
   ══════════════════════════════════════════════════════════════ */

let npcs = [];

function buildNPCs() {
  npcs = [
    {x:284, y:289, color:'#ec4899', name:'Mom'},
    {x:138, y:142, color:'#e2e8f0', name:'Club Guard',    isClubGuard:true},
    {x:168, y:145, color:'#e2e8f0', name:'Library Guard', isLibGuard:true},
    {x:128, y:125, color:'#e2e8f0', name:'DU Security',   isDUGuard:true},
    {x:33,  y:260, color:'#e2e8f0', name:'Mall Entrance', isMallGuard:true},
    {x:30,  y:250, color:'#f59e0b', name:'Shopkeeper',    isShop:true},
  ];
  // Signboards
  [{x:21,  y:17,  msg:'⬅️ Parliament Entry\n⬆️ Delhi University (East)\n⬇️ The Great Mall (South)'},
   {x:150, y:17,  msg:'⬆️ Delhi University Main Gate\n⬅️ Parliament\n➡️ Tihar Jail'},
   {x:153, y:148, msg:'⬅️ Intellects Club & Library\n⬆️ DU & Parliament\n⬇️ Mall & Residences'},
   {x:273, y:273, msg:'➡️ Residential Colony\n⬅️ The Great Mall\n⬆️ Main Highways'}
  ].forEach(s => npcs.push({x:s.x, y:s.y, color:'#8B4513', name:'Signboard', isSignboard:true, message:s.msg}));
  // Friends
  [{x:264,y:289,name:'Rahul'},{x:244,y:289,name:'Aman'},{x:224,y:289,name:'Karan'}]
    .forEach(f => npcs.push({...f, color:'#14b8a6', isFriend:true}));
  // Intellectuals
  for (let i = 0; i < 11; i++) {
    npcs.push({
      x:132+(i%6)*2, y:133+Math.floor(i/6)*2,
      color:'#d946ef', name:'Intellectual', isIntellect:true,
      qs: [getRandomQ('philosophy'), getRandomQ('philosophy'), getRandomQ('philosophy')],
      progress:0
    });
  }
  // Parliament NPC
  npcs.push({x:25,y:25,color:'#f87171',name:'Home Minister',isParliament:true,
    qs:[getRandomQ('politics')]});
  // DU Admin
  for (let i = 0; i < 11; i++)
    npcs.push({x:62+(i%4)*4, y:32+Math.floor(i/4)*4, color:'#ef4444', name:'Senior Prof', isDUAdmin:true, q:getRandomQ('science')});
  // DU Students
  for (let i = 0; i < 55; i++) {
    let rx = 55+Math.floor(Math.random()*140), ry = 28+Math.floor(Math.random()*90);
    if (rx>=60&&rx<=80&&ry>=30&&ry<=50) continue;
    npcs.push({x:rx, y:ry, color:'#f97316', name:'DU Scholar', isDUStudent:true, q:getRandomQ('history')});
  }
  // Street wager citizens (with roaming AI)
  for (let i = 0; i < 40; i++) {
    let rx = 1+Math.floor(Math.random()*298);
    let ry = Math.random()>.5 ? (15+Math.floor(Math.random()*6)) : (150+Math.floor(Math.random()*6));
    npcs.push({x:rx, y:ry, color:'#eab308', name:'Citizen', isWager:true,
      q:getRandomQ('delhi_gk'), isRoaming:true, roamTimer:0, roamDir:null});
  }
}

buildNPCs();

/* ══════════════════════════════════════════════════════════════
   NPC ROAMING AI
   ══════════════════════════════════════════════════════════════ */

const DIRS = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];

function tickNPCs() {
  if (gameState !== 'PLAYING') return;
  npcs.forEach(n => {
    if (!n.isRoaming) return;
    n.roamTimer = (n.roamTimer || 0) + 1;
    if (n.roamTimer < 18) return; // move every ~18 frames (≈ 0.3s at 60fps)
    n.roamTimer = 0;
    // Pick a random walkable direction
    const shuffled = DIRS.slice().sort(() => Math.random()-.5);
    for (const d of shuffled) {
      const nx = n.x + d.dx, ny = n.y + d.dy;
      if (nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) continue;
      if (map[ny][nx] !== 'ROAD') continue;
      if (npcs.find(o => o !== n && o.x === nx && o.y === ny)) continue;
      n.x = nx; n.y = ny;
      break;
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   GAME LOOP (requestAnimationFrame)
   ══════════════════════════════════════════════════════════════ */

let lastTick = 0;
function gameLoop(ts) {
  if (ts - lastTick > 50) { // ~20fps for NPC movement ticks
    tickNPCs();
    lastTick = ts;
  }
  draw();
  requestAnimationFrame(gameLoop);
}

/* ══════════════════════════════════════════════════════════════
   INPUT  (canvas focus fix — always reclaim after button clicks)
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('click', e => {
  if (gameState === 'PLAYING' && e.target.tagName !== 'INPUT') {
    canvas.focus();
  }
});

// After ANY button in a modal is clicked, restore focus
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => { setTimeout(() => canvas.focus(), 10); });
});

window.addEventListener('keydown', e => {
  if (gameState !== 'PLAYING' && gameState !== 'DIALOGUE') return;

  if (gameState === 'PLAYING') {
    let tx = player.x, ty = player.y;
    if (e.code==='ArrowUp')    { ty--; player.facing='up'; }
    if (e.code==='ArrowDown')  { ty++; player.facing='down'; }
    if (e.code==='ArrowLeft')  { tx--; player.facing='left'; }
    if (e.code==='ArrowRight') { tx++; player.facing='right'; }

    // Ctrl+S — save
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      triggerSave();
      return;
    }

    if (tx>=0 && tx<MAP_COLS && ty>=0 && ty<MAP_ROWS) {
      const tile = map[ty][tx];
      if (WALKABLE.has(tile)) {
        if (tile==='PARL_DOOR' && !player.hasClubMembership && player.y>ty)
          { showDialogue('Guard: Access Denied. You need the Club VIP membership.'); return; }
        if (tile==='CLUB_DOOR' && !player.hasPaidClubFee && player.y>ty)
          { showDialogue('Locked. Speak to the Guard next to the door.'); return; }
        if (tile==='LIB_DOOR' && !player.hasLibraryPass && player.y>ty)
          { showDialogue('Locked. Speak to the Library Guard.'); return; }
        if (tile==='DU_DOOR' && player.duStatus==='None' && player.y>ty)
          { showDialogue('Locked. Speak to the DU Security Guard.'); return; }
        if (tile==='DOOR') {
          if (tx===287) { sleep(); return; }
          showDialogue("They shouted: 'Meet us on the road outside!'"); return;
        }
        if (!npcs.find(n => n.x===tx && n.y===ty)) { player.x=tx; player.y=ty; }
      }
    }
  }

  if (e.code==='Space') {
    e.preventDefault();
    if (gameState==='DIALOGUE') { dialogueBox.style.display='none'; gameState='PLAYING'; canvas.focus(); }
    else if (gameState==='PLAYING') checkInteraction();
  }
});

/* ══════════════════════════════════════════════════════════════
   INTERACTION
   ══════════════════════════════════════════════════════════════ */

function checkInteraction() {
  let ix = player.x, iy = player.y;
  if (player.facing==='up')    iy--;
  if (player.facing==='down')  iy++;
  if (player.facing==='left')  ix--;
  if (player.facing==='right') ix++;

  const npc = npcs.find(n => n.x===ix && n.y===iy);
  if (!npc) return;

  if (npc.isSignboard)   { showDialogue('🪧 SIGNBOARD 🪧\n\n' + npc.message); return; }
  if (npc.isIntellect)   { startDebateFlow(npc, 'INTELLECT'); return; }
  if (npc.isParliament)  { startDebateFlow(npc, 'PARLIAMENT'); return; }
  if (npc.isDUAdmin)     { startDebateFlow(npc, 'DU_ADMIN'); return; }
  if (npc.isDUStudent)   { startDebateFlow(npc, 'DU_STUDENT'); return; }
  if (npc.isWager)       { openWagerModal(npc); return; }
  if (npc.isFriend)      { startTicTacToe(npc); return; }
  if (npc.isClubGuard)   { handleGuard(npc, 'CLUB'); return; }
  if (npc.isLibGuard)    { handleGuard(npc, 'LIB'); return; }
  if (npc.isDUGuard)     { handleGuard(npc, 'DU'); return; }
  if (npc.isMallGuard)   { showDialogue('Welcome to the Great Mall! Walk straight in.'); return; }
  if (npc.isShop)        { openShopMenu(); return; }
  if (npc.name==='Mom') {
    if (player.money < 200) { player.money+=500; showDialogue('Mom: Here is ₹500 emergency cash. Be careful!'); updateHUD(); }
    else showDialogue('Mom: Beta, go sleep in your bed to start a new day.');
  }
}

/* ══════════════════════════════════════════════════════════════
   DIALOGUE
   ══════════════════════════════════════════════════════════════ */

function showDialogue(text) {
  gameState = 'DIALOGUE';
  dialogueBox.innerText = text;
  dialogueBox.style.display = 'block';
}

function showModalError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = msg; el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

/* ══════════════════════════════════════════════════════════════
   SLEEP / DAY CYCLE
   ══════════════════════════════════════════════════════════════ */

function sleep() {
  player.day++;
  player.parliamentVisitsToday = 0;
  if (player.duStatus==='Guest' && player.day > player.guestPassDay) player.duStatus='None';
  showDialogue('You slept soundly. It is now Day ' + player.day + '.');
  updateHUD();
}

/* ══════════════════════════════════════════════════════════════
   GUARDS
   ══════════════════════════════════════════════════════════════ */

function handleGuard(npc, type) {
  gameState = 'GUARD_PROMPT';
  document.getElementById('debate-title').innerText = 'SECURITY GATE';
  document.getElementById('wager-section').style.display = 'none';
  document.getElementById('cancel-debate-btn').style.display = 'block';
  const opt = document.getElementById('debate-options'); opt.innerHTML = '';

  if (type==='CLUB') {
    if (player.hasPaidClubFee) { showDialogue('Guard: Door is already unlocked.'); return; }
    document.getElementById('debate-question').innerHTML = 'Intellects Club entry fee: ₹2500.';
    const btn = _makeBtn('Pay ₹2500', () => {
      if (player.money>=2500) { player.money-=2500; player.hasPaidClubFee=true; closeModals(); showDialogue('Guard: Door unlocked!'); updateHUD(); }
      else showModalError('modal-error', 'Not enough money!');
    });
    opt.appendChild(btn);
  }

  if (type==='LIB') {
    if (player.hasLibraryPass) { showDialogue('Guard: Door is already unlocked.'); return; }
    document.getElementById('debate-question').innerHTML = 'Library: Requires Club VIP & ₹500 Lifetime Fee.';
    const btn = _makeBtn('Pay ₹500', () => {
      if (player.money>=500) { player.money-=500; player.hasLibraryPass=true; closeModals(); showDialogue('Guard: Door unlocked!'); updateHUD(); }
      else showModalError('modal-error', 'Not enough money!');
    });
    if (!player.hasClubMembership) { btn.disabled=true; btn.innerText='Need Club VIP First'; }
    opt.appendChild(btn);
  }

  if (type==='DU') {
    if (player.duStatus==='Admitted'||player.duStatus==='Guest') { showDialogue('Guard: You may enter.'); return; }
    document.getElementById('debate-question').innerHTML = '₹1000 Guest Pass  OR  ₹1,00,000 Permanent Admission (pass interview first).';
    const btnG = _makeBtn('Pay ₹1000 (Guest)', () => {
      if (player.money>=1000) { player.money-=1000; player.duStatus='Guest'; player.guestPassDay=player.day; closeModals(); showDialogue('Guard: Guest Pass active for today.'); updateHUD(); }
      else showModalError('modal-error', 'Not enough money!');
    });
    const btnA = _makeBtn('Pay ₹1,00,000 (Permanent)', () => {
      if (player.money>=100000) { player.money-=100000; player.duStatus='Admitted'; closeModals(); showDialogue('Guard: Welcome to DU permanently!'); updateHUD(); }
      else showModalError('modal-error', 'Not enough money!');
    });
    if (player.duScore<25) { btnA.disabled=true; btnA.innerText='Need to pass DU interview first!'; }
    opt.appendChild(btnG); opt.appendChild(btnA);
  }

  debateModal.style.display = 'flex';
}

/* ══════════════════════════════════════════════════════════════
   DEBATE SYSTEM
   ══════════════════════════════════════════════════════════════ */

function startDebateFlow(npc, type) {
  currentOpp = npc; debateType = type; gameState = 'DEBATE';
  document.getElementById('wager-section').style.display = 'none';
  document.getElementById('cancel-debate-btn').style.display =
    (type==='INTELLECT'||type==='DU_ADMIN') ? 'none' : 'block';

  let qObj;
  if (type==='INTELLECT') {
    if (npc.progress>=3) { showDialogue('They have no more questions for you today.'); return; }
    document.getElementById('debate-title').innerText = 'CLUB DEBATE ('+(npc.progress+1)+'/3)';
    qObj = npc.qs[npc.progress];
  } else if (type==='PARLIAMENT') {
    if (player.parliamentVisitsToday>=1) { showDialogue('You can only debate in Parliament once per day.'); return; }
    document.getElementById('debate-title').innerText = 'PARLIAMENT POLICY';
    qObj = npc.qs[0]; // refresh daily
  } else if (type==='DU_ADMIN') {
    if (player.duScore>=25) { showDialogue('You already passed the DU interview.'); return; }
    document.getElementById('debate-title').innerText = 'DU INTERVIEW PANEL';
    qObj = npc.q;
  } else if (type==='DU_STUDENT') {
    document.getElementById('debate-title').innerText = 'DU SCHOLARSHIP DEBATE';
    qObj = npc.q;
  }

  loadQuestion(qObj);
  debateModal.style.display = 'flex';
}

function openWagerModal(npc) {
  if (player.money<200) { showDialogue('You need at least ₹200 to wager!'); return; }
  currentOpp = npc; debateType = 'WAGER'; gameState = 'WAGER';
  document.getElementById('debate-title').innerText = 'STREET WAGER';
  document.getElementById('wager-section').style.display = 'block';
  wagerSlider.max = player.money; wagerSlider.value = 200; updateWager();
  document.getElementById('cancel-debate-btn').style.display = 'block';
  debateModal.style.display = 'flex';
}

window.updateWager = function() {
  currentWager = parseInt(wagerSlider.value);
  wagerValueTxt.innerText = currentWager;
};

function loadQuestion(qObj) {
  document.getElementById('debate-question').innerText = qObj.q;
  const opt = document.getElementById('debate-options'); opt.innerHTML = '';
  qObj.o.forEach((o, i) => {
    const b = _makeBtn(o, () => resolveDebate(i, qObj.a));
    opt.appendChild(b);
  });
}

window.startDebate = function() {
  if (player.money < currentWager) return;
  player.money -= currentWager; updateHUD();
  document.getElementById('wager-section').style.display = 'none';
  loadQuestion(currentOpp.q);
};

window.resolveDebate = function(selected, correct) {
  debateModal.style.display = 'none'; gameState = 'RESULT';
  const win = selected === correct;
  const title = document.getElementById('result-title');
  const desc  = document.getElementById('result-desc');

  if (debateType==='INTELLECT') {
    player.intellectAttempted++; if (win) player.intellectScore++;
    currentOpp.progress++;
    title.innerHTML = win ? "<span style='color:#4ade80'>CORRECT!</span>" : "<span style='color:#ef4444'>INCORRECT.</span>";
    desc.innerText = `Philosophy Score: ${player.intellectScore}/${player.intellectAttempted} (Need 25 for VIP Parliament Pass)`;
    if (player.intellectScore>=25 && !player.hasClubMembership) {
      player.hasClubMembership=true;
      desc.innerText += '\n\n★ VIP ACCESS GRANTED! You can now enter Parliament.';
    }
  } else if (debateType==='DU_ADMIN') {
    player.duAttempted++; if (win) player.duScore++;
    title.innerHTML = win ? "<span style='color:#4ade80'>CORRECT!</span>" : "<span style='color:#ef4444'>INCORRECT.</span>";
    desc.innerText = `DU Science Interview: ${player.duScore}/25 needed for admission offer.`;
    if (player.duScore>=25) desc.innerText += '\n\n★ DU Admission Offer Unlocked! Pay ₹1 Lakh at the gate.';
  } else if (debateType==='PARLIAMENT') {
    player.parliamentVisitsToday++;
    if (win) { player.money+=2000; player.xp+=500; title.innerHTML="<span style='color:#4ade80'>PASSED!</span>"; desc.innerText='Policy approved! +₹2000 grant & 500 XP.'; }
    else { title.innerHTML="<span style='color:#ef4444'>REJECTED</span>"; desc.innerText='The bill was voted down.'; }
  } else if (debateType==='DU_STUDENT') {
    if (win) { player.money+=1000; player.xp+=100; title.innerHTML="<span style='color:#4ade80'>WON!</span>"; desc.innerText='Scholarship Won: ₹1000!'; }
    else { title.innerHTML="<span style='color:#ef4444'>LOST</span>"; desc.innerText='The scholar outargued you.'; }
  } else if (debateType==='WAGER') {
    if (win) { player.money+=currentWager*2; player.xp+=Math.floor(currentWager/10); title.innerHTML="<span style='color:#4ade80'>WON!</span>"; desc.innerText=`Won ₹${currentWager*2}!`; }
    else { const ret=Math.floor(currentWager/2); player.money+=ret; title.innerHTML="<span style='color:#ef4444'>LOST</span>"; desc.innerText=`Lost ₹${currentWager-ret}.`; }
  }

  if (player.xp >= player.level*100) { player.xp -= player.level*100; player.level++; }
  updateHUD();
  resultModal.style.display = 'flex';
};

/* ══════════════════════════════════════════════════════════════
   TIC-TAC-TOE
   ══════════════════════════════════════════════════════════════ */

let tttBoard = Array(9).fill('');

function startTicTacToe(npc) {
  gameState='TICTACTOE'; tttBoard=Array(9).fill(''); tttGameOver=false;
  document.getElementById('ttt-status').innerText='Your Turn (X) vs '+npc.name;
  document.getElementById('ttt-status').style.color='yellow';
  renderTTT(); tttModal.style.display='flex';
}

function renderTTT() {
  const bd = document.getElementById('ttt-board'); bd.innerHTML='';
  tttBoard.forEach((c,i) => {
    const d=document.createElement('div'); d.className='ttt-cell'; d.innerText=c;
    d.onclick=()=>pTTTMove(i); bd.appendChild(d);
  });
}

function pTTTMove(i) {
  if (tttBoard[i]!==''||checkTTTWin()) return;
  tttBoard[i]='X'; renderTTT();
  if (checkTTTWin()) return;
  setTimeout(aTTTMove,500);
}

function aTTTMove() {
  const e=tttBoard.map((c,i)=>c===''?i:null).filter(i=>i!==null);
  if (!e.length) { document.getElementById('ttt-status').innerText='Draw!'; return; }
  tttBoard[e[Math.floor(Math.random()*e.length)]]='O';
  renderTTT(); checkTTTWin();
}

function checkTTTWin() {
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const a of wins) {
    if (tttBoard[a[0]] && tttBoard[a[0]]===tttBoard[a[1]] && tttBoard[a[0]]===tttBoard[a[2]]) {
      const w=tttBoard[a[0]];
      const st=document.getElementById('ttt-status');
      if (w==='X'&&!tttGameOver) {
        player.money+=500; updateHUD(); tttGameOver=true;
        st.innerText='X WINS! You earned ₹500!'; st.style.color='#4ade80';
      } else if (!tttGameOver) {
        tttGameOver=true; st.innerText='O WINS!'; st.style.color='#ef4444';
      }
      return true;
    }
  }
  if (!tttBoard.includes('')) document.getElementById('ttt-status').innerText='DRAW!';
  return false;
}

/* ══════════════════════════════════════════════════════════════
   TRAVEL & SHOP
   ══════════════════════════════════════════════════════════════ */

window.openTravelMenu = function() {
  if (gameState!=='PLAYING'&&gameState!=='MENU') return;
  gameState='MENU';
  document.getElementById('taxi-desc').innerText =
    player.assets.includes('Car') ? 'You are driving your Car. Travel is FREE!' : 'Choose a destination (₹5 each):';
  travelModal.style.display='flex';
};

window.travelTo = function(x, y) {
  const cost = player.assets.includes('Car') ? 0 : 5;
  if (player.money<cost) { showModalError('taxi-error',`Need ₹${cost} for the taxi!`); return; }
  player.money-=cost; player.x=x; player.y=y;
  closeModals(); updateHUD();
};

window.openShopMenu = function() {
  if (gameState!=='PLAYING'&&gameState!=='MENU') return;
  gameState='MENU';
  document.getElementById('shop-money').innerText=player.money;
  shopModal.style.display='flex';
};

window.buyItem = function(item, price) {
  if (player.assets.includes(item)) { showModalError('shop-error','You already own this!'); return; }
  if (player.money>=price) {
    player.money-=price; player.assets.push(item);
    document.getElementById('shop-money').innerText=player.money;
    updateHUD(); showModalError('shop-error','Purchased '+item+'!');
  } else showModalError('shop-error','Not enough money!');
};

/* ══════════════════════════════════════════════════════════════
   CLOSE / MODAL
   ══════════════════════════════════════════════════════════════ */

window.closeModals = function() {
  debateModal.style.display='none'; resultModal.style.display='none';
  tttModal.style.display='none'; travelModal.style.display='none';
  shopModal.style.display='none'; dialogueBox.style.display='none';
  gameState='PLAYING';
  setTimeout(() => canvas.focus(), 10); // canvas focus fix
};

/* ══════════════════════════════════════════════════════════════
   HUD
   ══════════════════════════════════════════════════════════════ */

function updateHUD() {
  document.getElementById('day-display').innerText   = 'Day: '+player.day;
  document.getElementById('cash-display').innerText  = 'Money: ₹'+player.money;
  document.getElementById('xp-display').innerText    = 'Level: '+player.level+' | XP: '+player.xp;
  document.getElementById('club-display').innerText  = 'Club: '+player.intellectScore+'/33'+(player.hasClubMembership?' (VIP)':'');
  document.getElementById('du-display').innerText    = 'DU: '+player.duStatus+' (Intv: '+player.duScore+'/25)';
  document.getElementById('lib-display').innerText   = 'Library Pass: '+(player.hasLibraryPass?'Yes':'No');
  document.getElementById('assets-display').innerText= 'Assets: '+(player.assets.length?player.assets.join(', '):'None');
  if (player.assets.includes('Car')) document.getElementById('taxi-btn').innerText='🚙 Drive Car (FREE)';
}

/* ══════════════════════════════════════════════════════════════
   SAVE / LOAD
   ══════════════════════════════════════════════════════════════ */

function triggerSave() {
  const gs = { player };
  if (typeof window.saveGameToServer === 'function') window.saveGameToServer(gs);
}

function loadFromSave(saveData) {
  if (!saveData || !saveData.player) return;
  player = { ...DEFAULT_PLAYER, ...saveData.player };
  updateHUD();
}

/* ══════════════════════════════════════════════════════════════
   DRAW
   ══════════════════════════════════════════════════════════════ */

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx = Math.max(0, Math.min(player.x-Math.floor(CAM_COLS/2), MAP_COLS-CAM_COLS));
  const cy = Math.max(0, Math.min(player.y-Math.floor(CAM_ROWS/2), MAP_ROWS-CAM_ROWS));

  // Tiles
  for (let r=0; r<CAM_ROWS; r++) {
    for (let c=0; c<CAM_COLS; c++) {
      const tile = map[cy+r][cx+c];
      ctx.fillStyle = C[tile] || '#166534';
      ctx.fillRect(c*TILE_SIZE, r*TILE_SIZE, TILE_SIZE, TILE_SIZE);
      if (['GRASS','ROAD','WATER','CLUB_FLOOR','PARL_FLOOR','JAIL_FLOOR','LIB_FLOOR','DU_FLOOR','MALL_FLOOR'].includes(tile)) {
        ctx.strokeStyle='rgba(0,0,0,.09)'; ctx.strokeRect(c*TILE_SIZE,r*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      }
    }
  }

  // NPCs
  npcs.forEach(n => {
    if (n.x<cx||n.x>=cx+CAM_COLS||n.y<cy||n.y>=cy+CAM_ROWS) return;
    const px=(n.x-cx)*TILE_SIZE, py=(n.y-cy)*TILE_SIZE;
    ctx.fillStyle=n.color; ctx.fillRect(px+4,py+4,TILE_SIZE-8,TILE_SIZE-8);
    if (n.isSignboard) { ctx.font='20px Arial'; ctx.fillText('🪧',px+8,py+26); }
  });

  // Player
  const px=(player.x-cx)*TILE_SIZE, py=(player.y-cy)*TILE_SIZE;
  ctx.fillStyle=player.color; ctx.fillRect(px+4,py+4,TILE_SIZE-8,TILE_SIZE-8);
  ctx.fillStyle='#fff';
  let ex=px+TILE_SIZE/2-2, ey=py+TILE_SIZE/2-2;
  if (player.facing==='up')    ey-=10;
  if (player.facing==='down')  ey+=10;
  if (player.facing==='left')  ex-=10;
  if (player.facing==='right') ex+=10;
  ctx.fillRect(ex,ey,4,4);

  // Building labels
  ctx.textAlign='center'; ctx.font='bold 17px Courier';
  buildingLabels.forEach(l => {
    const lx=(l.x-cx)*TILE_SIZE, ly=(l.y-cy)*TILE_SIZE;
    if (lx<-100||lx>canvas.width+100||ly<-50||ly>canvas.height+50) return;
    const tw=ctx.measureText(l.text).width;
    ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(lx-tw/2-10,ly-20,tw+20,26);
    ctx.fillStyle='#facc15'; ctx.fillText(l.text,lx,ly);
  });
  ctx.textAlign='left';
}

/* ══════════════════════════════════════════════════════════════
   UTILITY
   ══════════════════════════════════════════════════════════════ */

function _makeBtn(label, onClick) {
  const b = document.createElement('button');
  b.className='btn'; b.innerText=label;
  b.addEventListener('click', () => { onClick(); setTimeout(()=>canvas.focus(),10); });
  return b;
}

/* ══════════════════════════════════════════════════════════════
   PUBLIC INIT (called by auth.js after login)
   ══════════════════════════════════════════════════════════════ */

window.initGame = function(saveData) {
  buildMap();
  buildNPCs();
  if (saveData) loadFromSave(saveData);
  updateHUD();
  canvas.focus();
  requestAnimationFrame(gameLoop);
};

// Save button in sidebar
document.getElementById('btn-save').addEventListener('click', () => {
  triggerSave();
  setTimeout(()=>canvas.focus(),10);
});
