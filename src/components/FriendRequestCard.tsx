import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock } from 'lucide-react';
import { FriendRequest } from '@/lib/socket-contract';
import { getUserPublicById } from '@/data/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept?: (requestId: string) => void;
  onDecline?: (requestId: string) => void;
  showActions?: boolean;
}

export function FriendRequestCard({ 
  request, 
  onAccept, 
  onDecline, 
  showActions = false 
}: FriendRequestCardProps) {
  const sender = getUserPublicById(request.from);
  const recipient = getUserPublicById(request.to);
  
  if (!sender) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-secondary';
      case 'declined': return 'text-destructive';
      default: return 'text-accent';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'declined': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${sender.id}`} className="hover:opacity-80 transition-opacity">
            <Avatar className="h-12 w-12">
              <AvatarImage src={sender.avatarUrl} />
              <AvatarFallback>
                {sender.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link 
                to={`/profile/${sender.id}`} 
                className="font-medium hover:underline"
              >
                {sender.name}
              </Link>
              <div className={`flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="text-xs capitalize">{request.status}</span>
              </div>
            </div>
            
            {request.message && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {request.message}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(request.createdAt))} ago
              {request.respondedAt && request.status !== 'pending' && 
                ` • Responded ${formatDistanceToNow(new Date(request.respondedAt))} ago`
              }
            </p>
          </div>
          
          {showActions && request.status === 'pending' && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAccept?.(request.id)}
                className="h-8 px-3"
              >
                <Check className="w-3 h-3 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDecline?.(request.id)}
                className="h-8 px-3"
              >
                <X className="w-3 h-3 mr-1" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}