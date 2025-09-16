import { useState } from 'react';
import { 
  QuestionMarkCircleIcon, 
  Cog6ToothIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';

const PipelineQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();
  const [selectedTask, setSelectedTask] = useState('translation');
  const [sourceLang, setSourceLang] = useState('hi');
  const [targetLang, setTargetLang] = useState('en');

  const taskTypes = [
    { id: 'translation', name: 'Translation', description: 'Text translation between languages' },
    { id: 'transliteration', name: 'Transliteration', description: 'Script conversion between languages' },
    { id: 'asr', name: 'Speech Recognition', description: 'Convert speech to text' },
    { id: 'tts', name: 'Text to Speech', description: 'Convert text to speech' }
  ];

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தমিழ্' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];

  const handleGetQuestions = async () => {
    if (!authToken.trim()) {
      setError('Please set your Authorization Token first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: selectedTask,
            config: {
              language: selectedTask === 'asr' || selectedTask === 'tts' ? {
                sourceLanguage: sourceLang
              } : {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
              }
            }
          }
        ]
      };

      const response = await bhashiniApi.getPipelineQuestions(payload, authToken);
      
      if (response && response.pipelineInferenceAPIEndPoint) {
        setQuestions([
          {
            question: 'What is the pipeline inference API endpoint?',
            answer: response.pipelineInferenceAPIEndPoint.inferenceApiKey?.value || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
            type: 'endpoint'
          },
          {
            question: 'What is the authorization method?',
            answer: 'Bearer Token in Authorization header',
            type: 'auth'
          },
          {
            question: 'What are the supported languages?',
            answer: response.languages?.join(', ') || 'Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi and more',
            type: 'languages'
          },
          {
            question: 'What is the task configuration?',
            answer: JSON.stringify(response.pipelineInferenceAPIEndPoint.schema || {}, null, 2),
            type: 'config'
          }
        ]);
      } else {
        setError('Failed to retrieve pipeline questions. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to get pipeline questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mb-4">
          <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pipeline Questions</h1>
        <p className="text-lg text-gray-600">Get configuration questions and setup information for API pipelines</p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
          <Cog6ToothIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Pipeline Configuration</h3>
        </div>
        
        {/* Auth Token Manager */}
        <AuthTokenManager />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {taskTypes.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {taskTypes.find(t => t.id === selectedTask)?.description}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Language
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>
          
          {(selectedTask === 'translation' || selectedTask === 'transliteration') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGetQuestions}
            disabled={loading || !isTokenSet}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Getting Questions...' : 'Get Pipeline Questions'}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-indigo-800 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    {item.question}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(item.answer)}
                    className="p-1 text-indigo-600 hover:text-indigo-700"
                    title="Copy answer"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {item.type === 'config' ? (
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{item.answer}</code>
                  </pre>
                ) : (
                  <p className="text-gray-800 leading-relaxed">{item.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block">
            {error}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-400">
          Configure your pipeline above and click "Get Pipeline Questions" to see the results.
        </div>
      )}

      {/* Information Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-800 mb-2">What are Pipeline Questions?</h3>
          <p className="text-sm text-blue-700">
            Pipeline questions help you understand the configuration requirements, 
            endpoints, and parameters needed to use specific Bhashini APIs effectively.
          </p>
        </div>
        
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Cog6ToothIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-green-800 mb-2">Configuration Details</h3>
          <p className="text-sm text-green-700">
            Get detailed information about API endpoints, callback URLs, supported languages, 
            and schema configurations for your selected pipeline task.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PipelineQuestions;
