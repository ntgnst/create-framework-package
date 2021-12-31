const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  async prompting() {
    this.log(
      chalk.bold.green(
        `Welcome to the Piri ${chalk.bold.yellow('create-framework-package')} generator!`,
      ),
    );

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'App name ?',
        default: 'my-app',
      },
      {
        type: 'input',
        name: 'appVersion',
        message: 'App version ?',
        default: '0.0.0',
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'App description ?',
        default: '',
      },
      {
        type: 'input',
        name: 'gitUrl',
        message: 'Project git url ? (Required)',
        default: '',
      },
      {
        type: 'input',
        name: 'azureFeedName',
        message: 'Azure npm feed name ?',
        default: 'Piri.Npm',
      },
    ];

    const props = await this.prompt(prompts);
    this.props = props;
  }

  default() {
    mkdirp(this.props.appName);
    this.destinationRoot(this.destinationPath(this.props.appName));
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationPath(''),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(''),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath('.husky/commit-msg'),
      this.destinationPath('.husky/commit-msg'),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath('.npmignore'),
      this.destinationPath('.npmignore'),
      this.props,
    );
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
    );
  }

  install() {
    this.log(chalk.bold.green('Initializing git repository..'));
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', [
      'remote',
      'add',
      'origin',
      this.props.gitUrl,
    ]);
    this.log(chalk.bold.green('Installing dependencies..'));
    this.spawnCommandSync('npm', ['install']);
  }
};
