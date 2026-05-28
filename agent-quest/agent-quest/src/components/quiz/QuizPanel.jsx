import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import { usePlayerStore } from '@store/usePlayerStore'
import { useXP } from '@hooks/useXP'
import { useGameStore } from '@store/useGameStore'
import { QUIZZES } from '@data/quizzes'
import { MASCOT_DIALOGUES } from '@data/mascotDialogues'

export default function QuizPanel({ levelId, onComplete }) {
  const quiz = QUIZZES[levelId]
  const { saveQuizScore } = usePlayerStore()
  const { awardXP } = useXP()
  const { showMascot } = useGameStore()

  const [current,  setCurrent]  = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers,  setAnswers]  = useState([])
  const [done,     setDone]     = useState(false)

  if (!quiz) return null

  const q     = quiz.questions[current]
  const total = quiz.questions.length
  const score = answers.filter(Boolean).length

  const handleSelect = (idx) => {
    if (revealed) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setRevealed(true)
    const correct = selected === q.answer
    setAnswers(prev => [...prev, correct])
  }

  const handleNext = () => {
    if (current + 1 >= total) {
      // Quiz complete
      const finalScore = answers.filter(Boolean).length + (selected === q.answer ? 1 : 0)
      saveQuizScore(levelId, finalScore)
      const xp = finalScore * 25
      awardXP(xp, `Quiz: ${finalScore}/${total} correct`)
      const passed = finalScore >= Math.ceil(total * 0.66)
      showMascot(
        passed ? MASCOT_DIALOGUES.quizPass.text : MASCOT_DIALOGUES.quizFail.text,
        passed ? 'celebrate' : 'happy'
      )
      setDone(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  if (done) {
    const finalScore = answers.filter(Boolean).length
    const passed     = finalScore >= Math.ceil(total * 0.66)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="text-6xl">{passed ? '🏆' : '💪'}</div>
        <div>
          <h3 className={`font-display text-2xl font-bold tracking-widest
            ${passed ? 'text-cyber-green glow-green' : 'text-cyber-amber glow-amber'}`}>
            {passed ? 'QUIZ CLEARED!' : 'KEEP GOING!'}
          </h3>
          <p className="font-mono text-cyber-muted mt-2">
            {finalScore} / {total} correct · {finalScore * 25} XP earned
          </p>
        </div>
        <NeonButton
          variant={passed ? 'green' : 'amber'}
          size="lg"
          onClick={() => onComplete?.(passed)}
        >
          {passed ? 'CLAIM BLUEPRINT →' : 'RETRY LEVEL'}
        </NeonButton>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="font-display text-xs text-cyber-muted tracking-widest">
          QUESTION {current + 1} / {total}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-1.5 rounded-full transition-colors ${
                i < current
                  ? answers[i] ? 'bg-cyber-green' : 'bg-cyber-pink'
                  : i === current ? 'bg-cyber-cyan' : 'bg-cyber-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <h3 className="font-body text-base text-cyber-text leading-relaxed">
          {q.text}
        </h3>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect  = i === q.answer
            let borderColor  = 'border-cyber-border hover:border-cyber-muted'
            if (revealed) {
              if (isCorrect)              borderColor = 'border-cyber-green bg-cyber-green/10'
              else if (isSelected)        borderColor = 'border-cyber-pink bg-cyber-pink/10'
            } else if (isSelected) {
              borderColor = 'border-cyber-cyan bg-cyber-cyan/10'
            }

            return (
              <motion.button
                key={i}
                whileHover={!revealed ? { x: 4 } : {}}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3 clip-cyber-sm border transition-all duration-200
                  font-body text-sm text-cyber-text ${borderColor}
                  ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-display text-xs text-cyber-muted mr-3 tracking-widest">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {revealed && isCorrect && <span className="ml-2 text-cyber-green">✓</span>}
                {revealed && isSelected && !isCorrect && <span className="ml-2 text-cyber-pink">✗</span>}
              </motion.button>
            )
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border border-cyber-purple/40 bg-cyber-purple/5 clip-cyber-sm p-3"
            >
              <span className="font-display text-xs text-cyber-purple tracking-widest block mb-1">
                EXPLANATION
              </span>
              <p className="font-body text-sm text-cyber-text/80 leading-relaxed">
                {q.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {!revealed ? (
            <NeonButton
              variant="cyan"
              size="md"
              onClick={handleConfirm}
              disabled={selected === null}
              className="flex-1"
            >
              CONFIRM ANSWER
            </NeonButton>
          ) : (
            <NeonButton variant="green" size="md" onClick={handleNext} className="flex-1">
              {current + 1 >= total ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
            </NeonButton>
          )}
        </div>
      </motion.div>
    </div>
  )
}
