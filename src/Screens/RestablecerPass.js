import React, {Component} from 'react';
import {
  StyleSheet, 
  View, 
  TextInput,
  Alert, 
  Text, 
  ImageBackground, 
  Image,Dimensions, 
  SafeAreaView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform } from 'react-native';
import { Button, List, withTheme, type Theme } from 'react-native-paper';
import AuthService from '../../src/Services/AuthService';
import MailAssets from '../../src/mailAssets/mailAssets'
import md5 from 'md5'
import { SecureStore, LocalAuthentication, Assets } from 'expo';
import API_CCS from '../../src/Services/API_CCS'
import { Buffer } from 'buffer'

import { connect } from 'react-redux';
import { addProfile, setCampaign, darkTheme } from '../Redux/Actions/profile';


const background = require('../../assets/images/login_background.png');
const ccsIcon = require('../../assets/images/forgotB.png');




class Restablecer extends React.Component{

  state = {
    username: '',
    password: '',

    isLoggingIn: false,
    biometricActive: false,
    bioUser: '',
    bioPass: ''
  }



constructor(props) {

    super(props);
    this.Auth = new AuthService();
    this.API_CCS = new API_CCS();
    this.MailAssets = new MailAssets();
 
    

  
    
 

   

    SecureStore.getItemAsync("biometricActive").then(res => {

      myString = (res == "true");
      this.setState({biometricActive:myString})

    }).catch(err =>{
            console.log(null)
    })


   SecureStore.getItemAsync("user").then(res => {

      this.setState({bioUser:res})

    }).catch(err =>{
            console.log(null)
    })

    SecureStore.getItemAsync("password").then(res => {

      this.setState({bioPass:res})

    }).catch(err =>{
            console.log(null)
    })



  }





sendMail = async () => {

  this.setState({isLoggingIn:true})

try {
    var email = await this.API_CCS.getCorreo(this.state.username)

if (email.length == 0) {

      Alert.alert('Usuario Invalido','El usuario que ingresaste no es válido o no está registrado',[
                  {text: 'Ok',onPress: () => this.setState({username:null}),},
                 ],
                  {cancelable: false})
    
      this.setState({isLoggingIn:false})

} else {

    var body = {
      username: this.state.username,
      mail: email[0].email
    }

  var base64 = new Buffer(JSON.stringify(body)).toString('base64');
    //console.log(JSON.stringify(body))
    //console.log(base64)


    var datitos = {
      to: email[0].email,
      subject:"Recuperacion de Contraseña",
      body: this.MailAssets.getMail(base64)
    }

  this.API_CCS.sendMail(datitos)
    .then(res =>{
      this.setState({isLoggingIn:false})
      Alert.alert('Correo Enviado','Se ha enviado un correo para restablecer tu contraseña',[
                  {text: 'Ok',onPress: () => this.props.navigation.navigate('loginScreen'),},
                 ],
                  {cancelable: false})
    })
    SecureStore.setItemAsync("biometricActive","false")
    .catch(err =>{
       Alert.alert('Error de Conexión','Al parecer, no tienes conexión a internet, intenta mas tarde',[
                  {text: 'Ok',onPress: () => this.props.navigation.navigate('loginScreen'),},
                 ],
                  {cancelable: false})     
      this.setState({isLoggingIn:false})
    })
    

  };

  } catch (err){

Alert.alert('Error de Conexión','Al parecer, no tienes conexión a internet, intenta mas tarde ' + err,[
                  {text: 'Ok',onPress: () => this.props.navigation.navigate('loginScreen'),},
                 ],
                  {cancelable: false})     
      this.setState({isLoggingIn:false})

    
  }

}











render() {


    return (
       <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <ImageBackground 
        style={[styles.background, styles.container]} 
        source={background}
        resizeMode="cover"
      >
        <View style={styles.container} />
        <View style={{width:'80%', height:200, alignItems:'center',marginLeft:'10%'}}>
          <Image source={ccsIcon} style={styles.logo}/>
        </View>

        <View style={{height: 40,width: '100%',backgroundColor: 'transparent',}}/>

        <View style={styles.wrapper}>
       
              <Text style={styles.forgotPasswordText}>Ingresa tu usuario o el correo electronico registrado.</Text>
               
        </View>    

        <View style={{height: 40,width: '100%',backgroundColor: 'transparent',}}/>

         <View style={styles.wrapper}>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Usuario o Correo Electronico"
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              id="username"
            />
          </View>
          <View style={styles.container} />
          <View style={{height: 20,width: '100%',backgroundColor: 'transparent',}}/>
          {this.state.isLoggingIn ? <ActivityIndicator size="large" color="black"/>
          : <Button mode="contained" uppercase={false} disabled={this.state.isLoggingIn || !this.state.username} onPress={this.sendMail} style={{shadowColor: 'rgba(0, 0, 0, 0.75)',shadowOffset: { width: 2, height: 10},shadowOpacity: 1,shadowRadius: 5, backgroundColor: (this.state.isLoggingIn || !this.state.username) ? 'rgba(63,63,63,.5)' : 'rgba(63,63,63,1)'}}>
              Enviar
          </Button>}
          
        </View> 

          


        <View style={styles.container} />

      </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: null,
    height: null
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    backgroundColor: "transparent",
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowOffset: { width: 2, height: 10},
    shadowOpacity: 1,
    shadowRadius: 5, 
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',

  },

  forgotPasswordText: {
    color: "rgba(255,255,255,0.7)",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize:17,
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 3},
    shadowOpacity: 1,
    textShadowRadius: 0
  },
  logo: {

    width:150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0,.75)',
    shadowOffset: { width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 5, 
    resizeMode:'contain'
  },
    biometricLabel: {
    marginTop: 25,
    fontSize:20,
    color: "rgba(255,255,255,0.7)",
    backgroundColor: "transparent",
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 3},
    shadowOpacity: 1,
    textShadowRadius: 0
  },

  });


const mapStateToProps = state => {
  return {
    profile: state.profile.profile,
    campaign: state.campaign.campaign,
    darkTheme: state.darkTheme.darkTheme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addProfile: (name) => {
      dispatch(addProfile(name))
    },
    setCampaign: (id) => {
      dispatch(setCampaign(id))
    },
    darkTheme: (isDarkTheme) => {
      dispatch(darkTheme(isDarkTheme))
    },

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Restablecer);