class Responser {
    returnResponseObject(code, message, status, action_type, content = []) {
        const response = { code: code, message: message, status: status }

        if(action_type === 'read') response.data = content

        return response
    }
}

module.exports = new Responser()