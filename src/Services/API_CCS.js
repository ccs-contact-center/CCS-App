import AuthService from './AuthService';


export default class API_CCS {


constructor() {
    
    this.Auth = new AuthService();
    this.fetch = this.fetch.bind(this) // React binding stuff
}
 

async fetch(url, options) {


		// performs api calls sending the required authentication headers
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}

		// Setting Authorization header
		// Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
		if (await this.Auth.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + await this.Auth.getToken()
		}

		return fetch(url, {
			headers,
			...options
		})
		.then(this._checkStatus)
		.then(response => response.json())
}

   getData(tipo, campania) {


       return this.fetch('https://api.ccscontactcenter.com/v1/campaigns/general/Application_Data?tipo=' + tipo + '&campania=' + campania, {    
            method: 'GET',
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }


  getUserProfile(user) {


       return this.fetch('https://api.ccscontactcenter.com/v1/users/Profile?user=' + user, {    
            method: 'GET',
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }

  getCampaignAvatar(id) {


       return this.fetch('https://api.ccscontactcenter.com/v1/campaigns/Avatar?id=' + id, {    
            method: 'GET',
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }    

   getCampanias() {


       return this.fetch('https://api.ccscontactcenter.com/v1/campaigns/Campanias', {    
            method: 'GET',
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }    

   getObjetivos(id) {


       return this.fetch('https://api.ccscontactcenter.com/v1/campaigns//general/Objetivos?campania=' + id, {    
            method: 'GET',
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }

   getCorreo(user) {

       return this.fetch('https://api.ccscontactcenter.com/v1/users/Mail?usuario=' + user, {    
            method: 'GET'
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }      

   sendMail(data) {

       return this.fetch('https://api.ccscontactcenter.com/v1/interface/send-email', {    
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            
            return Promise.resolve(res);
        })
   
    }      

   changePassword(data) {

       return this.fetch('https://api.ccscontactcenter.com/v1/auth/changePassword', {    
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            return Promise.resolve(res);
        })
        .catch(err =>{
          return Promise.resolve(err);
        })
   
    }          



}