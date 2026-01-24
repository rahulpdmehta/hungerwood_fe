import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import Button from '@components/common/Button';
import { authService } from '@services/auth.service';

const ProfileCompletion = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        referralCode: '',
        profilePic: 'https://ui-avatars.com/api/?name=User&background=B45309&color=fff&size=200',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [referralMessage, setReferralMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Validate form
    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        if (!formData.street.trim()) {
            setError('Street address is required');
            return false;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            return false;
        }
        if (!formData.state.trim()) {
            setError('State is required');
            return false;
        }
        if (!formData.pincode.trim()) {
            setError('Pincode is required');
            return false;
        }
        // Pincode validation (6 digits)
        if (!/^\d{6}$/.test(formData.pincode)) {
            setError('Pincode must be 6 digits');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const profileData = {
                name: formData.name,
                email: formData.email,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                profilePic: formData.profilePic,
            };

            // Include referral code if provided
            if (formData.referralCode && formData.referralCode.trim()) {
                profileData.referralCode = formData.referralCode.trim().toUpperCase();
            }

            const response = await authService.completeProfile(profileData);

            // Show referral success message if referral was applied
            if (response.referralApplied) {
                setReferralMessage('🎉 Referral code applied! You\'ll get bonus after your first order.');
            }

            // Update user in store
            updateUser(response.data);

            // Navigate to home after a brief delay to show referral message
            setTimeout(() => {
                navigate('/');
            }, response.referralApplied ? 2000 : 0);
        } catch (err) {
            setError(err.message || 'Failed to complete profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-center relative py-4 px-4">
                <h1 className="text-xl font-semibold text-text-primary">
                    Complete Your Profile
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 pb-8">
                <div className="max-w-lg mx-auto">
                    {/* Welcome Message */}
                    <div className="mb-8 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#B45309] to-[#92400E] flex items-center justify-center shadow-xl">
                            <span className="material-symbols-outlined text-white text-5xl">
                                person
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            Welcome to HungerWood!
                        </h2>
                        <p className="text-text-secondary text-base">
                            Please complete your profile to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Referral Success Message */}
                        {referralMessage && (
                            <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-bounce">
                                <span className="text-lg">🎉</span>
                                {referralMessage}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Referral Code (Optional) */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-white text-xl">🎁</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">
                                        Have a Referral Code?
                                    </h4>
                                    <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                                        Enter your friend's code and get ₹50 bonus after your first order!
                                    </p>
                                </div>
                            </div>
                            <input
                                type="text"
                                name="referralCode"
                                value={formData.referralCode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    setFormData(prev => ({ ...prev, referralCode: value }));
                                    setError('');
                                }}
                                placeholder="Enter referral code (optional)"
                                className="w-full bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-green-500 focus:outline-none transition-colors font-mono text-center text-lg font-bold tracking-wider"
                                disabled={loading}
                                maxLength="12"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                                Delivery Address *
                            </h3>

                            {/* Street */}
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street address"
                                className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                disabled={loading}
                            />

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                    disabled={loading}
                                />
                            </div>

                            {/* Pincode */}
                            <input
                                type="tel"
                                name="pincode"
                                value={formData.pincode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setFormData(prev => ({ ...prev, pincode: value }));
                                    setError('');
                                }}
                                placeholder="Pincode (6 digits)"
                                maxLength="6"
                                className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            className="!bg-[#B45309] hover:!bg-[#92400E] !text-white !rounded-2xl !py-4 !shadow-lg mt-8"
                        >
                            Complete Profile
                        </Button>
                    </form>

                    {/* Note */}
                    <p className="text-center text-sm text-text-tertiary mt-6 leading-relaxed">
                        All fields marked with * are required
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;
