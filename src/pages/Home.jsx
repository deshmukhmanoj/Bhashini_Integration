import { Link } from 'react-router-dom';
import { 
  LanguageIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      title: 'Neural Machine Translation',
      description: 'Translate text between multiple Indian languages with high accuracy using advanced AI models.',
      icon: LanguageIcon,
      path: '/translation',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Transliteration',
      description: 'Convert text from one script to another while preserving pronunciation and meaning.',
      icon: ChatBubbleLeftRightIcon,
      path: '/transliteration',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Speech Recognition',
      description: 'Convert spoken words into text with support for multiple Indian languages and dialects.',
      icon: MicrophoneIcon,
      path: '/speech-recognition',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Text to Speech',
      description: 'Generate natural-sounding speech from text in various Indian languages and voices.',
      icon: SpeakerWaveIcon,
      path: '/text-to-speech',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Speech to Speech',
      description: 'Complete pipeline for real-time speech translation between different languages.',
      icon: ChatBubbleLeftRightIcon,
      path: '/speech-to-speech',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      title: 'Pipeline Questions',
      description: 'Get configuration questions and setup information for API pipelines.',
      icon: QuestionMarkCircleIcon,
      path: '/pipeline-questions',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <LanguageIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bhashini API Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the power of Indian language AI with Bhashini's comprehensive suite of 
            language processing APIs. From translation to speech synthesis, unlock seamless 
            multilingual communication.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-white rounded-full px-6 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">22+ Indian Languages</span>
          </div>
          <div className="bg-white rounded-full px-6 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Real-time Processing</span>
          </div>
          <div className="bg-white rounded-full px-6 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">High Accuracy</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.path}
              className="group block"
            >
              <div className={`${feature.bgColor} rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border border-gray-100`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className={`text-xl font-bold ${feature.textColor} mb-3`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>Try it now</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">22+</div>
            <div className="text-gray-600">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">API Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">&lt;2s</div>
            <div className="text-gray-600">Average Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">95%+</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose any API above to begin exploring the capabilities of Bhashini's language AI.
          </p>
          <Link
            to="/feedback"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <HeartIcon className="w-5 h-5 mr-2" />
            Share Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
