## Directory Structure
This directory contains raw prompt `.txt` files. They are intended to be loaded into the corresponding
tool/resource/etc. that uses them.

The proper way to load these prompts is:
```ts
const somePrompt = loadPrompt('[subDirName]', '[fileName].txt')
```
* Set the first argument to an empty string to load from the root of the `prompts/` directory

ALWAYS follow the instructions in the [prompts.md documentation](../docs/prompts.md) 
when creating or editing prompts.
