import { AskResponse, BackendStatus } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  checkStatus: async (): Promise<BackendStatus> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/`);
      if (!resp.ok) throw new Error("Backend offline");
      const data = await resp.json();
      return { online: true, message: data.message };
    } catch (error) {
      return { online: false, message: "Backend unreachable" };
    }
  },

  ask: async (query: string): Promise<AskResponse> => {
    const resp = await fetch(`${API_BASE_URL}/ask?query=${encodeURIComponent(query)}`);
    if (!resp.ok) throw new Error("Failed to get answer");
    return resp.json();
  },

  askStream: async (query: string, onToken: (token: string) => void) => {
    const resp = await fetch(`${API_BASE_URL}/ask-stream?query=${encodeURIComponent(query)}`);
    if (!resp.ok) throw new Error("Failed to start stream");
    
    const reader = resp.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const token = decoder.decode(value, { stream: true });
      onToken(token);
    }
  }
};
