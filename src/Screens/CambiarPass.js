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


const ccsIcon = require('../../assets/images/forgot.png');
const background = require('../../assets/images/bg_bottom.png');


class Cambiar extends React.Component{

  state = {
    username: '',
    password: '',
    confirm: '',
    isLoggingIn: false,
    bioUser: ''
  }



constructor(props) {

    super(props);
    this.Auth = new AuthService();
    this.API_CCS = new API_CCS();
    this.MailAssets = new MailAssets();



   SecureStore.getItemAsync("user").then(res => {

      this.setState({bioUser:res})

    }).catch(err =>{
            console.log(null)
    })


  }





sendMail = () => {

const { navigation } = this.props

this.setState({isLoggingIn:true})

var datos = {
  username: this.state.bioUser,
  password: md5(this.state.password)
}


  this.API_CCS.changePassword(datos)
    .then(res => {
      this.props.navigation.navigate('Dashboard')
      Alert.alert('Correcto','¡Se ha actualizado tu contraseña!',[
                  {text: 'Ok',onPress: () => this.setState({username:null}),},
                 ],
                  {cancelable: false}) 
    SecureStore.setItemAsync("biometricActive","false")
    this.setState({isLoggingIn:false})


    })
    .catch(err => {
      Alert.alert('Error','¡Ha ocurrido un error!',[
                  {text: 'Ok',onPress: () => this.setState({username:null}),},
                 ],
                  {cancelable: false}) 
    this.setState({isLoggingIn:false})       
    })


this.setState({isLoggingIn:false})
}

render() {


    return (
      <ImageBackground style={{flex:1, width: null, height: null}} source={background} resizeMode="cover">

       <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >

        <View style={styles.container} />

        <View style={{width:'80%', height:200, alignItems:'center',marginLeft:'10%'}}>
          <Image source={ccsIcon} style={styles.logo}/>
        </View>

        <View style={{height: 35,width: '100%',backgroundColor: 'transparent',}}/>

        <View style={styles.wrapper}>
       
              <Text style={{fontSize:18, fontWeight: 'bold', textAlign:'center', justifyContent:'center', color: 'rgba(50,50,50,.7)'}}>Ingresa una contraseña que te sea fácil de recordar.</Text>
              <Text style={{fontSize:18, fontWeight: 'bold', textAlign:'center', justifyContent:'center', color: 'rgba(50,50,50,.7)'}}></Text>
              <Text style={{fontSize:14, fontWeight: 'bold', textAlign:'center', justifyContent:'center', color: 'rgba(50,50,50,.7)'}}>Distingue entre mayúsculas y minúsculas</Text>
        </View>    

        <View style={{height: 20,width: '100%',backgroundColor: 'transparent',}}/>

         <View style={styles.wrapper}>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Ingresa tu nueva contraseña"
              style={styles.input}
              secureTextEntry
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              id="password"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(confirm) => this.setState({confirm})}
              value={this.state.confirm}
              id="confiirm"
            />
          </View>
          <View style={styles.container} />
          <View style={{height: 20,width: '100%',backgroundColor: 'transparent',}}/>

          {(this.state.password || this.state.confirm) && (this.state.password != this.state.confirm )

          ? <View>
            <Text style={{textAlign:'center', fontSize:13, color: '#C00327'}}>¡Las contraseñas deben coincidir!</Text>
            <View style={{height: 20,width: '100%',backgroundColor: 'transparent',}}/>
          </View>
          : null }

          {this.state.isLoggingIn ? <ActivityIndicator size="large" color="black"/>
          : <Button mode="contained" uppercase={false} disabled={(this.state.isLoggingIn || !this.state.password || !this.state.confirm) || (this.state.password != this.state.confirm )} onPress={this.sendMail} style={{backgroundColor: (this.state.isLoggingIn || !this.state.password || !this.state.confirm || (this.state.password != this.state.confirm )) ? 'rgba(63,63,63,.4)' : 'rgba(0,0,0,.7)'}}>
              Cambiar
          </Button>}
          <View style={{height: 150,width: '100%',backgroundColor: 'transparent',}}/>
        </View> 

          


        <View style={styles.container} />

      </KeyboardAvoidingView>
      </ImageBackground>
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
    backgroundColor: "transparent"
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingLeft: 25,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(0,0,0,.6)',
    borderWidth: 1.5,
    borderRadius: 10
  },

  forgotPasswordText: {
    color: "#FFF",
    backgroundColor: "transparent",
    textAlign: "center"
  },
  logo: {
    width:150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain'
  },
    biometricLabel: {
    marginTop: 25,
    fontSize:20,
    color: "rgba(70,70,70,.9)",
    backgroundColor: "transparent",
    textAlign: "center",
    fontWeight: "bold"
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
export default connect(mapStateToProps,mapDispatchToProps)(Cambiar);