# Deployment

This guide explains how to deploy your OSRS MCP server as a [Custom Connector for Claude](https://support.anthropic.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp). The server is currently only deployed on Heroku. These docs are written with this in mind.

## Manual Deployment

At the moment, the only way to deploy the OSRS MCP server is to do so manually. Fortunately, the process is very simple. You can think of Heroku apps as pretty much the same as a git origin that you push changes to.

1. Install the [`heroku` CLI](https://devcenter.heroku.com/articles/heroku-cli).
2. Run `heroku login`.
3. After you log in, run `heroku git:remote -a osrs-mcp` to link to the `osrc-mcp` app. See [Heroku's docs on deploying with git](https://devcenter.heroku.com/articles/git).
4. You can now push changes to the app using `git push heroku <branch>`.
5. Wait for the build to run and ensure there were no errors.
6. Test as-needed.

### Overriding Branch Changes

You can push a branch's changes to another branch, overriding the changes there with whatever is on the branch that you pushed. To do push one branch to another branch's deployment:

```sh
git push heroku <new>:<base>
```

For example, if you are on `featureBranch` and want to push the changes to the `main` deployment, you can do so with `git push heroku featureBranch:main`.
