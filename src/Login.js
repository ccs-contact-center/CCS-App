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
import { Button, List, withTheme, Theme } from 'react-native-paper';
import AuthService from '../src/Services/AuthService';
import md5 from 'md5'
import { SecureStore, LocalAuthentication, Assets } from 'expo';
import API_CCS from '../src/Services/API_CCS'
import MailAssets from '../src/mailAssets/mailAssets'

import { connect } from 'react-redux';
import { addProfile, setCampaign, darkTheme,setAvatar } from '../src/Redux/Actions/profile';


const background = require('../assets/images/login_background.png');
const ccsIcon = require('../assets/images/logo.png');
const faceID = require('../assets/images/faceid.png');
const touchID = require('../assets/images/touchid.png');




class Login extends React.Component{

  state = {
    username: '',
    password: '',

    isLoggingIn: false,
    hasHardware: null,
    supportedAuth: null,
    enrolledAuth: null,
    biometricActive: false,
    bioUser: '',
    bioPass: ''
  }



constructor(props) {

    super(props);
    this.Auth = new AuthService();
    this.API_CCS = new API_CCS();
    this._bootstrapAsync();
    

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

    SecureStore.getItemAsync("darktheme").then(res => {


      myStringTheme = (res == "true");
      this.props.darkTheme(myStringTheme)

    }).catch(err =>{
            console.log(null)
    })




  }


  requestAvatar = async () => {
          const response = await this.API_CCS.getCampaignAvatar(this.props.campaign)
          return response
  }
  restablecerPass = () => {
    this.props.navigation.navigate('restablecerScreen')
  }

  _bootstrapAsync = async () => {

    const userToken = await this.Auth.loggedIn();

    
    this.props.navigation.navigate(userToken ? 'drawerStack' : 'loginStack');
  };
  
  _userLogin = () => {




      this.setState({isLoggingIn:true})
        this.Auth.login(this.state.username,md5(this.state.password))
            .then(res =>{
                

              (this.state.hasHardware && this.state.supportedAuth == 2 && Platform.OS === "ios" && this.state.enrolledAuth && !this.state.biometricActive) 
                ? Alert.alert('Activar Face ID','¿Deseas activar Face ID para iniciar sesión?',[
                  {text: 'No',onPress: () => SecureStore.setItemAsync("biometricActive","false"),},
                  {text: 'Si', onPress: () => SecureStore.setItemAsync("biometricActive","true")},],{cancelable: false})
                : (this.state.hasHardware && this.state.supportedAuth == 1 && Platform.OS === "ios" && this.state.enrolledAuth && !this.state.biometricActive) 
                ? Alert.alert('Activar Touch ID','¿Deseas activar Touch ID para iniciar sesión?',[
                  {text: 'No',onPress: () => SecureStore.setItemAsync("biometricActive","false"),},
                  {text: 'Si', onPress: () => SecureStore.setItemAsync("biometricActive","true")},],{cancelable: false})
                : (this.state.hasHardware && Platform.OS === "android" && this.state.enrolledAuth && !this.state.biometricActive) 
                ? Alert.alert('Activar Biometrico','¿Deseas activar el lector de huella para iniciar sesión?',[
                  {text: 'No',onPress: () => SecureStore.setItemAsync("biometricActive","false"),},
                  {text: 'Si', onPress: () => SecureStore.setItemAsync("biometricActive","true")},],{cancelable: false})
                : null


                SecureStore.setItemAsync("user", this.state.username)
                SecureStore.setItemAsync("password", this.state.password)

                this.props.addProfile(res.recordset)

                this.props.setCampaign(res.recordset[0].campania)

                 this.requestAvatar()
                  .then(res =>{
                    //console.log(res[0].avatar)
                    this.props.setAvatar(res[0].avatar)
                  })
                  .catch(err => console.log(err))

                this.setState({isLoggingIn:false})
               
                this.props.navigation.navigate('drawerStack')
            })
            .catch(err =>{

                Alert.alert(
                  'Error',
                  'Usuario o contraseña invalidos'
                  )

                this.setState({username:"", password:"", isLoggingIn:false})
                
            })
    

  };

_userLoginBiometric = async () => {



LocalAuthentication.authenticateAsync().then(res => {


if (res.success) { 



        this.setState({isLoggingIn:true})
        this.Auth.login(this.state.bioUser,md5(this.state.bioPass))
            .then(res =>{
              
                this.setState({isLoggingIn:false})
                this.props.addProfile(res.recordset)
                this.props.setCampaign(res.recordset[0].campania)

                 this.requestAvatar()
                  .then(res =>{
                    //console.log(res[0].avatar)
                    this.props.setAvatar(res[0].avatar)
                  })
                  .catch(err => console.log(err))

                this.props.navigation.navigate('drawerStack')
            })
            .catch(err =>{

                Alert.alert(
                  'Error',
                  'Usuario o contraseña invalidos ' + err
                  )

                this.setState({username:"", password:"", isLoggingIn:false})
                
            })

          }


          

    }).catch(err =>{
            console.log(null)
    })



  };



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

