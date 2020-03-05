import React from 'react'
import { StyleSheet, View, Image, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {
  Drawer,
  withTheme,
  Switch,
  TouchableRipple,
  Text,
  Colors,
  type Theme,
} from 'react-native-paper';
import AuthService from '../../src/Services/AuthService';
import { SecureStore } from 'expo';
import { connect } from 'react-redux';

var DrawerItemsData = [];



class DrawerContainer extends React.Component {

  state = {
    open: false,
    drawerItemIndex: 0,
    biometricActive:false
  };

  constructor(props) {
    super(props);
    this.Auth = new AuthService();


try {

  this.props.profile[0].su == 1 
      ? DrawerItemsData = [
         { label: 'Dashboard', icon: 'home', key: 0 },
         { label: 'Tendencias', icon: 'dashboard', key: 1 },
         { label: 'Campañas', icon: 'apps', key: 2 },
         { label: 'Configuración', icon: 'settings', key: 3 },
         { label: 'Contacto', icon: 'chat', key: 4 },]
      : DrawerItemsData = [
         { label: 'Dashboard', icon: 'home', key: 0 },
         { label: 'Tendencias', icon: 'dashboard', key: 1 },
         { label: 'Configuración', icon: 'settings', key: 3 },
         { label: 'Contacto', icon: 'chat', key: 4 },]
 }   

catch (e) {
  
      DrawerItemsData = [
           { label: 'Dashboard', icon: 'home', key: 0 },
           { label: 'Tendencias', icon: 'dashboard', key: 1 },
           { label: 'Configuración', icon: 'settings', key: 3 },
           { label: 'Contacto', icon: 'chat', key: 4 },
       ]

}


  }


_setDrawerItem = (index, label) => {

  const { navigation } = this.props

  this.setState({ drawerItemIndex: index })
  navigation.navigate(label)

};



  _bootstrapAsync = async () => {

    const userToken = await this.Auth.loggedIn();
    this.props.navigation.navigate(userToken ? 'drawerStack' : 'loginStack');

  };   



 _signOutAsync = async () => {

    await AsyncStorage.clear();
    this.props.navigation.navigate('loginStack');

  };


  render() {
    const { colors } = this.props.theme;
    const { navigation } = this.props
    this._bootstrapAsync();

    return (
      <View style={[styles.drawerContent, { backgroundColor: "colors.surface" }]}>
      
        <Drawer.Section title="Bienvenido">

          {DrawerItemsData.map((props, index) => (
            <Drawer.Item
              {...props}
              key={props.key}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(index, props.label)}
            />
          ))}

        </Drawer.Section>




         <Drawer.Section>

         
            <Drawer.Item
              label="Logout"
              icon='exit-to-app'
              onPress={this._signOutAsync}
            />
     
        </Drawer.Section>


      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
    paddingHorizontal: 20
  },
   preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})

const mapStateToProps = state => {
  return {
    profile: state.profile.profile,
    campaign: state.campaign.campaign,
    darkTheme: state.darkTheme.darkTheme
  }
}

export default connect(mapStateToProps)(withTheme(DrawerContainer));
//export default withTheme(DrawerContainer);