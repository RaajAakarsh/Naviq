/**
 * Mock Data for Demo Mode
 * Provides sample data to showcase the UI without a backend
 */

import { User, UserPublic, Room, RoomPublic, Message, Activity, FriendRequest, Meeting } from '@/lib/socket-contract';

// ==================== MOCK USERS ====================

export const MOCK_USERS: User[] = [
  {
    id: 'demo',
    name: 'Demo User',
    email: 'demo@example.com',
    isPrivate: false,
    savedRooms: [],
    friends: ['uid_alice123', 'uid_bob456'],
    createdAt: '2024-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'uid_alice123',
    name: 'Alice Chen',
    email: 'alice@example.com', 
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5a4?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_1', 'room_3'],
    friends: ['uid_bob456', 'uid_charlie789'],
    createdAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-20T15:45:00Z',
  },
  {
    id: 'uid_bob456',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_1', 'room_2'],
    friends: ['uid_alice123', 'uid_david012'],
    createdAt: '2024-01-10T08:20:00Z',
    lastActive: '2024-01-20T16:10:00Z',
  },
  {
    id: 'uid_charlie789',
    name: 'Charlie Johnson',
    email: 'charlie@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isPrivate: true,
    savedRooms: ['room_3'],
    friends: ['uid_alice123'],
    createdAt: '2024-01-12T14:15:00Z',
    lastActive: '2024-01-20T14:30:00Z',
  },
  {
    id: 'temp_guest001',
    name: 'Guest User',
    isPrivate: false,
    savedRooms: [],
    friends: [],
    createdAt: '2024-01-20T16:00:00Z',
    lastActive: '2024-01-20T16:15:00Z',
  },
  {
    id: 'uid_david012',
    name: 'David Wilson',
    email: 'david@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_2'],
    friends: ['uid_bob456'],
    createdAt: '2024-01-18T09:45:00Z',
    lastActive: '2024-01-20T13:20:00Z',
  },
  {
    id: 'uid_emma345',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_1'],
    friends: ['uid_alice123', 'uid_frank678'],
    createdAt: '2024-01-05T12:00:00Z',
    lastActive: '2024-01-20T18:30:00Z',
  },
  {
    id: 'uid_frank678',
    name: 'Frank Miller',
    email: 'frank@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    isPrivate: true,
    savedRooms: [],
    friends: ['uid_emma345'],
    createdAt: '2024-01-08T14:20:00Z',
    lastActive: '2024-01-19T20:15:00Z',
  },
  {
    id: 'uid_grace901',
    name: 'Grace Kim',
    email: 'grace@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_2', 'room_3'],
    friends: ['uid_henry234', 'uid_alice123'],
    createdAt: '2024-01-03T16:45:00Z',
    lastActive: '2024-01-20T17:10:00Z',
  },
  {
    id: 'uid_henry234',
    name: 'Henry Thompson',
    email: 'henry@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    isPrivate: true,
    savedRooms: [],
    friends: ['uid_grace901'],
    createdAt: '2024-01-14T11:30:00Z',
    lastActive: '2024-01-18T22:45:00Z',
  },
  {
    id: 'uid_ivy567',
    name: 'Ivy Chen',
    email: 'ivy@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    isPrivate: false,
    savedRooms: ['room_1', 'room_2'],
    friends: ['uid_alice123', 'uid_bob456'],
    createdAt: '2024-01-07T09:15:00Z',
    lastActive: '2024-01-20T19:20:00Z',
  }
];

export const MOCK_USERS_PUBLIC: UserPublic[] = MOCK_USERS.map(user => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl,
  isPrivate: user.isPrivate,
  isOnline: Math.random() > 0.3, // Random online status
  createdAt: user.createdAt,
  lastActive: user.lastActive,
  friends: user.friends,
}));

