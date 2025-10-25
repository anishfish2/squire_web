'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import ThreePane from './components/box'
import IntroText from './components/introText'
import useTimeStore from './stores/timeStore'
import TimeSave from './components/timeSave'
import ToolCarousel from './components/toolCarousel'
import ToolDescription from './components/toolSelection'
import { useToolStore } from './stores/toolStore'
import { ScrollProvider } from './hooks/useGlobalScroll'
import DrawBoxOverlay from './components/drawOverlay'
import { motion } from 'framer-motion'

function parseTimeString(timeStr: string): number {
  if (!timeStr) return 0

  const str = timeStr.trim().toLowerCase()
  const match = str.match(/([\d.]+)\s*(sec|second|seconds|min|minute|minutes|hr|hrs|hour|hours)?/)
  if (!match) return 0

  const value = parseFloat(match[1])
  const unit = match[2] || 'min'

  switch (unit) {
    case 'sec':
    case 'second':
    case 'seconds':
      return value / 60
    case 'hr':
    case 'hrs':
    case 'hour':
    case 'hours':
      return value * 60
    case 'min':
    case 'minute':
    case 'minutes':
    default:
      return value
  }
}


const toolActions = [
  {
    id: 'slack',
    tool: 'Slack',
    functions: [
      { name: 'Post Channel Message', time: '1 min' },
      { name: 'Create Announcement', time: '2 min' },
      { name: 'Fetch Recent Messages', time: '1 min' },
      { name: 'Invite User to Channel', time: '1.5 min' },
    ],
    time: '3 min',
    iconPath: '/textures/Slack.png',
    color: '#000000',
  },
  {
    id: 'gmail',
    tool: 'Gmail',
    functions: [
      { name: 'Send Email', time: '2 min' },
      { name: 'Draft Reply', time: '1.5 min' },
      { name: 'Search Inbox', time: '1 min' },
      { name: 'Label or Archive Message', time: '0.5 min' },
    ],
    time: '2 min',
    iconPath: '/textures/Gmail.png',
    color: '#000000',
  },
  {
    id: 'gdrive',
    tool: 'Google Drive',
    functions: [
      { name: 'Upload File', time: '1.5 min' },
      { name: 'Search for Document', time: '1 min' },
      { name: 'Share File with User', time: '1.5 min' },
      { name: 'List Files in Folder', time: '0.5 min' },
    ],
    time: '1.5 min',
    iconPath: '/textures/Google Drive.png',
    color: '#000000',
  },
  {
    id: 'notion',
    tool: 'Notion',
    functions: [
      { name: 'Create New Page', time: '1 min' },
      { name: 'Update Database Entry', time: '1.5 min' },
      { name: 'Query Tasks by Status', time: '1 min' },
      { name: 'Add Comment to Page', time: '0.5 min' },
    ],
    time: '1 min',
    iconPath: '/textures/Notion.png',
    color: '#000000',
  },
  {
    id: 'linear',
    tool: 'Linear',
    functions: [
      { name: 'Create Issue', time: '1.5 min' },
      { name: 'Update Ticket Status', time: '1 min' },
      { name: 'Assign Issue to Teammate', time: '1 min' },
      { name: 'List Open Issues', time: '0.5 min' },
    ],
    time: '2.5 min',
    iconPath: '/textures/Linear.png',
    color: '#000000',
  },
  {
    id: 'gsheets',
    tool: 'Google Sheets',
    functions: [
      { name: 'Append Row', time: '1 min' },
      { name: 'Update Cell Range', time: '1.5 min' },
      { name: 'Read Spreadsheet Data', time: '1 min' },
      { name: 'Create New Sheet', time: '1.5 min' },
    ],
    time: '3 min',
    iconPath: '/textures/Google Sheets.png',
    color: '#000000',
  },
  {
    id: 'reddit',
    tool: 'Reddit',
    functions: [
      { name: 'Fetch Top Posts', time: '1 min' },
      { name: 'Comment on Thread', time: '1.5 min' },
      { name: 'Upvote Post', time: '0.5 min' },
      { name: 'Submit New Post', time: '2 min' },
    ],
    time: '2 min',
    iconPath: '/textures/Reddit.png',
    color: '#000000',
  },
  {
    id: 'trello',
    tool: 'Trello',
    functions: [
      { name: 'Create Card', time: '1.5 min' },
      { name: 'Move Card Between Lists', time: '1 min' },
      { name: 'Add Comment to Card', time: '0.5 min' },
      { name: 'List Cards on Board', time: '1 min' },
    ],
    time: '2.5 min',
    iconPath: '/textures/Trello.png',
    color: '#000000',
  },
  {
    id: 'figma',
    tool: 'Figma',
    functions: [
      { name: 'List Frames in File', time: '1 min' },
      { name: 'Fetch Comments', time: '1 min' },
      { name: 'Get Component Metadata', time: '1.5 min' },
      { name: 'Render Design Thumbnail', time: '2 min' },
    ],
    time: '3 min',
    iconPath: '/textures/Figma.png',
    color: '#000000',
  },
  {
    id: 'gsearch',
    tool: 'Google',
    functions: [
      { name: 'Search Query', time: '1 min' },
      { name: 'Get Top Result Summary', time: '1.5 min' },
      { name: 'Find Related Articles', time: '2 min' },
      { name: 'Extract URLs from Results', time: '1 min' },
    ],
    time: '2 min',
    iconPath: '/textures/Google.png',
    color: '#000000',
  },
  {
    id: 'github',
    tool: 'GitHub',
    functions: [
      { name: 'Create Issue', time: '1.5 min' },
      { name: 'List Pull Requests', time: '1 min' },
      { name: 'Comment on PR', time: '1 min' },
      { name: 'Fetch Repository Info', time: '1 min' },
    ],
    time: '2.5 min',
    iconPath: '/textures/Github.png',
    color: '#000000',
  },
]
export default function Home() {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [collected, setCollected] = useState<{ id: string; color: string; tool: string }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { time, setTime } = useTimeStore()
  const [showTime, setShowTime] = useState(true)


  const handleClick = useCallback((id: string) => {
    const clicked = toolActions.find((t) => t.id === id)
    if (!clicked) return

    const el = document.getElementById(id)
    if (!el) return

    el.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.3, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 1200, easing: 'ease-in-out', fill: 'forwards' }
    )

    const addedTime = parseTimeString(clicked.time)

    setTime(time + addedTime)
    setCollected((prev) => [
      ...prev,
      { id: `${id}-${Math.random().toString(36).substring(2, 9)}`, color: clicked.color, tool: clicked.tool },
    ])
  }, [setTime, setCollected])

  const setHandleClick = useToolStore((s) => s.setHandleClick)

  useEffect(() => {
    setHandleClick(handleClick)
  }, [handleClick])

  const handleCubeVisibleChange = (visible: boolean) => {
    if (!visible) {
      setTimeout(() => setShowTime(false), 800) // matches cube fade
    } else {
      setTimeout(() => setShowTime(true), 600)
    }
  }

  return (
    <div className="relative overflow-hidden scollbar-hide">
      <ScrollProvider>
        <main className="relative overflow-hidden min-h-[2400vh] scrollbar-hide ">
          <div className="fixed right-6 translate-y-1/4 flex flex-col items-center gap-8 h-[60vh] overflow-visible z-[600] pt-6 pr-6 pl-6 pb-6">
            <ToolCarousel
              toolActions={toolActions}
              handleClick={handleClick}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          </div>
          <div ref={containerRef} className="fixed inset-0 z-50">
            <ThreePane collected={collected} onCubeVisibleChange={handleCubeVisibleChange} />
            <DrawBoxOverlay />
          </div>

          <div>
            <ToolDescription />
          </div>
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: showTime ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className=""
            >
              <TimeSave />
            </motion.div>
          </div>
          <section className="bg-white z-20">
            <IntroText />
          </section>
        </main>
      </ScrollProvider>
    </div>
  )
}
