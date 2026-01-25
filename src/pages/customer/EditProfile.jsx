import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import BackButton from '@components/common/BackButton';
import Button from '@components/common/Button';
import { authService } from '@services/auth.service';

const EditProfile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profilePic: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profilePic: user.profilePic || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

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
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await authService.updateProfile({
                name: formData.name,
                email: formData.email,
                profilePic: formData.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=B45309&color=fff&size=200`,
            });

            // Update user in store
            updateUser(response.data);

            // Navigate back to profile
            navigate('/profile');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center px-4 py-4">
                    <BackButton to="/profile" />
                    <h1 className="flex-1 text-center text-xl font-semibold text-text-primary pr-10">
                        Edit Profile
                    </h1>
                </div>
            </div>

            <div className="p-4">
                {/* Profile Picture Preview */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={formData.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=B45309&color=fff&size=200`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                        />
                        <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg">
                            <span className="material-symbols-outlined text-white text-xl">
                                edit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                            {error}
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

                    {/* Profile Picture URL */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">
                            Profile Picture URL (Optional)
                        </label>
                        <input
                            type="url"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                            disabled={loading}
                        />
                        <p className="text-xs text-text-tertiary mt-2">
                            Leave empty to use auto-generated avatar
                        </p>
                    </div> */}

                    {/* Phone (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">
                            Phone Number
                        </label>
                        <div className="w-full bg-gray-200 border-2 border-gray-200 rounded-xl px-4 py-3 text-text-secondary">
                            {user?.phone || 'Not available'}
                        </div>
                        <p className="text-xs text-text-tertiary mt-2">
                            Phone number cannot be changed
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            className="!bg-primary hover:!bg-primary-dark !text-white !rounded-2xl !py-4 !shadow-lg"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>

                {/* Info Card */}
                <div className="max-w-lg mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-xl">
                            info
                        </span>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                Profile Information
                            </h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Your profile picture will be visible on orders and in the app. You can use a URL to your photo or leave it empty for an auto-generated avatar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
