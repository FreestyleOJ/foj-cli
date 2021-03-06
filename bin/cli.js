#!/usr/bin/env node
'use strict';
var color = require('bash-color');
var _ = require('lodash');
var program = require('commander');
var submit = require('../lib/submit');
var $p = require('procstreams');
require('shelljs/global');

program
    .version('0.0.5')
    .usage('check more at http:24oj.cf');
program
    .command('OnlineJudge <cmd>')
    .alias('OJ')
    .description('specifying an OnlineJudge')
    .option('-s, --set <aliasOfOJ>', 'set an alias for an OnlineJudge')
    .option('-l, --list', 'list the OnlineJudges with the aliases')
    .action(function(cmd, options){
        var md = typeof options.set == 'string' ? options.set : '';
        console.log('%s %s', cmd, md);
    }).on('--help', function() {
        console.log('  Examples:');
        console.log('    foj OJ -l');
        console.log('    foj OJ -s PKUOJ POJ');
        console.log();
    });

program
    .command('list')
    .description('list files in current working directory')
    .option('-a, --all', 'Whether to display hidden files')
    .action(function(options) {
        var fs = require('fs');
        fs.readdir(process.cwd(), function(err, files) {
            var list = files;
            if (!options.all) {
                list = files.filter(function(file) {
                    return file.indexOf('.') !== 0;
                });
            }
            console.log(list.join(', '));
        });
    });

program
    .command('init <name>')
    .description('Init a name for a problem')
    // .option('-n --name', 'The name of the file')
    .action(function(name) {
        var fs = require('fs');
        var curcwd = process.cwd();
        if (!name) {
            console.error('No name provided');
        }
        var exec = require('child_process').exec, child;
        var cmd = 'subl ' + String(name) + '.cpp';
        child = exec(cmd, function(error, stdout, stderr) {
            if (error !== null) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                console.log('exec error: ' + error);
            }
        });
    });

program
    .command('test <name>')
    .description('Test a problem')
    .action(function(name) {
        var fs = require('fs');
        var curcwd = process.cwd();
        if (!name) {
            console.error('No name provided');
        }
        var exec = require('child_process').exec, child;
        var cmd = 'g++ ' + String(name) + '.cpp -o a -g';
        // var testcmd = curcwd + '/a';
        if (!which('g++')) {
            echo('Sorry, this script requires g++');
            exit(1);
        }
        console.log(color.green(cmd));
        child = exec(cmd, function(error, stdout, stderr) {
            if (error !== null) {
                console.log('stdout: ' + stdout);
                console.log('exec error: ' + error);
                console.log('stderr: ' + stderr);
            }
        });
    });

program.parse(process.argv);
