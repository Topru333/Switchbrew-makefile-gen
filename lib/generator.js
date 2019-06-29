'use babel';

const util = require('util');
const fs   = require("fs");
const exec = util.promisify(require('child_process').exec);
import Notify from './notifications';

const DEFAULT_TARGET   = 'target/$(notdir $(CURDIR))';
const DEFAULT_BUILD    = 'build';
const DEFAULT_SOURCES  = 'sources';
const DEFAULT_ASSETS   = 'assets';
const DEFAULT_TITLE    = 'BestTitle';
const DEFAULT_AUTHOR   = 'BestAuthor';
const DEFAULT_VERSION  = '1.0';
const DEFAULT_DATA     = 'data';
const DEFAULT_INCLUDES = 'include';

const DEFAULT_PROPERTIES_COMMENTS = `
#---------------------------------------------------------------------------------
# TARGET is the name of the output
# BUILD is the directory where object files & intermediate files will be placed
# SOURCES is a list of directories containing source code
# DATA is a list of directories containing data files
# INCLUDES is a list of directories containing header files
# ROMFS is the directory containing data to be added to RomFS, relative to the Makefile (Optional)
#
# NO_ICON: if set to anything, do not use icon.
# NO_NACP: if set to anything, no .nacp file is generated.
# APP_TITLE is the name of the app stored in the .nacp file (Optional)
# APP_AUTHOR is the author of the app stored in the .nacp file (Optional)
# APP_VERSION is the version of the app stored in the .nacp file (Optional)
# APP_TITLEID is the titleID of the app stored in the .nacp file (Optional)
# ICON is the filename of the icon (.jpg), relative to the project folder.
#   If not set, it attempts to use one of the following (in this order):
#     - <Project name>.jpg
#     - icon.jpg
#     - <libnx folder>/default_icon.jpg
#
# CONFIG_JSON is the filename of the NPDM config file (.json), relative to the project folder.
#   If not set, it attempts to use one of the following (in this order):
#     - <Project name>.json
#     - config.json
#   If a JSON file is provided or autodetected, an ExeFS PFS0 (.nsp) is built instead
#   of a homebrew executable (.nro). This is intended to be used for sysmodules.
#   NACP building is skipped as well.
#---------------------------------------------------------------------------------\n\n`;

async function checkDevkitpro() {
  const { stdout, stderr } = await exec('echo env${DEVKITPRO}');
  if (stdout) {
    Notify.info('Devkitpro have found:', stdout);
    return true;
  }
  return false;
}

export default class Generator {

  constructor() {

  }

  makefile(config) {
    let result = `.SUFFIXES:\n\n`;

    if (!config.devkitpro) {
      if (!checkDevkitpro()) {
        Notify.error('Devkitpro', 'There is no devkitpro in system, please write your own path to devkit.');
        return;
      }
    } else {
      result += `DEVKITPRO := ${config.devkitpro}\n\n`;
    }

    result += `TOPDIR ?= $(CURDIR) \ninclude $(DEVKITPRO)/libnx/switch_rules\n\n`;

    result += DEFAULT_PROPERTIES_COMMENTS;

    result += `TARGET       := ${config.target   ? ('target/' + config.target) : DEFAULT_TARGET} \n`;
    result += `BUILD        := ${config.build    ? config.build    : DEFAULT_BUILD}   \n`;
    result += `SOURCES      := ${config.sources  ? config.sources  : DEFAULT_SOURCES} \n`;
    result += `ASSETS       := ${config.assets   ? config.assets   : DEFAULT_ASSETS}  \n`;
    result += `APP_TITLE    := ${config.title    ? config.title    : DEFAULT_TITLE}   \n`;
    result += `APP_AUTHOR   := ${config.author   ? config.author   : DEFAULT_AUTHOR}  \n`;
    result += `APP_VERSION  := ${config.version  ? config.version  : DEFAULT_VERSION} \n`;
    result += `DATA         := ${config.data     ? config.data     : DEFAULT_DATA}    \n`;
    result += `INCLUDES     := ${config.includes ? config.includes : DEFAULT_INCLUDES}\n`;

    if (config.icon) {
      result += `ASSETS        := ${config.icon} \n`;
    }

    if (config.romfs) {
      result += `ROMFS         := ${config.romfs} \n`;
    }

    fs.writeFile(`${atom.project.getPaths()}/Makefile`, result, (err) => {
      if (err) {
        Notify.error(err.code, err.message);
        return;
      }
      Notify.info("Successfully", 'Makefile was created');
    });
  }
}
