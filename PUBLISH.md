# Publishing n8n-nodes-twenty to npm Registry

## Prerequisites

1. **npm account**: Create at https://www.npmjs.com/signup
2. **npm CLI login**: Run `npm login` and enter credentials
3. **Package name availability**: Verify `n8n-nodes-twenty` is available

## Pre-publish Checklist

- [ ] All tests pass
- [ ] Version number is correct in package.json
- [ ] README.md is complete with usage instructions
- [ ] License file exists (MIT)
- [ ] Repository URL is correct
- [ ] No sensitive data in code

## Publishing Steps

### 1. First-time Setup

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### 2. Build and Test

```bash
# Clean build
npm run build

# Verify the package contents
npm pack --dry-run

# Check what will be published
npm publish --dry-run
```

### 3. Publish to npm

```bash
# Publish public package
npm publish --access public

# Package will be available at:
# https://www.npmjs.com/package/n8n-nodes-twenty
```

### 4. Verify Publication

```bash
# Check if package is available
npm view n8n-nodes-twenty

# Test installation
npm install n8n-nodes-twenty
```

## After Publishing

Users can install your node in three ways:

### Method 1: Through n8n UI (Recommended)
1. Go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `n8n-nodes-twenty`
4. Click **Install**

### Method 2: Manual Installation
```bash
cd ~/.n8n
npm install n8n-nodes-twenty
# Restart n8n
```

### Method 3: Docker
```dockerfile
FROM n8nio/n8n:latest
RUN npm install -g n8n-nodes-twenty
```

## Version Management

### Releasing Updates

```bash
# Update version (patch/minor/major)
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# Publish update
npm publish

# Push version tag to git
git push && git push --tags
```

### Semantic Versioning
- **Patch** (0.1.x): Bug fixes, documentation
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

## npm Package Configuration

Your package.json should include:

```json
{
  "name": "n8n-nodes-twenty",
  "version": "0.1.0",
  "description": "Twenty CRM integration for n8n",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "twenty",
    "crm",
    "workflow",
    "automation"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/betterk8s-com/n8n-nodes-twenty.git"
  },
  "main": "index.js",
  "files": ["dist"],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/TwentyCrmApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/TwentyCrm/TwentyCrm.node.js"
    ]
  }
}
```

## Troubleshooting

### Package name taken
- Choose alternative: `@betterk8s/n8n-nodes-twenty`
- Scoped packages work with n8n community nodes

### Build errors before publish
```bash
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### Users can't find the package
- Wait 5-10 minutes after publishing
- Check: https://www.npmjs.com/package/n8n-nodes-twenty
- Ensure `n8n-community-node-package` keyword exists

## Maintenance

### Monitor Usage
```bash
# Check download stats
npm view n8n-nodes-twenty downloads

# View package info
npm info n8n-nodes-twenty
```

### Handle Issues
- Monitor GitHub issues
- Respond to npm security advisories
- Update dependencies regularly

## Quick Publish Command

For future releases after initial setup:

```bash
# One-liner for patch release
npm version patch && npm run build && npm publish && git push --follow-tags
```

## Support Channels

- **GitHub Issues**: https://github.com/betterk8s-com/n8n-nodes-twenty/issues
- **npm Package**: https://www.npmjs.com/package/n8n-nodes-twenty
- **n8n Community**: https://community.n8n.io/