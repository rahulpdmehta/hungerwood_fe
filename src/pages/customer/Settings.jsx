import { useState, useEffect } from 'react';
import BackButton from '@components/common/BackButton';
import BottomNavBar from '@components/layout/BottomNavBar';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    offers: true,
    reminders: false
  });
  const [language, setLanguage] = useState('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoLocation, setAutoLocation] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedSound = localStorage.getItem('soundEnabled') !== 'false';
    const savedAutoLocation = localStorage.getItem('autoLocation') !== 'false';

    setDarkMode(savedDarkMode);
    if (Object.keys(savedNotifications).length > 0) {
      setNotifications((prev) => ({ ...prev, ...savedNotifications }));
    }
    setLanguage(savedLanguage);
    setSoundEnabled(savedSound);
    setAutoLocation(savedAutoLocation);

    // Apply dark mode class
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = (enabled) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Handle sound toggle
  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled);
    localStorage.setItem('soundEnabled', enabled.toString());
  };

  // Handle auto location toggle
  const handleAutoLocationToggle = (enabled) => {
    setAutoLocation(enabled);
    localStorage.setItem('autoLocation', enabled.toString());
  };

  const settingsSections = [
    {
      id: 'appearance',
      title: 'Appearance',
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'toggle',
          value: darkMode,
          onChange: handleDarkModeToggle
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      items: [
        {
          id: 'orderUpdates',
          label: 'Order Updates',
          description: 'Get notified about your order status',
          type: 'toggle',
          value: notifications.orderUpdates,
          onChange: () => handleNotificationToggle('orderUpdates')
        },
        {
          id: 'promotions',
          label: 'Promotions',
          description: 'Receive promotional offers and deals',
          type: 'toggle',
          value: notifications.promotions,
          onChange: () => handleNotificationToggle('promotions')
        },
        {
          id: 'offers',
          label: 'Special Offers',
          description: 'Get notified about special offers',
          type: 'toggle',
          value: notifications.offers,
          onChange: () => handleNotificationToggle('offers')
        },
        {
          id: 'reminders',
          label: 'Reminders',
          description: 'Receive order reminders and recommendations',
          type: 'toggle',
          value: notifications.reminders,
          onChange: () => handleNotificationToggle('reminders')
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: [
        {
          id: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिंदी (Hindi)' },
            { value: 'bn', label: 'বাংলা (Bengali)' }
          ],
          onChange: handleLanguageChange
        },
        {
          id: 'sound',
          label: 'Sound Effects',
          description: 'Enable or disable app sounds',
          type: 'toggle',
          value: soundEnabled,
          onChange: handleSoundToggle
        },
        {
          id: 'autoLocation',
          label: 'Auto-detect Location',
          description: 'Automatically detect your location for faster checkout',
          type: 'toggle',
          value: autoLocation,
          onChange: handleAutoLocationToggle
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      items: [
        {
          id: 'clearCache',
          label: 'Clear Cache',
          description: 'Clear app cache to free up storage',
          type: 'button',
          action: () => {
            if (window.confirm('Are you sure you want to clear the cache?')) {
              localStorage.removeItem('menuCache');
              localStorage.removeItem('categoriesCache');
              alert('Cache cleared successfully!');
            }
          }
        },
        {
          id: 'clearData',
          label: 'Clear All Data',
          description: 'Remove all stored app data (requires login again)',
          type: 'button',
          action: () => {
            if (window.confirm('This will clear all your app data. Are you sure?')) {
              localStorage.clear();
              alert('All data cleared. Please restart the app.');
            }
          }
        }
      ]
    }
  ];

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#7f4f13]' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#f8f7f6] dark:bg-[#211811] p-4 justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 shadow-md">
        <BackButton className="w-12 h-12 shrink-0 max-h-[40px] max-w-[40px]" />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          App Settings
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <section key={section.id}>
              <h3 className="text-[#181411] dark:text-white text-sm font-bold uppercase tracking-wider px-2 pb-2 mb-3 opacity-60">
                {section.title}
              </h3>
              <div className="bg-white dark:bg-[#2d221a] rounded-xl overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className={`${
                      itemIndex < section.items.length - 1
                        ? 'border-b-2 border-gray-200 dark:border-gray-700'
                        : ''
                    }`}
                  >
                    {item.type === 'toggle' && (
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-[#181411] dark:text-white text-base font-semibold mb-1">
                            {item.label}
                          </p>
                          <p className="text-[#887263] dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                        <ToggleSwitch enabled={item.value} onChange={item.onChange} />
                      </div>
                    )}

                    {item.type === 'select' && (
                      <div className="p-4">
                        <div className="mb-2">
                          <p className="text-[#181411] dark:text-white text-base font-semibold mb-1">
                            {item.label}
                          </p>
                          <p className="text-[#887263] dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                        <select
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="w-full mt-2 px-4 py-2 bg-white dark:bg-[#211811] border-2 border-gray-200 dark:border-gray-700 rounded-lg text-[#181411] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7f4f13]"
                        >
                          {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {item.type === 'button' && (
                      <button
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <p className="text-[#181411] dark:text-white text-base font-semibold mb-1">
                            {item.label}
                          </p>
                          <p className="text-[#887263] dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[#887263]">
                          chevron_right
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* App Info */}
          <section>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-3">
                App Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#887263] dark:text-gray-400 text-sm">Version</span>
                  <span className="text-[#181411] dark:text-white text-sm font-medium">2.4.1 (Premium)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#887263] dark:text-gray-400 text-sm">Build</span>
                  <span className="text-[#181411] dark:text-white text-sm font-medium">2025.01.26</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#887263] dark:text-gray-400 text-sm">Platform</span>
                  <span className="text-[#181411] dark:text-white text-sm font-medium">Web App</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Settings;
