'use babel';

const util     = require('util');
const fs       = require("fs");
const exec = util.promisify(require('child_process').exec);
import Notify from './notifications';
import constant from './generator-const';


async function checkDevkitpro() {
  const { stdout, stderr } = await exec('echo ${DEVKITPRO}');
  if (stdout) {
    console.log('Devkitpro exist: ' + stdout);
    return true;
  }
  return false;
}

function writeMakefile(data) {
  try {
    let path = `${atom.project.getPaths()}/Makefile`;

    if (fs.existsSync(path)) {
      Notify.warn('Exist', 'Makefile already exist, creating new one.');

      let i = 0;
      for (; fs.existsSync(`${path}.${i}`); i++) {

      }
      path += '.'+i;
    }

    fs.writeFile(path, data, (err) => {
      if (err) {
        Notify.error(err.code, err.message);
        return;
      }
      Notify.info("Successfully", `Makefile was created. Path: ${path}`);
    });

  } catch(err) {
    Notify.error(err.code, err.message);
  }
}


export default class Generator {

  constructor() {

  }

  makefile(config) {
    let result = '';

    result += `\n.SUFFIXES:\n\n`;

    if (!config.devkitpro) {
      if (!checkDevkitpro()) {
        Notify.error('Devkitpro', 'There is no devkitpro in system, please write your own path to devkit.');
        return;
      }
    } else {
      result += `DEVKITPRO := ${config.devkitpro}\n\n`;
    }

    result += `TOPDIR ?= $(CURDIR) \ninclude $(DEVKITPRO)/libnx/switch_rules\n\n`;

    result += constant.BLOCK_SEPARATOR;
    result += constant.DEFAULT_PROPERTIES_COMMENTS;
    result += constant.BLOCK_SEPARATOR + `\n`;

    result += `#    PROPERTIES     \n`
    result += `TARGET      := ${config.properties.target   ? ('target/' + config.properties.target) : constant.DEFAULT_TARGET} \n`;
    result += `BUILD       := ${config.properties.build    ? config.properties.build    : constant.DEFAULT_BUILD}   \n`;
    result += `SOURCES     := ${config.properties.sources  ? config.properties.sources  : constant.DEFAULT_SOURCES} \n`;
    result += `ASSETS      := ${config.properties.assets   ? config.properties.assets   : constant.DEFAULT_ASSETS}  \n`;
    result += `APP_TITLE   := ${config.properties.title    ? config.properties.title    : constant.DEFAULT_TITLE}   \n`;
    result += `APP_AUTHOR  := ${config.properties.author   ? config.properties.author   : constant.DEFAULT_AUTHOR}  \n`;
    result += `APP_VERSION := ${config.properties.version  ? config.properties.version  : constant.DEFAULT_VERSION} \n`;
    result += `DATA        := ${config.properties.data     ? config.properties.data     : constant.DEFAULT_DATA}    \n`;
    result += `INCLUDES    := ${config.properties.includes ? config.properties.includes : constant.DEFAULT_INCLUDES}\n`;

    if (config.icon) {
      result += `ASSETS := ${config.icon} \n`;
    }

    if (config.romfs) {
      result += `ROMFS := ${config.romfs} \n`;
    }

    result += `\n#    FLAGS     \n`

    result += `ARCH     := ${constant.DEFAULT_ARCH}\n\n`;
    if (config.flags.arch) {
      result += `ARCH     += ${config.flags.arch}\n\n`;
    }

    result += `CFLAGS   := ${constant.DEFAULT_CFLAGS}\n\n`;
    result += `CFLAGS   += ${constant.DEFAULT_CFLAGS_SECOND}\n\n`;
    if (config.flags.c) {
      result += `CFLAGS   += ${config.flags.c}\n\n`;
    }

    result += `CXXFLAGS := ${constant.DEFAULT_CXXFLAGS}\n\n`;
    if (config.flags.cxx) {
      result += `CXXFLAGS += ${config.flags.cxx}\n\n`;
    }

    result += `ASFLAGS  := ${constant.DEFAULT_ASFLAGS}\n\n`;
    if (config.flags.as) {
      result += `ASFLAGS  += ${config.flags.as}\n\n`;
    }

    result += `LDFLAGS  := ${constant.DEFAULT_LDFLAGS}\n\n`;
    if (config.flags.ld) {
      result += `LDFLAGS  += ${config.flags.ld}\n\n`;
    }

    result += `LIBS     := ${constant.DEFAULT_LIBS}\n\n`;
    if (config.flags.libs) {
      result += `LIBS     += ${config.flags.libs}\n\n`;
    }

    result += `\n# list of directories containing libraries\n\n`;
    result += `LIBDIRS := ${constant.DEFAULT_LIBDIRS}\n\n`;
    if (config.libdirs) {
      result += `LIBDIRS += ${config.libdirs}\n\n`;
    }

    result += `\n\n${constant.LOGIC}`

    writeMakefile(result);

  }
}
