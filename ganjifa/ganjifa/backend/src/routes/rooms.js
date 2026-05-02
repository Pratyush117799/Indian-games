// routes/rooms.js
const r=require('express').Router(),gc=require('../controllers/gameController');
const{authenticate}=require('../middleware/auth');
r.post('/',authenticate,gc.createRoom);
r.post('/:code/join',authenticate,gc.joinRoom);
r.get('/:code',authenticate,gc.getRoom);
module.exports=r;
