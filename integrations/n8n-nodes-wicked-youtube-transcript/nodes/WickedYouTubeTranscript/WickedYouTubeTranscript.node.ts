import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const HOST = 'wicked-youtube-transcript-scraper.p.rapidapi.com';

export class WickedYouTubeTranscript implements INodeType {
	description: INodeTypeDescription = {
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const out: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			try {
				let response: unknown;
				if (operation === 'languages') {
					const url = this.getNodeParameter('url', i) as string;
					response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'GET', url: '/languages', qs: { url }, json: true });
				} else {
					const lang = this.getNodeParameter('lang', i) as string;
					const captionType = this.getNodeParameter('captionType', i) as string;
					const format = (this.getNodeParameter('format', i) as string[]).join(',');
					const segments = this.getNodeParameter('segments', i) as boolean;
					if (operation === 'transcript') {
						const url = this.getNodeParameter('url', i) as string;
						response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'GET', url: '/transcript', qs: { url, lang, captionType, format: format || undefined, segments }, json: true });
					} else {
						const urls = (this.getNodeParameter('urls', i) as string).split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
						if (urls.length > 25) throw new NodeOperationError(this.getNode(), 'At most 25 URLs per call; split the list.', { itemIndex: i });
						response = await this.helpers.httpRequestWithAuthentication.call(this, 'wickedYouTubeTranscriptApi', { method: 'POST', url: '/transcripts', body: { urls, lang, captionType, format: format || undefined, segments }, json: true });
					}
				}
				out.push({ json: response as IDataObject, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) { out.push({ json: { error: (error as Error).message }, pairedItem: { item: i } }); continue; }
				throw error;
			}
		}
		return [out];
	}
}