// ==================== MOCK ROOMS ====================

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room_1',
    code: 'ABC123',
    name: 'Team Standup',
    privacy: 'private',
    createdBy: 'uid_alice123',
    createdAt: '2024-01-20T09:00:00Z',
    participants: ['uid_alice123', 'uid_bob456', 'uid_charlie789'],
    maxParticipants: 100,
    pinnedMessages: ['msg_5'],
    lastActivity: '2024-01-20T16:10:00Z',
  },
  {
    id: 'room_2', 
    code: 'XYZ789',
    name: 'Design Review',
    privacy: 'public',
    createdBy: 'uid_bob456',
    createdAt: '2024-01-20T11:30:00Z',
    participants: ['uid_bob456', 'uid_david012', 'temp_guest001'],
    maxParticipants: 100,
    lastActivity: '2024-01-20T15:45:00Z',
  },
  {
    id: 'room_3',
    code: 'DEF456',
    name: 'Random Chat',
    privacy: 'public',
    createdBy: 'uid_charlie789',
    createdAt: '2024-01-19T14:20:00Z',
    participants: ['uid_charlie789', 'uid_alice123'],
    maxParticipants: 100,
    lastActivity: '2024-01-20T12:30:00Z',
  },
];

export const MOCK_ROOMS_PUBLIC: RoomPublic[] = MOCK_ROOMS.map(room => ({
  id: room.id,
  code: room.code,
  name: room.name,
  privacy: room.privacy,
  participantCount: room.participants.length,
  lastActivity: room.lastActivity,
  preview: 'Hey, are we still meeting at 3?', // Sample last message
}));

// ==================== MOCK MESSAGES ====================

