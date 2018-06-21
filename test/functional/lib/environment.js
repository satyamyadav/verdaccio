// @flow

import chalk from 'chalk';
import path from 'path';
import NodeEnvironment from 'jest-environment-node';
import {VerdaccioConfig} from "../../lib/verdaccio-server";
import VerdaccioProcess from "../../lib/server_process";
import Server from "../../lib/server";
import ExpressServer from "./simple_server";
import type {IServerBridge} from '../../types';

const EXPRESS_PORT = 55550;

class FunctionalEnvironment extends NodeEnvironment {
  config: any;

  constructor(config: any) {
    super(config)
  }

  async startWeb() {
    const express: any = new ExpressServer();

    return await express.start(EXPRESS_PORT);
  }


  async setup() {
    const SILENCE_LOG = !process.env.VERDACCIO_DEBUG;
    // $FlowFixMe
    const DEBUG_INJECT: boolean = process.env.VERDACCIO_DEBUG ? process.env.VERDACCIO_DEBUG : false;
    const forkList = [];
    const serverList = [];
    const pathStore = path.join(__dirname, '../store');
    const listServers = [
      {
        port: 55551,
        config: '/config-1.yaml',
        storage: '/test-storage'
      },
      {
        port: 55552,
        config: '/config-2.yaml',
        storage: '/test-storage2'
      },
      {
        port: 55553,
        config: '/config-3.yaml',
        storage: '/test-storage3'
      }
    ];
    console.log(chalk.green('Setup Verdaccio Servers'));

    const app = await this.startWeb();
    this.global.__WEB_SERVER__ = app;

    for (let config of listServers) {
      const verdaccioConfig = new VerdaccioConfig(
        path.join(pathStore, config.storage),
        path.join(pathStore, config.config),
        `http://localhost:${config.port}/`, config.port);
      console.log(chalk.magentaBright(`Running registry ${config.config} on port ${config.port}`));
      const server: IServerBridge = new Server(verdaccioConfig.domainPath);
      serverList.push(server);
      const process = new VerdaccioProcess(verdaccioConfig, server, SILENCE_LOG, DEBUG_INJECT);

      const fork = await process.init();
      console.log(chalk.blue(`Fork PID ${fork[1]}`));
      forkList.push(fork);
    }

    this.global.__SERVERS_PROCESS__ = forkList;
    this.global.__SERVERS__ = serverList;
  }

  async teardown() {
    await super.teardown();
    console.log(chalk.yellow('Teardown Test Environment.'));
    // this.global.__VERDACCIO_E2E__.stop();
    // this.global.__VERDACCIO__PROTECTED_E2E__.stop();
    // close verdaccios
    for (let server of this.global.__SERVERS_PROCESS__) {
      server[0].stop();
    }
    // close web server
    this.global.__WEB_SERVER__.server.close();
  }

  runScript(script: string) {
    return super.runScript(script);
  }
}

module.exports = FunctionalEnvironment;
