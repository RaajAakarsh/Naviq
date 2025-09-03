import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pin, File, Image, Download } from 'lucide-react';
import { Message } from '@/lib/socket-contract';
import { getUserPublicById } from '@/data/mock-data';
import { useAuth } from '@/hooks/useAuth';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { user } = useAuth();
  const sender = getUserPublicById(message.from);
  const isOwn = message.from === user?.id;
  const isRead = message.readBy?.includes(user?.id || '');

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {!isOwn && (
        <Link to={`/profile/${sender?.id}`} className="hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8 mt-1 cursor-pointer">
            <AvatarImage src={sender?.avatarUrl} />
            <AvatarFallback className="text-xs">
              {sender?.name.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      {/* Message Content */}
      <div className={`flex-1 max-w-xs md:max-w-md ${isOwn ? 'text-right' : ''}`}>
        {/* Sender Name & Time */}
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-foreground">
              {sender?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {message.isPinned && (
              <Pin className="w-3 h-3 text-accent" />
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className={`message-bubble ${isOwn ? 'message-own' : 'message-other'}`}>
          {/* Text Content */}
          {message.text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          )}

          {/* File Attachment */}
          {message.file && (
            <div className="mt-2 border border-border/50 rounded-lg overflow-hidden">
              {/* Image Preview */}
              {message.file.mime.startsWith('image/') && message.file.thumbnailUrl && (
                <img
                  src={message.file.thumbnailUrl}
                  alt={message.file.name}
                  className="w-full max-w-sm h-auto rounded-t-lg"
                />
              )}
              
              {/* File Info */}
              <div className="p-3 bg-card/50 flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  {message.file.mime.startsWith('image/') ? (
                    <Image className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{message.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(message.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                {message.file.downloadUrl && (
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Download className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Own Message Time & Status */}
        {isOwn && (
          <div className="flex items-center justify-end space-x-2 mt-1">
            {message.editedAt && (
              <span className="text-xs text-muted-foreground">edited</span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {message.isPinned && (
              <Pin className="w-3 h-3 text-accent" />
            )}
            {isRead && (
              <Badge variant="secondary" className="text-xs px-1">
                Read
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}