// Delhi – Ring Road
export const delhi = {
  id: 'delhi', name: 'Delhi', sub: 'Ring Road Chaos', emoji: '🏛️',
  unlocked: false, lapKm: 5,
  desc: 'Survive the smoggy ring road — widest & most chaotic.',
  skyGradient: ['#5a4a2a','#7a6030','#9a7840'], skyStars: false,
  roadColor: '#2a2520', roadLines: '#fff', dividerColor: '#fff', shoulderColor: '#3a3020',
  sideLeftColor: '#4a3a1a', sideRightColor: '#3a3025',
  sideLeftLabel: '🕌 Old Delhi', sideRightLabel: '🏛️ New Delhi',
  bgType: 'smog_city', streetLights: false, fogAlpha: 0.18,
  maxSpeed: 220, trafficDensity: 1.4, spawnInterval: 0.9,
  policeThreshold: 120, policeCount: 3,
  trafficMix: [
    { type:'car',   w:20, sMin:30, sMax:80,  dir:'both' },
    { type:'bus',   w:25, sMin:20, sMax:50,  dir:'both' },
    { type:'truck', w:20, sMin:25, sMax:55,  dir:'same' },
    { type:'auto',  w:20, sMin:15, sMax:45,  dir:'both' },
    { type:'cycle', w:10, sMin:10, sMax:25,  dir:'both' },
    { type:'bike',  w:5,  sMin:50, sMax:100, dir:'both' },
  ],
  specialHazard: 'pothole', hazardRate: 0.006, unlockCondition: 'mumbai',
};

// Himalaya – Mountain Highway
export const himalaya = {
  id: 'himalaya', name: 'Himalayan', sub: 'Mountain Highway', emoji: '🏔️',
  unlocked: false, lapKm: 5,
  desc: 'Narrow mountain roads, blind corners, truck convoys.',
  skyGradient: ['#1a3a5e','#2a5a8e','#4a7aae'], skyStars: false,
  roadColor: '#2a2a28', roadLines: '#fff', dividerColor: '#ff6600', shoulderColor: '#1a3a1a',
  sideLeftColor: '#1a4a1a', sideRightColor: '#3a4a3a',
  sideLeftLabel: '⚠️ Cliff', sideRightLabel: '🪨 Rock Face',
  bgType: 'mountain', streetLights: false, fogAlpha: 0.08,
  maxSpeed: 150, trafficDensity: 0.8, spawnInterval: 1.4,
  policeThreshold: 110, policeCount: 1,
  trafficMix: [
    { type:'truck', w:40, sMin:20, sMax:45, dir:'both' },
    { type:'bus',   w:25, sMin:20, sMax:40, dir:'both' },
    { type:'car',   w:20, sMin:30, sMax:70, dir:'both' },
    { type:'bike',  w:15, sMin:40, sMax:80, dir:'same' },
  ],
  specialHazard: 'rockfall', hazardRate: 0.005, unlockCondition: 'delhi',
};

// Rajasthan – Desert Highway
export const rajasthan = {
  id: 'rajasthan', name: 'Rajasthan', sub: 'Desert Highway', emoji: '🌅',
  unlocked: false, lapKm: 5,
  desc: 'Open highway, blazing sun, camels crossing at will.',
  skyGradient: ['#b03010','#d05020','#f07030'], skyStars: false,
  roadColor: '#3a3020', roadLines: '#fff', dividerColor: '#fff', shoulderColor: '#7a6035',
  sideLeftColor: '#c8a050', sideRightColor: '#b89040',
  sideLeftLabel: '🏜️ Desert', sideRightLabel: '🌵 Dunes',
  bgType: 'desert', streetLights: false, fogAlpha: 0.05,
  maxSpeed: 260, trafficDensity: 0.6, spawnInterval: 1.8,
  policeThreshold: 160, policeCount: 2,
  trafficMix: [
    { type:'car',   w:30, sMin:60, sMax:130, dir:'both' },
    { type:'truck', w:25, sMin:40, sMax:70,  dir:'same' },
    { type:'camel', w:20, sMin:5,  sMax:20,  dir:'both' },
    { type:'bike',  w:25, sMin:70, sMax:140, dir:'both' },
  ],
  specialHazard: 'sandstorm', hazardRate: 0.003, unlockCondition: 'himalaya',
};

// Chennai – ECR Coastal
export const chennai = {
  id: 'chennai', name: 'Chennai', sub: 'ECR Coastal', emoji: '🏖️',
  unlocked: false, lapKm: 5,
  desc: 'Sun-drenched coastal road with sea breeze and chaos.',
  skyGradient: ['#1a6aaa','#2a8ace','#4aaade'], skyStars: false,
  roadColor: '#282828', roadLines: '#ffd700', dividerColor: '#ffd700', shoulderColor: '#1a2a1a',
  sideLeftColor: '#1a80c0', sideRightColor: '#2a5a2a',
  sideLeftLabel: '🌊 Bay of Bengal', sideRightLabel: '🌴 ECR Strip',
  bgType: 'coastal', streetLights: true, fogAlpha: 0,
  maxSpeed: 240, trafficDensity: 1.2, spawnInterval: 0.9,
  policeThreshold: 145, policeCount: 2,
  trafficMix: [
    { type:'car',  w:25, sMin:40, sMax:100, dir:'both' },
    { type:'auto', w:25, sMin:20, sMax:50,  dir:'both' },
    { type:'bike', w:20, sMin:60, sMax:120, dir:'both' },
    { type:'bus',  w:15, sMin:30, sMax:60,  dir:'same' },
    { type:'taxi', w:15, sMin:35, sMax:80,  dir:'both' },
  ],
  specialHazard: 'pothole', hazardRate: 0.004, unlockCondition: 'rajasthan',
};