// Mock direct messages - More comprehensive data
export const MOCK_DIRECT_MESSAGES: Message[] = [
  {
    id: 'dm_1',
    roomId: 'dm_demo_uid_bob456',
    from: 'demo',
    text: 'Hey Bob! How are you doing?',
    createdAt: '2024-01-20T14:00:00Z',
    readBy: ['demo', 'uid_bob456'],
  },
  {
    id: 'dm_2',
    roomId: 'dm_demo_uid_bob456',
    from: 'uid_bob456',
    text: 'Hi! I am doing great, thanks for asking!',
    createdAt: '2024-01-20T14:05:00Z',
    readBy: ['demo', 'uid_bob456'],
  },
  {
    id: 'dm_3',
    roomId: 'dm_demo_uid_bob456',
    from: 'demo',
    text: 'Great! Want to hop on a quick call?',
    createdAt: '2024-01-20T14:10:00Z',
    readBy: ['demo'],
  },
  {
    id: 'dm_4',
    roomId: 'dm_demo_uid_alice123',
    from: 'demo',
    text: 'Alice, can we schedule a call later?',
    createdAt: '2024-01-20T13:30:00Z',
    readBy: ['demo'],
  },
  {
    id: 'dm_5',
    roomId: 'dm_demo_uid_alice123',
    from: 'uid_alice123',
    text: 'Sure! How about 3 PM?',
    createdAt: '2024-01-20T13:35:00Z',
    readBy: ['demo', 'uid_alice123'],
  },
  {
    id: 'dm_6',
    roomId: 'dm_demo_uid_charlie789',
    from: 'uid_charlie789',
    text: 'Hey there! Thanks for reaching out.',
    createdAt: '2024-01-20T12:00:00Z',
    readBy: ['uid_charlie789'],
  },
  {
    id: 'dm_7',
    roomId: 'dm_demo_uid_david012',
    from: 'demo',
    text: 'David, loved your recent work!',
    createdAt: '2024-01-20T11:30:00Z',
    readBy: ['demo'],
  },
  {
    id: 'dm_8',
    roomId: 'dm_demo_uid_david012',
    from: 'uid_david012',
    text: 'Thank you! Means a lot coming from you 😊',
    createdAt: '2024-01-20T11:45:00Z',
    readBy: ['demo', 'uid_david012'],
  },
  {
    id: 'dm_9',
    roomId: 'dm_demo_uid_bob456',
    from: 'uid_bob456',
    file: {
      id: 'file_dm_1',
      name: 'project-screenshot.png',
      size: 892000,
      mime: 'image/png',
      storagePath: 'images/project-screenshot.png',
      downloadUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=150',
    },
    text: 'Check out this screenshot of our project!',
    createdAt: '2024-01-20T14:15:00Z',
    readBy: ['uid_bob456'],
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    roomId: 'room_1',
    from: 'uid_alice123',
    text: 'Good morning team! Ready for our standup?',
    createdAt: '2024-01-20T15:00:00Z',
    readBy: ['uid_alice123', 'uid_bob456'],
  },
  {
    id: 'msg_2',
    roomId: 'room_1',
    from: 'uid_bob456',
    text: 'Morning Alice! Yes, just finishing up the designs.',
    createdAt: '2024-01-20T15:05:00Z',
    readBy: ['uid_alice123', 'uid_bob456'],
  },
  {
    id: 'msg_3',
    roomId: 'room_1',
    from: 'uid_charlie789',
    text: "I'll be 5 minutes late, just wrapping up a call.",
    createdAt: '2024-01-20T15:10:00Z',
    readBy: ['uid_alice123', 'uid_bob456', 'uid_charlie789'],
  },
  {
    id: 'msg_4',
    roomId: 'room_1',
    from: 'uid_alice123',
    file: {
      id: 'file_1',
      name: 'sprint-goals.pdf',
      size: 245760,
      mime: 'application/pdf',
      storagePath: 'files/sprint-goals.pdf',
      downloadUrl: 'https://example.com/files/sprint-goals.pdf',
    },
    text: 'Here are our sprint goals for this week',
    createdAt: '2024-01-20T15:15:00Z',
    readBy: ['uid_alice123'],
  },
  {
    id: 'msg_5',
    roomId: 'room_1',
    from: 'uid_bob456',
    text: 'Perfect! This covers everything we discussed. 📌',
    isPinned: true,
    createdAt: '2024-01-20T15:20:00Z',
    readBy: ['uid_alice123', 'uid_bob456'],
  },
  {
    id: 'msg_6',
    roomId: 'room_2',
    from: 'uid_bob456',
    text: 'Welcome to the design review room!',
    createdAt: '2024-01-20T15:30:00Z',
    readBy: ['uid_bob456', 'uid_david012'],
  },
  {
    id: 'msg_7',
    roomId: 'room_2',
    from: 'temp_guest001',
    text: 'Thanks for letting me join as a guest!',
    createdAt: '2024-01-20T15:35:00Z',
    readBy: ['uid_bob456', 'temp_guest001'],
  },
  {
    id: 'msg_8',
    roomId: 'room_2',
    from: 'uid_david012',
    file: {
      id: 'file_2',
      name: 'mockup-v2.png',
      size: 1024000,
      mime: 'image/png',
      storagePath: 'images/mockup-v2.png',
      downloadUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150',
    },
    text: 'Here\'s the updated mockup with your feedback',
    createdAt: '2024-01-20T15:45:00Z',
    readBy: ['uid_david012'],
  },
  ...MOCK_DIRECT_MESSAGES
];

// ==================== MOCK ACTIVITIES ====================

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'activity_1',
    userId: 'uid_alice123',
    type: 'joined_room',
    targetRoom: 'room_1',
    participants: ['uid_alice123', 'uid_bob456'],
    timestamp: '2024-01-20T15:00:00Z',
  },
  {
    id: 'activity_2',
    userId: 'uid_alice123',
    type: 'message_sent',
    targetRoom: 'room_1',
    timestamp: '2024-01-20T15:00:00Z',
  },
  {
    id: 'activity_3',
    userId: 'uid_bob456',
    type: 'call_started',
    targetUser: 'uid_david012',
    timestamp: '2024-01-20T14:30:00Z',
  },
  {
    id: 'activity_4',
    userId: 'uid_alice123',
    type: 'saved_room',
    targetRoom: 'room_1',
    timestamp: '2024-01-20T15:20:00Z',
  },
  {
    id: 'activity_5',
    userId: 'uid_alice123',
    type: 'friend_added',
    targetUser: 'uid_charlie789',
    timestamp: '2024-01-19T10:15:00Z',
  },
];

