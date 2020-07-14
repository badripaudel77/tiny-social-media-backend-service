

class HttpError extends Error {
    constructor(errorMsg, errorCode) {
        super(errorMsg)
        this.errorCode = errorCode
    }
}

module.exports = HttpError