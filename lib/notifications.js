'use babel';

export default  {
  error(msg, details) {
    if (!msg) {
      msg = 'Error';
    }
    atom.notifications.addError(msg, {
      dismissable: true,
      detail: details
    })
  },

  info(msg, details) {
    if (!msg) {
      msg = 'Info';
    }
    atom.notifications.addInfo(msg, {
      dismissable: true,
      detail: details
    })
  },

  warn(msg, details) {
    if (!msg) {
      msg = 'Warn';
    }
    atom.notifications.addWarning(msg, {
      dismissable: true,
      detail: details
    })
  }
}
