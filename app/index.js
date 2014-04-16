'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var s = require('string');


var WidgetGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    askFor: function () {
        var done = this.async();

        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('You\'re using the fantastic Widget generator <3.\n'));

        var colors = {
            black: chalk.black('█') + ' black',
            white: chalk.white('█') + ' white',
            silver: chalk.grey('█') + ' silver',
            bordeaux: chalk.red('█') + ' bordeaux',
            petrol: chalk.cyan('█') + ' petrol',
            green: chalk.green('█') + ' green',
            neonPink: chalk.magenta('█') + ' neon pink'
        }

        var prompts = [
            {
                name: 'name',
                message: 'What do you want to call your widget?',
                validate: function (value) {
                    return (value !== '') || 'Name can not be empty';
                }
            },
            {
                name: 'size',
                message: 'What should be the size? [2x2]',
                validate: function (value) {
                    var regex = /^([1-9]\d*)x([1-9]\d*)$/;
                    var valid = (regex.exec(value) !== null);
                    return valid || "Please enter correct size [width x height -> 3x5]";
                }
            },
            {
                name: 'color',
                type: 'list',
                choices: [
                    colors.black,
                    colors.white,
                    colors.silver,
                    colors.bordeaux,
                    colors.petrol,
                    colors.green,
                    colors.neonPink,
                    'transparent',
                    'else'],
                message: 'What color widget should have?'
            },
            {
                name: 'elseColor',
                message: 'Enter color in a hex format [#000000]',
                validate: function(value) {
                    var regex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
                    return (regex.exec(value) !== null) || 'Not a valid hex format';
                },
                when: function(answer) {
                    return answer.color === 'else'
                }
            },
            {
                name: 'configurable',
                type: 'confirm',
                message: 'Whether the widget should be configurable?'
            },
            {
                name: 'dataBind',
                type: 'confirm',
                message: 'Would you like to bind data source?'
            },
            {
                name: 'dataBindType',
                type: 'list',
                choices: ['external', 'internal'],
                message: 'What kind of data bind you would like to add?',
                when: function (answer) {
                    return answer.dataBind === true;
                }
            },
            {
                name: 'dataBindUrl',
                message: 'Enter the url to the data source',
                when: function (answer) {
                    return answer.dataBindType === 'external';
                }
            },
            {
                name: 'dataBindUrl',
                message: 'Enter the data channel',
                when: function (answer) {
                    return answer.dataBindType === 'internal';
                }
            },
            {
                name: 'dataBindInterval',
                message: 'How often data should be refreshed [min 1000 milliseconds]',
                filter: Number,
                validate: function (value) {
                    return (value >= 1000) || 'Interval should be longer than 1000ms'
                },
                when: function(answer) {
                    return answer.dataBindType === 'external';
                }
            }
        ];

        this.prompt(prompts, function (props) {
            this.options['skip-install'] = true;

            var regex = /^([1-9]\d*)x([1-9]\d*)$/,
                size = regex.exec(props.size);

            switch(props.color) {
                case colors.black:
                    props.color = 'rgb(0,0,0)';
                    break;
                case colors.white:
                    props.color = 'rgb(255,255,255)';
                    break;
                case colors.silver:
                    props.color = 'rgb(127,127,127)';
                    break;
                case colors.bordeaux:
                    props.color = 'rgb(93,7,73)';
                    break;
                case colors.petrol:
                    props.color = 'rgb(42,108,98)';
                    break;
                case colors.green:
                    props.color = 'rgb(99,111,3)';
                    break;
                case colors.neonPink:
                    props.color = 'rgb(232,50,120)';
                    break;
                default:
                    props.color = props.elseColor;
            }
//
//            if(props.color === 'transparent' || props.color === 'else') {
//                props.color = props.elseColor;
//            }

            if(props.dataBind && props.dataBindType === 'internal') {
                props.dataBindUrl = '/api/' + props.dataBindUrl
            }

            this.widget = {
                name: props.name,
                width: size[1],
                height: size[2],
                color: props.color,
                configurable: props.configurable,
                dataBind:  props.dataBind,
                dataBindType: props.dataBindType,
                dataBindUrl: props.dataBindUrl,
                dataBindInterval: props.dataBindInterval
            }

            done();
        }.bind(this));
    },

    app: function () {
      var camelName =  s(this.widget.name).camelize().s;

      this.mkdir(camelName);
      this.template('_config.js', camelName + '/config.js');
      this.template('_controller.js', camelName + '/controller.js');
      this.template('_style.scss', camelName + '/_style.scss');
      this.template('_front.html', camelName + '/' + camelName + '_front.html');

      if(this.widget.configurable) {
        this.template('_back.html', camelName + '/' + camelName + '_back.html');
      }
    }
});

module.exports = WidgetGenerator;