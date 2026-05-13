// src/hooks/usePuzzleValidator.js
import { useMemo, useEffect } from "react";
import useCanvasStore from "../store/canvasStore";
import useGameStore   from "../store/gameStore";

/**
 * Compares the player's placed tiles against a target pattern.
 * Returns accuracy (0-100), matched count, and per-cell correctness map.
 *
 * A tile is "correct" if:
 *   • Same ring + segment position
 *   • Same shapeId
 *   • Color within acceptable hue range (±30° HSL) for flexibility
 */

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1,3),16)/255;
  let g = parseInt(hex.slice(3,5),16)/255;
  let b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      case b: h = ((r-g)/d + 4)/6; break;
    }
  }
  return { h: h*360, s: s*100, l: l*100 };
}

function colorMatch(c1, c2) {
  if (!c1 || !c2) return false;
  if (c1.toLowerCase() === c2.toLowerCase()) return true;
  try {
    const h1 = hexToHSL(c1), h2 = hexToHSL(c2);
    const hueDiff = Math.abs(h1.h - h2.h);
    return hueDiff <= 30 || hueDiff >= 330; // same hue family
  } catch { return false; }
}

export default function usePuzzleValidator() {
  const { tiles }                          = useCanvasStore();
  const { targetPattern, updateAccuracy }  = useGameStore();

  // Build a lookup map of target tiles: "ring-segment" → tile
  const targetMap = useMemo(() => {
    if (!targetPattern?.tiles) return {};
    return targetPattern.tiles.reduce((acc, t) => {
      acc[`${t.ring}-${t.segment}`] = t;
      return acc;
    }, {});
  }, [targetPattern]);

  // For each placed tile, check if it matches the target
  const validation = useMemo(() => {
    if (!targetPattern?.tiles) return { accuracy: 0, matched: 0, total: 0, map: {} };

    const total   = targetPattern.tiles.length;
    let   matched = 0;
    const map     = {};  // "ring-segment" → true/false/undefined

    tiles.forEach(t => {
      const key    = `${t.ring}-${t.segment}`;
      const target = targetMap[key];
      if (!target) {
        map[key] = "wrong";   // placed where no tile should be
      } else {
        const correct = t.shapeId === target.shapeId && colorMatch(t.color, target.color);
        map[key] = correct ? "correct" : "wrong";
        if (correct) matched++;
      }
    });

    // Missing tiles still in target but not placed
    targetPattern.tiles.forEach(t => {
      const key = `${t.ring}-${t.segment}`;
      if (!map[key]) map[key] = "missing";
    });

    const accuracy = total > 0 ? Math.round((matched / total) * 100) : 0;
    return { accuracy, matched, total, map };
  }, [tiles, targetMap]);

  // Push accuracy to game store
  useEffect(() => {
    updateAccuracy(validation.accuracy);
  }, [validation.accuracy]);

  return validation;
}
