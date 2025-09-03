import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, 
  MessageCircle, 
  Phone, 
  Calendar,
  Clock,
  Users,
  Crown
} from 'lucide-react';
import { 
  getUserPublicById, 
  isGuestUser, 
  sendFriendRequest,
  getRoomsWhereUserIsAdmin,
  getUserParticipatedRooms 
} from '@/data/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  if (!userId) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Back Home</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const user = getUserPublicById(userId);
  
  if (!user) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Back Home</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const isGuest = isGuestUser(user.id);
  const isOwnProfile = currentUser?.id === user.id;
  const isFriend = currentUser?.friends?.includes(user.id);
  const canAddFriend = currentUser && !isGuestUser(currentUser.id) && !isOwnProfile && !isFriend;
  
  const adminRooms = getRoomsWhereUserIsAdmin(user.id);
  const participatedRooms = getUserParticipatedRooms(user.id);

  const handleAddFriend = () => {
    if (!currentUser) return;
    
    sendFriendRequest(currentUser.id, user.id, `Hi ${user.name}! Let's connect.`);
    toast({
      title: "Friend request sent",
      description: `Friend request sent to ${user.name}.`,
    });
  };

  const handleMessage = () => {
    if (!user) return;
    // Navigate to direct message page  
    window.location.href = `/direct-message/${user.id}`;
  };

  const handleCall = () => {
    if (!user) return;
    // Navigate to direct call page
    window.location.href = `/direct-call/${user.id}`;
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  {isGuest && <Badge variant="secondary">Guest</Badge>}
                  {isFriend && <Badge variant="outline" className="text-secondary">Friend</Badge>}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.createdAt ? formatDistanceToNow(new Date(user.createdAt)) : 'recently'} ago</span>
                  </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{user.isOnline ? 'Online' : `Last active ${user.lastActive ? formatDistanceToNow(new Date(user.lastActive)) : 'recently'} ago`}</span>
                          <Badge variant={user.isPrivate ? "secondary" : "default"}>
                            {user.isPrivate ? "Private" : "Public"}
                          </Badge>
                        </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex space-x-3 pt-2">
                    {canAddFriend && (
                      <Button onClick={handleAddFriend} size="sm" className="neon-button">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Friend
                      </Button>
                    )}
                    
                    {/* Only show messaging/calling for public users or friends */}
                    {(!user.isPrivate || isFriend) && (
                      <>
                        <Button onClick={handleMessage} size="sm" variant="outline" className="glass-button">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        
                        <Button onClick={handleCall} size="sm" variant="outline" className="glass-button">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {isOwnProfile && (
                  <div className="pt-2">
                    <Link to="/profile">
                      <Button size="sm" variant="outline">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats - Only show for public users or friends */}
        {(!user.isPrivate || isFriend || isOwnProfile) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{adminRooms.length}</p>
                    <p className="text-sm text-muted-foreground">Rooms Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{participatedRooms.length}</p>
                    <p className="text-sm text-muted-foreground">Rooms Joined</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-toxicMint" />
                  <div>
                    <p className="text-2xl font-bold">{user.friends?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Friends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Public Rooms - Only show for public users or friends */}
        {(!user.isPrivate || isFriend || isOwnProfile) && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Public Activity</CardTitle>
              <CardDescription>Recent rooms and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participatedRooms.slice(0, 5).map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{room.name || `Room ${room.code}`}</span>
                        <Badge variant="outline">{room.code}</Badge>
                        {room.privacy === 'private' && <Badge variant="secondary">Private</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {room.participants.length} participants • Last active {room.lastActivity ? formatDistanceToNow(new Date(room.lastActivity)) : 'recently'} ago
                      </div>
                    </div>
                    <Link to={`/room/${room.code}`}>
                      <Button variant="outline" size="sm">View Room</Button>
                    </Link>
                  </div>
                ))}
                
                {participatedRooms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No public activity to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Private Account Message - Show when user is private and not a friend */}
        {user.isPrivate && !isFriend && !isOwnProfile && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">This profile is private</h3>
                <p className="text-sm mb-4">
                  {user.name} has chosen to keep their activity and room history private.
                  Send a friend request to see more details.
                </p>
                {canAddFriend && (
                  <Button onClick={handleAddFriend} size="sm" className="neon-button">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Friend Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}