import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins = [];
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (apiKey) {
  plugins.push(googleAI({apiKey}));
} else {
  console.warn(
    '*********************************************************************************************************\n' +
    '** WARNING: GEMINI_API_KEY is not set. Genkit AI features will be disabled.                            **\n' +
    '** To enable AI features, please get a key from https://aistudio.google.com/app/apikey and add it     **\n' +
    '** to your .env file.                                                                                  **\n' +
    '*********************************************************************************************************'
  );
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
