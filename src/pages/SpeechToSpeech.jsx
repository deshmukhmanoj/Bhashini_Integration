import { useState, useRef } from 'react';
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  PlayIcon, 
  PauseIcon,
  StopIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SpeechToSpeech = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('hi');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தমিழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

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

  const handleSpeechToSpeech = async () => {
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
    setRecognizedText('');
    setTranslatedText('');
    setOutputAudioUrl('');

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        try {
          const response = await bhashiniApi.speechToSpeech(base64Audio, sourceLang, targetLang, authToken, 'female');
          
          // Handle different possible response structures
          if (response && response.pipelineResponse) {
            // Extract ASR result
            if (response.pipelineResponse[0] && response.pipelineResponse[0].output) {
              const asrOutput = response.pipelineResponse[0].output[0];
              if (asrOutput && asrOutput.source) {
                setRecognizedText(asrOutput.source);
              }
            }
            
            // Extract translation result
            if (response.pipelineResponse[1] && response.pipelineResponse[1].output) {
              const translationOutput = response.pipelineResponse[1].output[0];
              if (translationOutput && translationOutput.target) {
                setTranslatedText(translationOutput.target);
              }
            }
            
            // Extract TTS result - check multiple possible structures
            if (response.pipelineResponse[2]) {
              const ttsResponse = response.pipelineResponse[2];
              let audioContent = null;
              
              if (ttsResponse.audio && ttsResponse.audio[0] && ttsResponse.audio[0].audioContent) {
                audioContent = ttsResponse.audio[0].audioContent;
              } else if (ttsResponse.output && ttsResponse.output[0] && ttsResponse.output[0].audioContent) {
                audioContent = ttsResponse.output[0].audioContent;
              } else if (ttsResponse.audioContent) {
                audioContent = ttsResponse.audioContent;
              }
              
              if (audioContent) {
                try {
                  const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/wav' });
                  const audioUrl = URL.createObjectURL(audioBlob);
                  setOutputAudioUrl(audioUrl);
                } catch (audioError) {
                  console.error('Audio processing error:', audioError);
                  setError('Failed to process generated audio.');
                }
              }
            }
          } else {
            console.log('Full response:', response);
            setError('Speech-to-speech conversion failed. Please check your configuration and try again.');
          }
        } catch (err) {
          console.error('Speech-to-speech error:', err);
          setError(err.message || 'Speech-to-speech conversion failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      setError('Failed to process audio file.');
      setLoading(false);
    }
  };

  const playOutputAudio = () => {
    if (outputAudioUrl) {
      const audio = new Audio(outputAudioUrl);
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

  const clearAll = () => {
    setAudioBlob(null);
    setOutputAudioUrl('');
    setRecognizedText('');
    setTranslatedText('');
    setError('');
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl mb-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Speech to Speech</h1>
        <p className="text-lg text-gray-600">Complete pipeline for real-time speech translation</p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
          <Cog6ToothIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">API Configuration</h3>
        </div>
        

        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Source Language</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            className="mx-4 p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            title="Swap languages"
          >
            <ArrowsRightLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex justify-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recording Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-pink-50 px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-pink-800">Step 1: Record Speech</h3>
          </div>
          
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-pink-500 hover:bg-pink-600'
              }`}>
                {isRecording ? (
                  <StopIcon className="w-10 h-10 text-white" />
                ) : (
                  <MicrophoneIcon className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Stop Recording
                </button>
              )}
              
              {audioBlob && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={clearAll}
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
               'Click to start recording in ' + languages.find(l => l.code === sourceLang)?.name}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-green-800">Step 2: Translated Speech</h3>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : outputAudioUrl ? (
              <div className="text-center">
                <div className="mb-4">
                  <button
                    onClick={isPlaying ? pauseAudio : playOutputAudio}
                    className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors mx-auto"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-8 h-8" />
                    ) : (
                      <PlayIcon className="w-8 h-8" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Translated speech in {languages.find(l => l.code === targetLang)?.name}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Translated speech will appear here...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Processing Results</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Recognized Text */}
          <div className="p-6 border-r border-gray-100">
            <h4 className="font-medium text-gray-800 mb-3">Recognized Text</h4>
            <div className="min-h-24 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              {recognizedText ? (
                <p className="text-gray-800">{recognizedText}</p>
              ) : (
                <p className="text-gray-400 italic">Original speech will be recognized here...</p>
              )}
            </div>
          </div>

          {/* Translated Text */}
          <div className="p-6">
            <h4 className="font-medium text-gray-800 mb-3">Translated Text</h4>
            <div className="min-h-24 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              {translatedText ? (
                <p className="text-gray-800">{translatedText}</p>
              ) : (
                <p className="text-gray-400 italic">Translation will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {audioBlob ? 'Audio ready for processing' : 'No audio recorded'}
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={handleSpeechToSpeech}
            disabled={loading || !audioBlob || !isTokenSet}
            className="px-8 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Processing...' : 'Convert Speech'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MicrophoneIcon className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Speech Recognition</h3>
          <p className="text-sm text-gray-600">Convert speech to text with high accuracy</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowsRightLeftIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Translation</h3>
          <p className="text-sm text-gray-600">Translate between Indian languages</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Speech Synthesis</h3>
          <p className="text-sm text-gray-600">Generate natural speech output</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechToSpeech;
