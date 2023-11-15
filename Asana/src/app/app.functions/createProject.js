const axios = require('axios')

exports.main = (context = {}, sendResponse) => {
    const { name, admin, associate } = context.parameters

    return createProject(name, admin, associate)
        .then(() => {
            sendResponse({ status: 'success' })
        })
        .catch((e) => {
            sendResponse({ status: 'error', message: e.message })
        })
}

const createProject = (name, admin, associate) => {
    return refreshAccessToken()
        .then((newToken) => {
            return axios.post(
                'https://app.asana.com/api/1.0/projects',
                {
                    data: {
                        name: name,
                        owner: admin,
                        followers: associate
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    },
                },
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
            },
        },
    )
        .then((response) => {
            if (response.data && response.data.access_token) {
                return response.data.access_token
            } else {
                throw new Error("Unable to refresh access token.")
            }
        })
}