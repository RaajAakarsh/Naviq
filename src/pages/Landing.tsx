import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  MessageCircle, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isGuestUser } from '@/data/mock-data';

interface LandingNavbarProps {
  showUserInfo?: boolean;
}

export function LandingNavbar({ showUserInfo = true }: LandingNavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">NAVIQ</span>
      </Link>
      
      {showUserInfo && (
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link to="/users">
                <Button size="sm" variant="outline" className="glass-button">
                  Users Directory
                </Button>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  {isGuestUser(user.id) && (
                    <Badge variant="secondary" className="text-xs">Guest</Badge>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/auth">
                <Button size="sm" variant="outline" className="glass-button">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="neon-button">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,221,218,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,70,85,0.1),transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Modern Chat + Video Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
            Welcome to NAVIQ
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join rooms instantly, chat with friends, and make video calls with crystal-clear quality. 
            No downloads, no hassle — just pure connection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/create-room">
              <Button size="lg" className="neon-button text-lg px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Create Room
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/join-room">
              <Button size="lg" variant="outline" className="glass-button text-lg px-8 py-3">
                <Video className="w-5 h-5 mr-2" />
                Join Room
              </Button>
            </Link>
            
            <Link to="/call">
              <Button size="lg" variant="outline" className="glass-button text-lg px-8 py-3">
                <MessageCircle className="w-5 h-5 mr-2" />
                1-on-1 Call
              </Button>
            </Link>
          </div>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Instant Connect
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Works Anywhere
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to stay connected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From quick chats to important video calls, we've got all the tools 
              you need for seamless communication.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Instant Rooms */}
            <Card className="glass-panel border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Rooms</CardTitle>
                <CardDescription>
                  Create or join rooms with just a code. No registration required — 
                  perfect for quick team meetings or catching up with friends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 6-character room codes</li>
                  <li>• Public & private rooms</li>
                  <li>• Guest access available</li>
                  <li>• Save favorite rooms</li>
                </ul>
              </CardContent>
            </Card>

            {/* HD Video Calls */}
            <Card className="glass-panel border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>HD Video Calls</CardTitle>
                <CardDescription>
                  Crystal-clear video and audio quality with advanced WebRTC technology. 
                  Screen sharing and multi-device support included.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 1080p video quality</li>
                  <li>• Screen sharing</li>
                  <li>• Camera switching</li>
                  <li>• Connection stats</li>
                </ul>
              </CardContent>
            </Card>

            {/* Rich Messaging */}
            <Card className="glass-panel border-secondary/20 hover:border-secondary/40 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Rich Messaging</CardTitle>
                <CardDescription>
                  Send text, images, and files with ease. Read receipts, typing indicators, 
                  and message pinning keep everyone in sync.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• File & image sharing</li>
                  <li>• Read receipts</li>
                  <li>• Typing indicators</li>
                  <li>• Message pinning</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust NAVIQ for their communication needs.
            Start with a free account or jump right in as a guest.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth">
              <Button size="lg" className="neon-button text-lg px-8 py-3">
                Sign Up Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/create-room">
              <Button size="lg" variant="outline" className="glass-button text-lg px-8 py-3">
                Try as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}