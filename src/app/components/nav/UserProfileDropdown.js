// components/UserProfileDropdown.js
import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';

export default function UserProfileDropdown({ user, signOut, onOpenSettings, onOpenProfile }) {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    action();
  };

  const menuItems = [
    {
      icon: User,
      label: 'View Profile',
      action: () => router.push(`/user/${user?.uid}`),
      description: 'See your public profile'
    },
    {
      icon: Settings,
      label: 'Account Settings',
      action: () => onOpenSettings && onOpenSettings(),
      description: 'Manage your account'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => router.push('/help'),
      description: 'Get help and support'
    },
    {
      icon: LogOut,
      label: 'Log Out',
      action: ()=>{
        signOut();
        router.push('/');
      },
      description: 'Sign out of your account',
      variant: 'danger'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-15 transition-colors group"
        aria-label="User menu"
      >
        <Avatar
          src={user?.avatar}
          alt={user.username}
          status={'online'}
          fallbackText={user.username?.charAt(0)?.toUpperCase()}
        />
        
        {/* Desktop: Show username and chevron */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="text-left">
            <div className="text-white text-sm font-medium">
              {user?.displayName || user?.username || 'Unknown'}
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-50 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-10 border border-gray-20 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-3 bg-gradient-to-r from-purple-60 to-purple-70 text-white">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={user?.avatar}
                  alt={user.username}
                  status={'online'}
                  fallbackText={user.username?.charAt(0)?.toUpperCase()}
                />
                <div className="flex-1">
                  <div className="font-semibold">
                    {user?.displayName || user?.username || 'Unknown'}
                  </div>
                  <div className="text-purple-90 text-sm">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.action)}
                  className={`w-full flex items-center px-4 py-2 text-left transition-colors ${
                    item.variant === 'danger'
                      ? 'hover:bg-red-900/20 text-red-300 hover:text-red-200'
                      : 'hover:bg-gray-15 text-gray-50 hover:text-white'
                  } ${index === menuItems.length - 1 ? 'border-t border-gray-20 mt-2' : ''}`}
                >
                  <item.icon 
                    size={18} 
                    className={`mr-3 ${item.variant === 'danger' ? 'text-red-400' : 'text-gray-40'}`} 
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      item.variant === 'danger' ? 'text-red-400' : 'text-gray-60'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {item.label === 'Notifications' && (
                    <div className="w-2 h-2 bg-purple-60 rounded-full ml-2"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-gray-08 border-t border-gray-20">
              <div className="flex items-center justify-between text-xs text-gray-60">
                <span>My Tution v1.0</span>
                <div className="flex items-center space-x-2">
                  <Shield size={12} />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}