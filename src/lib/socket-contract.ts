/**
 * WebSocket & WebRTC Event Contract
 * Authoritative TypeScript types for all socket events and data structures
 */

export type ID = string;

// ==================== USER TYPES ====================
export interface User {
  id: ID; // "temp_xxx" for guests, "uid_xxx" for logged-in users
  name: string;
  avatarUrl?: string;
  email?: string;
  isPrivate?: boolean;
  savedRooms?: string[]; // roomIds
  friends?: ID[];
  createdAt: string;
  lastActive: string;
}

export interface UserPublic {
  id: ID;
  name: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  isOnline?: boolean;
  createdAt: string;
  lastActive: string;
  friends?: ID[];
}

export interface UserProfile extends User {
  activityLog: Activity[];
  friendRequests: FriendRequest[];
}

// ==================== ROOM TYPES ====================
export interface Room {
  id: ID;
  code: string; // 6-8 alphanumeric
  name?: string;
  privacy: 'public' | 'private';
  createdBy: ID;
  createdAt: string;
  participants: ID[];
  maxParticipants: number; // Max 100 people per room
  pinnedMessages?: ID[];
  lastActivity: string;
}

export interface RoomPublic {
  id: ID;
  code: string;
  name?: string;
  privacy: 'public' | 'private';
  participantCount: number;
  lastActivity: string;
  preview?: string; // last message preview
}

// ==================== MESSAGE TYPES ====================
export interface Message {
  id: ID;
  roomId: ID;
  from: ID;
  text?: string;
  file?: FileMeta;
  replyTo?: ID;
  isPinned?: boolean;
  createdAt: string;
  editedAt?: string;
  readBy?: ID[]; // user IDs who read this message
}

export interface FileMeta {
  id: ID;
  name: string;
  size: number;
  mime: string;
  storagePath: string; // Firebase Storage path
  downloadUrl?: string; // Signed URL
  thumbnailUrl?: string; // For images/videos
  uploadProgress?: number; // 0-100 during upload
}

// ==================== ACTIVITY & ANALYTICS ====================
export interface Activity {
  id: ID;
  userId: ID;
  type: 'joined_room' | 'left_room' | 'saved_room' | 'call_started' | 'call_ended' | 'message_sent' | 'friend_added';
  targetRoom?: ID;
  targetUser?: ID;
  participants?: ID[];
  timestamp: string;
}

export interface FriendRequest {
  id: ID;
  from: ID;
  to: ID;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface Meeting {
  id: ID;
  roomId?: ID;
  participants: ID[];
  type: 'group_call' | 'one_on_one' | 'room_chat';
  startedAt: string;
  endedAt?: string;
  duration?: number; // in minutes
}

// ==================== ROOM LIMITS ====================

export const ROOM_LIMITS = {
  MAX_PARTICIPANTS: 100,
  MAX_ROOM_NAME_LENGTH: 50,
  MAX_MESSAGE_LENGTH: 2000,
} as const;

// ==================== WEBSOCKET EVENTS ====================

// Room Events
export interface CreateRoomPayload {
  roomName?: string;
  privacy: 'public' | 'private';
  user: UserPublic;
}

export interface CreateRoomResponse {
  success: boolean;
  roomCode?: string;
  roomId?: string;
  error?: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  user: UserPublic;
}

export interface JoinRoomResponse {
  success: boolean;
  room?: RoomPublic;
  participants?: UserPublic[];
  error?: string;
}

export interface LeaveRoomPayload {
  roomId: ID;
  userId: ID;
}

// Message Events
export interface MessagePayload {
  roomId: ID;
  text?: string;
  file?: FileMeta;
  replyTo?: ID;
  tempId?: string; // For optimistic UI
}

export interface TypingPayload {
  roomId: ID;
  userId: ID;
  typing: boolean;
}

export interface ReadReceiptPayload {
  roomId: ID;
  messageIds: ID[];
  userId: ID;
}

// Presence Events
export interface PresencePayload {
  roomId: ID;
  users: UserPublic[];
  action: 'joined' | 'left' | 'updated';
}

// Room Management
export interface SaveRoomPayload {
  roomId: ID;
  save: boolean; // true to save, false to unsave
}

// ==================== WEBRTC SIGNALING EVENTS ====================

export interface CallOfferPayload {
  from: ID;
  to: ID;
  roomId?: ID;
  sdp: RTCSessionDescriptionInit;
}

export interface CallAnswerPayload {
  from: ID;
  to: ID;
  roomId?: ID;
  sdp: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  from: ID;
  to: ID;
  roomId?: ID;
  candidate: RTCIceCandidateInit;
}

export interface CallRequestPayload {
  from: ID;
  to: ID;
  roomId?: ID;
  callType: 'video' | 'audio';
}

export interface CallResponsePayload {
  from: ID;
  to: ID;
  roomId?: ID;
  accepted: boolean;
}

export interface CallEndPayload {
  from: ID;
  to: ID;
  roomId?: ID;
  reason?: 'user_ended' | 'connection_lost' | 'error';
}

// ==================== SOCKET EVENT NAMES ====================

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Room Management
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SAVE_ROOM: 'saveRoom',
  
  // Messaging
  MESSAGE: 'message',
  MESSAGE_RECEIVED: 'messageReceived',
  TYPING: 'typing',
  READ_RECEIPT: 'readReceipt',
  
  // Presence
  PRESENCE: 'presence',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  
  // WebRTC Signaling
  CALL_OFFER: 'callOffer',
  CALL_ANSWER: 'callAnswer',
  ICE_CANDIDATE: 'iceCandidate',
  CALL_REQUEST: 'callRequest',
  CALL_RESPONSE: 'callResponse',
  CALL_END: 'callEnd',
  
  // Room events
  USER_REMOVED: 'userRemoved',

  // Friend requests
  SEND_FRIEND_REQUEST: 'sendFriendRequest',
  RESPOND_FRIEND_REQUEST: 'respondFriendRequest',
  FRIEND_REQUEST_RECEIVED: 'friendRequestReceived',
  FRIEND_REQUEST_UPDATED: 'friendRequestUpdated',
  
  // Errors
  ERROR: 'error',
} as const;

// ==================== CONNECTION STATES ====================

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export type CallState = 'idle' | 'calling' | 'receiving' | 'connected' | 'ended';

// ==================== WEBRTC CONFIG ====================

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
}

export const DEFAULT_WEBRTC_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // TURN servers should be added for production:
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'password'
    // }
  ],
  iceCandidatePoolSize: 10,
};

// ==================== MEDIA CONSTRAINTS ====================

export const DEFAULT_MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
    facingMode: 'user', // Front camera by default
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};