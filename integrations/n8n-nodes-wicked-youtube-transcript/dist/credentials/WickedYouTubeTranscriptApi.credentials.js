"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WickedYouTubeTranscriptApi = void 0;
class WickedYouTubeTranscriptApi {
    constructor() {
        this.name = 'wickedYouTubeTranscriptApi';
        this.displayName = 'Wicked YouTube Transcript (RapidAPI) API';
        this.documentationUrl = 'https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper';
        this.properties = [
            { displayName: 'RapidAPI Key', name: 'apiKey', type: 'string', typeOptions: { password: true }, default: '', description: 'Your key from rapidapi.com (50 transcripts a month free).' },
        ];
        this.authenticate = { type: 'generic', properties: { headers: { 'X-RapidAPI-Key': '={{$credentials.apiKey}}', 'X-RapidAPI-Host': 'wicked-youtube-transcript-scraper.p.rapidapi.com' } } };
        this.test = { request: { baseURL: 'https://wicked-youtube-transcript-scraper.p.rapidapi.com', url: '/languages?url=jNQXAC9IVRw' } };
    }
}
exports.WickedYouTubeTranscriptApi = WickedYouTubeTranscriptApi;
