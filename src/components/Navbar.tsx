import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Plus, Video, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isGuestUser } from '@/data/mock-data';

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Logo & Brand */}
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">NAVIQ</span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users or rooms..."
            className="pl-10 bg-input/50 border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/create-room')}
          className="glass-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Room
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/call')}
          className="glass-button"
        >
          <Video className="w-4 h-4 mr-2" />
          1-on-1 Call
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/users')}
          className="glass-button"
        >
          <Users className="w-4 h-4" />
        </Button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          {user ? (
            <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                {isGuestUser(user.id) && (
                  <div className="text-xs text-toxicMint">Guest</div>
                )}
              </div>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="neon-button">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}