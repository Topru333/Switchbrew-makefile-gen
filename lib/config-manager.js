'use babel';

import { CompositeDisposable } from 'atom';
const jsonfile = require('jsonfile')

export default class ConfigManager {

  constructor() {
    this.json_path = atom.project.getPaths() + "/mf_config.json";
  }

  readJson() {
    jsonfile.readFile(this.json_path, function (err, obj) {
      if (err) {
        console.error(err);
      }
      console.dir(obj);
    })
    return this.json_path;
  }

}
