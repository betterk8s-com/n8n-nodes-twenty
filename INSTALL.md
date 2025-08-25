# Twenty CRM n8n Node - Installation Guide

## Installation Methods

### Method 1: Local Development (Recommended for Testing)

1. **Build the node:**
```bash
cd /Users/stefankrempel/projects/n8n/n8n-nodes-twenty
npm install
npm run build
```

2. **Link the package globally:**
```bash
npm link
```

3. **Link to your n8n instance:**
```bash
# Navigate to your n8n custom nodes folder
cd ~/.n8n/nodes  # or wherever your n8n stores custom nodes

# Create the folder if it doesn't exist
mkdir -p ~/.n8n/nodes

# Link the Twenty CRM node
npm link n8n-nodes-twenty
```

4. **Restart n8n:**
```bash
# If running with npm
n8n start

# If running with Docker
docker restart n8n

# If running with pm2
pm2 restart n8n
```

### Method 2: Direct Installation in n8n

1. **Copy the built files to n8n custom folder:**
```bash
# Create custom nodes directory if it doesn't exist
mkdir -p ~/.n8n/custom

# Copy the entire package
cp -r /Users/stefankrempel/projects/n8n/n8n-nodes-twenty ~/.n8n/custom/
```

2. **Set environment variable and restart n8n:**
```bash
export N8N_CUSTOM_EXTENSIONS="/home/user/.n8n/custom"
n8n start
```

### Method 3: Install from npm (After Publishing)

```bash
# In your n8n project
cd ~/.n8n
npm install n8n-nodes-twenty

# Restart n8n
n8n start
```

### Method 4: Docker Installation

Add to your docker-compose.yml:
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
    volumes:
      - ./n8n-nodes-twenty:/home/node/.n8n/custom/n8n-nodes-twenty
```

## Configuration in n8n

### 1. Add Twenty CRM Credentials

1. Go to **Credentials** in n8n
2. Click **Add Credential**
3. Search for "Twenty CRM API"
4. Configure:
   - **API URL**: `https://crm.betterk8s.com` (or your Twenty instance URL)
   - **API Key**: Your Twenty API key (get from Twenty settings)
5. Click **Save**

### 2. Using the Node

1. Create a new workflow
2. Add the **Twenty CRM** node
3. Select your credentials
4. Choose API Type:
   - **REST**: Standard CRUD operations
   - **GraphQL**: Complex queries
   - **Metadata**: Schema information

## Test Workflow Example

```json
{
  "nodes": [
    {
      "parameters": {
        "apiType": "rest",
        "resource": "person",
        "operation": "create",
        "fields": {
          "fieldValues": {
            "field": [
              {
                "fieldName": "name",
                "fieldValue": "{\"firstName\":\"Test\",\"lastName\":\"User\"}"
              },
              {
                "fieldName": "emails",
                "fieldValue": "{\"primaryEmail\":\"test@example.com\",\"additionalEmails\":[]}"
              }
            ]
          }
        }
      },
      "name": "Twenty CRM",
      "type": "n8n-nodes-twenty.twentyCrm",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ]
}
```

## Verify Installation

1. After restarting n8n, search for "Twenty" in the node panel
2. You should see the **Twenty CRM** node available
3. The node icon should appear as a black square with "20"

## Troubleshooting

### Node doesn't appear:
- Check n8n logs: `n8n start --tunnel`
- Verify files in: `ls ~/.n8n/nodes/node_modules/n8n-nodes-twenty`
- Ensure n8n was restarted after installation

### Credentials error:
- Verify your Twenty API URL includes the protocol (https://)
- Test API key directly: 
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://your-twenty-instance/rest/metadata/objects
```

### Build errors:
- Ensure Node.js version >= 20.15
- Clear and rebuild: `npm run build`
- Check TypeScript errors: `npx tsc --noEmit`

## Development Mode

For active development with hot reload:
```bash
# Terminal 1: Watch for changes
cd /Users/stefankrempel/projects/n8n/n8n-nodes-twenty
npm run dev

# Terminal 2: Run n8n
n8n start
```

## Environment Variables

Optional configuration:
```bash
# Custom nodes path
export N8N_CUSTOM_EXTENSIONS="/path/to/custom/nodes"

# Enable debug logs
export N8N_LOG_LEVEL=debug
```

## Support

- GitHub Issues: https://github.com/betterk8s-com/n8n-nodes-twenty/issues
- Twenty API Docs: https://twenty.com/developers/section/api-and-webhooks/api