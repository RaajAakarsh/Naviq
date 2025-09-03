import React from 'react';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, 
  Users, 
  Clock, 
  MessageSquare,
  Calendar,
  Settings,
  UserCheck,
  UserPlus,
  Phone
} from 'lucide-react';
import { 
  getRoomsWhereUserIsAdmin, 
  getUserParticipatedRooms,
  getActivitiesByUserId,
  isGuestUser,
  getFriendRequestsForUser,
  getPendingFriendRequests,
  getMeetingsByUserId,
  friendRequests,
  getUserPublicById
} from '@/data/mock-data';
import { FriendRequestCard } from '@/components/FriendRequestCard';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-muted-foreground">Please sign in to view your profile</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const adminRooms = getRoomsWhereUserIsAdmin(user.id);
  const participatedRooms = getUserParticipatedRooms(user.id);
  const activities = getActivitiesByUserId(user.id);
  const meetings = getMeetingsByUserId(user.id);
  const friendRequestsForUser = getFriendRequestsForUser(user.id);
  const pendingRequests = getPendingFriendRequests(user.id);
  const isGuest = isGuestUser(user.id);

  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'accepted';
      request.respondedAt = new Date().toISOString();
      
      // Add to friends list (mock implementation)
      if (user.friends) {
        user.friends.push(request.from);
      } else {
        user.friends = [request.from];
      }
    }
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'declined';
      request.respondedAt = new Date().toISOString();
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>{user.email}</span>
                  {isGuest && <Badge variant="secondary">Guest</Badge>}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Last active {formatDistanceToNow(new Date(user.lastActive))} ago</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <MessageSquare className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{activities.filter(a => a.type === 'message_sent').length}</p>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-toxicMint" />
                <div>
                  <p className="text-2xl font-bold">{user.friends?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Friends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Friend Requests Alert */}
        {pendingRequests.length > 0 && (
          <Card className="glass-card border-accent/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Friend Requests</CardTitle>
                <Badge variant="secondary">{pendingRequests.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptFriendRequest}
                  onDecline={handleDeclineFriendRequest}
                  showActions={true}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="rooms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="admin">Admin Rooms</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Participated Rooms</CardTitle>
                <CardDescription>All rooms you've joined or participated in</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {participatedRooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{room.name || `Room ${room.code}`}</span>
                            <Badge variant="outline">{room.code}</Badge>
                            {room.privacy === 'private' && <Badge variant="secondary">Private</Badge>}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{room.participants.length} participants</span>
                            <span>Last active {formatDistanceToNow(new Date(room.lastActivity))} ago</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Join</Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-accent" />
                  <span>Admin Rooms</span>
                </CardTitle>
                <CardDescription>Rooms you created and manage</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {adminRooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-accent" />
                            <span className="font-medium">{room.name || `Room ${room.code}`}</span>
                            <Badge variant="outline">{room.code}</Badge>
                            {room.privacy === 'private' && <Badge variant="secondary">Private</Badge>}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{room.participants.length}/{room.maxParticipants} participants</span>
                            <span>Created {formatDistanceToNow(new Date(room.createdAt))} ago</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Manage</Button>
                          <Button variant="outline" size="sm">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Meeting History</CardTitle>
                <CardDescription>Your past video calls and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium capitalize">{meeting.type.replace('_', ' ')}</span>
                            <Badge variant="outline">{meeting.participants.length} participants</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(meeting.startedAt))} ago • {meeting.duration} minutes
                          </div>
                        </div>
                      </div>
                    ))}
                    {meetings.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No meetings yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Friends & Requests</CardTitle>
                <CardDescription>Manage your friends and friend requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Friend Requests */}
                  {friendRequestsForUser.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Recent Requests</h4>
                      <div className="space-y-3">
                        {friendRequestsForUser.slice(0, 5).map((request) => (
                          <FriendRequestCard
                            key={request.id}
                            request={request}
                            onAccept={request.status === 'pending' && request.to === user.id ? handleAcceptFriendRequest : undefined}
                            onDecline={request.status === 'pending' && request.to === user.id ? handleDeclineFriendRequest : undefined}
                            showActions={request.status === 'pending' && request.to === user.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Friends List */}
                  {user.friends && user.friends.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Friends ({user.friends.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.friends.map((friendId) => {
                          const friend = getUserPublicById(friendId);
                          if (!friend) return null;
                          
                          return (
                            <div key={friendId} className="flex items-center space-x-3 p-3 rounded-lg bg-card/30">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatarUrl} />
                                <AvatarFallback>
                                  {friend.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{friend.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {friend.isOnline ? 'Online' : 'Offline'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(!user.friends || user.friends.length === 0) && friendRequestsForUser.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No friends or requests yet</p>
                      <p className="text-sm">Start connecting with people in chat rooms!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-card/30">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {activity.type === 'joined_room' && 'Joined a room'}
                            {activity.type === 'left_room' && 'Left a room'}
                            {activity.type === 'saved_room' && 'Saved a room'}
                            {activity.type === 'call_started' && 'Started a call'}
                            {activity.type === 'call_ended' && 'Ended a call'}
                            {activity.type === 'message_sent' && 'Sent a message'}
                            {activity.type === 'friend_added' && 'Added a friend'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp))} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}