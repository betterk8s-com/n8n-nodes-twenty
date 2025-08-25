import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TwentyCrmApi implements ICredentialType {
	name = 'twentyCrmApi';
	displayName = 'Twenty CRM API';
	documentationUrl = 'https://twenty.com/developers/section/api-and-webhooks/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://api.twenty.com',
			placeholder: 'https://your-instance.twenty.com',
			description: 'The URL of your Twenty CRM instance',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API Key generated from your Twenty CRM instance',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/rest/metadata/objects',
			method: 'GET',
		},
	};
}