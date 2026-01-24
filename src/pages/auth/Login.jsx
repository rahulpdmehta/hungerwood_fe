import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import Button from '@components/common/Button';
import { authService } from '@services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  // State management
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // OTP input refs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Timer for resend OTP
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  // Handle mobile number submission
  const handleMobileSubmit = async e => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call backend API to send OTP
      const response = await authService.sendOTP(mobileNumber);
      console.log('OTP sent:', response.message);
      console.log('Check backend console for OTP code');

      // Move to OTP step
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);

      // Focus first OTP input
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleOtpSubmit(newOtp.join(''));
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = e => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs[lastIndex].current?.focus();

    // Auto-submit if 6 digits pasted
    if (pastedData.length === 6) {
      handleOtpSubmit(pastedData);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call backend API to verify OTP
      const response = await authService.verifyOTP(mobileNumber, otpValue);

      // Save user and token to store
      setAuth(response.data.user, response.data.token);

      // Check if profile is complete
      if (response.data.isProfileComplete) {
        // Navigate to home if profile is complete
        navigate('/');
      } else {
        // Navigate to profile completion if profile is incomplete
        navigate('/complete-profile');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      // Call backend API to resend OTP
      const response = await authService.sendOTP(mobileNumber);
      console.log('OTP resent:', response.message);
      console.log('Check backend console for new OTP code');

      // Reset timer
      setResendTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      otpRefs[0].current?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit phone number
  const handleEditPhone = () => {
    setStep('mobile');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleGuestContinue = () => {
    navigate('/menu');
  };

  const handleBack = () => {
    if (step === 'otp') {
      handleEditPhone();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center relative py-3 px-4">
        
        <h1 className="text-lg font-semibold text-text-primary">
          {step === 'mobile' ? 'Login' : 'Verify OTP'}
        </h1>
      </div>

      {/* Hero Image - Only show on mobile step */}
      {step === 'mobile' && (
        <div className="px-4 mb-5">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-40">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
              alt="Premium Dining"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs font-medium mb-0.5 tracking-wide">GAYA, BIHAR</p>
              <h2 className="text-xl font-bold text-white">Premium Dining</h2>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-4">
        <div className="max-w-lg mx-auto">
          {/* Mobile Number Step */}
          {step === 'mobile' && (
            <>
              {/* Welcome Text */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Welcome to<br />HungerWood
                </h2>
                <p className="text-text-secondary text-sm">
                  Enter your mobile number to explore multi-cuisine flavors.
                </p>
              </div>

              {/* Mobile Number Form */}
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                {error && (
                  <div className="bg-danger/10 border border-danger/20 text-danger px-3 py-2 rounded-lg text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-2 uppercase tracking-wide">
                    Mobile Number
                  </label>
                  <div className="flex items-center bg-surface border-2 border-border rounded-xl px-3 py-3 focus-within:border-primary transition-colors">
                    <span className="text-text-primary font-medium mr-3 text-base">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobileNumber(value);
                        setError('');
                      }}
                      placeholder="00000 00000"
                      className="flex-1 bg-transparent text-text-primary text-base placeholder:text-text-tertiary focus:outline-none"
                      maxLength="10"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={mobileNumber.length !== 10}
                  className="!bg-[#B45309] hover:!bg-[#92400E] !text-white !rounded-xl !py-3 !shadow-lg"
                >
                  Continue
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-3 text-text-tertiary text-xs">Or</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Continue as Guest */}
              <button
                onClick={handleGuestContinue}
                className="w-full text-[#B45309] font-semibold text-base hover:text-[#92400E] transition-colors"
              >
                Continue as Guest
              </button>

              {/* Terms */}
              <p className="text-center text-xs text-text-tertiary mt-8 mb-6 leading-relaxed">
                By continuing, you agree to HungerWood&apos;s{' '}
                <button className="text-text-secondary underline hover:text-text-primary">
                  Terms of Service
                </button>{' '}
                &{' '}
                <button className="text-text-secondary underline hover:text-text-primary">
                  Privacy Policy
                </button>
              </p>
            </>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <>
              {/* OTP Icon */}
              <div className="flex justify-center mb-5 mt-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B45309] to-[#92400E] flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* OTP Instructions */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Enter OTP
                </h2>
                <p className="text-text-secondary text-sm mb-1.5">
                  We&apos;ve sent a 6-digit code to
                </p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-text-primary font-semibold text-base">
                    +91 {mobileNumber}
                  </p>
                  <button
                    onClick={handleEditPhone}
                    className="text-[#B45309] text-xs font-medium hover:text-[#92400E] underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-3 py-2 rounded-lg text-xs mb-4 text-center">
                  {error}
                </div>
              )}

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-1.5 md:gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="tel"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold text-text-primary bg-surface border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <Button
                onClick={() => handleOtpSubmit()}
                fullWidth
                size="lg"
                loading={loading}
                disabled={otp.some(digit => digit === '')}
                className="!bg-[#B45309] hover:!bg-[#92400E] !text-white !rounded-xl !py-3 !shadow-lg mb-4"
              >
                Verify & Continue
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-text-secondary text-xs mb-1.5">
                  Didn&apos;t receive the code?
                </p>
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#B45309] font-semibold text-sm hover:text-[#92400E] transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-text-tertiary text-xs">
                    Resend OTP in <span className="font-semibold text-text-primary">{resendTimer}s</span>
                  </p>
                )}
              </div>

              {/* Help Text */}
              <div className="mt-8 text-center">
                <p className="text-text-tertiary text-xs leading-relaxed">
                  Check your backend console for the OTP code<br />
                  (OTP is logged for development)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
