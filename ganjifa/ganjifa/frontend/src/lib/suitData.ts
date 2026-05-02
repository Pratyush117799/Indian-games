import type { SuitDef } from '@/types';

export const DASHAVATARA_SUITS: SuitDef[] = [
  { slug:'matsya',      name:'Matsya',      nameHindi:'मत्स्य',  type:'bishbar', bgColor:'#0A0A1A', borderColor:'#B8860B', pipSymbol:'🐟' },
  { slug:'kurma',       name:'Kurma',       nameHindi:'कूर्म',    type:'kambar',  bgColor:'#8B5E1A', borderColor:'#DAA520', pipSymbol:'🐢' },
  { slug:'varaha',      name:'Varaha',      nameHindi:'वराह',    type:'bishbar', bgColor:'#0A2A0A', borderColor:'#228B22', pipSymbol:'🐗' },
  { slug:'narasimha',   name:'Narasimha',   nameHindi:'नरसिंह',  type:'bishbar', bgColor:'#6B0000', borderColor:'#FF4500', pipSymbol:'🦁' },
  { slug:'vamana',      name:'Vamana',      nameHindi:'वामन',    type:'kambar',  bgColor:'#001F3F', borderColor:'#87CEEB', pipSymbol:'👣' },
  { slug:'parashurama', name:'Parashurama', nameHindi:'परशुराम', type:'bishbar', bgColor:'#2A0A0A', borderColor:'#8B0000', pipSymbol:'🪓' },
  { slug:'rama',        name:'Rama',        nameHindi:'राम',     type:'kambar',  bgColor:'#003333', borderColor:'#20B2AA', pipSymbol:'🏹' },
  { slug:'krishna',     name:'Krishna',     nameHindi:'कृष्ण',   type:'bishbar', bgColor:'#001A33', borderColor:'#4169E1', pipSymbol:'🪈' },
  { slug:'buddha',      name:'Buddha',      nameHindi:'बुद्ध',   type:'kambar',  bgColor:'#3D1A00', borderColor:'#FF8C00', pipSymbol:'☸️' },
  { slug:'kalki',       name:'Kalki',       nameHindi:'कल्कि',   type:'bishbar', bgColor:'#1A1A2E', borderColor:'#C0C0C0', pipSymbol:'⚔️' },
];

export const RAMAYANA_SUITS: SuitDef[] = [
  { slug:'rama',         name:'Rama',        character:'Prince of Ayodhya',      type:'bishbar', bgColor:'#004444', borderColor:'#20B2AA', pipSymbol:'🏹' },
  { slug:'sita',         name:'Sita',        character:'Princess of Mithila',    type:'kambar',  bgColor:'#4A3000', borderColor:'#FFD700', pipSymbol:'🌸' },
  { slug:'lakshmana',    name:'Lakshmana',   character:"Rama's brother",         type:'bishbar', bgColor:'#003300', borderColor:'#32CD32', pipSymbol:'🗡️' },
  { slug:'hanuman',      name:'Hanuman',     character:'Divine Vanara General',  type:'bishbar', bgColor:'#4A1400', borderColor:'#FF6347', pipSymbol:'🔱' },
  { slug:'ravana',       name:'Ravana',      character:'King of Lanka',          type:'kambar',  bgColor:'#1A0000', borderColor:'#DC143C', pipSymbol:'👑' },
  { slug:'kumbhakarna',  name:'Kumbhakarna', character:'Giant warrior',          type:'kambar',  bgColor:'#000A1F', borderColor:'#4169E1', pipSymbol:'⚔️' },
  { slug:'sugriva',      name:'Sugriva',     character:'Vanara King',            type:'bishbar', bgColor:'#2A1500', borderColor:'#CD853F', pipSymbol:'🌿' },
  { slug:'vibhishana',   name:'Vibhishana',  character:'Righteous brother',      type:'kambar',  bgColor:'#1A0033', borderColor:'#9370DB', pipSymbol:'🕊️' },
];

export const GEOPOLITICS_SUITS: SuitDef[] = [
  { slug:'rafale',  name:'Rafale',         label:'Dassault Rafale',     nation:'France',  type:'bishbar', bgColor:'#00206A', borderColor:'#C0C0C0', pipSymbol:'✈' },
  { slug:'su57',    name:'Su-57 Felon',    label:'Sukhoi Su-57',        nation:'Russia',  type:'bishbar', bgColor:'#8B0000', borderColor:'#FFD700', pipSymbol:'🛦' },
  { slug:'f35',     name:'F-35 Lightning', label:'Lockheed F-35',       nation:'USA',     type:'bishbar', bgColor:'#1C2951', borderColor:'#C0C0C0', pipSymbol:'⚡' },
  { slug:'brahmos', name:'BrahMos',        label:'Supersonic Missile',  nation:'IN/RU',   type:'bishbar', bgColor:'#FF6600', borderColor:'#138808', pipSymbol:'🚀' },
  { slug:'tejas',   name:'Tejas Mk2',      label:'HAL Tejas',           nation:'India',   type:'kambar',  bgColor:'#005500', borderColor:'#FF9933', pipSymbol:'🛩' },
  { slug:'s400',    name:'S-400 Triumf',   label:'S-400 SAM',           nation:'Russia',  type:'kambar',  bgColor:'#1A2A00', borderColor:'#8B8B00', pipSymbol:'🎯' },
  { slug:'b2',      name:'B-2 Spirit',     label:'Stealth Bomber',      nation:'USA',     type:'bishbar', bgColor:'#0A0A0A', borderColor:'#888888', pipSymbol:'💀' },
  { slug:'kalibr',  name:'Kalibr',         label:'Cruise Missile',      nation:'Russia',  type:'kambar',  bgColor:'#001433', borderColor:'#4682B4', pipSymbol:'🌊' },
  { slug:'drone',   name:'Kamikaze Drone', label:'Loitering Munition',  nation:'Multi',   type:'kambar',  bgColor:'#1A1400', borderColor:'#B8860B', pipSymbol:'💥' },
  { slug:'carrier', name:'Carrier',        label:'Aircraft Carrier',    nation:'Multi',   type:'bishbar', bgColor:'#001A2E', borderColor:'#00CED1', pipSymbol:'⚓' },
];
