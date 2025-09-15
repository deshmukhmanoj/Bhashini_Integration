import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AuthTokenManager = () => {
  const { authToken, isTokenSet, updateAuthToken, clearAuthToken } = useAuth();
  const [tempToken, setTempToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isEditing, setIsEditing] = useState(!isTokenSet);

  const handleSaveToken = () => {
    if (tempToken.trim()) {
      updateAuthToken(tempToken.trim());
      setIsEditing(false);
      setTempToken('');
    }
  };

  const handleEditToken = () => {
    setTempToken(authToken);
    setIsEditing(true);
  };

  const handleClearToken = () => {
    clearAuthToken();
    setTempToken('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempToken('');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center mb-4">
          <KeyIcon className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {isTokenSet ? 'Update Authorization Token' : 'Set Authorization Token'}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bhashini Authorization Token *
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Bhashini authorization token"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showToken ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This token will be saved securely and used for all API calls
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSaveToken}
              disabled={!tempToken.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Token
            </button>
            
            {isTokenSet && (
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Authorization Token Set</h3>
            <p className="text-sm text-green-600">
              Token is configured and ready for API calls
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleEditToken}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            Update Token
          </button>
          <button
            onClick={handleClearToken}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Clear Token
          </button>
        </div>
      </div>
      
      {showToken && authToken && (
        <div className="mt-4 p-3 bg-white rounded-lg border">
          <p className="text-xs text-gray-500 mb-1">Current Token:</p>
          <p className="font-mono text-sm text-gray-800 break-all">{authToken}</p>
        </div>
      )}
      
      <button
        onClick={() => setShowToken(!showToken)}
        className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
      >
        {showToken ? 'Hide Token' : 'Show Token'}
      </button>
    </div>
  );
};

export default AuthTokenManager;
