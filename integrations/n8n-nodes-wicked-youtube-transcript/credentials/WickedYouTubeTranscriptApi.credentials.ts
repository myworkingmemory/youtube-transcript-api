import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class WickedYouTubeTranscriptApi implements ICredentialType {
	name = 'wickedYouTubeTranscriptApi';
	displayName = 'Wicked YouTube Transcript (RapidAPI) API';
	documentationUrl = 'https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper';
	properties: INodeProperties[] = [
		{ displayName: 'RapidAPI Key', name: 'apiKey', type: 'string', typeOptions: { password: true }, default: '', description: 'Your key from rapidapi.com (50 transcripts a month free).' },
	];
	authenticate: IAuthenticateGeneric = { type: 'generic', properties: { headers: { 'X-RapidAPI-Key': '={{$credentials.apiKey}}', 'X-RapidAPI-Host': 'wicked-youtube-transcript-scraper.p.rapidapi.com' } } };
	test: ICredentialTestRequest = { request: { baseURL: 'https://wicked-youtube-transcript-scraper.p.rapidapi.com', url: '/languages?url=jNQXAC9IVRw' } };
}