       {(this.state.hasHardware && this.state.supportedAuth == 2 && Platform.OS === "ios" && this.state.enrolledAuth && this.state.biometricActive) 

        ? <View style={{width:'80%', height:200, alignItems:'center',marginLeft:'10%',}}><View style={{height: 90,width: '100%',backgroundColor: 'transparent',}}/><TouchableOpacity onPress={this._userLoginBiometric}><View style={{flex:0, backgroundColor:"rgba(30,30,30,0.4)", borderRadius:20, width:100, height:100, marginTop:-60, alignItems:"center", justifyContent:"center"}}><Image source={faceID} style={{width: 75, height: 75, tintColor: "rgba(255,255,255,0.7)"}}/></View></TouchableOpacity><Text style={styles.biometricLabel}>Face ID</Text></View> 

        : (this.state.hasHardware && this.state.supportedAuth == 1 && Platform.OS === "ios" && this.state.enrolledAuth && this.state.biometricActive) 

        ? <View style={{width:'80%', height:200, alignItems:'center',marginLeft:'10%'}}><View style={{height: 90,width: '100%',backgroundColor: 'transparent',}}/><TouchableOpacity onPress={this._userLoginBiometric}><View style={{flex:0, backgroundColor:"rgba(30,30,30,0.4)", borderRadius:20, width:100, height:100, marginTop:-60, alignItems:"center", justifyContent:"center"}}><Image  source={touchID} style={{width: 75, height: 75, tintColor: "rgba(255,255,255,0.7)"}}/></View></TouchableOpacity><Text style={styles.biometricLabel}>Touch ID</Text></View> 

        : (this.state.hasHardware && Platform.OS === "android" && this.state.enrolledAuth && this.state.biometricActive) 

        ? <View style={{width:'80%', height:200, alignItems:'center',marginLeft:'10%'}}><View style={{height: 90,width: '100%',backgroundColor: 'transparent',}}/><TouchableOpacity onPress={this._userLoginBiometric}><View style={{flex:0, backgroundColor:"rgba(30,30,30,0.4)", borderRadius:20, width:100, height:100, marginTop:-60, alignItems:"center", justifyContent:"center"}}><Image  source={touchID} style={{width: 75, height: 75, tintColor: "rgba(255,255,255,0.7)"}}/></View></TouchableOpacity><Text style={styles.biometricLabel}>Escanea tu Huella</Text></View> 

        : <View style={styles.wrapper}>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Usuario"
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              id="username"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              id="password"
            />
          </View>
          <View style={styles.container} />
          <View style={{height: 10,width: '100%',backgroundColor: 'transparent',}}/>
          <Button mode="contained" uppercase={false} disabled={this.state.isLoggingIn || !this.state.username || !this.state.password} onPress={this._userLogin} style={{shadowColor: 'rgba(0, 0, 0, 0.75)',shadowOffset: { width: 2, height: 10},shadowOpacity: 1,shadowRadius: 5, backgroundColor: (this.state.isLoggingIn || !this.state.username || !this.state.password) ? 'rgba(63,63,63,.5)' : 'rgba(63,63,63,1)'}}>
              Iniciar Sesión
          </Button>

        </View> }

          {this.state.isLoggingIn && <ActivityIndicator style={styles.activity}/>}

          <TouchableOpacity activeOpacity={.5} onPress={this.restablecerPass}>
            <View>
            <View style={{height: 50,width: '100%',backgroundColor: 'transparent',}}/>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu Password?</Text>
            </View>
          </TouchableOpacity>

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

    width:250,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowOffset: { width: 2, height: 8},
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
    setAvatar: (data) => {
      dispatch(setAvatar(data))
    }

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));