// Mock friend requests
const friendRequests: FriendRequest[] = [
  {
    id: 'req_001',
    from: 'uid_bob456',
    to: 'uid_alice123',
    status: 'pending',
    message: 'Hi! Would love to connect and collaborate on some projects.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'req_002',
    from: 'uid_david012',
    to: 'uid_alice123',
    status: 'accepted',
    message: 'Hey! Saw your work on the design project. Let\'s stay connected!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  }
];

// Mock meetings history
const meetings: Meeting[] = [
  {
    id: 'meeting_001',
    roomId: 'room_1',
    participants: ['uid_alice123', 'uid_bob456', 'uid_charlie789'],
    type: 'group_call',
    startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    duration: 62
  },
  {
    id: 'meeting_002',
    participants: ['uid_alice123', 'uid_david012'],
    type: 'one_on_one',
    startedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 71.5 * 60 * 60 * 1000).toISOString(),
    duration: 28
  },
  {
    id: 'meeting_003',
    roomId: 'room_2',
    participants: ['uid_alice123', 'uid_bob456', 'uid_david012'],
    type: 'room_chat',
    startedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 118 * 60 * 60 * 1000).toISOString(),
    duration: 95
  }
];

// Helper functions
export const getFriendRequestsForUser = (userId: string): FriendRequest[] => {
  return friendRequests.filter(req => req.to === userId || req.from === userId);
};

export const getPendingFriendRequests = (userId: string): FriendRequest[] => {
  return friendRequests.filter(req => req.to === userId && req.status === 'pending');
};

export const getMeetingsByUserId = (userId: string): Meeting[] => {
  return meetings.filter(meeting => meeting.participants.includes(userId));
};

export const sendFriendRequest = (from: string, to: string, message?: string): FriendRequest => {
  const newRequest: FriendRequest = {
    id: `req_${Date.now()}`,
    from,
    to,
    status: 'pending',
    message,
    createdAt: new Date().toISOString()
  };
  friendRequests.push(newRequest);
  return newRequest;
};

// Export all data and functions
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find(user => user.id === id);
}

export function getUserPublicById(id: string): UserPublic | undefined {
  return MOCK_USERS_PUBLIC.find(user => user.id === id);
}

export function getRoomById(id: string): Room | undefined {
  return MOCK_ROOMS.find(room => room.id === id);
}

export function getRoomByCode(code: string): Room | undefined {
  return MOCK_ROOMS.find(room => room.code === code);
}

export function getMessagesByRoomId(roomId: string): Message[] {
  return MOCK_MESSAGES.filter(message => message.roomId === roomId);
}

export function getDirectMessages(userId1: string, userId2: string): Message[] {
  const roomId1 = `dm_${userId1}_${userId2}`;
  const roomId2 = `dm_${userId2}_${userId1}`;
  return MOCK_MESSAGES.filter(message => 
    message.roomId === roomId1 || message.roomId === roomId2
  );
}

export function getActivitiesByUserId(userId: string): Activity[] {
  return MOCK_ACTIVITIES.filter(activity => 
    activity.userId === userId || activity.targetUser === userId
  );
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTempUserId(): string {
  return `temp_${Math.random().toString(36).substr(2, 9)}`;
}

export function isGuestUser(userId: string): boolean {
  return userId.startsWith('temp_');
}

export function isRoomAdmin(userId: string, room: Room): boolean {
  return room.createdBy === userId;
}

export function getRoomsWhereUserIsAdmin(userId: string): Room[] {
  return MOCK_ROOMS.filter(room => room.createdBy === userId);
}

export function getUserParticipatedRooms(userId: string): Room[] {
  return MOCK_ROOMS.filter(room => room.participants.includes(userId));
}

export function getUserDisplayName(user: UserPublic): string {
  if (isGuestUser(user.id)) {
    return `${user.name} (Guest)`;
  }
  return user.name;
}

export {
  MOCK_USERS as users,
  MOCK_USERS_PUBLIC as usersPublic,
  MOCK_ROOMS as rooms,
  MOCK_ROOMS_PUBLIC as roomsPublic,
  MOCK_MESSAGES as messages,
  MOCK_ACTIVITIES as activities,
  friendRequests,
  meetings
};