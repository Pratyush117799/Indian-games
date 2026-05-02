/**
 * boardGeometry.js
 * All static board data for Navakankari (Nine Men's Morris variant).
 * 24 nodes on a 300×300 SVG coordinate space.
 * Three concentric squares with midpoint connectors.
 */

/** Node positions in SVG space */
export const NODE = [
  // Outer square (0-7)  corners → midpoints → corners...
  { x: 14,  y: 14  }, // 0  top-left
  { x: 150, y: 14  }, // 1  top-mid
  { x: 286, y: 14  }, // 2  top-right
  { x: 286, y: 150 }, // 3  mid-right
  { x: 286, y: 286 }, // 4  bot-right
  { x: 150, y: 286 }, // 5  bot-mid
  { x: 14,  y: 286 }, // 6  bot-left
  { x: 14,  y: 150 }, // 7  mid-left
  // Middle square (8-15)
  { x: 74,  y: 74  }, // 8
  { x: 150, y: 74  }, // 9
  { x: 226, y: 74  }, // 10
  { x: 226, y: 150 }, // 11
  { x: 226, y: 226 }, // 12
  { x: 150, y: 226 }, // 13
  { x: 74,  y: 226 }, // 14
  { x: 74,  y: 150 }, // 15
  // Inner square (16-23)
  { x: 120, y: 120 }, // 16
  { x: 150, y: 120 }, // 17
  { x: 180, y: 120 }, // 18
  { x: 180, y: 150 }, // 19
  { x: 180, y: 180 }, // 20
  { x: 150, y: 180 }, // 21
  { x: 120, y: 180 }, // 22
  { x: 120, y: 150 }, // 23
]

/** Adjacency list — legal slide destinations from each node */
export const ADJ = [
  [1, 7],           // 0
  [0, 2, 9],        // 1
  [1, 3],           // 2
  [2, 4, 11],       // 3
  [3, 5],           // 4
  [4, 6, 13],       // 5
  [5, 7],           // 6
  [0, 6, 15],       // 7
  [9, 15],          // 8
  [1, 8, 10, 17],   // 9
  [9, 11],          // 10
  [3, 10, 12, 19],  // 11
  [11, 13],         // 12
  [5, 12, 14, 21],  // 13
  [13, 15],         // 14
  [7, 8, 14, 23],   // 15
  [17, 23],         // 16
  [9, 16, 18],      // 17
  [17, 19],         // 18
  [11, 18, 20],     // 19
  [19, 21],         // 20
  [13, 20, 22],     // 21
  [21, 23],         // 22
  [15, 16, 22],     // 23
]

/** The 16 winning mill lines */
export const MILLS = [
  // Outer square sides
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  // Middle square sides
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  // Inner square sides
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  // Cross-connectors (midpoints linking squares)
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23],
]

/** Unique edge pairs for drawing the board lines */
export const EDGES = (() => {
  const edges = []
  for (let i = 0; i < 24; i++)
    ADJ[i].forEach(j => { if (j > i) edges.push([i, j]) })
  return edges
})()
