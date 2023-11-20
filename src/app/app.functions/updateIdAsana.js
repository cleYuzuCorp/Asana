const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { dealId, value } = context.parameters
    const token = "pat-na1-410db506-cb67-4366-9aee-c6571b593416"
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