import React from 'react'
import { motion } from 'framer-motion'
import { useAgentStore } from '@store/useAgentStore'
import CyberBadge from '@components/ui/CyberBadge'

const TOOL_META = {
  get_current_time: { icon: '🕐', label: 'Clock',      desc: 'Returns current date & time',            color: 'cyan'   },
  calculator:       { icon: '🧮', label: 'Calculator', desc: 'Evaluate math expressions',               color: 'purple' },
  web_search:       { icon: '🔍', label: 'Web Search', desc: 'Search the web for live information',     color: 'pink'   },
  read_file:        { icon: '📄', label: 'Read File',  desc: 'Read from virtual filesystem',            color: 'amber'  },
  write_file:       { icon: '💾', label: 'Write File', desc: 'Write to virtual filesystem',             color: 'amber'  },
  send_message:     { icon: '📨', label: 'Message',    desc: 'Send message to another agent',           color: 'green'  },
}

export default function ToolBox() {
  const { availableTools, equippedTools, equipTool, unequipTool } = useAgentStore()

  return (
    <div className="bg-cyber-surface border border-cyber-border clip-cyber overflow-hidden">
      <div className="px-4 py-2 border-b border-cyber-border">
        <span className="font-display text-xs tracking-widest text-cyber-muted">
          TOOLBOX · {equippedTools.length} EQUIPPED
        </span>
      </div>

      <div className="p-3 space-y-2">
        {availableTools.map((toolId) => {
          const meta     = TOOL_META[toolId] || { icon: '⚙️', label: toolId, desc: '', color: 'cyan' }
          const equipped = equippedTools.includes(toolId)

          return (
            <motion.div
              key={toolId}
              whileHover={{ x: 2 }}
              onClick={() => equipped ? unequipTool(toolId) : equipTool(toolId)}
              className={`
                flex items-center gap-3 p-3 clip-cyber-sm border cursor-pointer
                transition-all duration-200 select-none
                ${equipped
                  ? `border-cyber-${meta.color}/60 bg-cyber-${meta.color}/10`
                  : 'border-cyber-border hover:border-cyber-muted bg-cyber-bg/50'
                }
              `}
            >
              <span className="text-xl">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-xs font-bold tracking-wide
                    ${equipped ? `text-cyber-${meta.color}` : 'text-cyber-text'}`}>
                    {meta.label}
                  </span>
                  {equipped && <CyberBadge label="ON" color={meta.color} size="xs" />}
                </div>
                <p className="font-mono text-[10px] text-cyber-muted truncate">{meta.desc}</p>
              </div>
              <motion.div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${equipped ? `border-cyber-${meta.color} bg-cyber-${meta.color}` : 'border-cyber-border'}`}
                animate={equipped ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {equipped && <div className="w-1.5 h-1.5 rounded-full bg-cyber-bg" />}
              </motion.div>
            </motion.div>
          )
        })}

        {availableTools.length === 0 && (
          <p className="font-mono text-xs text-cyber-muted text-center py-4">
            // No tools available in this level
          </p>
        )}
      </div>
    </div>
  )
}
