const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { dealId, value } = context.parameters
    const token = "pat-na1-61a34a29-c617-4b56-b4dd-2d5a683b5a3e"
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