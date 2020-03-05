import React from 'react'
import { Text, Animated, Easing, TouchableOpacity, Image, StyleSheet,View } from 'react-native'
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import LoginScreen from '../../src/Login'
import Dashboard from '../Screens/Dashboard'
import Tendencias from '../Screens/Tendencias'
import Campanias from '../Screens/Campanias'
import Configuracion from '../Screens/Configuracion'
import Restablecer from '../Screens/RestablecerPass'
import Contacto from '../Screens/Contacto'
import DrawerContainer from '../Screens/DrawerContainer'
import Cambiar from '../Screens/CambiarPass'
import { Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../src/Redux/store';

var isDark = null;
var data = null;

const getDark = () => {
  data = store.getState()
  isDark = data.darkTheme
  return isDark.darkTheme
}

const ccsIcon = require('../../assets/images/logo.png');

// https://github.com/react-community/react-navigation/issues/1254
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
})


// drawer stack
const DrawerStack = createDrawerNavigator({
  Dashboard: { screen: Dashboard },
  Tendencias: { screen: Tendencias },
  Campañas: { screen: Campanias },
  Configuración: { screen: Configuracion },
  Cambiar: { screen: Cambiar },
  Contacto: { screen: Contacto }
}, {
  gesturesEnabled: false,
  contentComponent: DrawerContainer,
  unmountInactiveRoutes: true
})




const DrawerNavigation = createStackNavigator({

  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'float',
  defaultNavigationOptions: ({navigation}) => ({
    gestureResponseDistance: {
        horizontal: 45,
      },
      header: (
        <Appbar.Header style={{backgroundColor: getDark() ? '#3F3F3F' : 'white'}}>

          <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()}/>

          <View style={styles.container}>
          <View style={{flex:0, backgroundColor:"transparent", borderRadius:10, width:80, height:45, alignItems:"center", justifyContent:"center"}}>
          <View style={{width:'80%', height:60, alignItems:'center',marginLeft:'10%'}}>
          <Image source={ccsIcon} style={styles.logo}/>
          </View>

          </View>
          </View>

          <View style={{paddingRight:45}}>
        
        </View>

        </Appbar.Header>
      )
  })
})

// login stack
const LoginStack = createStackNavigator({
  loginScreen: { screen: LoginScreen, navigationOptions: { header:null, headerBackTitle: null } },
  restablecerScreen: { screen: Restablecer, navigationOptions: {title: 'Recuperar Contraseña', headerBackTitle: null, headerTintColor: 'black'} },
  //forgottenPasswordScreen: { screen: ForgottenPasswordScreen, navigationOptions: { title: 'Forgot Password' } }
}, {
    headerMode: 'screen',
    unmountInactiveRoutes: true
})

// Manifest of possible screens
const PrimaryNav = createAppContainer(createSwitchNavigator({
  loginStack: LoginStack ,
  drawerStack: DrawerNavigation
}))


export default PrimaryNav;
//export default PrimaryNav

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logo: {
    width: 90,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain'
  },
   

  });


