#!/usr/bin/env ts-node

import * as Path from 'path';
import VueRunner from '../';

const path = Path.resolve(__dirname, 'Testit.vue');
const vueRunner = new VueRunner(path);

vueRunner.attachAPI(apiServer => {
  apiServer.get('/', (req, res) => {
    res.send('Working!')
  });

  apiServer.get('/name', (req, res) => {
    res.send('Caleb')
  });
});
