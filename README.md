# n8n-nodes-twentycrm

This is an n8n community node that provides full integration with [Twenty CRM](https://twenty.com), an open-source CRM platform. It allows you to automate workflows and interact with Twenty CRM data directly from n8n.

## Features

This node provides comprehensive access to the Twenty CRM API with 50+ operations across multiple resources:

### Supported Resources

- **Person** - Manage contacts and individuals
- **Company** - Handle company records
- **Opportunity** - Track sales opportunities
- **Task** - Manage tasks and to-dos
- **Note** - Create and manage notes
- **Calendar Event** - Handle calendar events
- **Message** - Manage messages
- **Attachment** - Handle file attachments
- **Workflow** - Manage automation workflows
- **Custom** - Access any Twenty CRM resource via API

### Available Operations

Each resource supports the following operations:
- **Create** - Create new records
- **Get** - Retrieve a single record by ID
- **Get Many** - Retrieve multiple records with filtering and pagination
- **Update** - Update existing records
- **Delete** - Delete records

### Additional Features

- Full pagination support with cursor-based navigation
- Advanced filtering with JSON queries
- Custom field support
- Bulk operations support
- Automatic retry on failure
- Rich text fields with Markdown support

## Installation

### Using n8n UI

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-twentycrm`
4. Click **Install**

### Using CLI

```bash
npm install n8n-nodes-twentycrm
```

After installation, restart your n8n instance to load the new node.

## Configuration

### Credentials

To use this node, you need to configure Twenty CRM credentials:

1. **API URL**: Your Twenty CRM instance URL (e.g., `https://api.twenty.com`)
2. **API Key**: Your Twenty CRM API key

### Getting API Credentials

1. Log into your Twenty CRM instance
2. Navigate to Settings > API & Webhooks
3. Generate a new API key
4. Copy the API key and your instance URL

## Usage Examples

### Create a Person

```json
{
  "resource": "person",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "jobTitle": "Manager",
  "city": "New York"
}
```

### Get All Companies with Filtering

```json
{
  "resource": "company",
  "operation": "getAll",
  "returnAll": false,
  "limit": 50,
  "additionalOptions": {
    "orderBy": "name",
    "orderDirection": "ASC",
    "filter": {
      "employees": {
        "gte": 10
      }
    }
  }
}
```

### Update an Opportunity

```json
{
  "resource": "opportunity",
  "operation": "update",
  "id": "opportunity-id-here",
  "stage": "NEGOTIATION",
  "probability": 75
}
```

### Custom Resource Access

For resources not explicitly listed, use the "Custom" resource type:

```json
{
  "resource": "custom",
  "operation": "create",
  "customResource": "blocklists",
  "fieldsJson": {
    "handle": "spam@example.com",
    "workspaceMemberId": "member-id"
  }
}
```

## Advanced Features

### Pagination

The node automatically handles pagination when "Return All" is enabled. For manual pagination control, use the cursor fields in additional options.

### Filtering

Use JSON-based filters to query specific records:

```json
{
  "filter": {
    "createdAt": {
      "gte": "2024-01-01"
    },
    "status": "active"
  }
}
```

### Error Handling

The node includes automatic error handling with retry logic. Enable "Continue On Fail" in the node settings to handle errors gracefully in your workflows.

## Compatibility

- **n8n Version**: 0.187.0 or later
- **Twenty CRM API**: v0.20 or later
- **Node.js**: 20.15 or later

## Resources

- [Twenty CRM Documentation](https://developers.twenty.com)
- [Twenty CRM API Reference](https://developers.twenty.com/rest-api)
- [n8n Documentation](https://docs.n8n.io)

## Support

For issues, feature requests, or questions:
- [GitHub Issues](https://github.com/betterk8s-com/n8n-nodes-twenty/issues)
- [Twenty CRM Community](https://twenty.com/community)
- [n8n Community Forum](https://community.n8n.io)

## License

[MIT](https://github.com/betterk8s-com/n8n-nodes-twenty/blob/main/LICENSE.md)

## Changelog

### v0.1.6
- Simplified node structure for better UI compatibility
- Added 10 core resources with full CRUD operations
- Improved error handling and pagination
- Added custom resource support for extended functionality

### v0.1.0
- Initial release with basic Twenty CRM integration