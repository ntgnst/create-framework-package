'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    this.log(
      chalk.bold.green('Welcome to the ' + chalk.bold.yellow('create-framework-package') + ' generator!')
    );

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'What is your app name ?',
        default: 'my-app'
      },
      {
        type: 'input',
        name: 'gitUrl',
        message: 'What is your project git url ? (Required)',
        default: ''
      },
      {
        type: 'input',
        name: 'azureFeedName',
        message: 'What is your azure feed name ? (Default: Piri.Npm)',
        default: 'Piri.Npm'
      },
      {
        type: 'input',
        name: 'appVersion',
        message: 'What is your app version ? (Default: 0.0.0)',
        default: '0.0.0'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    mkdirp(this.props.appName);
    this.destinationRoot(this.destinationPath(this.props.appName));
  }

  writing() {
    this.fs.copyTpl(this.templatePath("*"), this.destinationPath(""), this.props);
    this.fs.copyTpl(this.templatePath(".*"), this.destinationPath(""), this.props);
    this.fs.copyTpl(this.templatePath(".husky/commit-msg"), this.destinationPath(".husky/commit-msg"), this.props);
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      this.props
    );
  }

  install() {
    console.log(`Initializing git repository`);
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", ["remote", "add", "origin", this.props.gitUrl]);
    console.log(`Installing dependencies`);
    this.spawnCommandSync('npm', ['install']);
  }
};
