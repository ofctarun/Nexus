import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * mlBridge — HTTP bridge to the Python ML microservice (Phase 2).
 * These functions will be called from the chat and document controllers
 * once the ML service is built.
 */

/**
 * Send a document to the ML service for ingestion (chunking + embedding).
 */
export const ingestDocument = async (documentId, filePath, orgId) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ingest`, {
      documentId,
      filePath,
      organizationId: orgId,
    });
    return response.data;
  } catch (error) {
    console.warn('ML Service unavailable for document ingestion:', error.message);
    return { status: 'ml_service_unavailable' };
  }
};

/**
 * Query the ML service with a user's question.
 */
export const queryRAG = async ({ query, organizationId, userRole, sessionContext }) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/query`, {
      query,
      organizationId,
      userRole,
      sessionContext,
    });
    return response.data;
  } catch (error) {
    console.warn('ML Service unavailable for query:', error.message);
    return {
      response: 'The AI service is currently unavailable. Please try again later.',
      sources: [],
      fromCache: false,
      status: 'ml_service_unavailable',
    };
  }
};

/**
 * Transcribe audio using Whisper (Phase 2).
 */
export const transcribeAudio = async (audioBuffer) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/transcribe`, audioBuffer, {
      headers: { 'Content-Type': 'audio/webm' },
    });
    return response.data;
  } catch (error) {
    console.warn('ML Service unavailable for transcription:', error.message);
    return { transcript: '', status: 'ml_service_unavailable' };
  }
};
