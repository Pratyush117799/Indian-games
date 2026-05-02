// Journey Across India - Spiral Quest
// Circular / spiral snake-and-ladder style game.

const boardElement = document.getElementById("board");
const rollButton = document.getElementById("rollButton");
const restartButton = document.getElementById("restartButton");
const diceResultElement = document.getElementById("diceResult");
const playerCountSelect = document.getElementById("playerCountSelect");
const currentPlayerLabel = document.getElementById("currentPlayerLabel");
const locationNameElement = document.getElementById("locationName");
const locationEffectElement = document.getElementById("locationEffect");
const logEntriesElement = document.getElementById("logEntries");

// Board definition:
// 64 tiles (8x8 grid) arranged as a spiral path from outer corner to center.
// Types: "normal", "boost", "penalty".

const tiles = [
  // 0 is only a virtual "off-board" start, players begin here
  {
    id: 1,
    name: "Kanyakumari (Tamil Nadu)",
    region: "Southern tip of India",
    type: "normal",
    effectText: "You stand where three seas meet. The journey begins!",
  },
  {
    id: 2,
    name: "Thiruvananthapuram",
    region: "Kerala",
    type: "normal",
    effectText: "Coastal breeze and coconut groves – a calm start.",
  },
  {
    id: 3,
    name: "Kochi",
    region: "Kerala",
    type: "normal",
    effectText: "Chinese fishing nets sway gently in the Arabian Sea.",
  },
  {
    id: 4,
    name: "Madurai – Meenakshi Temple",
    region: "Tamil Nadu",
    type: "boost",
    boost: 6,
    effectText: "Sacred darshan at Meenakshi Temple – surge ahead 6 steps!",
  },
  {
    id: 5,
    name: "Rameswaram (Char Dham)",
    region: "Tamil Nadu",
    type: "boost",
    boost: 7,
    effectText: "Holy waters of Rameswaram bless your path – move 7 ahead.",
  },
  {
    id: 6,
    name: "Bengaluru",
    region: "Karnataka (Metro)",
    type: "penalty",
    penalty: -3,
    effectText: "Traffic snarls slow you down – move back 3 steps.",
  },
  {
    id: 7,
    name: "Mysuru Palace",
    region: "Karnataka",
    type: "normal",
    effectText: "You gaze at grand palatial halls and royal history.",
  },
  {
    id: 8,
    name: "Hampi (UNESCO site)",
    region: "Karnataka",
    type: "normal",
    effectText: "Ancient ruins whisper tales of the Vijayanagara Empire.",
  },
  {
    id: 9,
    name: "Hyderabad – Charminar",
    region: "Telangana",
    type: "penalty",
    penalty: -2,
    effectText: "You get lost in bustling bazaars – step back 2.",
  },
  {
    id: 10,
    name: "Amaravati Region",
    region: "Andhra Pradesh",
    type: "normal",
    effectText: "Fields and rivers glide past as you move on.",
  },
  {
    id: 11,
    name: "Visakhapatnam Coast",
    region: "Andhra Pradesh",
    type: "normal",
    effectText: "Sea cliffs and beaches refresh your spirit.",
  },
  {
    id: 12,
    name: "Puri – Jagannath Temple (Char Dham)",
    region: "Odisha",
    type: "boost",
    boost: 6,
    effectText: "Rath Yatra chants carry you forward – advance 6 spaces.",
  },
  {
    id: 13,
    name: "Konark Sun Temple",
    region: "Odisha",
    type: "normal",
    effectText: "Stone wheels of time keep you steady on your journey.",
  },
  {
    id: 14,
    name: "Kolkata – Howrah Bridge",
    region: "West Bengal (Metro)",
    type: "penalty",
    skipTurn: true,
    effectText: "Rush hour on Howrah Bridge – your next turn is skipped.",
  },
  {
    id: 15,
    name: "Sundarbans",
    region: "West Bengal",
    type: "normal",
    effectText: "Mangroves and tigers make this a thrilling stretch.",
  },
  {
    id: 16,
    name: "Shillong & Cherrapunji",
    region: "Meghalaya",
    type: "normal",
    effectText: "Living root bridges guide you through misty hills.",
  },
  {
    id: 17,
    name: "Majuli Island",
    region: "Assam",
    type: "normal",
    effectText: "The Brahmaputra surrounds this serene river island.",
  },
  {
    id: 18,
    name: "Kaziranga National Park",
    region: "Assam",
    type: "normal",
    effectText: "You spot rhinos in the grasslands – carry on.",
  },
  {
    id: 19,
    name: "Gangtok",
    region: "Sikkim",
    type: "normal",
    effectText: "Himalayan views remind you of the long road ahead.",
  },
  {
    id: 20,
    name: "Bodh Gaya",
    region: "Bihar",
    type: "boost",
    boost: 8,
    effectText: "Under the Bodhi tree you find clarity – move ahead 8.",
  },
  {
    id: 21,
    name: "Patna",
    region: "Bihar",
    type: "normal",
    effectText: "Historic Ganga ghats mark your passage through Bihar.",
  },
  {
    id: 22,
    name: "Varanasi – Kashi Vishwanath",
    region: "Uttar Pradesh (Jyotirlinga)",
    type: "boost",
    boost: 7,
    effectText: "Ganga aarti fills you with energy – leap 7 spaces ahead.",
  },
  {
    id: 23,
    name: "Prayagraj – Triveni Sangam",
    region: "Uttar Pradesh",
    type: "boost",
    boost: 5,
    effectText: "Sacred confluence carries you forward – move 5 ahead.",
  },
  {
    id: 24,
    name: "Lucknow",
    region: "Uttar Pradesh",
    type: "normal",
    effectText: "Tehzeeb and kebabs slow you just enough to enjoy.",
  },
  {
    id: 25,
    name: "Haridwar",
    region: "Uttarakhand",
    type: "boost",
    boost: 5,
    effectText: "Ganga snan renews your strength – surge 5 spaces.",
  },
  {
    id: 26,
    name: "Rishikesh",
    region: "Uttarakhand",
    type: "normal",
    effectText: "Ashrams and rapids guide your spiritual adventure.",
  },
  {
    id: 27,
    name: "Kedarnath (Char Dham, Jyotirlinga)",
    region: "Uttarakhand",
    type: "boost",
    boost: 8,
    effectText: "Difficult trek rewarded – jump 8 squares forward.",
  },
  {
    id: 28,
    name: "Badrinath (Char Dham)",
    region: "Uttarakhand",
    type: "boost",
    boost: 6,
    effectText: "Darshan at Badrinath propels you 6 spaces ahead.",
  },
  {
    id: 29,
    name: "Shimla",
    region: "Himachal Pradesh",
    type: "normal",
    effectText: "Hill station charm keeps you cool and steady.",
  },
  {
    id: 30,
    name: "Manali & Rohtang",
    region: "Himachal Pradesh",
    type: "normal",
    effectText: "Snowy roads make travel slow but scenic.",
  },
  {
    id: 31,
    name: "Amritsar – Golden Temple",
    region: "Punjab",
    type: "boost",
    boost: 7,
    effectText: "Langar and shabad inspire you – move 7 steps ahead.",
  },
  {
    id: 32,
    name: "Wagah Border",
    region: "Punjab",
    type: "normal",
    effectText: "Flag ceremony fills you with patriotic zeal.",
  },
  {
    id: 33,
    name: "Jammu – Vaishno Devi",
    region: "Jammu & Kashmir",
    type: "boost",
    boost: 6,
    effectText: "Yatra to Vaishno Devi gives a holy boost of 6.",
  },
  {
    id: 34,
    name: "Srinagar – Dal Lake",
    region: "Jammu & Kashmir",
    type: "penalty",
    skipTurn: true,
    effectText: "Shikara ride is too peaceful – you skip your next turn.",
  },
  {
    id: 35,
    name: "Gulmarg",
    region: "Jammu & Kashmir",
    type: "penalty",
    penalty: -4,
    effectText: "Snowfall blocks passes – move back 4 spaces.",
  },
  {
    id: 36,
    name: "Leh–Ladakh",
    region: "Ladakh",
    type: "penalty",
    penalty: -5,
    effectText: "Thin air forces a rest – go back 5 spots.",
  },
  {
    id: 37,
    name: "Rann of Kutch (White Desert)",
    region: "Gujarat",
    type: "normal",
    effectText: "White sands under moonlight keep your pace steady.",
  },
  {
    id: 38,
    name: "Dwarka (Char Dham)",
    region: "Gujarat",
    type: "boost",
    boost: 7,
    effectText: "Blessings of Dwarkadhish move you 7 steps forward.",
  },
  {
    id: 39,
    name: "Somnath (Jyotirlinga)",
    region: "Gujarat",
    type: "boost",
    boost: 6,
    effectText: "Waves crash at Somnath temple – leap ahead 6 spaces.",
  },
  {
    id: 40,
    name: "Gir Forest",
    region: "Gujarat",
    type: "normal",
    effectText: "Lions watch you pass quietly.",
  },
  {
    id: 41,
    name: "Mumbai – Gateway of India",
    region: "Maharashtra (Metro)",
    type: "penalty",
    penalty: -3,
    effectText: "Local trains and monsoon delays – step back 3.",
  },
  {
    id: 42,
    name: "Shirdi",
    region: "Maharashtra",
    type: "boost",
    boost: 5,
    effectText: "Sai Baba's blessings push you 5 steps ahead.",
  },
  {
    id: 43,
    name: "Ellora & Ajanta Caves",
    region: "Maharashtra",
    type: "normal",
    effectText: "Rock-cut caves tell stories that fuel your imagination.",
  },
  {
    id: 44,
    name: "Ujjain – Mahakaleshwar",
    region: "Madhya Pradesh (Jyotirlinga)",
    type: "boost",
    boost: 6,
    effectText: "Mahakal's aarti surges through you – race ahead 6.",
  },
  {
    id: 45,
    name: "Khajuraho Temples",
    region: "Madhya Pradesh",
    type: "normal",
    effectText: "Intricate sculptures remind you of timeless art.",
  },
  {
    id: 46,
    name: "Jaipur – Pink City",
    region: "Rajasthan",
    type: "normal",
    effectText: "Fortresses and palaces make for a royal detour.",
  },
  {
    id: 47,
    name: "Jaisalmer – Thar Desert",
    region: "Rajasthan",
    type: "penalty",
    penalty: -3,
    effectText: "Desert heat slows your caravan – move back 3.",
  },
  {
    id: 48,
    name: "Rann Utsav Camp",
    region: "Gujarat/Rajasthan Border",
    type: "normal",
    effectText: "Folk music and dance revive your spirits.",
  },
  {
    id: 49,
    name: "Agra – Taj Mahal",
    region: "Uttar Pradesh",
    type: "normal",
    effectText: "The symbol of love gives you quiet determination.",
  },
  {
    id: 50,
    name: "Mathura & Vrindavan",
    region: "Uttar Pradesh",
    type: "boost",
    boost: 5,
    effectText: "Krishna leelas lift you forward by 5.",
  },
  {
    id: 51,
    name: "Ayodhya – Ram Janmabhoomi",
    region: "Uttar Pradesh",
    type: "boost",
    boost: 6,
    effectText: "Jai Shri Ram! Leap 6 steps forward.",
  },
  {
    id: 52,
    name: "Ahmedabad – Sabarmati Ashram",
    region: "Gujarat",
    type: "normal",
    effectText: "Gandhiji's simplicity keeps you grounded and steady.",
  },
  {
    id: 53,
    name: "Indore",
    region: "Madhya Pradesh",
    type: "penalty",
    skipTurn: true,
    effectText: "Too many food stops at Sarafa – you skip your next turn.",
  },
  {
    id: 54,
    name: "Bhopal – Lakes & Stupas",
    region: "Madhya Pradesh",
    type: "normal",
    effectText: "Calm lakes reflect your steady progress.",
  },
  {
    id: 55,
    name: "Bengaluru (Return Leg)",
    region: "Karnataka (Metro)",
    type: "penalty",
    penalty: -4,
    effectText: "Ring road jams strike again – go back 4 spaces.",
  },
  {
    id: 56,
    name: "Goa – Beaches & Churches",
    region: "Goa",
    type: "penalty",
    skipTurn: true,
    effectText: "Beach holiday mode on – you skip your next turn.",
  },
  {
    id: 57,
    name: "Coorg & Western Ghats",
    region: "Karnataka",
    type: "normal",
    effectText: "Coffee plantations wake you up for the final stretch.",
  },
  {
    id: 58,
    name: "Tirupati Balaji",
    region: "Andhra Pradesh",
    type: "boost",
    boost: 7,
    effectText: "Laddu prasad and blessings send you 7 ahead.",
  },
  {
    id: 59,
    name: "Chennai – Marina Beach",
    region: "Tamil Nadu (Metro)",
    type: "penalty",
    penalty: -3,
    effectText: "City traffic near Marina slows you – move back 3.",
  },
  {
    id: 60,
    name: "Pondicherry",
    region: "Tamil Nadu/Puducherry",
    type: "normal",
    effectText: "French streets and sea breeze keep you relaxed.",
  },
  {
    id: 61,
    name: "Andaman & Nicobar Islands",
    region: "Bay of Bengal",
    type: "normal",
    effectText: "Islands remind you how vast India truly is.",
  },
  {
    id: 62,
    name: "Lakshadweep",
    region: "Arabian Sea",
    type: "normal",
    effectText: "Coral reefs sparkle as you sail ahead.",
  },
  {
    id: 63,
    name: "Delhi – Old & New",
    region: "National Capital (Metro)",
    type: "penalty",
    penalty: -5,
    effectText: "Parliament sessions and metro crowds delay you – go back 5.",
  },
  {
    id: 64,
    name: "Central Square – Heart of India",
    region: "Victory",
    type: "center",
    effectText: "You reach the symbolic heart of India and win the journey!",
  },
];

