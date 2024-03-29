import React from 'react'
import { useState } from 'react'
import AuthServices from './services/auth-services'
import './styles.css'

function App(props) {

    const [resumeInfo, setResumeInfo] = useState({})
    const [clientId, setClientId] = useState(null)
    const [stateValue, setStateValue] = useState(null)
    const [clientSecret, setClientSecret] = useState(null)
    const [redirectUrl, setRedirectUrl] = useState('')
    const [authCode, setAuthCode] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [error, handleError] = useState(null);

    // * Get Authorization Code
    function handleGetAuthCode(event) {
        event.preventDefault()

        if (!clientId || !stateValue) return
        if (!redirectUrl) redirectUrl = ''

        AuthServices.getAuthCode(clientId, stateValue, redirectUrl)
            .then((code) => {
                setAuthCode(code)
                handleError(null);
            })
            .catch(e => handleError(e))
    }

    // * Use creds from Authorization Code to 
    // * get an Access Token
    function handleGetAccessToken(event) {
        event.preventDefault()

        if (!clientId || !authCode || ! clientSecret) return
        if (!redirectUrl) redirectUrl = ''

        AuthServices.getAccessToken(clientId, authCode, clientSecret, redirectUrl)
    }

    // * After Access Token expires, use the 
    // * Refresh Token to get a new one
    function handlePostRefreshToken(event) {
        event.preventDefault()
        
        if (!clientId || !clientSecret || !refreshToken) return

        AuthServices.postRefreshToken(clientId, clientSecret, refreshToken)
            .then(token => {
                setAccessToken(token)
                handleError(null)
            })
            .catch(e => handleError(e))
    }

    // * Get a resume .doc from the user and
    // * send it to the Bullhorn API
    function handleFileUpload({ contents }) {
        const file = contents[0]

        AuthServices.parseResume('access_token', file, 'testName')
            .then(data => {
                setResumeInfo(data)
                handleError(null)
            })
            .catch(e => handleError(e))
    }

    function formatResumeData() {
        if (!resumeInfo) return

        for (const [key, value] of Object.entries(resumeInfo)) {
            return (
                <div key={key}>
                    <div>{key + ': '}</div>
                    <div>{value}</div>
                </div>
            )
        }
    }


    return (
        <div className='App'>
            <div className='resume-info'>
                <div>{ resumeInfo && formatResumeData() }</div>
            </div>
            <fieldset className='token-field'>
                <form>
                    <input type='file' onChange={(event) => handleFileUpload(event)}></input>
                    <button onClick={(event) => handleGetAuthCode(event)}>Get Authorization Code</button>
                    <button onClick={(event) => handleGetAccessToken(event)}>Get Access Token</button>
                    <button onClick={(event) => handlePostRefreshToken(event)}>Post Refresh Token</button>
                </form>
            </fieldset>
        </div>
    )
}

export default App