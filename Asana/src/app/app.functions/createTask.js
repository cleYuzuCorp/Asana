const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { project } = context.parameters

    return createTask(project)
        .then((data) => {
            sendResponse({ status: 'success', data: data.data },)
        })
        .catch((e) => {
            sendResponse({ status: 'error', message: e.message })
        })
}

const createTask = (project) => {
    return refreshAccessToken()
        .then((newToken) => {
            return axios.post(
                'https://app.asana.com/api/1.0/tasks',
                {
                    data : {
                        name: 'Passation',
                        projects: [project],
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            )
        })
}

const refreshAccessToken = () => {
    const refreshToken = "2/1204730887006934/1205951601419302:193f502db8325134524f9c6972d30e10"
    const clientId = "1205951601419302"
    const clientSecret = "4e4435b7d23f8fc6151f98e09fe4a20d"
    const codeVerifier = "fdsuiafhjbkewbfnmdxzvbuicxlhkvnemwavx"

    return axios.post(
        'https://app.asana.com/-/oauth_token',
        `grant_type=refresh_token&refresh_token=${refreshToken}&code_verifier=${codeVerifier}`,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            }
        }
    )
        .then((response) => {
            if (response.data && response.data.access_token) {
                return response.data.access_token
            } else {
                throw new Error("Unable to refresh access token.")
            }
        })
}