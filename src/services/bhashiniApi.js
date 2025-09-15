import axios from 'axios';

// Base configuration - Direct Bhashini API endpoints
const BHASHINI_INFERENCE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const ULCA_BASE_URL = 'https://meity-auth.ulcacontrib.org';
const MODEL_PIPELINE_ENDPOINT = '/ulca/apis/v0/model/getModelsPipeline';
const QUESTIONS_ENDPOINT = '/ulca/apis/v0/model/getModelsPipeline';

// API service class for Bhashini APIs
class BhashiniApiService {
  constructor() {
    this.apiClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Direct Translation API (like your VB.NET implementation)
  async translateText(sourceText, sourceLang, targetLang, authToken) {
    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: "translation",
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
              },
              serviceId: "ai4bharat/indictrans-v2-all-gpu--t4"
            }
          }
        ],
        inputData: {
          input: [
            {
              source: sourceText
            }
          ]
        }
      };

      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Configuration APIs (keeping for backward compatibility)
  async getConfigWithRequest(payload, userID, ulcaApiKey) {
    try {
      const response = await this.apiClient.post(
        `${ULCA_BASE_URL}${MODEL_PIPELINE_ENDPOINT}`,
        payload,
        {
          headers: {
            userID: userID,
            ulcaApiKey: ulcaApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getConfigWithoutRequest(payload, ulcaApiKey) {
    try {
      const response = await this.apiClient.post(
        `${ULCA_BASE_URL}${MODEL_PIPELINE_ENDPOINT}`,
        payload,
        {
          headers: {
            ulcaApiKey: ulcaApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Transliteration Configuration APIs
  async getTransliterationConfigWithRequest(payload, ulcaApiKey) {
    try {
      const response = await this.apiClient.post(
        `${ULCA_BASE_URL}${MODEL_PIPELINE_ENDPOINT}`,
        payload,
        {
          headers: {
            ulcaApiKey: ulcaApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransliterationConfigWithoutRequest(payload, ulcaApiKey) {
    try {
      const response = await this.apiClient.post(
        `${ULCA_BASE_URL}${MODEL_PIPELINE_ENDPOINT}`,
        payload,
        {
          headers: {
            ulcaApiKey: ulcaApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Direct Transliteration API
  async transliterateText(sourceText, sourceLang, targetLang, authToken) {
    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: "transliteration",
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
              }
            }
          }
        ],
        inputData: {
          input: [
            {
              source: sourceText
            }
          ]
        }
      };

      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Direct ASR API
  async speechToText(audioContent, sourceLang, authToken) {
    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: sourceLang
              },
              serviceId: "ai4bharat/conformer-hi-gpu--t4"
            }
          }
        ],
        inputData: {
          audio: [
            {
              audioContent: audioContent
            }
          ]
        }
      };

      console.log('ASR Payload:', JSON.stringify(payload, null, 2));

      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('ASR Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('ASR Error:', error);
      throw this.handleError(error);
    }
  }

  // Direct TTS API
  async textToSpeech(sourceText, sourceLang, authToken, gender = 'female') {
    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: "tts",
            config: {
              language: {
                sourceLanguage: sourceLang
              },
              gender: gender
            }
          }
        ],
        inputData: {
          input: [
            {
              source: sourceText
            }
          ]
        }
      };

      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Direct Speech-to-Speech API
  async speechToSpeech(audioContent, sourceLang, targetLang, authToken, gender = 'female') {
    try {
      const payload = {
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: sourceLang
              },
              serviceId: "ai4bharat/conformer-hi-gpu--t4"
            }
          },
          {
            taskType: "translation",
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
              },
              serviceId: "ai4bharat/indictrans-v2-all-gpu--t4"
            }
          },
          {
            taskType: "tts",
            config: {
              language: {
                sourceLanguage: targetLang
              },
              gender: gender,
              serviceId: "ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4"
            }
          }
        ],
        inputData: {
          audio: [
            {
              audioContent: audioContent
            }
          ]
        }
      };

      console.log('Speech-to-Speech Payload:', JSON.stringify(payload, null, 2));

      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Speech-to-Speech Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Speech-to-Speech Error:', error);
      throw this.handleError(error);
    }
  }

  // Legacy Compute APIs (keeping for backward compatibility)
  async computeASR(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async computeNMT(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async computeTTS(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async computeTransliteration(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Combined Compute APIs
  async computeASRNMT(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async computeNMTTTS(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async computeASRNMTTTS(callbackUrl, payload) {
    try {
      const response = await this.apiClient.post(callbackUrl, payload, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility APIs
  async getPipelineQuestions(payload, authToken) {
    try {
      const response = await this.apiClient.post(
        `${ULCA_BASE_URL}${QUESTIONS_ENDPOINT}`,
        payload,
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitFeedback(payload, authToken) {
    try {
      const response = await this.apiClient.post(BHASHINI_INFERENCE_URL, payload, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || 'API request failed',
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Network error - no response received',
        data: null,
      };
    } else {
      return {
        status: -1,
        message: error.message || 'Unknown error occurred',
        data: null,
      };
    }
  }
}

export default new BhashiniApiService();
