import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Phone, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [username, setUsernameInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUsername } = useAuth();
  const navigate = useNavigate();

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phoneNumber.trim()) return;

    setIsLoading(true);
    
    // Simulate OTP sending delay
    setTimeout(() => {
      const otp = generateOtp();
      setGeneratedOtp(otp);
      setOtpSent(true);
      setIsLoading(false);
      
      // Show OTP in toast for demo purposes
      toast({
        title: "OTP Sent (Demo)",
        description: `Your OTP is: ${otp}`,
      });
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enteredOtp === generatedOtp) {
      // OTP matches - create session and redirect
      setUsername(username);
      // Clear OTP after use
      setGeneratedOtp('');
      navigate('/assessment');
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setEnteredOtp('');
    
    setTimeout(() => {
      const otp = generateOtp();
      setGeneratedOtp(otp);
      setIsLoading(false);
      
      toast({
        title: "OTP Resent (Demo)",
        description: `Your new OTP is: ${otp}`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">IMPROVÉ</h1>
          <p className="text-muted-foreground mt-2">Know your strengths. Improve with intention</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              {otpSent ? 'Verify OTP' : 'Login'}
            </CardTitle>
            <CardDescription>
              {otpSent 
                ? 'Enter the 6-digit code sent to your phone' 
                : 'Enter your details to receive an OTP'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="h-12 text-center text-lg"
                  autoFocus
                />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 text-center text-lg"
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 font-medium text-base"
                  disabled={!username.trim() || !phoneNumber.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-2">
                  OTP sent to {phoneNumber}
                </div>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  autoFocus
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 font-medium text-base"
                  disabled={enteredOtp.length !== 6}
                >
                  Verify OTP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          OTP is simulated for demo purposes. No SMS is actually sent.
        </p>
        <p className="text-center text-xs text-muted-foreground mt-2 px-4">
          This assessment is inspired by strengths-based psychology and is not an official Gallup CliftonStrengths® product.
        </p>
      </div>
    </div>
  );
}
