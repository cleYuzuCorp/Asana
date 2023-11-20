const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { dealId, value } = context.parameters
    const token = "pat-na1-b4475a9a-541a-461a-bed0-ab46bb9b6812"
    return updateIdAsana(token, dealId, value)
        .then((data) => {
            sendResponse({ status: 'success', data: data.data },)
        })
        .catch((e) => {
            sendResponse({ status: 'error', message: e.message })
        })
}

const updateIdAsana = (token, dealId, value) => {
    return axios.patch(
        `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
        {
            properties: {
                idasana: value
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }
    )
}