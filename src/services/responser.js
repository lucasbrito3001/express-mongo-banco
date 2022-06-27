class Responser {
    returnResponseObject(action_type, code, message, status, content = []) {
        const response = { code: code, message: message, status: status }

        if(action_type === 'read') response.data = content

        return response
    }
}

module.exports = new Responser()