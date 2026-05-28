import React from 'react'
import { motion } from 'framer-motion'
import HUD from './HUD'

export default function GameShell({ children }) {
  return (
    <div className="min-h-screen bg-cyber-bg bg-cyber-grid bg-grid-40 flex flex-col">
      <HUD />
      <main className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