// Map tile indices (1..64) to positions in the 8x8 grid for a spiral path.
// We'll precompute a spiral path and assign tiles following that path.
const GRID_SIZE = 8;

function buildSpiralOrder(size) {
  const visited = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
  const order = [];
  let top = 0;
  let bottom = size - 1;
  let left = 0;
  let right = size - 1;

  while (top <= bottom && left <= right) {
    // top row (left to right)
    for (let j = left; j <= right; j++) {
      order.push({ row: top, col: j });
    }
    top++;
    // right column (top to bottom)
    for (let i = top; i <= bottom; i++) {
      order.push({ row: i, col: right });
    }
    right--;
    if (top <= bottom) {
      // bottom row (right to left)
      for (let j = right; j >= left; j--) {
        order.push({ row: bottom, col: j });
      }
      bottom--;
    }
    if (left <= right) {
      // left column (bottom to top)
      for (let i = bottom; i >= top; i--) {
        order.push({ row: i, col: left });
      }
      left++;
    }
  }

  return order.slice(0, 64); // For 8x8 we expect 64 cells exactly.
}

const spiralOrder = buildSpiralOrder(GRID_SIZE);

// Players
let players = [];
let currentPlayerIndex = 0;
let gameOver = false;

const PLAYER_EMOJIS = ["🧕", "👨‍💼", "🧑‍🎓", "👵"];

