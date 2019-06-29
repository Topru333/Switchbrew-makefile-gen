'use babel';

export default  {
  error(msg, details) {
    atom.notifications.addError(msg, {
      dismissable: true,
      detail: details
    })
  },

  info(msg, details) {
    atom.notifications.addInfo(msg, {
      dismissable: true,
      detail: details
    })
  },

  warn(msg, details) {
    atom.notifications.addWarning(msg, {
      dismissable: true,
      detail: details
    })
  }
}
