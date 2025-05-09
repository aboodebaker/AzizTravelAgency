/* eslint-disable no-console */
'use client'
import React, { TouchEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios'

import ChatMessage from './ChatMessage'

import './index.css'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint || /Mobi|Android/i.test(navigator.userAgent)
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      const isMobileNow =
        window.innerWidth <= breakpoint || /Mobi|Android/i.test(navigator.userAgent)
      setIsMobile(isMobileNow)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: "I'm your helpful assistant. How can I help you today?" },
  ])
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const webhookUrl = 'https://hook.eu2.make.com/smd5pbv5py9cm3nnp4arddtkqfgnma24'

  const minSwipeDistance = 50

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
    if (isDragging) e.preventDefault()
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchEnd - touchStart
    if (distance > minSwipeDistance) setIsOpen(false)
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)
    const newMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      console.log('Posting to webhook...')

      const response = await axios.post(webhookUrl, {
        message: messages, // or just newMessage if required by webhook
      })

      console.log('Webhook response:', response.data)

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data || 'Response received.' },
      ])
    } catch (error: any) {
      console.log('Failed to send message:', error.message || error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to send message.' }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const ChatContent = () => <></>

  return (
    <div className="chat-bot-container">
      <button className="chat-toggle-button" onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {isMobile && (
        <>
          <div
            className={`chat-overlay ${isOpen ? 'visible' : 'hidden'}`}
            onClick={() => setIsOpen(false)}
          ></div>
          <div className={`chat-drawer ${isOpen ? 'visible' : 'hidden'}`} ref={drawerRef}>
            <div
              className="drawer-handle-area"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="drawer-handle"></div>
            </div>
            <div className="chat-content">
              <div className="chat-header">
                <h2>Chat Assistant</h2>
                <button className="close-button" onClick={() => setIsOpen(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="chat-messages">
                <div className="message-list">
                  {messages
                    .filter(msg => msg.role !== 'system')
                    .map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        isNew={index === messages.length - 1}
                      />
                    ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <div className="input-container">
                  <textarea
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="message-textarea"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="send-button"
                  >
                    {loading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!isMobile && (
        <>
          <div
            className={`chat-overlay ${isOpen ? 'visible' : 'hidden'}`}
            onClick={() => setIsOpen(false)}
          ></div>
          <div className={`chat-sheet ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="chat-content">
              <div className="chat-header">
                <h2>Chat Assistant</h2>
                <button className="close-button" onClick={() => setIsOpen(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="chat-messages">
                <div className="message-list">
                  {messages
                    .filter(msg => msg.role !== 'system')
                    .map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        isNew={index === messages.length - 1}
                      />
                    ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <div className="input-container">
                  <textarea
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="message-textarea"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="send-button"
                  >
                    {loading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatBot
