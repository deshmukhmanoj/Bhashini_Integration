import { useState, useRef } from 'react';
import { 
  SpeakerWaveIcon, 
  PlayIcon, 
  PauseIcon,
  StopIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AuthTokenManager from '../components/AuthTokenManager';

const TextToSpeech = () => {
  const [inputText, setInputText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi');
  const [selectedVoice, setSelectedVoice] = useState('female');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];

  const voices = [
    { id: 'female', name: 'Female Voice' },
    { id: 'male', name: 'Male Voice' }
  ];

  const handleGenerateSpeech = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to convert to speech');
      return;
    }

    if (!authToken.trim()) {
      setError('Please set your Authorization Token first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bhashiniApi.textToSpeech(inputText, selectedLang, authToken, selectedVoice);
      
      if (response && response.pipelineResponse && response.pipelineResponse[0]) {
        const audioContent = response.pipelineResponse[0].audio[0].audioContent;
        const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      } else {
        setError('Text-to-speech conversion failed. Please check your configuration.');
      }
    } catch (err) {
      setError(err.message || 'Text-to-speech conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      
      audio.play();
    }
  };

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts_${selectedLang}_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sampleTexts = {
    hi: 'नमस्ते, मैं भाषिणी का टेक्स्ट टू स्पीच सिस्टम हूं।',
    en: 'Hello, I am Bhashini\'s text to speech system.',
    bn: 'হ্যালো, আমি ভাষিণীর টেক্সট টু স্পিচ সিস্টেম।',
    te: 'హలో, నేను భాషిణి టెక్స్ట్ టు స్పీచ్ సిస్టమ్.',
    mr: 'नमस्कार, मी भाषिणीची टेक्स्ट टू स्पीच सिस्टीम आहे।'
  };

  const loadSampleText = () => {
    const sample = sampleTexts[selectedLang] || sampleTexts['en'];
    setInputText(sample);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4">
          <SpeakerWaveIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Text to Speech</h1>
        <p className="text-lg text-gray-600">Generate natural-sounding speech from text in Indian languages</p>
      </div>

      {/* Auth Token Manager */}
      <AuthTokenManager />

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
          <Cog6ToothIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">API Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Text Input Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Text Input */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Input Text
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={loadSampleText}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Load Sample
              </button>
              <button
                onClick={() => copyToClipboard(inputText)}
                disabled={!inputText}
                className="p-1 text-gray-400 hover:text-orange-600 disabled:opacity-50"
                title="Copy"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              {inputText.length} characters
            </div>
            <button
              onClick={handleGenerateSpeech}
              disabled={loading || !inputText.trim() || !isTokenSet}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Generating...' : 'Generate Speech'}
            </button>
          </div>
        </div>

        {/* Audio Player */}
        <div className="p-6">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <SpeakerWaveIcon className="w-5 h-5 mr-2" />
            Generated Audio
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : audioUrl ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  className="flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                  ) : (
                    <PlayIcon className="w-6 h-6" />
                  )}
                </button>
                
                <button
                  onClick={stopAudio}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <StopIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={downloadAudio}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Download Audio
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-400">
              Generated audio will appear here...
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 pb-6">
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <SpeakerWaveIcon className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Natural Voice</h3>
          <p className="text-sm text-gray-600">High-quality, natural-sounding speech synthesis</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Multi-language</h3>
          <p className="text-sm text-gray-600">Support for multiple Indian languages</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Voice Options</h3>
          <p className="text-sm text-gray-600">Choose from male and female voices</p>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
