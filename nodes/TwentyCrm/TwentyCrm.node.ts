import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	IHttpRequestMethods,
	NodeConnectionType,
	IBinaryData,
} from 'n8n-workflow';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM',
		name: 'twentyCrm',
		icon: 'file:twenty.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Complete integration with Twenty CRM API - All features',
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
			{
				displayName: 'API Type',
				name: 'apiType',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'REST',
						value: 'rest',
						description: 'Use REST API for standard CRUD operations',
					},
					{
						name: 'GraphQL',
						value: 'graphql',
						description: 'Use GraphQL for complex queries',
					},
					{
						name: 'Metadata',
						value: 'metadata',
						description: 'Access metadata and schema information',
					},
					{
						name: 'Webhooks',
						value: 'webhooks',
						description: 'Manage webhooks for event notifications',
					},
					{
						name: 'Batch',
						value: 'batch',
						description: 'Perform batch operations',
					},
				],
				default: 'rest',
			},
			// REST API Resources
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						apiType: ['rest'],
					},
				},
				options: [
					{
						name: 'Attachment',
						value: 'attachment',
					},
					{
						name: 'Blocklist',
						value: 'blocklist',
					},
					{
						name: 'Calendar Channel',
						value: 'calendarChannel',
					},
					{
						name: 'Calendar Channel Event Association',
						value: 'calendarChannelEventAssociation',
					},
					{
						name: 'Calendar Event',
						value: 'calendarEvent',
					},
					{
						name: 'Calendar Event Participant',
						value: 'calendarEventParticipant',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Connected Account',
						value: 'connectedAccount',
					},
					{
						name: 'Favorite',
						value: 'favorite',
					},
					{
						name: 'Favorite Folder',
						value: 'favoriteFolder',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Message Channel',
						value: 'messageChannel',
					},
					{
						name: 'Message Channel Message Association',
						value: 'messageChannelMessageAssociation',
					},
					{
						name: 'Message Folder',
						value: 'messageFolder',
					},
					{
						name: 'Message Participant',
						value: 'messageParticipant',
					},
					{
						name: 'Message Thread',
						value: 'messageThread',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Note Target',
						value: 'noteTarget',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Task Target',
						value: 'taskTarget',
					},
					{
						name: 'Timeline Activity',
						value: 'timelineActivity',
					},
					{
						name: 'View',
						value: 'view',
					},
					{
						name: 'View Field',
						value: 'viewField',
					},
					{
						name: 'View Filter',
						value: 'viewFilter',
					},
					{
						name: 'View Filter Group',
						value: 'viewFilterGroup',
					},
					{
						name: 'View Group',
						value: 'viewGroup',
					},
					{
						name: 'View Sort',
						value: 'viewSort',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
					{
						name: 'Workflow Automated Trigger',
						value: 'workflowAutomatedTrigger',
					},
					{
						name: 'Workflow Run',
						value: 'workflowRun',
					},
					{
						name: 'Workflow Version',
						value: 'workflowVersion',
					},
					{
						name: 'Workspace Member',
						value: 'workspaceMember',
					},
					{
						name: 'Custom Object',
						value: 'customObject',
					},
				],
				default: 'person',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						apiType: ['rest'],
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
					{
						name: 'Search',
						value: 'search',
						description: 'Search records using full-text search',
						action: 'Search records',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Update or create a record',
						action: 'Upsert a record',
					},
				],
				default: 'getAll',
			},
			// Webhook Operations
			{
				displayName: 'Webhook Operation',
				name: 'webhookOperation',
				type: 'options',
				displayOptions: {
					show: {
						apiType: ['webhooks'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new webhook',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a webhook',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a webhook',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all webhooks',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a webhook',
					},
				],
				default: 'getAll',
			},
			// Webhook Fields
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						apiType: ['webhooks'],
						webhookOperation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'https://your-domain.com/webhook',
				description: 'URL to receive webhook notifications',
			},
			{
				displayName: 'Events',
				name: 'webhookEvents',
				type: 'multiOptions',
				displayOptions: {
					show: {
						apiType: ['webhooks'],
						webhookOperation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'Company Created',
						value: 'company.created',
					},
					{
						name: 'Company Updated',
						value: 'company.updated',
					},
					{
						name: 'Company Deleted',
						value: 'company.deleted',
					},
					{
						name: 'Person Created',
						value: 'person.created',
					},
					{
						name: 'Person Updated',
						value: 'person.updated',
					},
					{
						name: 'Person Deleted',
						value: 'person.deleted',
					},
					{
						name: 'Opportunity Created',
						value: 'opportunity.created',
					},
					{
						name: 'Opportunity Updated',
						value: 'opportunity.updated',
					},
					{
						name: 'Task Created',
						value: 'task.created',
					},
					{
						name: 'Task Updated',
						value: 'task.updated',
					},
					{
						name: 'Task Completed',
						value: 'task.completed',
					},
				],
				default: [],
				description: 'Events that trigger the webhook',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						apiType: ['webhooks'],
						webhookOperation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'ID of the webhook',
			},
			// Batch Operations
			{
				displayName: 'Batch Operation',
				name: 'batchOperation',
				type: 'options',
				displayOptions: {
					show: {
						apiType: ['batch'],
					},
				},
				options: [
					{
						name: 'Create Multiple',
						value: 'createMultiple',
						description: 'Create multiple records at once',
					},
					{
						name: 'Update Multiple',
						value: 'updateMultiple',
						description: 'Update multiple records at once',
					},
					{
						name: 'Delete Multiple',
						value: 'deleteMultiple',
						description: 'Delete multiple records at once',
					},
					{
						name: 'Mixed Operations',
						value: 'mixed',
						description: 'Perform different operations in one request',
					},
				],
				default: 'createMultiple',
			},
			{
				displayName: 'Batch Resource',
				name: 'batchResource',
				type: 'options',
				displayOptions: {
					show: {
						apiType: ['batch'],
					},
				},
				options: [
					{
						name: 'Companies',
						value: 'companies',
					},
					{
						name: 'People',
						value: 'people',
					},
					{
						name: 'Tasks',
						value: 'tasks',
					},
					{
						name: 'Notes',
						value: 'notes',
					},
					{
						name: 'Opportunities',
						value: 'opportunities',
					},
				],
				default: 'people',
			},
			{
				displayName: 'Batch Data',
				name: 'batchData',
				type: 'json',
				displayOptions: {
					show: {
						apiType: ['batch'],
					},
				},
				default: '[\n  {"name": {"firstName": "John", "lastName": "Doe"}},\n  {"name": {"firstName": "Jane", "lastName": "Smith"}}\n]',
				description: 'Array of records to process',
			},
			// GraphQL Operations
			{
				displayName: 'GraphQL Query',
				name: 'graphqlQuery',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						apiType: ['graphql'],
					},
				},
				default: '',
				placeholder: '{\n  people(first: 10) {\n    edges {\n      node {\n        id\n        name {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n}',
				description: 'GraphQL query to execute',
			},
			{
				displayName: 'GraphQL Variables',
				name: 'graphqlVariables',
				type: 'json',
				displayOptions: {
					show: {
						apiType: ['graphql'],
					},
				},
				default: '{}',
				description: 'Variables for the GraphQL query',
			},
			// Metadata Operations
			{
				displayName: 'Metadata Operation',
				name: 'metadataOperation',
				type: 'options',
				displayOptions: {
					show: {
						apiType: ['metadata'],
					},
				},
				options: [
					{
						name: 'Get All Objects',
						value: 'getAllObjects',
						description: 'Get all object types and their metadata',
					},
					{
						name: 'Get Object',
						value: 'getObject',
						description: 'Get metadata for a specific object',
					},
					{
						name: 'Get Fields',
						value: 'getFields',
						description: 'Get fields for a specific object',
					},
					{
						name: 'Get Relations',
						value: 'getRelations',
						description: 'Get relations for a specific object',
					},
					{
						name: 'Create Custom Field',
						value: 'createField',
						description: 'Create a custom field for an object',
					},
					{
						name: 'Update Custom Field',
						value: 'updateField',
						description: 'Update a custom field',
					},
				],
				default: 'getAllObjects',
			},
			// Custom Field Creation
			{
				displayName: 'Field Type',
				name: 'fieldType',
				type: 'options',
				displayOptions: {
					show: {
						apiType: ['metadata'],
						metadataOperation: ['createField'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'TEXT',
					},
					{
						name: 'Number',
						value: 'NUMBER',
					},
					{
						name: 'Boolean',
						value: 'BOOLEAN',
					},
					{
						name: 'Date',
						value: 'DATE',
					},
					{
						name: 'DateTime',
						value: 'DATE_TIME',
					},
					{
						name: 'Select',
						value: 'SELECT',
					},
					{
						name: 'Multi-Select',
						value: 'MULTI_SELECT',
					},
					{
						name: 'Currency',
						value: 'CURRENCY',
					},
					{
						name: 'Link',
						value: 'LINK',
					},
					{
						name: 'Email',
						value: 'EMAIL',
					},
					{
						name: 'Phone',
						value: 'PHONE',
					},
				],
				default: 'TEXT',
			},
			{
				displayName: 'Field Name',
				name: 'fieldName',
				type: 'string',
				displayOptions: {
					show: {
						apiType: ['metadata'],
						metadataOperation: ['createField', 'updateField'],
					},
				},
				default: '',
				description: 'Name of the custom field',
			},
			{
				displayName: 'Field Label',
				name: 'fieldLabel',
				type: 'string',
				displayOptions: {
					show: {
						apiType: ['metadata'],
						metadataOperation: ['createField', 'updateField'],
					},
				},
				default: '',
				description: 'Display label for the field',
			},
			{
				displayName: 'Object Name',
				name: 'objectName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['customObject'],
					},
					hide: {
						apiType: ['graphql', 'metadata', 'webhooks', 'batch'],
					},
				},
				placeholder: 'e.g., products',
				description: 'The name of the custom object in Twenty CRM',
			},
			{
				displayName: 'Object Name',
				name: 'metadataObjectName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						apiType: ['metadata'],
						metadataOperation: ['getObject', 'getFields', 'getRelations', 'createField', 'updateField'],
					},
				},
				placeholder: 'e.g., person',
				description: 'The name of the object to get metadata for',
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						apiType: ['rest'],
					},
				},
				default: '',
				description: 'The ID of the record',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['search'],
						apiType: ['rest'],
					},
				},
				default: '',
				description: 'Full-text search query',
			},
			// Relation Management
			{
				displayName: 'Relation Type',
				name: 'relationType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['noteTarget', 'taskTarget'],
						operation: ['create'],
					},
				},
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
				],
				default: 'person',
				description: 'Type of record to relate to',
			},
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['noteTarget', 'taskTarget'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'ID of the source record (note or task)',
			},
			{
				displayName: 'Target ID',
				name: 'targetId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['noteTarget', 'taskTarget'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'ID of the target record to relate to',
			},
			// Task-specific fields
			{
				displayName: 'Task Fields',
				name: 'taskFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Task title',
					},
					{
						displayName: 'Body',
						name: 'bodyV2',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Task description (use JSON format: {"markdown": "text"})',
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
						description: 'Task status',
					},
					{
						displayName: 'Due Date',
						name: 'dueAt',
						type: 'dateTime',
						default: '',
						description: 'Task due date',
					},
					{
						displayName: 'Assignee ID',
						name: 'assigneeId',
						type: 'string',
						default: '',
						description: 'ID of the workspace member to assign the task to',
					},
				],
			},
			// Note-specific fields
			{
				displayName: 'Note Fields',
				name: 'noteFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['note'],
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Note title',
					},
					{
						displayName: 'Body',
						name: 'bodyV2',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Note content (use JSON format: {"markdown": "text"})',
					},
				],
			},
			// Calendar Event fields
			{
				displayName: 'Calendar Event Fields',
				name: 'calendarEventFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['calendarEvent'],
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Event title',
					},
					{
						displayName: 'Start Date',
						name: 'startsAt',
						type: 'dateTime',
						default: '',
						description: 'Event start date and time',
					},
					{
						displayName: 'End Date',
						name: 'endsAt',
						type: 'dateTime',
						default: '',
						description: 'Event end date and time',
					},
					{
						displayName: 'Is Full Day',
						name: 'isFullDay',
						type: 'boolean',
						default: false,
						description: 'Whether this is a full day event',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Event description',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Event location',
					},
					{
						displayName: 'Conference Link',
						name: 'conferenceLink',
						type: 'string',
						default: '',
						description: 'Meeting/conference link',
					},
					{
						displayName: 'Recurring',
						name: 'recurring',
						type: 'boolean',
						default: false,
						description: 'Whether this is a recurring event',
					},
				],
			},
			// Message fields
			{
				displayName: 'Message Fields',
				name: 'messageFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						default: '',
						description: 'Message subject',
					},
					{
						displayName: 'Body',
						name: 'body',
						type: 'string',
						typeOptions: {
							rows: 6,
						},
						default: '',
						description: 'Message body',
					},
					{
						displayName: 'Thread ID',
						name: 'messageThreadId',
						type: 'string',
						default: '',
						description: 'ID of the message thread',
					},
					{
						displayName: 'Channel ID',
						name: 'messageChannelId',
						type: 'string',
						default: '',
						description: 'ID of the message channel',
					},
				],
			},
			// Workflow fields
			{
				displayName: 'Workflow Fields',
				name: 'workflowFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['workflow', 'workflowAutomatedTrigger'],
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Workflow name',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Workflow description',
					},
					{
						displayName: 'Trigger Type',
						name: 'triggerType',
						type: 'options',
						options: [
							{
								name: 'Record Created',
								value: 'RECORD_CREATED',
							},
							{
								name: 'Record Updated',
								value: 'RECORD_UPDATED',
							},
							{
								name: 'Record Deleted',
								value: 'RECORD_DELETED',
							},
							{
								name: 'Field Changed',
								value: 'FIELD_CHANGED',
							},
							{
								name: 'Scheduled',
								value: 'SCHEDULED',
							},
							{
								name: 'Manual',
								value: 'MANUAL',
							},
						],
						default: 'RECORD_CREATED',
					},
					{
						displayName: 'Active',
						name: 'isActive',
						type: 'boolean',
						default: true,
						description: 'Whether the workflow is active',
					},
					{
						displayName: 'Actions',
						name: 'actions',
						type: 'json',
						default: '[]',
						description: 'Workflow actions in JSON format',
					},
				],
			},
			// Generic fields for other resources
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						apiType: ['rest'],
					},
					hide: {
						resource: ['task', 'note', 'calendarEvent', 'message', 'workflow', 'workflowAutomatedTrigger'],
					},
				},
				options: [
					{
						displayName: 'Field Values',
						name: 'fieldValues',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Field Value',
						options: [
							{
								name: 'field',
								displayName: 'Field',
								values: [
									{
										displayName: 'Field Name',
										name: 'fieldName',
										type: 'string',
										default: '',
										description: 'The name of the field',
									},
									{
										displayName: 'Field Value',
										name: 'fieldValue',
										type: 'string',
										default: '',
										description: 'The value of the field',
									},
								],
							},
						],
					},
				],
			},
			// Pagination and filtering
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll', 'search'],
						apiType: ['rest'],
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
						operation: ['getAll', 'search'],
						returnAll: [false],
						apiType: ['rest'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
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
						operation: ['getAll', 'search'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						displayName: 'After Cursor',
						name: 'afterCursor',
						type: 'string',
						default: '',
						description: 'Cursor for pagination (get results after this cursor)',
					},
					{
						displayName: 'Before Cursor',
						name: 'beforeCursor',
						type: 'string',
						default: '',
						description: 'Cursor for pagination (get results before this cursor)',
					},
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'json',
						default: '{}',
						description: 'Filter query in JSON format',
					},
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
						description: 'Direction to order results',
					},
					{
						displayName: 'Include Deleted',
						name: 'includeDeleted',
						type: 'boolean',
						default: false,
						description: 'Whether to include soft-deleted records',
					},
					{
						displayName: 'Depth',
						name: 'depth',
						type: 'number',
						default: 1,
						description: 'Depth of relations to include',
					},
				],
			},
			// File upload for attachments
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['create'],
						apiType: ['rest'],
					},
				},
				placeholder: 'data',
				description: 'Name of the binary property which contains the file data',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['create'],
						apiType: ['rest'],
					},
				},
				description: 'Name of the file being uploaded',
			},
			{
				displayName: 'Parent Type',
				name: 'parentType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['create'],
						apiType: ['rest'],
					},
				},
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'note',
				description: 'Type of parent record for the attachment',
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['create'],
						apiType: ['rest'],
					},
				},
				default: '',
				description: 'ID of the parent record',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('twentyCrmApi');
		const apiType = this.getNodeParameter('apiType', 0) as string;
		const apiUrl = credentials.apiUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (apiType === 'webhooks') {
					// Handle Webhook operations
					const webhookOperation = this.getNodeParameter('webhookOperation', i) as string;
					let endpoint = '/rest/webhooks';
					let method: IHttpRequestMethods = 'GET';
					let body: IDataObject = {};

					if (webhookOperation === 'create') {
						method = 'POST';
						body.url = this.getNodeParameter('webhookUrl', i) as string;
						body.events = this.getNodeParameter('webhookEvents', i) as string[];
					} else if (webhookOperation === 'get') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint += `/${webhookId}`;
					} else if (webhookOperation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint += `/${webhookId}`;
						method = 'PATCH';
						body.url = this.getNodeParameter('webhookUrl', i) as string;
						body.events = this.getNodeParameter('webhookEvents', i) as string[];
					} else if (webhookOperation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint += `/${webhookId}`;
						method = 'DELETE';
					}

					const options = {
						method,
						uri: `${apiUrl}${endpoint}`,
						body: Object.keys(body).length ? body : undefined,
						json: true,
					};

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options,
					);

				} else if (apiType === 'batch') {
					// Handle Batch operations
					const batchOperation = this.getNodeParameter('batchOperation', i) as string;
					const batchResource = this.getNodeParameter('batchResource', i) as string;
					const batchData = this.getNodeParameter('batchData', i) as string;
					
					const parsedData = typeof batchData === 'string' 
						? JSON.parse(batchData) 
						: batchData;

					let mutation = '';
					if (batchOperation === 'createMultiple') {
						mutation = `mutation { create${batchResource.charAt(0).toUpperCase() + batchResource.slice(1)}(data: ${JSON.stringify(parsedData)}) { id } }`;
					} else if (batchOperation === 'updateMultiple') {
						mutation = `mutation { update${batchResource.charAt(0).toUpperCase() + batchResource.slice(1)}(data: ${JSON.stringify(parsedData)}) { id } }`;
					} else if (batchOperation === 'deleteMultiple') {
						const ids = parsedData.map((item: any) => item.id);
						mutation = `mutation { delete${batchResource.charAt(0).toUpperCase() + batchResource.slice(1)}(filter: {id: {in: ${JSON.stringify(ids)}}}) { id } }`;
					}

					const options = {
						method: 'POST' as IHttpRequestMethods,
						uri: `${apiUrl}/graphql`,
						body: {
							query: mutation,
						},
						json: true,
					};

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options,
					);

				} else if (apiType === 'graphql') {
					// Handle GraphQL queries
					const query = this.getNodeParameter('graphqlQuery', i) as string;
					const variables = this.getNodeParameter('graphqlVariables', i, {}) as string;
					
					const graphqlVariables = typeof variables === 'string' 
						? JSON.parse(variables || '{}') 
						: variables;

					const options = {
						method: 'POST' as IHttpRequestMethods,
						uri: `${apiUrl}/graphql`,
						body: {
							query,
							variables: graphqlVariables,
						},
						json: true,
					};

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options,
					);

				} else if (apiType === 'metadata') {
					// Handle Metadata API
					const metadataOperation = this.getNodeParameter('metadataOperation', i) as string;
					let endpoint = '/rest/metadata';
					let method: IHttpRequestMethods = 'GET';
					let body: IDataObject = {};

					if (metadataOperation === 'getAllObjects') {
						endpoint += '/objects';
					} else if (metadataOperation === 'getObject') {
						const objectName = this.getNodeParameter('metadataObjectName', i) as string;
						endpoint += `/objects/${objectName}`;
					} else if (metadataOperation === 'getFields') {
						const objectName = this.getNodeParameter('metadataObjectName', i) as string;
						endpoint += `/objects/${objectName}/fields`;
					} else if (metadataOperation === 'getRelations') {
						const objectName = this.getNodeParameter('metadataObjectName', i) as string;
						endpoint += `/objects/${objectName}/relations`;
					} else if (metadataOperation === 'createField') {
						const objectName = this.getNodeParameter('metadataObjectName', i) as string;
						endpoint += `/objects/${objectName}/fields`;
						method = 'POST';
						body = {
							name: this.getNodeParameter('fieldName', i) as string,
							label: this.getNodeParameter('fieldLabel', i) as string,
							type: this.getNodeParameter('fieldType', i) as string,
						};
					} else if (metadataOperation === 'updateField') {
						const objectName = this.getNodeParameter('metadataObjectName', i) as string;
						const fieldName = this.getNodeParameter('fieldName', i) as string;
						endpoint += `/objects/${objectName}/fields/${fieldName}`;
						method = 'PATCH';
						body = {
							label: this.getNodeParameter('fieldLabel', i) as string,
						};
					}

					const options = {
						method,
						uri: `${apiUrl}${endpoint}`,
						body: Object.keys(body).length ? body : undefined,
						json: true,
					};

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options,
					);

				} else {
					// Handle REST API
					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;
					const baseUrl = `${apiUrl}/rest`;
					
					let endpoint = '';
					let method: IHttpRequestMethods = 'GET';
					let body: IDataObject = {};
					let qs: IDataObject = {};

					const resourceMap: { [key: string]: string } = {
						attachment: 'attachments',
						blocklist: 'blocklists',
						calendarChannel: 'calendarChannels',
						calendarChannelEventAssociation: 'calendarChannelEventAssociations',
						calendarEvent: 'calendarEvents',
						calendarEventParticipant: 'calendarEventParticipants',
						company: 'companies',
						connectedAccount: 'connectedAccounts',
						favorite: 'favorites',
						favoriteFolder: 'favoriteFolders',
						message: 'messages',
						messageChannel: 'messageChannels',
						messageChannelMessageAssociation: 'messageChannelMessageAssociations',
						messageFolder: 'messageFolders',
						messageParticipant: 'messageParticipants',
						messageThread: 'messageThreads',
						note: 'notes',
						noteTarget: 'noteTargets',
						opportunity: 'opportunities',
						person: 'people',
						task: 'tasks',
						taskTarget: 'taskTargets',
						timelineActivity: 'timelineActivities',
						view: 'views',
						viewField: 'viewFields',
						viewFilter: 'viewFilters',
						viewFilterGroup: 'viewFilterGroups',
						viewGroup: 'viewGroups',
						viewSort: 'viewSorts',
						workflow: 'workflows',
						workflowAutomatedTrigger: 'workflowAutomatedTriggers',
						workflowRun: 'workflowRuns',
						workflowVersion: 'workflowVersions',
						workspaceMember: 'workspaceMembers',
					};

					let resourceName = resourceMap[resource];
					if (resource === 'customObject') {
						resourceName = this.getNodeParameter('objectName', i) as string;
					}

					if (operation === 'getAll') {
						endpoint = `/${resourceName}`;
						method = 'GET';

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

						if (!returnAll) {
							qs.first = this.getNodeParameter('limit', i) as number;
						} else {
							qs.first = 1000;
						}

						if (additionalOptions.afterCursor) {
							qs.after = additionalOptions.afterCursor;
						}

						if (additionalOptions.beforeCursor) {
							qs.before = additionalOptions.beforeCursor;
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

						if (additionalOptions.orderBy) {
							qs.orderBy = additionalOptions.orderBy;
							qs.orderDirection = additionalOptions.orderDirection || 'ASC';
						}

						if (additionalOptions.includeDeleted) {
							qs.includeDeleted = true;
						}

						if (additionalOptions.depth) {
							qs.depth = additionalOptions.depth;
						}

					} else if (operation === 'search') {
						endpoint = `/${resourceName}/search`;
						method = 'POST';
						
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						body.query = searchQuery;

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							body.limit = this.getNodeParameter('limit', i) as number;
						}

					} else if (operation === 'get') {
						const recordId = this.getNodeParameter('recordId', i) as string;
						endpoint = `/${resourceName}/${recordId}`;
						method = 'GET';

					} else if (operation === 'create') {
						endpoint = `/${resourceName}`;
						method = 'POST';

						// Handle resource-specific fields
						if (resource === 'task') {
							const taskFields = this.getNodeParameter('taskFields', i, {}) as IDataObject;
							// Handle bodyV2 field properly
							if (taskFields.bodyV2 && typeof taskFields.bodyV2 === 'string') {
								taskFields.bodyV2 = { markdown: taskFields.bodyV2 };
							}
							Object.assign(body, taskFields);
						} else if (resource === 'note') {
							const noteFields = this.getNodeParameter('noteFields', i, {}) as IDataObject;
							// Handle bodyV2 field properly
							if (noteFields.bodyV2 && typeof noteFields.bodyV2 === 'string') {
								noteFields.bodyV2 = { markdown: noteFields.bodyV2 };
							}
							Object.assign(body, noteFields);
						} else if (resource === 'calendarEvent') {
							const eventFields = this.getNodeParameter('calendarEventFields', i, {}) as IDataObject;
							Object.assign(body, eventFields);
						} else if (resource === 'message') {
							const messageFields = this.getNodeParameter('messageFields', i, {}) as IDataObject;
							Object.assign(body, messageFields);
						} else if (resource === 'workflow' || resource === 'workflowAutomatedTrigger') {
							const workflowFields = this.getNodeParameter('workflowFields', i, {}) as IDataObject;
							Object.assign(body, workflowFields);
						} else if (resource === 'attachment') {
							// Handle file upload with binary data
							const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							const parentType = this.getNodeParameter('parentType', i) as string;
							const parentId = this.getNodeParameter('parentId', i) as string;
							const fileName = this.getNodeParameter('fileName', i, '') as string;
							
							if (items[i].binary && items[i].binary![binaryPropertyName]) {
								const binaryData = items[i].binary![binaryPropertyName] as IBinaryData;
								const formData = {
									file: {
										value: binaryData.data,
										options: {
											filename: fileName || binaryData.fileName,
											contentType: binaryData.mimeType,
										},
									},
									parentType,
									parentId,
								};
								
								// Use multipart form data for file upload
								const uploadOptions = {
									method: 'POST' as IHttpRequestMethods,
									uri: `${baseUrl}${endpoint}`,
									formData,
									json: true,
								};

								responseData = await this.helpers.requestWithAuthentication.call(
									this,
									'twentyCrmApi',
									uploadOptions,
								);
								continue;
							} else {
								throw new NodeOperationError(this.getNode(), 'No binary data found', { itemIndex: i });
							}
						} else if (resource === 'noteTarget' || resource === 'taskTarget') {
							// Handle relation creation
							const sourceId = this.getNodeParameter('sourceId', i) as string;
							const targetId = this.getNodeParameter('targetId', i) as string;
							const relationType = this.getNodeParameter('relationType', i) as string;
							
							body = {
								[resource === 'noteTarget' ? 'noteId' : 'taskId']: sourceId,
								[`${relationType}Id`]: targetId,
							};
						} else {
							// Generic fields
							const fields = this.getNodeParameter('fields', i, {}) as any;
							if (fields.fieldValues?.field) {
								fields.fieldValues.field.forEach((field: any) => {
									// Parse JSON strings for complex fields
									try {
										body[field.fieldName] = JSON.parse(field.fieldValue);
									} catch {
										body[field.fieldName] = field.fieldValue;
									}
								});
							}
						}

					} else if (operation === 'update') {
						const recordId = this.getNodeParameter('recordId', i) as string;
						endpoint = `/${resourceName}/${recordId}`;
						method = 'PATCH';

						// Handle resource-specific fields (same as create)
						if (resource === 'task') {
							const taskFields = this.getNodeParameter('taskFields', i, {}) as IDataObject;
							if (taskFields.bodyV2 && typeof taskFields.bodyV2 === 'string') {
								taskFields.bodyV2 = { markdown: taskFields.bodyV2 };
							}
							Object.assign(body, taskFields);
						} else if (resource === 'note') {
							const noteFields = this.getNodeParameter('noteFields', i, {}) as IDataObject;
							if (noteFields.bodyV2 && typeof noteFields.bodyV2 === 'string') {
								noteFields.bodyV2 = { markdown: noteFields.bodyV2 };
							}
							Object.assign(body, noteFields);
						} else if (resource === 'calendarEvent') {
							const eventFields = this.getNodeParameter('calendarEventFields', i, {}) as IDataObject;
							Object.assign(body, eventFields);
						} else if (resource === 'message') {
							const messageFields = this.getNodeParameter('messageFields', i, {}) as IDataObject;
							Object.assign(body, messageFields);
						} else if (resource === 'workflow' || resource === 'workflowAutomatedTrigger') {
							const workflowFields = this.getNodeParameter('workflowFields', i, {}) as IDataObject;
							Object.assign(body, workflowFields);
						} else {
							// Generic fields
							const fields = this.getNodeParameter('fields', i, {}) as any;
							if (fields.fieldValues?.field) {
								fields.fieldValues.field.forEach((field: any) => {
									try {
										body[field.fieldName] = JSON.parse(field.fieldValue);
									} catch {
										body[field.fieldName] = field.fieldValue;
									}
								});
							}
						}

					} else if (operation === 'delete') {
						const recordId = this.getNodeParameter('recordId', i) as string;
						endpoint = `/${resourceName}/${recordId}`;
						method = 'DELETE';

					} else if (operation === 'upsert') {
						// Upsert operation - update if exists, create if not
						endpoint = `/${resourceName}/upsert`;
						method = 'POST';
						
						const fields = this.getNodeParameter('fields', i, {}) as any;
						if (fields.fieldValues?.field) {
							fields.fieldValues.field.forEach((field: any) => {
								try {
									body[field.fieldName] = JSON.parse(field.fieldValue);
								} catch {
									body[field.fieldName] = field.fieldValue;
								}
							});
						}
					}

					const options: any = {
						method,
						uri: `${baseUrl}${endpoint}`,
						json: true,
					};

					if (Object.keys(body).length > 0) {
						options.body = body;
					}

					if (Object.keys(qs).length > 0) {
						options.qs = qs;
					}

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options,
					);

					// Handle response data structure
					if (operation === 'getAll' && responseData.data) {
						// Extract the nested data array
						const resourceKey = Object.keys(responseData.data)[0];
						if (responseData.data[resourceKey]) {
							// Handle pagination for returnAll
							const returnAll = this.getNodeParameter('returnAll', i) as boolean;
							if (returnAll && responseData.pageInfo?.hasNextPage) {
								let allData = responseData.data[resourceKey];
								let nextCursor = responseData.pageInfo.endCursor;
								
								while (nextCursor) {
									qs.after = nextCursor;
									const nextOptions = { ...options, qs: { ...qs, after: nextCursor } };
									const nextResponse = await this.helpers.requestWithAuthentication.call(
										this,
										'twentyCrmApi',
										nextOptions,
									);
									
									if (nextResponse.data && nextResponse.data[resourceKey]) {
										allData = allData.concat(nextResponse.data[resourceKey]);
										nextCursor = nextResponse.pageInfo?.hasNextPage ? nextResponse.pageInfo.endCursor : null;
									} else {
										break;
									}
								}
								
								responseData = {
									data: allData,
									totalCount: allData.length,
								};
							} else {
								responseData = {
									data: responseData.data[resourceKey],
									pageInfo: responseData.pageInfo,
									totalCount: responseData.totalCount,
								};
							}
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}