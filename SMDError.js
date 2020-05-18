/**
 * Error that could be thrown when importing a SMD file
 */
class SMDError extends Error {

  /**
   * Creates an SMDError
   * @param {String} message Error message
   * @param {Number} smdLineNumber Line number in the SMD file
   * @param {String} SMDLine Content of the line in the SMD file
   */
  constructor(message, smdLineNumber, SMDLine) {
    super(message);
    this.smdLineNumber = smdLineNumber;
    this.smdLine = SMDLine;
  }

  toString() {
    return message + "\n\tIn line: " + this.smdLineNumber + "\n\tLine content: " + this.smdLine;
  }

}

module.exports = SMDError;