import React from 'react'

import './index.css'

interface MessageProps {
  message: {
    role: 'user' | 'assistant' | 'system' | 'tool'
    content: string
  }
  isNew?: boolean
}

const ChatMessage: React.FC<MessageProps> = ({ message, isNew }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`message ${message.role} ${isNew ? 'fade-in' : ''}}`}>
      <div className="message-content">
        <div className="avatar">
          {isUser ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          )}
        </div>
        <div className="message-bubble" dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    </div>
  )
}

export default ChatMessage
