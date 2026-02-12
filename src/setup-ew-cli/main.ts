import { getInput } from '@actions/core';
import setupEwCli from './index.js';

const version = getInput('version');
void setupEwCli(version);
