export declare const HOST: string;
export interface Segment { start: number; dur: number; text: string }
export interface CaptionLanguage { code: string; name?: string; kind?: "manual" | "auto" }
export interface Transcript { videoId: string; url: string; title?: string; channel?: string; durationSeconds?: number; viewCount?: number; language: string; captionType: "manual" | "auto"; text: string; data?: Segment[]; srt?: string; vtt?: string; availableLanguages?: CaptionLanguage[] }
export interface Options { lang?: string | string[]; captionType?: "any" | "manual" | "auto"; format?: string | string[]; segments?: boolean }
export declare class YouTubeTranscriptError extends Error { status: number; code: string; details?: unknown }
export declare class YouTubeTranscript {
  constructor(apiKey: string, options?: { fetch?: typeof fetch; host?: string });
  transcript(url: string, options?: Options): Promise<Transcript>;
  languages(url: string): Promise<{ videoId: string; title?: string; availableLanguages: CaptionLanguage[] }>;
  transcripts(urls: string[], options?: Options): Promise<{ requested: number; delivered: number; items: Transcript[]; failed: unknown[] }>;
}
export default YouTubeTranscript;
