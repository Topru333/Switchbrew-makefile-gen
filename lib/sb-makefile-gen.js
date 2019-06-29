'use babel';

import SbMakefileGenView from './sb-makefile-gen-view';
import ConfigManager from './config-manager';
import Generator from './generator';
import { CompositeDisposable } from 'atom';

export default {

  sbMakefileGenView: null,
  modalPanel: null,
  subscriptions: null,
  configManager: null,
  generator: null,

  activate(state) {
    this.sbMakefileGenView = new SbMakefileGenView(state.sbMakefileGenViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sbMakefileGenView.getElement(),
      visible: false
    });

    this.configManager = new ConfigManager();
    this.generator     = new Generator();
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sb-makefile-gen:toggle': () => this.toggle(),
      'sb-makefile-gen:generate_json': () => this.gen_json(),
      'sb-makefile-gen:generate_makefile': () => this.gen_makefile()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sbMakefileGenView.destroy();
  },

  serialize() {
    return {
      sbMakefileGenViewState: this.sbMakefileGenView.serialize()
    };
  },

  toggle() {
    console.log('SbMakefileGen was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  gen_json() {
    console.log('gen_json was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  gen_makefile() {
    let config = this.configManager.readJson();
    if (!config) {
      return;
    }
    this.generator.makefile(config);
  }

};
