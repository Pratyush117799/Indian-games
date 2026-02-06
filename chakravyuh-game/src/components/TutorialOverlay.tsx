import React from "react";

interface TutorialOverlayProps {
  open: boolean;
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const STEPS: { title: string; body: string }[] = [
  {
    title: "This is the Chakravyuh board",
    body: "Nine rings of tiles form your battlefield. The left edge is the entry, the center is your goal, and the right edge is the exit."
  },
  {
    title: "Place tiles to build your formation",
    body: "Select tiles from the Architect's panel and click on empty cells to place them. Create paths, walls, and guard positions."
  },
  {
    title: "Rotate tiles for precise paths",
    body: "Click a placed tile to rotate it by 90°. Use rotation to shape the spiral flow of your Chakravyuh."
  },
  {
    title: "Verify your solution",
    body: "When you think a path exists from entry to center to exit, press 'Verify Solution'. A valid design unlocks the Solver phase."
  },
  {
    title: "Navigate as the warrior",
    body: "In Solver mode, guide the warrior from entry through the center to the exit using clicks or arrow keys. Avoid walls and guards."
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  open,
  step,
  onNext,
  onSkip
}) => {
  if (!open) return null;
  const content = STEPS[Math.min(step, STEPS.length - 1)];
  const isLast = step >= STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-30 bg-black/45 flex items-center justify-center">
      <div className="max-w-md mx-4 rounded-2xl bg-amber-50 border border-amber-600/70 shadow-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-wide text-amber-700">
          Guided Tutorial
        </div>
        <h2 className="text-lg font-semibold text-amber-900">{content.title}</h2>
        <p className="text-sm text-amber-900 leading-relaxed">{content.body}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-amber-700">
          <span>
            Step {Math.min(step + 1, STEPS.length)} / {STEPS.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="px-3 py-1 rounded-full border border-amber-400 text-amber-800 hover:bg-amber-100 font-semibold"
            >
              Skip Tutorial
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-3 py-1 rounded-full bg-indigo-700 text-amber-50 hover:bg-indigo-800 font-semibold"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