function createPlayers(count) {
  players = [];
  for (let i = 0; i < count; i++) {
    players.push({
      id: i,
      name: `Player ${i + 1}`,
      position: 0, // 0 means before tile 1
      skipNext: false,
      colorClass: `p${i}`,
      emoji: PLAYER_EMOJIS[i] || "🧍",
    });
  }
  currentPlayerIndex = 0;
  gameOver = false;
}

function getTileById(id) {
  return tiles.find((t) => t.id === id);
}

function renderBoard() {
  boardElement.innerHTML = "";

  const tileById = {};
  tiles.forEach((t) => {
    tileById[t.id] = t;
  });

  // Spiral order positions: index 0 -> tile 1, index 63 -> tile 64
  for (let index = 0; index < spiralOrder.length; index++) {
    const { row, col } = spiralOrder[index];
    const tileId = index + 1;
    const tileData = tileById[tileId];

    const tileDiv = document.createElement("div");
    tileDiv.classList.add("tile");
    if (tileData) {
      if (tileData.type === "boost") tileDiv.classList.add("tile-boost");
      else if (tileData.type === "penalty") tileDiv.classList.add("tile-penalty");
      else if (tileData.type === "center") tileDiv.classList.add("tile-center");
      else tileDiv.classList.add("tile-normal");
    } else {
      tileDiv.classList.add("tile-normal");
    }
    tileDiv.dataset.tileId = tileId.toString();

    const numberSpan = document.createElement("div");
    numberSpan.className = "tile-number";
    numberSpan.textContent = tileId.toString();

    const nameSpan = document.createElement("div");
    nameSpan.className = "tile-name";
    nameSpan.textContent = tileData ? tileData.name : "—";

    const tagSpan = document.createElement("div");
    tagSpan.className = "tile-tag";
    if (tileData) {
      if (tileData.type === "boost") {
        tagSpan.textContent = "Boost";
      } else if (tileData.type === "penalty") {
        if (tileData.skipTurn) tagSpan.textContent = "Skip";
        else tagSpan.textContent = "Back";
      } else if (tileData.type === "center") {
        tagSpan.textContent = "Central Square";
      } else {
        tagSpan.textContent = "Normal";
      }
    } else {
      tagSpan.textContent = "—";
    }

    const piecesContainer = document.createElement("div");
    piecesContainer.className = "pieces";

    const inner = document.createElement("div");
    inner.className = "tile-inner";

    tileDiv.appendChild(numberSpan);
    tileDiv.appendChild(nameSpan);
    tileDiv.appendChild(tagSpan);
    tileDiv.appendChild(piecesContainer);
    tileDiv.appendChild(inner);

    // Map to grid position
    tileDiv.style.gridRowStart = row + 1;
    tileDiv.style.gridColumnStart = col + 1;

    boardElement.appendChild(tileDiv);
  }

  updatePiecesOnBoard();
}

