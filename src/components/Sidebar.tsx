import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Heart, 
  Users, 
  Clock, 
  Lock, 
  Globe,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_ROOMS_PUBLIC, MOCK_USERS_PUBLIC, getUserPublicById, isGuestUser } from '@/data/mock-data';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const savedRoomIds = user?.savedRooms || [];
  const savedRooms = MOCK_ROOMS_PUBLIC.filter(room => savedRoomIds.includes(room.id));
  const recentRooms = MOCK_ROOMS_PUBLIC.slice(0, 5);
  const onlineFriends = user?.friends
    ?.map(friendId => getUserPublicById(friendId))
    ?.filter(friend => friend?.isOnline) || [];

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {/* Saved Rooms Section (Logged-in users only) */}
        {user && !isGuestUser(user.id) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Saved Rooms
              </h3>
              <Heart className="w-4 h-4 text-accent" />
            </div>
            
            {savedRooms.length > 0 ? (
              <div className="space-y-2">
                {savedRooms.map(room => (
                  <Link
                    key={room.id}
                    to={`/room/${room.code}`}
                    className={`block p-3 rounded-lg transition-all duration-200 ${
                      location.pathname.includes(room.code)
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-card/50 hover:bg-card/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{room.name || `Room ${room.code}`}</span>
                      <div className="flex items-center space-x-1">
                        {room.privacy === 'private' ? (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <Globe className="w-3 h-3 text-muted-foreground" />
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {room.participantCount}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {room.preview}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic p-3 bg-card/30 rounded-lg">
                No saved rooms yet. Join rooms and save your favorites!
              </p>
            )}
          </div>
        )}

        {/* Recent Rooms */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Rooms
            </h3>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          
          <div className="space-y-2">
            {recentRooms.map(room => (
              <Link
                key={room.id}
                to={`/room/${room.code}`}
                className={`block p-3 rounded-lg transition-all duration-200 ${
                  location.pathname.includes(room.code)
                    ? 'bg-primary/20 border border-primary/30'
                    : 'bg-card/50 hover:bg-card/80 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{room.name || `Room ${room.code}`}</span>
                  <div className="flex items-center space-x-1">
                    {room.privacy === 'private' ? (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Globe className="w-3 h-3 text-muted-foreground" />
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {room.participantCount}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {room.preview}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Online Friends (Logged-in users only) */}
        {user && !isGuestUser(user.id) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Online Friends
              </h3>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            
            {onlineFriends.length > 0 ? (
              <div className="space-y-2">
                {onlineFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic p-3 bg-card/30 rounded-lg">
                No friends online. Add friends to see them here!
              </p>
            )}
          </div>
        )}

        {/* Guest Hint */}
        {user && isGuestUser(user.id) && (
          <div className="p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <Crown className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-accent-foreground mb-1">
                  You're chatting as a guest
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Save rooms and add friends by signing in.
                </p>
                <Link to="/auth">
                  <Button size="sm" className="neon-button">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}