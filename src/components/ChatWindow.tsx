import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { Room, Message } from '@/lib/socket-contract';

interface ChatWindowProps {
  room: Room;
  messages: Message[];
  onSendMessage: (message: { text?: string; file?: File }) => void;
}

export function ChatWindow({ room, messages, onSendMessage }: ChatWindowProps) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator (in real app, this would come from WebSocket)
  const handleTyping = (isTyping: boolean) => {
    if (isTyping) {
      // Simulate other users typing
      const otherUsers = ['Alice Chen', 'Bob Smith'].filter(name => 
        Math.random() > 0.7 // Random chance to show typing
      );
      setTypingUsers(otherUsers);
      
      // Clear typing after a delay
      setTimeout(() => setTypingUsers([]), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-2 md:px-4">
          <div className="py-2 md:py-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                <div className="text-center space-y-4 max-w-md px-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
                    <p className="text-muted-foreground text-sm">
                      This is the beginning of your conversation in {room.name || `Room ${room.code}`}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <MessageList messages={messages} />
            )}
            <TypingIndicator users={typingUsers} />
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input - Responsive padding */}
      <div className="border-t border-border bg-card/50 p-2 md:p-4">
        <MessageInput 
          onSendMessage={onSendMessage}
          onTyping={handleTyping}
          placeholder={`Message ${room.name || `Room ${room.code}`}...`}
        />
      </div>
    </div>
  );
}