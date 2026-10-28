"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WickedYouTubeTranscript = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const HOST = 'wicked-youtube-transcript-scraper.p.rapidapi.com';
class WickedYouTubeTranscript {
    constructor() {
        this.description = {
            displayName: 'YouTube Transcript',
            name: 'wickedYouTubeTranscript',
            icon: 'file:youtubeTranscript.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Transcript, timestamped segments, SRT, WebVTT and caption languages of any public YouTube video (Wicked YouTube Transcript Scraper on RapidAPI)',
            defaults: { name: 'YouTube Transcript' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'wickedYouTubeTranscriptApi', required: true }],
            requestDefaults: { baseURL: 'https://' + HOST },
            properties: [
                { displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true, default: 'transcript', options: [
                        { name: 'Get Transcript', value: 'transcript', action: 'Get the transcript of one video' },
                        { name: 'List Caption Languages (Free)', value: 'languages', action: 'List caption languages and video facts' },
                        { name: 'Get Transcripts (Batch of 25)', value: 'transcripts', action: 'Get transcripts for up to 25 videos' },
                    ] },
                { displayName: 'Video URL or ID', name: 'url', type: 'string', default: '', required: true, placeholder: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', displayOptions: { show: { operation: ['transcript', 'languages'] } } },
                { displayName: 'Video URLs or IDs', name: 'urls', type: 'string', default: '', required: true, description: 'Up to 25, separated by commas or new lines', displayOptions: { show: { operation: ['transcripts'] } } },
                { displayName: 'Language', name: 'lang', type: 'string', default: 'en', description: 'ISO 639-1 code, or a priority list such as es,en', displayOptions: { show: { operation: ['transcript', 'transcripts'] } } },
                { displayName: 'Caption Type', name: 'captionType', type: 'options', default: 'any', options: [{ name: 'Any (Manual First)', value: 'any' }, { name: 'Manual Only', value: 'manual' }, { name: 'Auto-Generated Only', value: 'auto' }], displayOptions: { show: { operation: ['transcript', 'transcripts'] } } },
                { displayName: 'Subtitle Formats', name: 'format', type: 'multiOptions', default: [], options: [{ name: 'SRT', value: 'srt' }, { name: 'WebVTT', value: 'vtt' }], description: 'Free; adds srt and vtt text fields', displayOptions: { show: { operation: ['transcript', 'transcripts'] } } },
                { displayName: 'Include Timestamped Segments', name: 'segments', type: 'boolean', default: true, displayOptions: { show: { operation: ['transcript', 'transcripts'] } } },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const out = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            try {
                let response;
                if (operation === 'languages') {
                    const url = this.getNodeParameter('url', i);
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'GET', url: '/languages', qs: { url }, json: true });
                }
                else {
                    const lang = this.getNodeParameter('lang', i);
                    const captionType = this.getNodeParameter('captionType', i);
                    const format = this.getNodeParameter('format', i).join(',');
                    const segments = this.getNodeParameter('segments', i);
                    if (operation === 'transcript') {
                        const url = this.getNodeParameter('url', i);
                        response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'GET', url: '/transcript', qs: { url, lang, captionType, format: format || undefined, segments }, json: true });
                    }
                    else {
                        const urls = this.getNodeParameter('urls', i).split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
                        if (urls.length > 25)
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At most 25 URLs per call; split the list.', { itemIndex: i });
                        response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'POST', url: '/transcripts', body: { urls, lang, captionType, format: format || undefined, segments }, json: true });
                    }
                }
                out.push({ json: response, pairedItem: { item: i } });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw error;
            }
        }
        return [out];
    }
}
exports.WickedYouTubeTranscript = WickedYouTubeTranscript;
