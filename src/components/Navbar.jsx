import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  LanguageIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { authToken, setAuthToken, clearAuthToken, isTokenSet } = useAuth();

  const translationItems = [
    { path: '/translation', name: 'Translation', icon: LanguageIcon },
    { path: '/transliteration', name: 'Transliteration', icon: ChatBubbleLeftRightIcon },
    { path: '/speech-recognition', name: 'Speech Recognition', icon: MicrophoneIcon },
    { path: '/text-to-speech', name: 'Text to Speech', icon: SpeakerWaveIcon },
    { path: '/speech-to-speech', name: 'Speech to Speech', icon: ChatBubbleLeftRightIcon },
    { path: '/pipeline-questions', name: 'Pipeline Questions', icon: QuestionMarkCircleIcon },
  ];

  const standaloneItems = [
    { path: '/', name: 'Home', icon: HomeIcon },
    { path: '/feedback', name: 'Feedback', icon: HeartIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setAuthToken(tokenInput.trim());
      setTokenInput('');
      setShowAuthModal(false);
      toast.success('Authentication token set successfully!');
    } else {
      toast.error('Please enter a valid token');
    }
  };

  const handleClearToken = () => {
    clearAuthToken();
    setShowAuthModal(false);
    toast.info('Authentication token cleared');
  };

  const openAuthModal = () => {
    setTokenInput(authToken || '');
    setShowAuthModal(true);
  };

  const isTranslationPage = translationItems.some(item => item.path === location.pathname);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <LanguageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Bhashini API</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Standalone Items */}
            {standaloneItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Translation Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isTranslationPage
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <LanguageIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Translation Services</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {translationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowDropdown(false)}
                        className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Auth Token Button */}
            <button
              onClick={openAuthModal}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ml-4 ${
                isTokenSet
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
              title={isTokenSet ? 'Token Set - Click to manage' : 'No Token - Click to set'}
            >
              <KeyIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isTokenSet ? 'Token Set' : 'Set Token'}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            {/* Top Row: Home, Feedback, Auth Token */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {standaloneItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex flex-col items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium text-center">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Token Button */}
              <button
                onClick={() => {
                  openAuthModal();
                  setIsOpen(false);
                }}
                className={`flex flex-col items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 ${
                  isTokenSet
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <KeyIcon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium text-center">
                  {isTokenSet ? 'Token Set' : 'Set Token'}
                </span>
              </button>
            </div>

            {/* Translation Services Section */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2">
                Translation Services
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {translationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Token Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <KeyIcon className="w-5 h-5 mr-2" />
                Authentication Token
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {isTokenSet && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">Token Status: Active</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={authToken || ''}
                    readOnly
                    className="flex-1 text-xs text-gray-600 bg-transparent border-none p-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showToken ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isTokenSet ? 'Update Token' : 'Enter Token'}
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter your Bhashini authorization token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSetToken}
                  disabled={!tokenInput.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isTokenSet ? 'Update Token' : 'Set Token'}
                </button>
                
                {isTokenSet && (
                  <button
                    onClick={handleClearToken}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    title="Clear Token"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
