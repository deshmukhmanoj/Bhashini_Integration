import { useState } from 'react';
import { 
  LanguageIcon, 
  ArrowsRightLeftIcon, 
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';

const Translation = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' }
  ];

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    if (!authToken.trim()) {
      setError('Please set your Authorization Token first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bhashiniApi.translateText(sourceText, sourceLang, targetLang, authToken);
      
      if (response && response.pipelineResponse && response.pipelineResponse[0]) {
        const translationResult = response.pipelineResponse[0].output[0].target;
        setTranslatedText(translationResult);
        toast.success('Translation completed successfully!');
      } else {
        setError('Translation failed. Please check your configuration.');
        toast.error('Translation failed. Please check your configuration.');
      }
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard!');
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
          <LanguageIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Neural Machine Translation</h1>
        <p className="text-lg text-gray-600">Translate text between Indian languages with AI precision</p>
      </div>


      {/* Translation Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Language Selector */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapLanguages}
              className="mx-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Swap languages"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 flex justify-end">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Source Text */}
          <div className="p-6 border-r border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Source Text</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => speakText(sourceText, sourceLang)}
                  disabled={!sourceText}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Listen"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(sourceText)}
                  disabled={!sourceText}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Copy"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Translated Text */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Translation</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  disabled={!translatedText}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Listen"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  disabled={!translatedText}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Copy"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : translatedText ? (
                <p className="text-gray-800 leading-relaxed">{translatedText}</p>
              ) : (
                <p className="text-gray-400 italic">Translation will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {sourceText.length} characters
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim() || !isTokenSet}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <LanguageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">22+ Languages</h3>
          <p className="text-sm text-gray-600">Support for all major Indian languages</p>
        </div>

        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">AI Powered</h3>
          <p className="text-sm text-gray-600">Advanced neural machine translation</p>
        </div>

        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowsRightLeftIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Real-time</h3>
          <p className="text-sm text-gray-600">Instant translation results</p>
        </div>
      </div>
    </div>
  );
};

export default Translation;
