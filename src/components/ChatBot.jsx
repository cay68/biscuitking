import { useState, useRef, useEffect } from 'react'

// Simple markdown → React: handles **bold**, *italic*, and newlines
function renderMarkdown(text) {
  // Split by **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

const suggestionPills = [
  "I'm a 90s kid, what should I get?",
  "Gift box under $30",
  "What's good for CNY?",
  "Something sour and tangy",
]

const welcomeMessage = {
  role: 'assistant',
  content: "Hi, I'm Biscuit King! \ud83d\udc4b Your guide to Singapore's best old-school snacks. Whether you're hunting for childhood favourites or looking for the perfect gift tin, I'm here to help. What are you looking for today?",
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, alignItems: 'flex-end' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
        👑
      </div>
      <div
        className="rounded-2xl rounded-bl-sm bg-[var(--yellow-50)]"
        style={{ padding: '14px 18px', display: 'flex', gap: 4, alignItems: 'center' }}
      >
        <span className="typing-dot" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot" style={{ animationDelay: '150ms' }} />
        <span className="typing-dot" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([welcomeMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPills, setShowPills] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return
    const userMsg = { role: 'user', content: text.trim() }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setShowPills(false)
    setIsLoading(true)

    try {
      // Build conversation history for API (exclude the static welcome message)
      const apiMessages = [...messages.slice(1), userMsg].map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again in a moment!" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-[900]">
          {showTooltip && (
            <div
              className="absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-lg bg-[var(--white)] text-[var(--black)]"
              style={{ border: '1px solid var(--red-100)' }}
            >
              Need help choosing? Ask me!
              <div
                className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-[var(--white)]"
                style={{ borderRight: '1px solid var(--red-100)', borderBottom: '1px solid var(--red-100)' }}
              />
            </div>
          )}

          <button
            onClick={() => { setOpen(true); setShowTooltip(false) }}
            className="chat-pulse w-14 h-14 rounded-full bg-[var(--red-400)] hover:bg-[var(--red-500)] text-white shadow-lg flex items-center justify-center transition-colors"
            aria-label="Open chat"
          >
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[900] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Header */}
          <div
            className="shrink-0"
            style={{ background: 'var(--red-400)', padding: '14px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  👑
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 15, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.2 }}>
                    Biscuit King
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Close chat"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto" style={{ background: 'var(--off-white)', padding: '20px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    👑
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl text-sm leading-relaxed text-[var(--black)] ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-[var(--red-50)]'
                      : 'rounded-bl-sm bg-[var(--yellow-50)]'
                  }`}
                  style={{ padding: '14px 18px', whiteSpace: 'pre-wrap' }}
                >
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
            </div>
          </div>

          {/* Suggestion pills + input area */}
          <div className="shrink-0 border-t border-[var(--red-50)] bg-white">
            {/* Pills — shown until first message sent */}
            {showPills && (
              <div style={{ padding: '10px 16px 4px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestionPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => sendMessage(pill)}
                    className="hover:bg-[var(--red-100)] transition-colors"
                    style={{
                      fontSize: 12,
                      padding: '5px 12px',
                      borderRadius: 9999,
                      background: 'var(--red-50)',
                      color: 'var(--red-500)',
                      border: '1px solid var(--red-200)',
                      cursor: 'pointer',
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '8px 16px 12px', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about snacks..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 9999,
                  fontSize: 14,
                  border: '1px solid var(--red-100)',
                  outline: 'none',
                  background: 'var(--off-white)',
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading}
                className="hover:bg-[var(--red-500)] transition-colors"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: 'var(--red-400)',
                  color: 'white',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isLoading ? 0.6 : 1,
                }}
                aria-label="Send message"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--muted);
          animation: typing-bounce 1.2s infinite;
        }
      `}</style>
    </>
  )
}