function updatePiecesOnBoard() {
  const tileDivs = boardElement.querySelectorAll(".tile");
  tileDivs.forEach((tileDiv) => {
    const container = tileDiv.querySelector(".pieces");
    if (container) container.innerHTML = "";
  });

  players.forEach((player) => {
    if (player.position <= 0) return;
    const selector = `.tile[data-tile-id="${player.position}"] .pieces`;
    const container = boardElement.querySelector(selector);
    if (!container) return;
    const piece = document.createElement("div");
    piece.className = `piece ${player.colorClass}`;
    piece.textContent = player.emoji;
    piece.title = player.name;
    container.appendChild(piece);
  });
}

function log(message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = message;
  logEntriesElement.prepend(entry);
}

function updateTurnDisplay() {
  const player = players[currentPlayerIndex];
  currentPlayerLabel.textContent = `${player.name}${
    player.skipNext ? " (will skip next)" : ""
  }`;
}

function updateLocationInfo(tileId) {
  const tileData = getTileById(tileId);
  if (!tileData) {
    locationNameElement.textContent =
      "You are just outside the board. Roll to enter India at Kanyakumari!";
    locationEffectElement.textContent = "";
    return;
  }
  locationNameElement.textContent = `${tileData.name} – ${tileData.region}`;
  locationEffectElement.textContent = tileData.effectText || "";
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateTurnDisplay();
}

