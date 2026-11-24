# AI Agent Instructions

## 1. Git Commit Messages

Generate clear and natural commit messages in the format `type: description`.

Allowed types:

- `add` — add new files or features
- `update` — update existing files or settings
- `fix` — fix bugs
- `remove` — remove files or code
- `change` — change functionality
- `docs` — add or update documentation
- `test` — add or update tests

Requirements:

- Write in English, use lowercase, and omit the final period.
- Keep titles under 72 characters when possible.
- Inspect all staged changes and read newly added files to understand their purpose.
- Describe what changed and why, focusing on functionality rather than filenames.
- Use natural, specific descriptions without repeating the commit type or using vague wording.
- Choose the most appropriate type and never invent changes.
- Output only the commit message.

## 2. Coding Style

- Write clean, readable, and maintainable code.
- Prefer simple solutions over unnecessarily complex implementations.
- Follow the existing project's coding style.
- Use meaningful variable and function names.
- Avoid code duplication.
- Remove unused imports and unnecessary code.
- Do not introduce unnecessary abstractions.

## 3. Project Structure

- Respect the existing project architecture.
- Keep files organized by their purpose.
- Reuse existing utilities and components.
- Do not create unnecessary files or folders.
- Do not move or rename files without a good reason.
- Avoid modifying unrelated files.

## 4. Dependencies

- Reuse installed dependencies whenever possible.
- Do not install packages without a valid reason.
- Avoid unnecessary or outdated dependencies.
- Do not replace existing libraries without a clear benefit.
- Update dependency files only when necessary.

## 5. Security

- Never hardcode API keys, passwords, or tokens.
- Never expose secrets in logs or responses.
- Do not commit `.env` files or other secret files.
- Validate external input where appropriate.
- Do not weaken existing security measures.

## 6. Git Operations

- Do not create commits unless explicitly requested.
- Do not push changes without permission.
- Never run destructive Git commands without permission.
- Do not overwrite uncommitted user changes.
- Keep changes focused on the requested task.

## 7. Testing and Verification

- Run relevant tests after making changes.
- Check for errors and warnings.
- Verify that existing functionality is not broken.
- Do not claim that something works without verification.
- If tests cannot be run, explain why.

## 8. Communication

- Communicate with the user in Russian.
- Keep explanations concise and clear.
- Explain what was changed and why.
- Ask before making major architectural changes.
- Do not make assumptions when important information is missing.
- Present important limitations honestly.

## 9. Problem Solving

- Understand the problem before changing code.
- Investigate the root cause instead of applying superficial fixes.
- Prefer minimal changes that solve the actual problem.
- Consider possible side effects.
- Do not make unrelated improvements unless requested.
