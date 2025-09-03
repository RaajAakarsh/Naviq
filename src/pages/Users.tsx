import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  Users as UsersIcon,
  UserPlus,
  MessageCircle,
  Phone,
  Clock,
  Calendar,
  Globe,
  Lock
} from 'lucide-react';
import { MOCK_USERS_PUBLIC } from '@/data/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Users() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  // Filter out private users and current user
  const publicUsers = MOCK_USERS_PUBLIC.filter(user => 
    !user.isPrivate && user.id !== currentUser?.id
  );

  // Filter users based on search query
  const filteredUsers = publicUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (userId: string, userName: string) => {
    setPendingRequests(prev => new Set([...prev, userId]));
    toast({
      title: "Friend request sent",
      description: `Friend request sent to ${userName}.`,
    });
  };

  const handleMessage = (userId: string) => {
    // Navigate to direct message page
    navigate(`/direct-message/${userId}`);
  };

  const handleCall = (userId: string) => {
    // Navigate to direct call page
    navigate(`/direct-call/${userId}`);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Users Directory</h1>
            <p className="text-muted-foreground">
              Discover and connect with other users
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {filteredUsers.length} public users
            </span>
          </div>
        </div>

        {/* Search */}
        <Card className="glass-panel">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredUsers.map((user) => {
              const isFriend = currentUser?.friends?.includes(user.id);
              const hasPendingRequest = pendingRequests.has(user.id);
              const canAddFriend = currentUser && !isFriend && !hasPendingRequest;

              return (
                <Card key={user.id} className="glass-panel hover:scale-105 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-4">
                    {/* Header with horizontal layout */}
                    <div className="relative flex items-center gap-4 mb-4">
                      {/* Avatar */}
                      <Link to={`/profile/${user.id}`} className="relative flex-shrink-0">
                        <Avatar className="h-16 w-16 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
                          <AvatarImage src={user.avatarUrl} className="object-cover" />
                          <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online Indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center ${
                          user.isOnline ? 'bg-secondary' : 'bg-muted-foreground'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-card" />
                        </div>
                      </Link>

                      {/* User Info - Horizontal */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <Link 
                            to={`/profile/${user.id}`}
                            className="hover:text-primary transition-colors flex-1 min-w-0"
                          >
                            <h3 className="text-lg font-bold truncate">{user.name}</h3>
                          </Link>
                          
                          {/* Privacy Badge */}
                          <Badge variant={user.isPrivate ? "secondary" : "outline"} className="text-xs px-2 py-1 flex-shrink-0 ml-2">
                            {user.isPrivate ? (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </>
                            ) : (
                              <>
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${user.isOnline ? 'text-secondary' : 'text-muted-foreground'}`}>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                          {isFriend && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <Badge variant="outline" className="text-xs">
                                Friend
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Joined</span>
                        </div>
                        <span className="text-sm font-medium">
                          {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Recently'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Active</span>
                        </div>
                        <span className="text-sm font-medium">
                          {user.isOnline ? 'Now' : user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Recently'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="grid gap-2" style={{ gridTemplateColumns: '65% 35%' }}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessage(user.id)}
                          className="glass-button hover:bg-primary/10 flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Message</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCall(user.id)}
                          className="glass-button hover:bg-primary/10 flex items-center justify-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">Call</span>
                        </Button>
                      </div>
                      
                      {canAddFriend && (
                        <Button
                          size="sm"
                          onClick={() => handleAddFriend(user.id, user.name)}
                          className="w-full neon-button flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Add Friend</span>
                        </Button>
                      )}
                      
                      {hasPendingRequest && (
                        <Button
                          size="sm"
                          disabled
                          className="w-full flex items-center justify-center gap-1.5 bg-muted text-muted-foreground cursor-not-allowed"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Requested</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="glass-panel">
            <CardContent className="p-12 text-center">
              <UsersIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "No public users are available at the moment"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}