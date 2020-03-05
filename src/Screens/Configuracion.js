import React, { Component } from 'react';
import { View, Text, Platform, Alert, ScrollView,ImageBackground } from 'react-native';
import { ListItem } from 'react-native-elements';
import { SecureStore, LocalAuthentication } from 'expo';
import { connect } from 'react-redux';
import { addProfile, setCampaign, darkTheme } from '../../src/Redux/Actions/profile';

const faceid = require('../../assets/images/touchid.png');
const notifications = require('../../assets/images/notifications.png');
const key = require('../../assets/images/key.png');
const forgot = require('../../assets/images/forgot.png');
const darktheme = require('../../assets/images/darktheme.png');
const background = require('../../assets/images/bg_bottom.png');

class Configuracion extends Component {

  constructor(props) {
    super(props);

    this.state = {
        username: '',
        password: '',
        isLoggingIn: false,
        hasHardware: null,
        supportedAuth: null,
        enrolledAuth: null,
        biometricActive: false,
        darktheme: false
    };



    LocalAuthentication.hasHardwareAsync().then(res => {

      this.setState({hasHardware:res})
    }).catch(err =>{
      console.log(null)
    })
    
    LocalAuthentication.supportedAuthenticationTypesAsync().then(res => {
      this.setState({supportedAuth:res[0]})
    }).catch(err =>{
      console.log(null)
    })

    LocalAuthentication.isEnrolledAsync().then(res => {
      this.setState({enrolledAuth:res})
    }).catch(err =>{
      console.log(null)
    })

    SecureStore.getItemAsync("biometricActive").then(res => {

      myString = (res == "true");
      this.setState({biometricActive:myString})

    }).catch(err =>{
      console.log(null)
    })

    SecureStore.getItemAsync("darktheme").then(res => {

      myString = (res == "true");
      this.setState({darktheme:myString})

    }).catch(err =>{
      console.log(null)
    })



  }



_changeTheme = () => {


if (this.props.darkTheme == true) {
  SecureStore.setItemAsync("darktheme","false")
  this.props.setDarkTheme(false)
} else
{
  SecureStore.setItemAsync("darktheme","true")
  this.props.setDarkTheme(true)
} 


}

_toggleBiometrics = () => {

   (this.state.biometricActive) 
   ?  SecureStore.setItemAsync("biometricActive","false").then(res => {
    myString = (res == "true");
    this.setState({biometricActive:false})
  }).catch(err =>{
    console.log(null)
  })
  :  SecureStore.setItemAsync("biometricActive","true").then(res => {
    myString = (res == "true");
    this.setState({biometricActive:true})
  }).catch(err =>{
    console.log(null)
  })


};


render() {

  const { navigation } = this.props


    return (
    

<ImageBackground style={{flex:1, width: null, height: null}} source={background} resizeMode="cover">
<ScrollView>
      <View style={{ flex: 1, margin:10}}>
  
            {this.state.hasHardware ? 
              <View>
                <ListItem

                leftAvatar={{ source: faceid, imageProps: {"resizeMode": "contain", backgroundColor:"white"}}}
                title={
                  (this.state.supportedAuth == 2 && Platform.OS === "ios" && this.state.enrolledAuth) 
                  ? "Utilizar Face ID"
                  : (this.state.supportedAuth == 1 && Platform.OS === "ios" && this.state.enrolledAuth) 
                  ? "Utilizar Touch ID"
                  : (Platform.OS === "android" && this.state.enrolledAuth) 
                  ? "Utilizar Huella Digital"
                  : null
                }
                titleStyle={{color:"rgba(0,0,0,.9)"}}
                subtitle={"Habilita el inicio de sesión biometrica"}
                subtitleStyle={{fontSize:11, color:"rgba(0,0,0,.7)"}}
                switch={{
                  value: this.state.biometricActive,
                  onValueChange: value => this._toggleBiometrics(),
                  trackColor: Platform.OS === "ios" ? {true: "#C00327", false: null} : null
                }}

                />

                <View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>

              </View>

            : null }


              <ListItem

                leftAvatar={{ source: darktheme, imageProps: {"resizeMode": "contain", backgroundColor:"white"}}}
                title={"Modo Obscuro"}
                titleStyle={{color:"rgba(0,0,0,.9)"}}
                subtitle={"Activa o desactiva el modo obscuro"}
                subtitleStyle={{fontSize:11, color:"rgba(0,0,0,.7)"}}
                switch={{
                  value: this.props.darkTheme,
                  onValueChange: value => this._changeTheme(),
                  trackColor: Platform.OS === "ios" ? {true: "#C00327", false: null} : null
                }}

              />

              <View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>

              <ListItem

                leftAvatar={{ source: notifications, imageProps: {"resizeMode": "contain", backgroundColor:"white"}}}
                title={"Notificaciones"}
                titleStyle={{color:"rgba(0,0,0,.9)"}}
                subtitle={"Activa o desactiva las notificaciones"}
                subtitleStyle={{fontSize:11, color:"rgba(0,0,0,.7)"}}
                switch={{
                  value: this.state.isOn,
                  onValueChange: value => this.setState({ isOn: value }),
                  trackColor: Platform.OS === "ios" ? {true: "#C00327", false: null} : null
                }}

              />

              <View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>

              <ListItem

                leftAvatar={{ source: key, imageProps: {"resizeMode": "contain", backgroundColor:"white"}}}
                title={"Cambiar Password"}
                titleStyle={{color:"rgba(0,0,0,.9)"}}
                subtitle={"Cambia el password de tu cuenta"}
                subtitleStyle={{fontSize:11, color:"rgba(0,0,0,.7)"}}
                onPress={()=>this.props.navigation.navigate('Cambiar')}

              />

              <View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>     

                         

      </View>
      </ScrollView>
      </ImageBackground>



    );
  }
}

const mapStateToProps = state => {
  return {
    darkTheme: state.darkTheme.darkTheme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDarkTheme: (isDarkTheme) => {
      dispatch(darkTheme(isDarkTheme))
    },

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Configuracion);