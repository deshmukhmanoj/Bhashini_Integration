import { useState } from 'react';
import { 
  HeartIcon, 
  StarIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import bhashiniApi from '../services/bhashiniApi';
import AuthTokenManager from '../components/AuthTokenManager';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [apiUsed, setApiUsed] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { authToken, isTokenSet } = useAuth();

  const apis = [
    { id: 'translation', name: 'Translation' },
    { id: 'transliteration', name: 'Transliteration' },
    { id: 'asr', name: 'Speech Recognition' },
    { id: 'tts', name: 'Text to Speech' },
    { id: 'speech-to-speech', name: 'Speech to Speech' },
    { id: 'pipeline-questions', name: 'Pipeline Questions' },
    { id: 'general', name: 'General Experience' }
  ];

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please provide a rating');
      return;
    }
    
    if (!feedbackText.trim()) {
      setError('Please provide feedback text');
      return;
    }

    if (!authToken.trim()) {
      setError('Please set your Authorization Token first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        rating: rating,
        feedback: feedbackText,
        email: email,
        apiUsed: apiUsed,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      await bhashiniApi.submitFeedback(payload, authToken);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setFeedbackText('');
    setEmail('');
    setApiUsed('');
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
          </p>
          
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-4">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
        <p className="text-lg text-gray-600">Help us improve Bhashini APIs with your valuable feedback</p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmitFeedback}>
          {/* Auth Token Manager */}
          <div className="px-6 py-4 border-b border-gray-100">
            <AuthTokenManager />
          </div>

          <div className="p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-colors"
                  >
                    {star <= (hoverRating || rating) ? (
                      <StarIconSolid className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {rating > 0 && (
                    <>
                      {rating} star{rating !== 1 ? 's' : ''} - 
                      {rating === 1 && ' Poor'}
                      {rating === 2 && ' Fair'}
                      {rating === 3 && ' Good'}
                      {rating === 4 && ' Very Good'}
                      {rating === 5 && ' Excellent'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* API Used */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which API did you use?
              </label>
              <select
                value={apiUsed}
                onChange={(e) => setApiUsed(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select an API</option>
                {apis.map((api) => (
                  <option key={api.id} value={api.id}>
                    {api.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll only use this to follow up on your feedback if needed
              </p>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Please share your experience, suggestions, or any issues you encountered..."
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Be specific about what worked well and what could be improved
                </p>
                <span className="text-xs text-gray-400">
                  {feedbackText.length} characters
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !rating || !feedbackText.trim() || !isTokenSet}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Feedback Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">Feedback Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Be specific about which features you used and your experience</li>
          <li>• Include details about any errors or issues you encountered</li>
          <li>• Suggest improvements or new features you'd like to see</li>
          <li>• Rate based on accuracy, ease of use, and overall satisfaction</li>
        </ul>
      </div>
    </div>
  );
};

export default Feedback;
