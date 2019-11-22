export default {
    getAuthCode(client_id, stateValue, redirect_uri = '') {
        return fetch(`https://auth.bullhornstaffing.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&state=${stateValue}`, {
            method: 'GET'
        })
        .then(res => {
            return (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        })
    },

    getAccessToken(client_id, auth_code, client_secret, redirect_uri = '') {
        return fetch(`https://auth.bullhornstaffing.com/oauth/token?grant_type=authorization_code&code=${auth_code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`, {
            method: 'POST'
        })
        .then(res => {
            return (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        })
    },

    // Returns a new Access Token
    postRefreshToken(client_id, client_secret, refresh_token) {
        return fetch(`https://auth.bullhornstaffing.com/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}`, {
            method: 'POST'
        })
        .then(res => {
            return (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        })
    },

    // use version=* to get the latest version
    bullhornLogin(access_token) {
        return fetch(`https://rest.bullhornstaffing.com/rest-services/login?version=2.0&access_token=${access_token}`, {
            method: 'GET'
        })
        .then(res => {
            return (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        })
    },

    parseResume(access_token, file, file_name) {
        let data = new FormData();

        data.append('file', file);
        data.append('name', file_name)

        return fetch(`https://rest.bullhornstaffing.com/rest-services/${access_token}/resume/parseToCandidate?format=DOC`, {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            body: data
        })
        .then(res => {
            return (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        })
    }
}