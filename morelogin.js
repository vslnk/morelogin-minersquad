// Importing necessary modules
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config('.env');

// Loading environment variables from .env file
const { APP_ID, SECRET_KEY, BASE_URL, ENCRYPT_KEY } = process.env;

/**
 * Generates request headers with necessary authentication details.
 * @param {string} appId - Application ID.
 * @param {string} secretKey - Secret key for authentication.
 * @returns {Object} Headers object.
 */
function requestHeader(appId, secretKey) {
  const nonceId = generateNonceId();
  const sign = generateAuthorization(appId, nonceId, secretKey);
  return {
    'Content-Type': 'application/json',
    'X-Api-Id': appId,
    'X-Nonce-Id': nonceId,
    'Authorization': sign
  };
}

/**
 * Generates a unique Nonce ID for each request (Timestamp + Random String).
 * @returns {string} Nonce ID.
 */
function generateNonceId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}:${randomStr}`;
}

/**
 * Generates an authorization signature using MD5 hashing.
 * @param {string} apiId - Application ID.
 * @param {string} nonceId - Nonce ID generated for the request.
 * @param {string} secretKey - Secret key for hashing.
 * @returns {string} Generated signature.
 */
function generateAuthorization(apiId, nonceId, secretKey) {
  const signStr = apiId + nonceId + secretKey;
  return crypto.createHash('md5').update(signStr).digest('hex');
}

/**
 * Sends a POST request to the specified URL.
 * @param {string} url - The URL to send the request to.
 * @param {Object} body - The request payload.
 * @param {Object} headers - The request headers.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function postRequest(url, body, headers) {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  return await response.json();
}

/**
 * Starts an environment profile.
 * @param {string} envId - The ID of the environment to start.
 * @returns {Promise<string>} The local URL to interact with the environment.
 */
export async function startEnv(envId) {
  const requestPath = `${BASE_URL}/api/env/start`;
  const data = { envId, encryptKey: ENCRYPT_KEY };
  const headers = requestHeader(APP_ID, SECRET_KEY);

  const result = await postRequest(requestPath, data, headers);
  if (result.code !== 0) {
    throw new Error(`Error starting environment: ${result.msg}`);
  }

  console.log('Environment started successfully:', result.data);
  return `http://127.0.0.1:${result.data.debugPort}`;
}

/**
 * Stops an environment profile.
 * @param {string} envId - The ID of the environment to stop.
 * @returns {Promise<boolean>} True if the environment was stopped successfully, otherwise false.
 */
export async function stopEnv(envId) {
  const requestPath = `${BASE_URL}/api/env/close`;
  const data = { envId };
  const headers = requestHeader(APP_ID, SECRET_KEY);

  const result = await postRequest(requestPath, data, headers);
  if (result.code === -1) {
    console.error('Error stopping environment:', result.msg);
    return false;
  }
  return true;
}
