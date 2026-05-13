// backend/src/data/seedPatterns.js
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Pattern  = require("../models/Pattern");
const User     = require("../models/User");

function makeTiles(rings, axes, colors, shapes) {
  const tiles = [];
  for (let ring = 0; ring < rings; ring++) {
    const totalSegments = axes * Math.max(1, ring + 1);
    const step = Math.max(1, Math.floor(totalSegments / (axes * 2)));
    for (let seg = 0; seg < totalSegments; seg += step) {
      tiles.push({
        shapeId:       shapes[ring % shapes.length],
        ring,
        segment:       seg % totalSegments,
        totalSegments,
        color:         colors[seg % colors.length],
        rotation:      0,
      });
    }
  }
  return tiles;
}

const SEEDS = [
  // ── DIWALI ───────────────────────────────────────────────────────────
  { festival:"diwali", title:"Diya Mandala",       difficulty:"easy",   axes:8,  rings:3, shapes:["petal","dot"],                colors:["#FF6B00","#FFD700","#FF3D00"] },
  { festival:"diwali", title:"Golden Lotus",        difficulty:"medium", axes:8,  rings:5, shapes:["lotus","petal","dot"],         colors:["#FFD700","#FF6B00","#FFF176","#E65100"] },
  { festival:"diwali", title:"Lakshmi Wheel",       difficulty:"hard",   axes:12, rings:6, shapes:["petal","diamond","dot"],       colors:["#FF6B00","#FFD700","#FF3D00","#FFCA28"] },
  { festival:"diwali", title:"Diya Ring",           difficulty:"easy",   axes:4,  rings:3, shapes:["diya","dot"],                 colors:["#FF6B00","#FFD700"] },
  { festival:"diwali", title:"Firework Burst",      difficulty:"medium", axes:8,  rings:4, shapes:["star","dot","diamond"],       colors:["#FF6B00","#FFD700","#FF3D00","#FF8F00"] },
  { festival:"diwali", title:"Grand Illumination",  difficulty:"expert", axes:12, rings:7, shapes:["lotus","petal","star","diya"],colors:["#FF6B00","#FFD700","#FFF176","#E65100","#FFCA28"] },
  // ── HOLI ─────────────────────────────────────────────────────────────
  { festival:"holi",   title:"Colour Burst",        difficulty:"easy",   axes:6,  rings:3, shapes:["dot","petal"],                colors:["#E91E63","#9C27B0","#2196F3","#4CAF50","#FF9800"] },
  { festival:"holi",   title:"Rainbow Spiral",      difficulty:"medium", axes:8,  rings:5, shapes:["leaf","petal","dot"],         colors:["#F44336","#FF9800","#FFEB3B","#4CAF50","#2196F3","#9C27B0"] },
  { festival:"holi",   title:"Powder Explosion",    difficulty:"easy",   axes:4,  rings:3, shapes:["diamond","dot"],              colors:["#E91E63","#2196F3","#FFEB3B","#4CAF50"] },
  { festival:"holi",   title:"Spring Bloom",        difficulty:"medium", axes:6,  rings:4, shapes:["lotus","petal","dot"],        colors:["#F48FB1","#CE93D8","#80DEEA","#A5D6A7"] },
  { festival:"holi",   title:"Gulal Circle",        difficulty:"easy",   axes:8,  rings:3, shapes:["dot","arc"],                  colors:["#E91E63","#FF9800","#FFEB3B","#4CAF50","#2196F3"] },
  { festival:"holi",   title:"Festival of Colours", difficulty:"hard",   axes:12, rings:6, shapes:["petal","star","dot"],         colors:["#F44336","#FF9800","#FFEB3B","#4CAF50","#2196F3","#9C27B0"] },
  // ── ONAM ─────────────────────────────────────────────────────────────
  { festival:"onam",   title:"Pookalam Classic",    difficulty:"medium", axes:8,  rings:5, shapes:["petal","dot","leaf"],         colors:["#F44336","#FF9800","#FFEB3B","#4CAF50","#2196F3","#9C27B0"] },
  { festival:"onam",   title:"Kerala Bloom",        difficulty:"hard",   axes:12, rings:7, shapes:["lotus","petal","dot"],        colors:["#F44336","#FF9800","#4CAF50","#2196F3","#FFEB3B"] },
  { festival:"onam",   title:"Flower Carpet",       difficulty:"easy",   axes:6,  rings:3, shapes:["petal","dot"],                colors:["#4CAF50","#F44336","#FFEB3B"] },
  { festival:"onam",   title:"River Goddess",       difficulty:"medium", axes:8,  rings:4, shapes:["leaf","petal","lotus"],       colors:["#4CAF50","#66BB6A","#A5D6A7","#F44336","#FF9800"] },
  { festival:"onam",   title:"Harvest Ring",        difficulty:"hard",   axes:9,  rings:6, shapes:["petal","diamond","dot"],      colors:["#F44336","#FF9800","#FFEB3B","#4CAF50","#2196F3"] },
  { festival:"onam",   title:"Grand Pookalam",      difficulty:"expert", axes:12, rings:7, shapes:["lotus","petal","leaf","star"],colors:["#F44336","#FF9800","#FFEB3B","#4CAF50","#2196F3","#9C27B0","#FF5722","#8BC34A"] },
  // ── NAVRATRI ─────────────────────────────────────────────────────────
  { festival:"navratri", title:"Garba Circle",      difficulty:"hard",   axes:9,  rings:5, shapes:["petal","dot","diamond"],      colors:["#E91E63","#FF5722","#9C27B0","#FF9800"] },
  { festival:"navratri", title:"Dandiya Ring",      difficulty:"medium", axes:8,  rings:4, shapes:["diamond","dot"],              colors:["#E91E63","#FF9800","#F44336","#FF6F00"] },
  { festival:"navratri", title:"Nine Nights",       difficulty:"expert", axes:9,  rings:7, shapes:["lotus","petal","star"],       colors:["#E91E63","#FF5722","#9C27B0","#FF9800","#F44336","#FF6F00"] },
  { festival:"navratri", title:"Shakti Mandala",    difficulty:"hard",   axes:12, rings:6, shapes:["petal","arc","dot"],          colors:["#E91E63","#9C27B0","#FF5722","#FF9800"] },
  { festival:"navratri", title:"Festival Fire",     difficulty:"easy",   axes:6,  rings:3, shapes:["star","dot"],                 colors:["#E91E63","#FF9800","#FF5722"] },
  // ── MAKAR SANKRANTI ──────────────────────────────────────────────────
  { festival:"makar-sankranti", title:"Kite Mosaic",     difficulty:"medium", axes:4,  rings:4, shapes:["diamond","dot"],          colors:["#1565C0","#F9A825","#2E7D32","#C62828"] },
  { festival:"makar-sankranti", title:"Harvest Wheel",   difficulty:"easy",   axes:8,  rings:3, shapes:["petal","dot"],            colors:["#F9A825","#1565C0","#2E7D32"] },
  { festival:"makar-sankranti", title:"Sugarcane Bloom", difficulty:"medium", axes:6,  rings:4, shapes:["leaf","petal","dot"],     colors:["#2E7D32","#F9A825","#C62828","#1565C0"] },
  { festival:"makar-sankranti", title:"Uttarayan Sky",   difficulty:"hard",   axes:8,  rings:5, shapes:["star","diamond","petal"], colors:["#1565C0","#F9A825","#FFFFFF","#C62828"] },
  { festival:"makar-sankranti", title:"Solar Mandala",   difficulty:"hard",   axes:12, rings:6, shapes:["petal","dot","arc"],      colors:["#F9A825","#FF8F00","#FFF176","#1565C0"] },
  // ── RAKSHA BANDHAN ───────────────────────────────────────────────────
  { festival:"raksha-bandhan", title:"Floral Bond",      difficulty:"easy",   axes:6,  rings:3, shapes:["petal","dot"],            colors:["#F48FB1","#CE93D8","#80DEEA"] },
  { festival:"raksha-bandhan", title:"Sister's Mandala", difficulty:"medium", axes:8,  rings:5, shapes:["lotus","petal","dot"],    colors:["#F48FB1","#CE93D8","#80DEEA","#A5D6A7","#FFF59D"] },
  { festival:"raksha-bandhan", title:"Rakhi Circle",     difficulty:"medium", axes:8,  rings:4, shapes:["diamond","petal","arc"],  colors:["#E91E63","#CE93D8","#F48FB1","#FFCC80"] },
  { festival:"raksha-bandhan", title:"Love Knot",        difficulty:"hard",   axes:12, rings:6, shapes:["lotus","petal","star"],   colors:["#F48FB1","#CE93D8","#EF9A9A","#FFCC80","#A5D6A7"] },
  // ── CHRISTMAS ────────────────────────────────────────────────────────
  { festival:"christmas", title:"Star of Bethlehem",     difficulty:"easy",   axes:6,  rings:3, shapes:["star","dot"],             colors:["#C62828","#1B5E20","#FFFFFF","#F9A825"] },
  { festival:"christmas", title:"Snowflake",             difficulty:"medium", axes:8,  rings:4, shapes:["star","diamond","arc"],   colors:["#FFFFFF","#E8F5E9","#0D47A1","#F9A825"] },
  { festival:"christmas", title:"Christmas Star",        difficulty:"easy",   axes:8,  rings:3, shapes:["star","petal","dot"],     colors:["#C62828","#F9A825","#1B5E20","#FFFFFF"] },
  { festival:"christmas", title:"Winter Mandala",        difficulty:"hard",   axes:12, rings:6, shapes:["star","diamond","arc"],   colors:["#FFFFFF","#C62828","#1B5E20","#F9A825","#0D47A1"] },
  // ── KARVA CHAUTH ─────────────────────────────────────────────────────
  { festival:"karva-chauth", title:"Moon Lotus",         difficulty:"easy",   axes:6,  rings:3, shapes:["lotus","dot"],            colors:["#F8BBD9","#CE93D8","#FFCC02"] },
  { festival:"karva-chauth", title:"Sieve Pattern",      difficulty:"medium", axes:8,  rings:4, shapes:["arc","dot","diamond"],    colors:["#CE93D8","#FFCC02","#F8BBD9","#EF9A9A"] },
  { festival:"karva-chauth", title:"Karwa Mandala",      difficulty:"medium", axes:8,  rings:5, shapes:["petal","lotus","dot"],    colors:["#F8BBD9","#CE93D8","#FFCC02","#A5D6A7","#80DEEA"] },
  { festival:"karva-chauth", title:"Moon and Stars",     difficulty:"hard",   axes:12, rings:6, shapes:["star","petal","lotus"],   colors:["#FFCC02","#F8BBD9","#CE93D8","#B39DDB","#80DEEA"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected\n");

  let admin = await User.findOne({ username: "admin" });
  if (!admin) {
    admin = new User({ username:"admin", email:"admin@rangoli.dev", passwordHash:"Admin@1234" });
    await admin.save();
    console.log("👤 Created admin user\n");
  }

  let created = 0, skipped = 0;
  for (const s of SEEDS) {
    const exists = await Pattern.findOne({ title:s.title, festival:s.festival, isOfficial:true });
    if (exists) { skipped++; continue; }
    await Pattern.create({
      title:        s.title,
      festival:     s.festival,
      difficulty:   s.difficulty,
      symmetryAxes: s.axes,
      tiles:        makeTiles(s.rings, s.axes, s.colors, s.shapes),
      isOfficial:   true,
      isPublic:     true,
      authorId:     admin._id,
      estimatedTime:{ easy:240, medium:480, hard:720, expert:900 }[s.difficulty] || 480,
      tags:         [s.festival, s.difficulty],
    });
    created++;
    console.log(`  ✅  [${s.festival.padEnd(18)}] ${s.title} (${s.difficulty})`);
  }

  console.log(`\n🎨  Seed complete — ${created} created, ${skipped} already existed`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
