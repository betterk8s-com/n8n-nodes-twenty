import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM',
		name: 'twentyCrm',
		icon: 'file:twenty.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Connect with Twenty CRM API',
		defaults: {
			name: 'Twenty CRM',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Calendar Event',
						value: 'calendarEvent',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Attachment',
						value: 'attachment',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
					{
						name: 'Custom',
						value: 'custom',
					},
				],
				default: 'person',
			},
			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'company',
							'person',
							'opportunity',
							'task',
							'note',
							'calendarEvent',
							'message',
							'attachment',
							'workflow',
							'custom',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new record',
						action: 'Create a record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a record',
						action: 'Delete a record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a record by ID',
						action: 'Get a record',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many records',
						action: 'Get many records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a record',
						action: 'Update a record',
					},
				],
				default: 'getAll',
			},

			// ----------------------------------------
			//             Common Fields
			// ----------------------------------------
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'ID of the record',
			},

			// ----------------------------------------
			//             Person Fields
			// ----------------------------------------
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'john@example.com',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['person'],
						operation: ['create', 'update'],
					},
				},
			},

			// ----------------------------------------
			//             Company Fields
			// ----------------------------------------
			{
				displayName: 'Company Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Domain',
				name: 'domainName',
				type: 'string',
				default: '',
				placeholder: 'example.com',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Employee Count',
				name: 'employees',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update'],
					},
				},
			},

			// ----------------------------------------
			//             Task Fields
			// ----------------------------------------
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['task', 'note'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['task', 'note'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'To Do',
						value: 'TODO',
					},
					{
						name: 'In Progress',
						value: 'IN_PROGRESS',
					},
					{
						name: 'Done',
						value: 'DONE',
					},
				],
				default: 'TODO',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update'],
					},
				},
			},

			// ----------------------------------------
			//             Opportunity Fields
			// ----------------------------------------
			{
				displayName: 'Opportunity Name',
				name: 'opportunityName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				options: [
					{
						name: 'New',
						value: 'NEW',
					},
					{
						name: 'Qualified',
						value: 'QUALIFIED',
					},
					{
						name: 'Proposal',
						value: 'PROPOSAL',
					},
					{
						name: 'Negotiation',
						value: 'NEGOTIATION',
					},
					{
						name: 'Won',
						value: 'WON',
					},
					{
						name: 'Lost',
						value: 'LOST',
					},
				],
				default: 'NEW',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Probability',
				name: 'probability',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
			},

			// ----------------------------------------
			//             Custom Resource Fields
			// ----------------------------------------
			{
				displayName: 'Custom Resource Name',
				name: 'customResource',
				type: 'string',
				default: '',
				placeholder: 'e.g., blocklists, workflows, views',
				displayOptions: {
					show: {
						resource: ['custom'],
					},
				},
				description: 'Name of the custom resource (plural form)',
			},
			{
				displayName: 'Fields JSON',
				name: 'fieldsJson',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						resource: ['custom'],
						operation: ['create', 'update'],
					},
				},
				description: 'JSON object with field values',
			},

			// ----------------------------------------
			//             Pagination
			// ----------------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'string',
						default: '',
						description: 'Field to order results by',
					},
					{
						displayName: 'Order Direction',
						name: 'orderDirection',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'ASC',
							},
							{
								name: 'Descending',
								value: 'DESC',
							},
						],
						default: 'ASC',
					},
					{
						displayName: 'Filter JSON',
						name: 'filter',
						type: 'json',
						default: '{}',
						description: 'Filter query in JSON format',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('twentyCrmApi');
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Map resource names to API endpoints
		const resourceMap: IDataObject = {
			person: 'people',
			company: 'companies',
			opportunity: 'opportunities',
			task: 'tasks',
			note: 'notes',
			calendarEvent: 'calendarEvents',
			message: 'messages',
			attachment: 'attachments',
			workflow: 'workflows',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let endpoint = resourceMap[resource] as string;
				
				// Handle custom resources
				if (resource === 'custom') {
					endpoint = this.getNodeParameter('customResource', i) as string;
				}

				const options: IDataObject = {
					method: 'GET' as IHttpRequestMethods,
					uri: `${credentials.apiUrl}/rest/${endpoint}`,
					json: true,
				};

				if (operation === 'create') {
					options.method = 'POST';
					const body: IDataObject = {};

					if (resource === 'person') {
						const firstName = this.getNodeParameter('firstName', i, '') as string;
						const lastName = this.getNodeParameter('lastName', i, '') as string;
						
						if (firstName || lastName) {
							body.name = {
								firstName: firstName || '',
								lastName: lastName || '',
							};
						}
						
						const email = this.getNodeParameter('email', i, '') as string;
						if (email) {
							body.emails = {
								primaryEmail: email,
								additionalEmails: [],
							};
						}

						const phone = this.getNodeParameter('phone', i, '') as string;
						if (phone) {
							body.phones = {
								primaryPhoneNumber: phone,
								primaryPhoneCountryCode: 'US',
								additionalPhones: [],
							};
						}

						const jobTitle = this.getNodeParameter('jobTitle', i, '') as string;
						if (jobTitle) body.jobTitle = jobTitle;

						const city = this.getNodeParameter('city', i, '') as string;
						if (city) body.city = city;
					}

					if (resource === 'company') {
						body.name = this.getNodeParameter('name', i) as string;
						
						const domainName = this.getNodeParameter('domainName', i, '') as string;
						if (domainName) {
							body.domainName = {
								primaryLinkLabel: domainName,
								primaryLinkUrl: `https://${domainName}`,
							};
						}

						const employees = this.getNodeParameter('employees', i, 0) as number;
						if (employees > 0) body.employees = employees;

						const address = this.getNodeParameter('address', i, '') as string;
						if (address) {
							body.address = {
								addressStreet1: address,
								addressCity: '',
								addressCountry: '',
							};
						}
					}

					if (resource === 'task') {
						body.title = this.getNodeParameter('title', i) as string;
						const bodyText = this.getNodeParameter('body', i, '') as string;
						if (bodyText) {
							body.bodyV2 = { markdown: bodyText };
						}
						body.status = this.getNodeParameter('status', i, 'TODO') as string;
						const dueAt = this.getNodeParameter('dueAt', i, '') as string;
						if (dueAt) body.dueAt = dueAt;
					}

					if (resource === 'note') {
						body.title = this.getNodeParameter('title', i) as string;
						const bodyText = this.getNodeParameter('body', i, '') as string;
						if (bodyText) {
							body.bodyV2 = { markdown: bodyText };
						}
					}

					if (resource === 'opportunity') {
						body.name = this.getNodeParameter('opportunityName', i) as string;
						body.amount = this.getNodeParameter('amount', i, 0) as number;
						body.stage = this.getNodeParameter('stage', i, 'NEW') as string;
						body.probability = this.getNodeParameter('probability', i, 0) as number;
						const closeDate = this.getNodeParameter('closeDate', i, '') as string;
						if (closeDate) body.closeDate = closeDate;
					}

					if (resource === 'custom') {
						const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}') as string;
						try {
							Object.assign(body, JSON.parse(fieldsJson));
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
						}
					}

					options.body = body;
				}

				if (operation === 'get') {
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${credentials.apiUrl}/rest/${endpoint}/${id}`;
				}

				if (operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
					
					const qs: IDataObject = {};
					
					if (!returnAll) {
						qs.first = limit;
					} else {
						qs.first = 1000;
					}
					
					if (additionalOptions.orderBy) {
						qs.orderBy = additionalOptions.orderBy;
						qs.orderDirection = additionalOptions.orderDirection || 'ASC';
					}
					
					if (additionalOptions.filter) {
						try {
							const filter = typeof additionalOptions.filter === 'string' 
								? JSON.parse(additionalOptions.filter as string) 
								: additionalOptions.filter;
							qs.filter = JSON.stringify(filter);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid filter JSON', { itemIndex: i });
						}
					}
					
					options.qs = qs;
				}

				if (operation === 'update') {
					options.method = 'PATCH';
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${credentials.apiUrl}/rest/${endpoint}/${id}`;
					
					const updateBody: IDataObject = {};
					
					// Similar field handling as create
					if (resource === 'person') {
						const firstName = this.getNodeParameter('firstName', i, '') as string;
						const lastName = this.getNodeParameter('lastName', i, '') as string;
						
						if (firstName || lastName) {
							updateBody.name = {
								firstName: firstName || '',
								lastName: lastName || '',
							};
						}
						
						const email = this.getNodeParameter('email', i, '') as string;
						if (email) {
							updateBody.emails = {
								primaryEmail: email,
								additionalEmails: [],
							};
						}
					}
					
					if (resource === 'custom') {
						const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}') as string;
						try {
							Object.assign(updateBody, JSON.parse(fieldsJson));
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
						}
					}
					
					// Add other resource update fields as needed
					options.body = updateBody;
				}

				if (operation === 'delete') {
					options.method = 'DELETE';
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${credentials.apiUrl}/rest/${endpoint}/${id}`;
				}

				responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'twentyCrmApi',
					options as any,
				);

				// Handle response
				if (operation === 'getAll' && responseData.data) {
					const resourceKey = Object.keys(responseData.data)[0];
					if (responseData.data[resourceKey]) {
						// Handle pagination for returnAll
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll && responseData.pageInfo?.hasNextPage) {
							let allData = responseData.data[resourceKey];
							let nextCursor = responseData.pageInfo.endCursor;
							
							while (nextCursor) {
								const nextOptions = { 
									...options, 
									qs: { ...(options.qs as IDataObject), after: nextCursor } 
								};
								
								const nextResponse = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'twentyCrmApi',
									nextOptions as any,
								);
								
								if (nextResponse.data && nextResponse.data[resourceKey]) {
									allData = allData.concat(nextResponse.data[resourceKey]);
									nextCursor = nextResponse.pageInfo?.hasNextPage ? nextResponse.pageInfo.endCursor : null;
								} else {
									break;
								}
							}
							
							responseData = allData;
						} else {
							responseData = responseData.data[resourceKey];
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { 
							error: error.message,
							resource,
							operation,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}