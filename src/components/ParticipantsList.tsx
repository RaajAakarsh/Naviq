import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  MessageCircle, 
  Crown, 
  UserPlus,
  Settings,
  UserMinus
} from 'lucide-react';
import { Room, UserPublic, User } from '@/lib/socket-contract';
import { isGuestUser, isRoomAdmin, sendFriendRequest } from '@/data/mock-data';
import { useToast } from '@/hooks/use-toast';

interface ParticipantsListProps {
  participants: UserPublic[];
  room: Room;
  currentUser: User | null;
}

export function ParticipantsList({ participants, room, currentUser }: ParticipantsListProps) {
  const { toast } = useToast();
  const isAdmin = currentUser ? isRoomAdmin(currentUser.id, room) : false;

  const handleStartCall = (participant: UserPublic) => {
    console.log('Starting call with', participant.name);
  };

  const handleMessage = (participant: UserPublic) => {
    console.log('Starting message with', participant.name);
  };

  const handleAddFriend = (participant: UserPublic) => {
    if (currentUser && isGuestUser(currentUser.id)) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send friend requests.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentUser) {
      sendFriendRequest(currentUser.id, participant.id, `Hi ${participant.name}! Let's connect.`);
      toast({
        title: "Friend request sent",
        description: `Friend request sent to ${participant.name}.`,
      });
    }
  };

  const handleRemoveUser = (participant: UserPublic) => {
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "Only room admins can remove participants.",
        variant: "destructive",
      });
      return;
    }

    if (participant.id === room.createdBy) {
      toast({
        title: "Cannot remove admin",
        description: "You cannot remove the room creator.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual user removal via WebSocket
    console.log('Removing user from room:', participant.name);
    toast({
      title: "User removed",
      description: `${participant.name} has been removed from the room.`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm md:text-base">
            Participants ({participants.length}/{room.maxParticipants})
          </h3>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <ScrollArea className="flex-1">
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          {participants.map((participant) => {
            const isCreator = participant.id === room.createdBy;
            const isCurrentUser = participant.id === currentUser?.id;
            
            return (
              <div
                key={participant.id}
                className="flex items-center space-x-3 p-2 md:p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors"
              >
                {/* Avatar with Status */}
                <div className="relative flex-shrink-0">
                  <Link 
                    to={isCurrentUser ? "/profile" : `/profile/${participant.id}`} 
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer">
                      <AvatarImage src={participant.avatarUrl} />
                      <AvatarFallback className="text-xs md:text-sm">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  {participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-xs md:text-sm truncate">
                      {participant.name}
                    </span>
                    {isCreator && (
                      <Crown className="w-3 h-3 text-accent flex-shrink-0" />
                    )}
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {participant.isOnline ? 'Online' : 'Offline'}
                    </span>
                    {isGuestUser(participant.id) && (
                      <Badge variant="secondary" className="text-xs">Guest</Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Responsive */}
                {!isCurrentUser && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartCall(participant)}
                      className="h-6 w-6 p-0"
                      title="Start call"
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMessage(participant)}
                      className="h-6 w-6 p-0"
                      title="Send message"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                    
                    {currentUser && !isGuestUser(currentUser.id) && !currentUser.friends?.includes(participant.id) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddFriend(participant)}
                        className="h-6 w-6 p-0"
                        title="Add friend"
                      >
                        <UserPlus className="w-3 h-3" />
                      </Button>
                    )}

                    {/* Admin Controls */}
                    {isAdmin && !isCreator && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveUser(participant)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        title="Remove from room"
                      >
                        <UserMinus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Room Actions */}
      <div className="p-3 md:p-4 border-t border-border space-y-2">
        <Button variant="outline" size="sm" className="w-full glass-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Others
        </Button>
        
        {currentUser && isGuestUser(currentUser.id) && (
          <div className="text-center text-xs text-muted-foreground">
            <p>Sign in to add friends and save rooms</p>
          </div>
        )}
      </div>
    </div>
  );
}