import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Translation from './pages/Translation';
import Transliteration from './pages/Transliteration';
import SpeechRecognition from './pages/SpeechRecognition';
import TextToSpeech from './pages/TextToSpeech';
import SpeechToSpeech from './pages/SpeechToSpeech';
import PipelineQuestions from './pages/PipelineQuestions';
import Feedback from './pages/Feedback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/translation" element={<Translation />} />
              <Route path="/transliteration" element={<Transliteration />} />
              <Route path="/speech-recognition" element={<SpeechRecognition />} />
              <Route path="/text-to-speech" element={<TextToSpeech />} />
              <Route path="/speech-to-speech" element={<SpeechToSpeech />} />
              <Route path="/pipeline-questions" element={<PipelineQuestions />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>
        </div>
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