function rollDice() {
  if (gameOver) return;
  const player = players[currentPlayerIndex];
  if (player.skipNext) {
    log(
      `<strong>${player.name}</strong> skips this turn to rest in <em>${getTileById(
        player.position
      )?.name || "a peaceful spot"}</em>.`
    );
    player.skipNext = false;
    nextPlayer();
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  diceResultElement.textContent = `🎲 ${roll}`;
  log(`<strong>${player.name}</strong> rolled a <strong>${roll}</strong>.`);

  let targetPos = player.position + roll;
  if (targetPos > 64) {
    // If overshoot, bounce back
    const overshoot = targetPos - 64;
    targetPos = 64 - overshoot;
    log(
      `<strong>${player.name}</strong> overshoots the central square and bounces back to <strong>${targetPos}</strong>.`
    );
  }

  player.position = targetPos;
  updatePiecesOnBoard();
  updateLocationInfo(player.position);

  const tile = getTileById(player.position);
  if (!tile) {
    nextPlayer();
    return;
  }

  if (tile.type === "center") {
    log(
      `<strong>${player.name}</strong> has reached the <strong>Central Square – Heart of India</strong> and wins the game!`
    );
    gameOver = true;
    rollButton.disabled = true;
    currentPlayerLabel.textContent = `${player.name} – Winner!`;
    return;
  }

  // Apply special effects
  if (tile.type === "boost") {
    const boost = tile.boost ?? 5;
    let newPos = player.position + boost;
    if (newPos > 64) newPos = 64;
    log(
      `<strong>Boost!</strong> Sacred energy at <em>${tile.name}</em> moves ${player.name} forward by <strong>${boost}</strong> to <strong>${newPos}</strong>.`
    );
    player.position = newPos;
    if (player.position === 64) {
      updatePiecesOnBoard();
      updateLocationInfo(player.position);
      log(
        `<strong>${player.name}</strong> reaches the <strong>Central Square – Heart of India</strong> and wins the game!`
      );
      gameOver = true;
      rollButton.disabled = true;
      currentPlayerLabel.textContent = `${player.name} – Winner!`;
      return;
    }
  } else if (tile.type === "penalty") {
    if (tile.skipTurn) {
      player.skipNext = true;
      log(
        `<strong>Rest!</strong> ${player.name} enjoys an extended stay at <em>${tile.name}</em> and will <strong>skip the next turn</strong>.`
      );
    } else if (typeof tile.penalty === "number") {
      const back = tile.penalty;
      let newPos = player.position + back; // back is negative
      if (newPos < 0) newPos = 0;
      log(
        `<strong>Setback!</strong> Hustle or harsh terrain at <em>${tile.name}</em> pushes ${player.name} back by <strong>${Math.abs(
          back
        )}</strong> to <strong>${newPos}</strong>.`
      );
      player.position = newPos;
    }
  }

  updatePiecesOnBoard();
  updateLocationInfo(player.position);

  // If after all effects player is exactly at 64, also win
  if (player.position === 64 && !gameOver) {
    const center = getTileById(64);
    log(
      `<strong>${player.name}</strong> has reached <strong>${center.name}</strong> and wins the journey across India!`
    );
    gameOver = true;
    rollButton.disabled = true;
    currentPlayerLabel.textContent = `${player.name} – Winner!`;
    return;
  }

  nextPlayer();
}

function restartGame() {
  const count = parseInt(playerCountSelect.value, 10) || 2;
  createPlayers(count);
  renderBoard();
  updateTurnDisplay();
  updateLocationInfo(0);
  diceResultElement.textContent = "🎲 -";
  rollButton.disabled = false;
  logEntriesElement.innerHTML = "";
  log(`New game started with <strong>${count}</strong> players. Begin from Kanyakumari!`);
}

rollButton.addEventListener("click", () => {
  rollDice();
});

restartButton.addEventListener("click", () => {
  restartGame();
});

playerCountSelect.addEventListener("change", () => {
  restartGame();
});

// Initial setup
restartGame();

