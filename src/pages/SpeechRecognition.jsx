import { useState, useRef } from 'react';
import { 
  MicrophoneIcon, 
  StopIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AuthTokenManager from '../components/AuthTokenManager';

const SpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleRecognize = async () => {
    if (!audioBlob) {
      setError('Please record audio first');
      return;
    }

    if (!authToken.trim()) {
      setError('Please set your Authorization Token first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        try {
          const response = await bhashiniApi.speechToText(base64Audio, selectedLang, authToken);
          
          // Handle different possible response structures
          if (response && response.pipelineResponse && response.pipelineResponse[0]) {
            const asrOutput = response.pipelineResponse[0].output;
            if (asrOutput && asrOutput[0] && asrOutput[0].source) {
              setRecognizedText(asrOutput[0].source);
            } else {
              setError('No text recognized from audio. Please try speaking more clearly.');
            }
          } else if (response && response.output && response.output[0]) {
            // Alternative response structure
            setRecognizedText(response.output[0].source || response.output[0].text || 'Recognition completed');
          } else if (response && response.data) {
            // Another possible structure
            setRecognizedText(response.data.output || response.data.text || 'Recognition completed');
          } else {
            console.log('Full response:', response);
            setError('Speech recognition failed. Please check your configuration and try again.');
          }
        } catch (err) {
          console.error('Speech recognition error:', err);
          setError(err.message || 'Speech recognition failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      setError('Failed to process audio file.');
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setRecognizedText('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-4">
          <MicrophoneIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Speech Recognition</h1>
        <p className="text-lg text-gray-600">Convert spoken words into text with AI precision</p>
      </div>

      {/* Auth Token Manager */}
      <AuthTokenManager />

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
          <Cog6ToothIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">API Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

      {/* Recording Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Recording Controls */}
        <div className="p-8 text-center border-b border-gray-100">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'
            }`}>
              {isRecording ? (
                <StopIcon className="w-12 h-12 text-white" />
              ) : (
                <MicrophoneIcon className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Stop Recording
              </button>
            )}
            
            {audioBlob && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={playAudio}
                  className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Play
                </button>
                <button
                  onClick={clearRecording}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {isRecording ? 'Recording... Click stop when finished' : 
             audioBlob ? 'Audio recorded successfully' : 
             'Click the microphone to start recording'}
          </div>
        </div>

        {/* Recognition Results */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Recognized Text
            </h3>
            {recognizedText && (
              <button
                onClick={() => copyToClipboard(recognizedText)}
                className="p-1 text-gray-400 hover:text-purple-600"
                title="Copy"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="min-h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : recognizedText ? (
              <p className="text-gray-800 leading-relaxed">{recognizedText}</p>
            ) : (
              <p className="text-gray-400 italic">Recognized text will appear here...</p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {audioBlob ? 'Audio ready for recognition' : 'No audio recorded'}
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              onClick={handleRecognize}
              disabled={loading || !audioBlob || !isTokenSet}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Recognizing...' : 'Recognize Speech'}
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MicrophoneIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Real-time Recognition</h3>
          <p className="text-sm text-gray-600">Convert speech to text instantly</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">High Accuracy</h3>
          <p className="text-sm text-gray-600">Advanced AI models for precise recognition</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Multi-language</h3>
          <p className="text-sm text-gray-600">Support for multiple Indian languages</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognition;
