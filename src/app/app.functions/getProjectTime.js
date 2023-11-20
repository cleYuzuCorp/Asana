const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { idAsana } = context.parameters
    const token = "ffa3-c6d9-996d60-b9fb1a-022b7662"
    return getProjectTime(token, idAsana)
        .then((data) => {
            sendResponse({ status: 'success', data: data.data })
        })
        .catch((e) => {
            sendResponse({ status: 'error', message: e.message })
        })
}

const getProjectTime = (token, idAsana) => {
    return axios.get(
        `https://api.everhour.com/projects/as:${idAsana}/time`,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': token
            }
        }
    )
}