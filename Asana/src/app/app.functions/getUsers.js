const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
  const { dealStage } = context.parameters
  const token = "pat-na1-b4475a9a-541a-461a-bed0-ab46bb9b6812"
  return updateProps(token, dealStage)
    .then(() => {
      sendResponse({ status: 'success' })
    })
    .catch((e) => {
      sendResponse({ status: 'error', message: e.message })
    })
}

const updateProps = (token, dealStage) => {
  return axios.get(
    `https://app.asana.com/api/1.0/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
}