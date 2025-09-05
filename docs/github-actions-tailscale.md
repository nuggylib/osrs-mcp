# GitHub Actions with Tailscale integration

This guide describes how to use Tailscale with GitHub Actions to create secure CI/CD pipelines for the OSRS MCP server.

## What is Tailscale integration?

Tailscale integration enables GitHub Actions runners to securely connect to your private Tailscale network during workflow execution. This connection provides access to private resources without exposing them to the public internet.

## Workflow files

### CI pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push or pull request to main, develop, or tailscale branches
- **Purpose**: Validate code quality and functionality
- **Tailscale tag**: `tag:ci`

### Deploy pipeline (`.github/workflows/deploy.yml`)
- **Triggers**: Manual dispatch or push to main branch
- **Purpose**: Deploy to Heroku with verification
- **Tailscale tag**: `tag:deploy`

## How Tailscale integration works

### Authentication flow
```yaml
- name: Connect to Tailscale
  uses: tailscale/github-action@v3
  with:
    oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
    oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
    tags: tag:ci
```

The authentication process:
1. The GitHub runner authenticates with Tailscale by using OAuth credentials.
2. Tailscale creates an ephemeral node in your tailnet (Tailscale network).
3. The node is automatically tagged with `tag:ci` or `tag:deploy`.
4. The node is deleted when the workflow completes.

### Network access
After connecting, the GitHub runner can:
- Access private databases (Redis, PostgreSQL, and others).
- Connect to internal APIs and services.
- Deploy through private networks.
- Run tests against staging environments.
- Access monitoring and logging systems.

## Security model

### ACL tags
Use `tag:ci` and `tag:deploy` to control access to resources:

```json
{
  "tagOwners": {
    "tag:ci": ["your-email@domain.com"],
    "tag:deploy": ["your-email@domain.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:ci"],
      "dst": ["tag:databases:6379", "tag:apis:*"]
    },
    {
      "action": "accept",
      "src": ["tag:deploy"],
      "dst": ["tag:production:*"]
    }
  ]
}
```

### Ephemeral nodes
- Nodes exist only during workflow execution.
- Tailscale automatically cleans up nodes after use.
- No persistent access credentials are stored.

## Set up requirements

To use Tailscale integration with GitHub Actions, complete these setup tasks.

### Step 1: Configure Tailscale
In your Tailscale admin console:
1. Create an OAuth client with the `auth_keys` scope.
2. Define ACL tags: `tag:ci` and `tag:deploy`.
3. Set permissions for tagged resources.

### Step 2: Add GitHub repository secrets
Add these secrets to your GitHub repository:

- `TS_OAUTH_CLIENT_ID`: OAuth client ID from the Tailscale admin console
- `TS_OAUTH_SECRET`: OAuth client secret from the Tailscale admin console
- `HEROKU_API_KEY`: Your Heroku API key (for the deployment workflow)
- `HEROKU_EMAIL`: Your Heroku account email (for the deployment workflow)

### Step 3: Add optional GitHub variables
- `HEROKU_APP_NAME`: Set this variable if your app name differs from `osrs-mcp`

## Workflow details

### CI pipeline steps
The CI pipeline performs these steps:
1. **Check out code and set up environment**: Get the code and configure the Node.js environment.
2. **Connect to Tailscale**: Join the private network with the `tag:ci` tag.
3. **Install dependencies**: Run `yarn install --frozen-lockfile`.
4. **Run quality checks**: Perform linting and build validation.
5. **Run tests**: Execute deployment script and Docker build tests.

### Deploy pipeline steps
The deploy pipeline performs these steps:
1. **Set up environment**: Check out code, configure Node.js, and install dependencies.
2. **Connect to Tailscale**: Join the network with the `tag:deploy` tag.
3. **Run pre-deployment tests**: Validate code with lint and build checks.
4. **Deploy to Heroku**: Use the Heroku API to deploy the application.
5. **Verify health**: Check the deployment endpoint for successful deployment.
6. **Run post-deployment tests**: Execute the test suite against the live application.

## Benefits of Tailscale integration

### Enhanced security
- **Zero-trust networking**: Only authorized workflows can access resources.
- **No public endpoints**: Databases and internal services remain private.
- **Simplified secrets management**: No need to store database URLs or API endpoints in secrets.

### Improved reliability
- **Better testing**: Connect to actual staging and development environments.
- **Secure deployment**: Deploy through private networks.
- **Automated health verification**: Validate deployments automatically.

### Easier maintenance
- **Reduced complexity**: No VPN configuration or firewall management required.
- **Automatic cleanup**: Ephemeral nodes are automatically removed.
- **Complete audit trail**: Tailscale logs all network access.

## Example use cases

### Test database connections
Connect the runner to a private Redis server:
```yaml
- name: Test Redis connection
  run: |
    redis-cli -h redis-server.tailnet ping
    yarn test:integration
```

### Test private APIs
Access internal microservices:
```yaml
- name: Test internal APIs
  run: |
    curl http://internal-api.tailnet/health
    yarn test:e2e
```

### Deploy through private networks
Deploy through a private load balancer:
```yaml
- name: Deploy via private network
  run: |
    curl -X POST http://deploy-service.tailnet/deploy \
      -H "Authorization: Bearer $TOKEN"
```

## Troubleshoot common issues

### OAuth authentication fails
If OAuth authentication fails:
- Verify that `TS_OAUTH_CLIENT_ID` and `TS_OAUTH_SECRET` are set correctly.
- Ensure that the OAuth client has the `auth_keys` scope.

### ACL permission denied
If you receive ACL permission errors:
- Check that tags are defined in Tailscale ACLs.
- Verify that tag permissions allow access to target resources.

### Workflow can't access private resources
If the workflow can't access private resources:
- Confirm that the Tailscale connection step completed successfully.
- Check that target resources are properly tagged in Tailscale.

### Debug connection issues
To debug connection issues:
- View workflow logs for Tailscale connection status.
- Check the Tailscale admin console for ephemeral node creation.
- Verify ACL rules in the Tailscale admin console.
- Test connectivity manually by using `tailscale ping` in the workflow.

## Related documentation
- [Deployment guide](./deployment.md): Learn about the manual deployment process.
- [Testing guide](./testing.md): Explore testing strategies and tools.
- [Tailscale GitHub Action documentation](https://tailscale.com/kb/1276/tailscale-github-action): Read the official Tailscale GitHub Action documentation.