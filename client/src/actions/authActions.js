import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import { GET_ERRORS, SET_CURRENT_USER } from './types'


// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// login and get user token
export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // save to localstorage
            const { token } = res.data
            // set token to localstorage
            localStorage.setItem('jwtToken', token);
            // set token to auth header
            setAuthToken(token);
            // decode tokent to get user data
            const decoded = jwt_decode(token);
            // set current user
            dispatch(setCurrentUser(decoded))
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
}

// set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// log out user
export const logoutUser = () => dispatch => {
    // remove token from localstorage
    localStorage.removeItem('jwtToken')
    // remove auth header for future purpose
    setAuthToken(false)
    // set current user to {} which will set authenticated to false
    dispatch(setCurrentUser({}))
}