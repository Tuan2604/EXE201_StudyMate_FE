import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { type Conversation, type Message } from './mockData'
import MainHeader from '../components/MainHeader'

// --- Component: Avatar Group ---
const AvatarGroup: React.FC<{ avatar: string | string[] | null | undefined; name?: string; size?: 'sm' | 'md' | 'lg'; isOnline?: boolean }> = ({ avatar, name, size = 'md', isOnline = false }) => {
  const containerSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-12 h-12';
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`;
  
  return (
    <div className="relative">
      <div className={`${containerSize} rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-50`}>
        {!avatar ? (
          <img src={fallbackAvatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : typeof avatar === 'string' ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full relative flex flex-wrap bg-slate-50">
            {avatar.slice(0, 4).map((url, idx) => (
              <img key={idx} src={url || fallbackAvatar} alt="Group" className="w-1/2 h-1/2 object-cover border-[0.5px] border-white" />
            ))}
          </div>
        )}
      </div>
      {isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
      )}
    </div>
  );
};

// --- Component: Chat Item ---
const ChatItem: React.FC<{ 
  conv: Conversation; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ conv, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative mx-3 my-1.5 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-white shadow-md shadow-blue-500/5 ring-1 ring-slate-200' 
          : 'hover:bg-white/60 hover:shadow-sm'
      }`}
    >
      {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-full"></div>}
      <div className="flex items-center gap-4">
        <AvatarGroup avatar={conv.avatar} name={conv.name} size="md" isOnline={!conv.isGroup && !isNaN(parseInt(conv.id)) && parseInt(conv.id) % 2 === 0} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className={`text-sm font-bold truncate ${isActive ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>
              {conv.name}
            </h4>
            <span className="text-[10px] font-medium text-slate-400">{conv.lastMessageTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className={`text-xs truncate ${isActive ? 'text-slate-600 font-medium' : 'text-slate-400'} pr-2`}>
              {conv.lastMessage}
            </p>
            {conv.unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-lg shadow-lg shadow-blue-600/20">
                {conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Chat Page ---
const ChatPage: React.FC = () => {
  const { user } = useAuth()
  
  // States
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [searchKeyword, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const messageEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations && Array.isArray(conversations) 
    ? conversations.find(c => c && c.id && c.id.toString() === selectedConvId) 
    : null

  // Helper to format time
  const formatTime = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return ''
    }
  }

  // 1. Fetch Conversations on mount & auto-refresh
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('https://localhost:7259/api/chat/conversations', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          const apiRawData = result.data || result || []
          
          // Map API fields to UI fields
          const mappedData: Conversation[] = apiRawData.map((item: any) => ({
            id: item.otherUserId.toString(),
            name: item.otherUserName,
            avatar: item.otherUserAvatar,
            lastMessage: item.lastMessage,
            lastMessageTime: formatTime(item.lastMessageAt),
            unreadCount: item.unreadCount,
            isGroup: false // Assuming false for this API structure
          }))
          
          setConversations(prev => {
            const currentPrev = Array.isArray(prev) ? prev : []
            // Merge logic: Keep temporary conversations (from search) until they exist in the API
            const tempConvs = currentPrev.filter(c => c && c.lastMessage === 'Bắt đầu cuộc trò chuyện mới')
            const merged = [...mappedData]
            
            tempConvs.forEach(temp => {
              if (temp && temp.id && !merged.find(c => c && c.id && c.id.toString() === temp.id.toString())) {
                merged.unshift(temp)
              }
            })
            
            // Set first conversation if none is selected
            if (!selectedConvId && merged.length > 0 && merged[0] && merged[0].id) {
              setSelectedConvId(merged[0].id.toString())
            }
            
            return merged
          })
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoadingConvs(false)
      }
    }

    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [selectedConvId])

  // 2. Fetch Messages when a conversation is selected & auto-refresh
  useEffect(() => {
    if (!selectedConvId) return

    const fetchMessages = async (isInitial = false) => {
      if (isInitial) setLoadingMessages(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`https://localhost:7259/api/chat/conversation/${selectedConvId}`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          const rawMessages = result.data || result || []
          
          // Map API fields to UI fields
          const mappedMessages: Message[] = rawMessages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId.toString(),
            content: msg.content,
            timestamp: formatTime(msg.createdAt)
          }))
          
          setMessages(mappedMessages)
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        setMessages([])
      } finally {
        if (isInitial) setLoadingMessages(false)
      }
    }

    fetchMessages(true)
    const interval = setInterval(() => fetchMessages(false), 3000) // Auto refresh messages
    return () => clearInterval(interval)
  }, [selectedConvId])

  // Auto scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 3. Send Message API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !selectedConvId) return

    const textToSend = inputValue.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setInputValue('') // Clear input immediately for better UX

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://localhost:7259/api/chat/send', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: parseInt(selectedConvId),
          content: textToSend
        })
      })

      if (response.ok) {
        // Refresh messages manually
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: 'user',
          content: textToSend,
          timestamp: now
        }
        setMessages(prev => [...prev, newMessage])
        
        // Update Sidebar (lastMessage)
        setConversations(prev => prev.map(conv => {
          if (conv.id === selectedConvId) {
            return {
              ...conv,
              lastMessage: textToSend,
              lastMessageTime: now
            }
          }
          return conv
        }))
      } else {
        console.error('Failed to send message')
        setInputValue(textToSend)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setInputValue(textToSend)
    }
  }

  // 4. Search Users API
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchKeyword.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`https://localhost:7259/api/chat/search-users?keyword=${searchKeyword}`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          setSearchResults(result.data || [])
        }
      } catch (error) {
        console.error('Search API error:', error)
        setSearchResults([])
      } finally {
        // We keep isSearching true if there's text to show the results panel
      }
    }

    const timer = setTimeout(searchUsers, 500) // Debounce search
    return () => clearTimeout(timer)
  }, [searchKeyword])

  const handleSelectSearchResult = (searchedUser: any) => {
    if (!searchedUser || !searchedUser.id) return
    
    // Check if conversation already exists
    const currentConvs = Array.isArray(conversations) ? conversations : []
    const existingConv = currentConvs.find(c => c && c.id && c.id.toString() === searchedUser.id.toString())
    
    if (existingConv) {
      setSelectedConvId(existingConv.id.toString())
    } else {
      // Create a temporary conversation object for the UI
      const newTempConv: Conversation = {
        id: searchedUser.id.toString(),
        name: searchedUser.fullName,
        avatar: searchedUser.avatarUrl,
        lastMessage: 'Bắt đầu cuộc trò chuyện mới',
        lastMessageTime: '',
        unreadCount: 0,
        isGroup: false
      }
      setConversations(prev => [newTempConv, ...(Array.isArray(prev) ? prev : [])])
      setSelectedConvId(newTempConv.id.toString())
    }
    
    // Clear search
    setSearchTerm('')
    setSearchResults([])
    setIsSearching(false)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MainHeader />

      <main className="bg-gradient-to-b from-[#eef6ff] to-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[calc(100vh-9rem)] min-h-[620px]">
            <div className="h-full flex">
              <aside className="w-full max-w-[360px] border-r border-slate-200 bg-slate-50/60 flex flex-col">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
                  <div className="relative group">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#1976d2]"></i>
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm border border-slate-200 focus:border-[#1976d2] focus:ring-2 focus:ring-[#e3f2fd] transition-all outline-none"
                      value={searchKeyword}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {isSearching && searchKeyword && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-30 max-h-80 overflow-y-auto">
                        <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">People</span>
                          <button onClick={() => { setSearchTerm(''); setIsSearching(false) }} className="text-slate-400 hover:text-slate-600">
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                        {searchResults.length > 0 ? (
                          searchResults.map(u => (
                            <div
                              key={u.id}
                              onClick={() => handleSelectSearchResult(u)}
                              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <AvatarGroup avatar={u.avatarUrl} name={u.fullName} size="sm" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{u.fullName}</p>
                                <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-slate-400">
                            <i className="fa-solid fa-user-slash text-2xl mb-2 opacity-20"></i>
                            <p className="text-xs font-medium">No users found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-1.5 py-3 custom-scrollbar">
                  {loadingConvs ? (
                    <div className="flex flex-col gap-4 p-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : conversations && conversations.length > 0 ? (
                    conversations.filter(c => c && c.id).map(conv => (
                      <ChatItem
                        key={conv.id}
                        conv={conv}
                        isActive={selectedConvId === conv.id.toString()}
                        onClick={() => setSelectedConvId(conv.id.toString())}
                      />
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-xs italic">
                      No conversations found.
                    </div>
                  )}
                </div>
              </aside>

              {activeConv ? (
                <section className="flex-1 flex flex-col bg-white min-w-0">
                  <div className="h-20 px-6 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                      <AvatarGroup avatar={activeConv.avatar} name={activeConv.name} size="md" isOnline={!activeConv.isGroup && !isNaN(parseInt(activeConv.id)) && parseInt(activeConv.id) % 2 === 0} />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">{activeConv.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          {!activeConv.isGroup ? (
                            <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active now</>
                          ) : (
                            <><i className="fa-solid fa-users text-[10px]"></i> {activeConv.memberCount} Members</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#1976d2] transition-all flex items-center justify-center border border-slate-200"><i className="fa-solid fa-phone"></i></button>
                      <button className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#1976d2] transition-all flex items-center justify-center border border-slate-200"><i className="fa-solid fa-video"></i></button>
                      <button className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#1976d2] transition-all flex items-center justify-center border border-slate-200"><i className="fa-solid fa-circle-info"></i></button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 bg-slate-50/40 custom-scrollbar">
                    {loadingMessages ? (
                      <div className="flex-1 flex flex-col gap-5">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} animate-pulse`}>
                            <div className="w-1/2 h-12 bg-slate-100 rounded-2xl"></div>
                          </div>
                        ))}
                      </div>
                    ) : messages && messages.length > 0 ? (
                      messages.filter(m => m && m.id).map((msg) => {
                        const isMe = msg.senderId?.toString() === 'user' || msg.senderId?.toString() === user?.id?.toString()
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]`}>
                              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-[#1976d2] text-white rounded-br-md'
                                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                              }`}>
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1.5 px-1">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl mb-4">
                          <i className="fa-solid fa-comments"></i>
                        </div>
                        <p className="font-semibold text-slate-600">Start a conversation</p>
                        <p className="text-sm">Type a message to begin chatting.</p>
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-white rounded-xl border border-slate-200 focus-within:border-[#1976d2] focus-within:ring-2 focus-within:ring-[#e3f2fd] transition-all">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write your message..."
                        className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`m-1.5 h-9 px-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                          inputValue.trim()
                            ? 'bg-[#1976d2] text-white hover:bg-[#1565c0]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                        Send
                      </button>
                    </form>
                  </div>
                </section>
              ) : (
                <section className="flex-1 flex flex-col items-center justify-center bg-white">
                  <div className="w-20 h-20 rounded-2xl bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center text-4xl mb-4">
                    <i className="fa-solid fa-paper-plane"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">No conversation selected</h3>
                  <p className="max-w-xs text-center text-slate-500 text-sm">Choose a user from the left panel to start chatting.</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
