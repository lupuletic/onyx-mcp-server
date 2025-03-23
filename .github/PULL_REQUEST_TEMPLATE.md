# Pull Request

> **IMPORTANT**: Your PR title must follow the [Conventional Commits](https://www.conventionalcommits.org/) format.
> Examples: `feat: add new search feature`, `fix: resolve API timeout issue`, `docs: update installation instructions`
> This is enforced by our CI and used for automatic version bumping.

## Description
Please provide a brief description of the changes in this pull request.

## Related Issue
Fixes #(issue number)

## Type of Change
Please check the options that are relevant.
- [ ] Bug fix (non-breaking change which fixes an issue)
      - Will trigger a **patch** version bump (e.g., 1.0.0 -> 1.0.1)
      - Use `fix:` prefix in PR title
- [ ] New feature (non-breaking change which adds functionality)
      - Will trigger a **minor** version bump (e.g., 1.0.0 -> 1.1.0)
      - Use `feat:` prefix in PR title
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
      - Will trigger a **major** version bump (e.g., 1.0.0 -> 2.0.0)
      - Use `feat!:` or `fix!:` prefix in PR title, or include "BREAKING CHANGE:" in description
- [ ] Documentation update
      - Use `docs:` prefix in PR title
- [ ] Code refactoring
      - Use `refactor:` prefix in PR title
- [ ] Performance improvement
      - Use `perf:` prefix in PR title
- [ ] Test addition or update
      - Use `test:` prefix in PR title
- [ ] Other (please describe):
      - Use appropriate prefix based on the nature of the change

## Checklist
Please check the options that are relevant.
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Additional Information
Add any other information about the pull request here.

## Screenshots (if appropriate)
Add screenshots to help explain your changes if applicable.