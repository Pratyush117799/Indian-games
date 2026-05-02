// Mumbai – Marine Drive Night
export const mumbai = {
  id: 'mumbai', name: 'Mumbai', sub: 'Marine Drive', emoji: '🌃',
  unlocked: true, lapKm: 5,
  desc: 'Race the necklace road under golden streetlights.',

  // Visuals
  skyGradient:    ['#03051a', '#0d1040', '#1a2260'],
  skyStars:       true,
  roadColor:      '#1c1c1c',
  roadLines:      '#ffd700',
  dividerColor:   '#ffd700',
  shoulderColor:  '#111',
  sideLeftColor:  '#021830',
  sideRightColor: '#0a0a1a',
  sideLeftLabel:  '🌊 Sea',
  sideRightLabel: '🏢 City',
  bgType:         'night_city',
  streetLights:   true,
  fogAlpha:       0,

  // Gameplay
  maxSpeed:        190,
  trafficDensity:  1.1,
  spawnInterval:   1.1,
  policeThreshold: 130,
  policeCount:     2,

  trafficMix: [
    { type:'car',   w:25, sMin:40, sMax:90,  dir:'both' },
    { type:'taxi',  w:20, sMin:30, sMax:70,  dir:'same' },
    { type:'auto',  w:20, sMin:20, sMax:50,  dir:'both' },
    { type:'bus',   w:15, sMin:20, sMax:45,  dir:'same' },
    { type:'bike',  w:15, sMin:60, sMax:110, dir:'both' },
    { type:'truck', w:5,  sMin:30, sMax:60,  dir:'same' },
  ],
  specialHazard: 'pothole',
  hazardRate:    0.004,
  unlockCondition: null,
};
