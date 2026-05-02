const express = require('express');
const router = express.Router();
const svc = require('../services/playerService');

router.post('/', async (req,res,next) => {
  try {
    const {username,displayName,carColor} = req.body;
    if (!username||username.length<2||username.length>32) return res.status(400).json({error:{message:'Username must be 2–32 chars'}});
    const player = await svc.createOrGet({username,displayName,carColor});
    res.status(201).json({player});
  } catch(err){next(err);}
});

router.get('/:id', async (req,res,next) => {
  try {
    const player = await svc.getPlayer(req.params.id);
    if (!player) return res.status(404).json({error:{message:'Not found'}});
    res.json({player});
  } catch(err){next(err);}
});

router.post('/:id/race', async (req,res,next) => {
  try {
    const {mapId,mode,completed,timeMs,score,distM,maxSpeed,avgSpeed,damage,nearMisses,policeEscaped,crashes,position} = req.body;
    await svc.recordRaceStats({playerId:req.params.id,distM:distM||0,maxSpeed:maxSpeed||0,nearMisses:nearMisses||0,policeEscaped:policeEscaped?1:0,crashes:crashes||0,won:completed&&position===1});
    await svc.updateProgress({playerId:req.params.id,mapId,mode,completed:!!completed,timeMs:timeMs||null,score:score||0});
    res.json({saved:true});
  } catch(err){next(err);}
});

module.exports = router;
