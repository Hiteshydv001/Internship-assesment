const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Sends a question to the Q&A bot backend.
 * @param question The user's question.
 * @returns A promise that resolves to the answer object.
 */
export async function askQuestion(question: string): Promise<{ answer: string }> {
  const response = await fetch(`${API_BASE_URL}/qna`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch answer' }));
    throw new Error(errorData.error || 'Failed to fetch answer from API');
  }

  return response.json();
}

/**
 * Sends text to the summarizer backend.
 * @param text The text to be summarized.
 * @returns A promise that resolves to the summary object.
 */
export async function summarizeText(text: string): Promise<{ summary: string }> {
  const response = await fetch(`${API_BASE_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch summary' }));
    throw new Error(errorData.error || 'Failed to fetch summary from API');
  }

  return response.json();
}

/**
 * Sends a prompt to the expense tracker agent.
 * @param prompt The user's command or question (e.g., "add $20 for coffee").
 * @returns A promise that resolves to the agent's response object.
 */
export async function sendTrackerPrompt(prompt: string): Promise<{ response: string }> {
  const response = await fetch(`${API_BASE_URL}/tracker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch response' }));
    throw new Error(errorData.error || 'Failed to fetch response from tracker API');
  }

  return response.json();
}
