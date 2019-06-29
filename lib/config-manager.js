'use babel';

import Notify from './notifications';
const jsonfile = require('jsonfile')

function testJson(obj, callback) {
  let warnings = [];

  if (!obj.properties.title) {
    warnings.push('title');
  }

  if (!obj.properties.author) {
    warnings.push('author');
  }

  if (warnings.length > 0) {
    callback(warnings);
  }

  return warnings;
}

export default class ConfigManager {

  constructor() {
    this.default_path = atom.project.getPaths() + "/mf_config.json";
  }

  async readJson(path) {
    if (!path) {
      path = this.default_path;
    }

    let config;

    let promise = new Promise((resolve, reject) => {
      jsonfile.readFile(path, function (err, obj) {
        if (err) {
          reject(err);
        } else {
          resolve(obj);
        }
      })
    });

    promise.catch(err => {
      Notify.error('error', err.toString());
    });

    await promise.then((obj) => {
      console.log('Json file have been loaded.');
      config = obj;
    });

    if (!config) {
      return;
    }

    testJson(config, (wproperties) => {
      Notify.warn('Empty properties', wproperties.join(', '));
    });

    return config;
  }

}
