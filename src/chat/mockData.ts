export interface Message {
  id: string;
  senderId: string;
  content: string; // Use content instead of text to match API
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string | string[]; // Single string for individual, array for group
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  memberCount?: number;
}
