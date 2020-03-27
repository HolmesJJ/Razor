#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const assign = require('lodash/assign');
const chalk = require('chalk');

const createFile = require('./create-file');
const createFolder = require('./create-folder');

const buildComponentEntry = require('../bin/build-component-entry');
const buildStyleEntry = require('../bin/build-style-entry');

function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }

    return true;
}
// #TODO, 检测组件名称是否合法
function isCmpNameLegal(cmpName) {}

program
    .command('add [componentName]')
    .description('创建新的组件')
    .action(option => {
        let promps = [];

        if (option) {
            if (
                !fsExistsSync(
                    path.resolve(__dirname, `../../packages/${option}`)
                )
            ) {
                createFolder(option).then(cmpName => {
                    createFile(cmpName).then(success => {
                        console.log(success);
                        buildComponentEntry();
                        buildStyleEntry();
                    });
                });
            } else {
                console.log('组件已存在');
            }
        } else {
            let config = assign(
                {
                    componentName: null
                },
                option
            );
            if (config.componentName !== 'string') {
                promps.push({
                    type: 'input',
                    name: 'componentName',
                    message: '请输入组件名称',
                    validate: input => {
                        // 判断是否有输入
                        if (!input) {
                            return '组件名不能为空';
                        }
                        // 判断组件是否已经存在
                        if (
                            fsExistsSync(
                                path.resolve(
                                    __dirname,
                                    `../../packages/${input}`
                                )
                            )
                        ) {
                            return '组件已存在';
                        }
                        return true;
                    }
                });
            }
            inquirer.prompt(promps).then(answers => {
                createFolder(answers.componentName).then(cmpName => {
                    createFile(cmpName).then(success => {
                        console.log(success);
                        buildComponentEntry();
                        buildStyleEntry();
                    });
                });
            });
        }
    });

program.parse(process.argv);
