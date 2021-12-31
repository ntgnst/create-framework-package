/* eslint-disable max-len */
const fs = require('fs');
const path = require('path');
const parse = require('parse-git-config');

const gitConfig = parse.sync();

if (!gitConfig && !gitConfig['remote "origin"'] && gitConfig['remote "origin"']) {
  console.error('git not initialized. Please initialize git. Then make sure remote origin url entered.');
  process.exit(1);
}

const repoUrl = gitConfig['remote "origin"']?.url;

if (!repoUrl) {
  console.error('Incorrect git url. Please enter correct git url. After that run npm install.');
  process.exit(1)
}

const [, organizationName, projectName, repositoryName] = /^https:[/][/].*[.]azure[.]com[/]([\w.]*)[/]([\w.]*)[/]_git[/]([\w.-]*)$/
  .exec(repoUrl);

const text = `module.exports = {
  "types": [
    {
      "type": "feat",
      "section": "Features"
    },
    {
      "type": "fix",
      "section": "Fixes and improvements"
    },
    {
      "type": "perf",
      "section": "Fixes and improvements"
    },
    {
      "type": "chore",
      "section": "Miscellaneous"
    },
    {
      "type": "docs",
      "section": "Miscellaneous"
    },
    {
      "type": "style",
      "section": "Miscellaneous"
    },
    {
      "type": "refactor",
      "section": "Miscellaneous"
    },
    {
      "type": "test",
      "section": "Miscellaneous"
    },
    {
      "type": "ci",
      "section": "Miscellaneous"
    },
    {
      "type": "build",
      "section": "Miscellaneous"
    }
  ],
  "issueUrlFormat": "{{host}}/${organizationName}/${projectName}/_workitems/edit/{{id}}/",
  "commitUrlFormat": "{{host}}/${organizationName}/${projectName}/_git/${repositoryName}/commit/{{hash}}",
  "compareUrlFormat": "{{host}}/${organizationName}/${projectName}/_git/${repositoryName}/branchCompare?baseVersion=GT{{previousTag}}&targetVersion=GT{{currentTag}}",
  "releaseCommitMessageFormat": "chore(release): {{currentTag}} [skip ci]"
}`;

const filePath = path.resolve(__dirname, './.versionrc.js');

if (!fs.existsSync(filePath)) {
  fs.writeFile(filePath, text, { flag: 'w', encoding: 'utf8' }, (err) => {
    if (err) throw err;
  });
}

