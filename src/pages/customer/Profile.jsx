import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import BottomNavBar from '@components/layout/BottomNavBar';
import BackButton from '@components/common/BackButton';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const accountSettings = [
        {
            id: 'addresses',
            icon: 'location_on',
            label: 'Saved Addresses',
            path: '/addresses',
            iconBg: 'bg-[#7f4f13]/10',
            iconColor: 'text-[#7f4f13]',
        },
        {
            id: 'history',
            icon: 'history',
            label: 'Order History',
            path: '/orders',
            iconBg: 'bg-[#7f4f13]/10',
            iconColor: 'text-[#7f4f13]',
        },
        {
            id: 'settings',
            icon: 'settings',
            label: 'App Settings',
            path: '/settings',
            iconBg: 'bg-[#7f4f13]/10',
            iconColor: 'text-[#7f4f13]',
        },
    ];

    const supportItems = [
        {
            id: 'help',
            icon: 'help',
            label: 'Help & Support',
            path: '/help',
            iconBg: 'bg-[#f4f2f0] dark:bg-[#211811]',
            iconColor: 'text-[#887263]',
        },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811] pb-20">
            {/* Top App Bar */}
            <div className="flex items-center bg-[#f8f7f6] dark:bg-[#211811] p-4 justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 shadow-md">
                <BackButton className="w-12 h-12 shrink-0  max-h-[40px] max-w-[40px]" onClick={() => navigate('/')} />
                <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Profile
                </h2>
                <div className="flex w-12 items-center justify-end max-h-[40px]">
                    <button className="flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-zinc-800 text-[#181411] dark:text-white shadow-md border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="flex p-4 mt-2">
                <div className="flex w-full flex-col gap-4 items-center">
                    <div className="flex gap-4 flex-col items-center">
                        {/* Avatar with Gradient Border */}
                        <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#7f4f13] to-[#887263] shadow-lg">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-[#f8f7f6] dark:border-[#211811] shadow-md"
                                style={{
                                    backgroundImage:
                                        `url("${user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=B45309&color=fff&size=200`}")`,
                                }}
                            ></div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[#181411] dark:text-white text-[24px] font-bold leading-tight tracking-[-0.015em] text-center">
                                {user?.name || 'Rahul Sharma'}
                            </p>
                            <p className="text-[#887263] dark:text-[#a18a7c] text-base font-medium leading-normal text-center">
                                {user?.phone || '+91 98765 43210'}
                            </p>
                            <p className="text-[#887263] dark:text-[#a18a7c] text-sm font-normal leading-normal text-center">
                                {user?.email || 'rahul.gaya@hungerwood.com'}
                            </p>
                            {/* Edit Profile Button */}
                            <Link
                                to="/edit-profile"
                                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-[#7f4f13] text-white rounded-xl hover:bg-[#b35614] transition-all shadow-md border-2 border-[#7f4f13] hover:shadow-lg"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                <span className="text-sm font-semibold">Edit Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="flex flex-col gap-1 px-4 mb-8">
                {/* Account Settings */}
                <h3 className="text-[#181411] dark:text-white text-sm font-bold uppercase tracking-wider px-2 pb-2 pt-6 opacity-60">
                    Account Settings
                </h3>
                <div className="bg-white dark:bg-[#2d221a] rounded-xl overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
                    {accountSettings.map((item, index) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 min-h-16 justify-between cursor-pointer ${index < accountSettings.length - 1
                                ? 'border-b-2 border-gray-200 dark:border-gray-700'
                                : ''
                                } active:bg-gray-50 dark:active:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`${item.iconColor} flex items-center justify-center rounded-lg ${item.iconBg} shrink-0 w-10 h-10`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <p className="text-[#181411] dark:text-white text-base font-medium flex-1 truncate">
                                    {item.label}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <span className="material-symbols-outlined text-[#887263]">chevron_right</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Support */}
                <h3 className="text-[#181411] dark:text-white text-sm font-bold uppercase tracking-wider px-2 pb-2 pt-8 opacity-60">
                    Support
                </h3>
                <div className="bg-white dark:bg-[#2d221a] rounded-xl overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
                    {/* Help & Support */}
                    {supportItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex items-center gap-4 px-4 min-h-16 justify-between cursor-pointer border-b-2 border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`${item.iconColor} flex items-center justify-center rounded-lg ${item.iconBg} shrink-0 w-10 h-10`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <p className="text-[#181411] dark:text-white text-base font-medium flex-1 truncate">
                                    {item.label}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <span className="material-symbols-outlined text-[#887263]">chevron_right</span>
                            </div>
                        </Link>
                    ))}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 min-h-16 justify-between cursor-pointer active:bg-gray-50 dark:active:bg-white/5 w-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-red-500 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30 shrink-0 w-10 h-10">
                                <span className="material-symbols-outlined">logout</span>
                            </div>
                            <p className="text-red-500 text-base font-semibold flex-1 truncate text-left">Logout</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center justify-center pb-4 pt-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7f4f13] font-bold">HungerWood</span>
                    <span className="text-[#887263]">•</span>
                    <span className="text-[#887263] font-medium">Gaya, Bihar</span>
                </div>
                <p className="text-[#887263] text-xs opacity-60">Version 2.4.1 (Premium)</p>
            </div>

            {/* Bottom Navigation Bar */}
            <BottomNavBar />
        </div>
    );
};

export default Profile;
