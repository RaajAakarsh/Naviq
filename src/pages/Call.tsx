import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Call() {
  const { user } = useAuth();
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  // Media controls
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // UI state
  const [showControls, setShowControls] = useState(true);
  
  // Mock participant data (since it's frontend only)
  const mockParticipant = {
    id: 'uid_alice123',
    name: 'Alice Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5a4?w=150&h=150&fit=crop&crop=face'
  };

  // Timer for call duration
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCallActive]);

  // Hide controls after inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCallActive) setShowControls(false);
    }, 3000);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showControls, isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    toast({
      title: "Call ended",
      description: `Call duration: ${formatDuration(callDuration)}`,
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast({
      title: isCameraOn ? "Camera turned off" : "Camera turned on",
    });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast({
      title: isMicOn ? "Microphone muted" : "Microphone unmuted",
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker muted" : "Speaker unmuted",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isCallActive) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center">
          <Card className="glass-card max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <PhoneOff className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Call Ended</h2>
              <p className="text-muted-foreground">
                Call duration: {formatDuration(callDuration)}
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showSidebar={false}>
      <div className={`relative h-full bg-background overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Main Video Area */}
        <div className="relative h-full">
          {/* Remote Video (Main) */}
          <div className="absolute inset-0">
            {isCameraOn ? (
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover bg-card"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full bg-card flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={mockParticipant.avatarUrl} />
                    <AvatarFallback className="text-2xl">
                      {mockParticipant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-medium">{mockParticipant.name}</p>
                  <Badge variant="secondary">Camera off</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-32 bg-card rounded-lg overflow-hidden border border-border shadow-lg">
            {isCameraOn ? (
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="h-8 w-8 mx-auto mb-2">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs">You</p>
                </div>
              </div>
            )}
          </div>

          {/* Call Info Overlay */}
          <div className={`absolute top-4 left-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <Card className="glass-card">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
                  <Badge variant="outline">{isScreenSharing ? 'Screen Sharing' : '1-on-1 Call'}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-center space-x-4">
              {/* Mic Control */}
              <Button
                size="lg"
                variant={isMicOn ? "outline" : "destructive"}
                onClick={toggleMic}
                className="w-12 h-12 rounded-full glass-button"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {/* Camera Control */}
              <Button
                size="lg"
                variant={isCameraOn ? "outline" : "destructive"}
                onClick={toggleCamera}
                className="w-12 h-12 rounded-full glass-button"
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                onClick={toggleScreenShare}
                className="w-12 h-12 rounded-full glass-button"
              >
                <Monitor className="w-5 h-5" />
              </Button>

              {/* Speaker Control */}
              <Button
                size="lg"
                variant={isSpeakerOn ? "outline" : "destructive"}
                onClick={toggleSpeaker}
                className="w-12 h-12 rounded-full glass-button"
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                size="lg"
                variant="outline"
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-full glass-button"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>

              {/* Settings */}
              <Button
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full glass-button"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* More Options */}
              <Button
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full glass-button"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              {/* End Call */}
              <Button
                size="lg"
                variant="destructive"
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}