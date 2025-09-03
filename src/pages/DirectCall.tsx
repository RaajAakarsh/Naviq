import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  MoreVertical,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getUserPublicById } from '@/data/mock-data';
import { UserPublic } from '@/lib/socket-contract';

export default function DirectCall() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [otherUser, setOtherUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoCall, setIsVideoCall] = useState(searchParams.get('video') === 'true');
  
  // Media controls
  const [isCameraOn, setIsCameraOn] = useState(isVideoCall);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // UI state
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Skip validation for demo purposes - just load the user
    if (!userId) {
      setError('Invalid user ID');
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      setIsLoading(true);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = getUserPublicById(userId);
      
      if (!foundUser) {
        setError('User not found.');
        setIsLoading(false);
        return;
      }

      // Skip self-check for demo
      setOtherUser(foundUser);
      setIsLoading(false);
      
      toast({
        title: isVideoCall ? "Video call started" : "Voice call started",
        description: `Calling ${foundUser.name}...`,
      });
    };

    loadUser();
  }, [userId, user, isVideoCall, toast]);

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

  const handleSwitchToVideo = () => {
    setIsVideoCall(true);
    setIsCameraOn(true);
    toast({
      title: "Switched to video call",
    });
  };

  if (isLoading) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Connecting...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !otherUser) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mb-4">
                {error}
              </AlertDescription>
            </Alert>
            <div className="flex space-x-3 mt-4">
              <Button onClick={() => navigate('/users')} variant="outline" className="flex-1">
                Back to Users
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isCallActive) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center">
          <Card className="glass-card max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={otherUser.avatarUrl} />
                <AvatarFallback className="text-xl">
                  {otherUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <PhoneOff className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Call with {otherUser.name} Ended</h2>
              <p className="text-muted-foreground">
                Call duration: {formatDuration(callDuration)}
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => navigate(`/direct-message/${otherUser.id}`)}
                  variant="outline"
                  className="flex-1"
                >
                  Send Message
                </Button>
                <Button 
                  onClick={() => navigate('/users')}
                  className="flex-1"
                >
                  Back to Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showSidebar={false}>
      <div className={`relative h-full bg-background overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Main Video/Audio Area */}
        <div className="relative h-full">
          {/* Remote Video/Audio (Main) */}
          <div className="absolute inset-0">
            {isVideoCall && isCameraOn ? (
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
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage src={otherUser.avatarUrl} />
                    <AvatarFallback className="text-4xl">
                      {otherUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-2xl font-medium mb-2">{otherUser.name}</p>
                    <Badge variant="secondary">
                      {isVideoCall ? 'Camera off' : 'Voice call'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) - Only show if video call */}
          {isVideoCall && (
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
          )}

          {/* Back Button */}
          <div className={`absolute top-4 left-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/users')}
              className="glass-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Call Info Overlay */}
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <Card className="glass-card">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
                  <Badge variant="outline">
                    {isScreenSharing ? 'Screen Sharing' : isVideoCall ? 'Video Call' : 'Voice Call'}
                  </Badge>
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

              {/* Camera Control (only show if video call) */}
              {isVideoCall && (
                <Button
                  size="lg"
                  variant={isCameraOn ? "outline" : "destructive"}
                  onClick={toggleCamera}
                  className="w-12 h-12 rounded-full glass-button"
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}

              {/* Switch to Video (only show if voice call) */}
              {!isVideoCall && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSwitchToVideo}
                  className="w-12 h-12 rounded-full glass-button"
                >
                  <Video className="w-5 h-5" />
                </Button>
              )}

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