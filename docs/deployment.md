# Deployment Guide for OSRS MCP Server as a Custom Connector
This guide explains how to deploy your OSRS MCP server as a Custom Connector for Claude. The
server is currently only deployed on Heroku. These docs are written with this in mind.

## Manual deployment
At the moment, the only way to deploy the OSRS MCP server is to do so manually. Fortunately,
the process is very simple. You can think of Heroku apps as pretty much the same as a git
origin that you push changes to.

1. Install the `heroku` CLI.
2. Run `heroku login`.
3. Once logged in, push changes to the app via `git push heroku <branch>`

### Overriding branch changes
You can push a branch's changes to another branch, overridding the changes there with whatever
is on the branch that you pushed. To do push one branch to another branch's deployment:

```sh
git push heroku <new>:<base>
```

For example, if you are on `featureBranch` and want to push the changes to the `main` deployment,
you can do so with `git push heroku featureBranch:main`.
