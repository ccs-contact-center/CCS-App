import decode from 'jwt-decode';
import {AsyncStorage} from 'react-native';
export default class AuthService {



    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'https://api.ccscontactcenter.com' // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(username, password) {
        // Get a token from api server using the fetch api
        //return this.fetch(`${this.domain}/login`, {
        return this.fetch(`https://api.ccscontactcenter.com/v1/auth/login`, {    
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            //console.log(res)
            this.setToken(res.token) // Setting the token in localStorage
            return Promise.resolve(res);
        })
    }

   async loggedIn() {

       const token = await this.getToken() // GEtting token from localstorage
       
       const expired = this.isTokenExpired(token)
      
        return !!token && !this.isTokenExpired(token) // handwaiving here

    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }


  setToken(idToken) {
    AsyncStorage.setItem('id_token', idToken)
  }

  async getToken(){

    return await AsyncStorage.getItem('id_token')

  }


  logout(){
    
    AsyncStorage.removeItem('id_token');

  }


    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}