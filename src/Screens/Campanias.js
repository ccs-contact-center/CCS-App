import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import { Haptic, SecureStore } from 'expo';
import API_CCS from '../Services/API_CCS'
import { connect } from 'react-redux';
import { setCampaign, setAvatar } from '../../src/Redux/Actions/profile';

const logo = require('../../assets/images/logo.png');
const background = require('../../assets/images/bg_bottom.png');

class Campanias extends Component {

  constructor(props) {

    super(props);
    this.API_CCS = new API_CCS();
    this.state = {
      loading: false,
      data: [],
      error: null,
      selectedItem: "1",
      refreshing: false,
    };

    this.arrayholder = [];
  }


  _onRefresh = () => {

    this.setState({refreshing: true});

    this.makeRemoteRequest();

    this.setState({refreshing: false})
  }

  setSelected = (selected, avatar) =>  {

    this.setState({ selectedItem: selected });
    this.props.setCampaign(selected)
    this.props.setAvatar(avatar)

    Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium)

  };

  componentDidMount() {

    this.makeRemoteRequest();

    this.setState({selectedItem: this.props.campaign});


  }

  makeRemoteRequest = async () => {


  try {

    this.setState({ loading: true });
    var datos = await this.API_CCS.getCampanias();

        this.setState({
            data: datos,
            //data: mockData.campanias,
            error: datos.error || null,
            loading: false,
          });
          this.arrayholder = datos;  

    } catch (e) {

      this.setState({ e, loading: false });

    }


  };



  renderSeparator = () => {

    return (
      <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',

      }}/>
      );

  };

  searchFilterFunction = text => {

    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {

      const itemData = `${item.campania.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {

    return (

      <Searchbar
        placeholder="Buscar"
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.value}/>
      );

  };

  render() {

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large"/><Text allowFontScaling={false} style={{marginLeft:20, color:"grey"}}>Cargando...</Text>
        </View>
      );
    }
    return (
    
     <ImageBackground style={{flex:1, width: null, height: null}} source={background} resizeMode="cover">

      <View style={{ flex: 1, margin:15}}>
      <View height={610}>

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              underlayColor={"rgba(192,3,39,.15)"}
              leftAvatar={{ source: {uri: item.avatar}, imageProps: {"resizeMode": "center", backgroundColor:"white"}}}
              //title={`${item.name.first} ${item.name.last}`}
              title={item.campania}
              onPress={() => this.setSelected('' + item.id_campania, item.avatar)}
              containerStyle={{backgroundColor: ('' + item.id_campania == this.state.selectedItem) ? "rgba(192,3,39,1)" : null, borderRadius:15, marginTop:5, marginBottom:5}}
              titleStyle={{color: ('' + item.id_campania == this.state.selectedItem) ? "white" : null, fontSize: 18, textTransform: "capitalize"}}
            />
          )}
          keyExtractor={item => '' + item.id_campania}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          extraData={this.state}
          refreshing={this.state.refreshing} 
          onRefresh={this._onRefresh}
        />

      </View>
      </View>
      </ImageBackground>

    );
  }
}


const mapStateToProps = state => {
  return {
    campaign: state.campaign.campaign,
    avatar: state.setAvatar.setAvatar
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCampaign: (id) => {
      dispatch(setCampaign(id))
    },
    setAvatar: (data) => {
      dispatch(setAvatar(data))
    }

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Campanias);
