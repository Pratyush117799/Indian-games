/**
 * soundEngine.js — Web Audio API sound effects
 * No external libraries. Pure synthesis.
 */

let ctx = null
const getCtx = () => {
  if (!ctx) try { ctx = new (window.AudioContext || window.webkitAudioContext)() } catch {}
  return ctx
}

const tone = (freq, type, dur, vol = 0.12) => {
  try {
    const c = getCtx(); if (!c) return
    const osc  = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain); gain.connect(c.destination)
    osc.type = type; osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    osc.start(); osc.stop(c.currentTime + dur)
  } catch {}
}

export const sfx = {
  place:  () => { tone(320, 'triangle', .18, .13); setTimeout(() => tone(240, 'triangle', .1, .06), 60) },
  move:   () => { tone(260, 'triangle', .14, .10) },
  mill:   () => [440, 550, 660].forEach((f, i) => setTimeout(() => tone(f, 'sine', .22, .1), i * 80)),
  remove: () => { tone(180, 'sawtooth', .25, .1); setTimeout(() => tone(120, 'sawtooth', .2, .07), 80) },
  seed:   () => { tone(600, 'sine', .06, .06) },
  capture:() => [300, 400, 500, 600].forEach((f, i) => setTimeout(() => tone(f, 'sine', .18, .08), i * 60)),
  win:    () => [440, 550, 660, 880].forEach((f, i) => setTimeout(() => tone(f, 'sine', .35, .1), i * 90)),
  lose:   () => [220, 180, 150].forEach((f, i) => setTimeout(() => tone(f, 'sawtooth', .3, .08), i * 100)),
}
