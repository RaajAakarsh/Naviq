import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (message: { text?: string; file?: File }) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
}

export function MessageInput({ 
  onSendMessage, 
  onTyping, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      if (selectedFile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      onSendMessage({
        text: message.trim() || undefined,
        file: selectedFile || undefined,
      });
      
      setMessage('');
      setSelectedFile(null);
      onTyping?.(false);
      
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    onTyping?.(value.length > 0);
  };

  return (
    <div className="space-y-3">
      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {selectedFile.type.startsWith('image/') ? (
              <Image className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pr-24 bg-background/50 border-border focus:border-primary"
            disabled={isUploading}
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-6 w-6 p-0"
              disabled={isUploading}
            >
              <Paperclip className="w-3 h-3" />
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              disabled
            >
              <Smile className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          size="sm" 
          className="neon-button"
          disabled={(!message.trim() && !selectedFile) || isUploading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}