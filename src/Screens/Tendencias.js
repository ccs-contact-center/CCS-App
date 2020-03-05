import React from 'react'
import { Dimensions, StyleSheet, Text, View, Image, ScrollView, RefreshControl, Alert, Platform, ActivityIndicator } from 'react-native'
import {CardChart} from '../Components/cardChart'
import { SecureStore, LinearGradient, Haptic } from 'expo';
import { ButtonGroup } from 'react-native-elements';
import { 
  VictoryChart,
  VictoryTheme,
  VictoryArea, VictoryLine, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip, VictoryAxis } from "victory-native";
import API_CCS from '../Services/API_CCS'
import moment from 'moment' 
import 'moment/locale/es';
import { connect } from 'react-redux';



moment.locale('es');



    const sampleData2=[
      { x: "01/04/2019", y: 350},


    ]

class Tendencias extends React.Component {
  
  // static navigationOptions = {
  //   drawerLabel: 'Screen Two',
  //   drawerIcon: () => (
  //     <Image
  //       source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=2`}}
  //       style={{width: 30, height: 30, borderRadius: 15}}
  //     />
  //   )
  // }

  constructor(props) {

    super(props)
    this.API_CCS = new API_CCS();
    this.state = {
      refreshing: false,
      selectedKPI: 2,
      selectedInterval: 2,

      data: [
        { x: "01/01/1900", y: 0},
        { x: "02/01/1900", y: 0},

      ],
      obj: [
        { x: "01/01/1900", y: 0},
        { x: "02/01/1900", y: 0},

      ],      
      minAxis: 0,
      maxAxis:1000,
      xAxisLimit: 0


  }

  this.updateKPI = this.updateKPI.bind(this)
  this.updateInterval = this.updateInterval.bind(this)


  }



round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }


getYear(numero){

 switch(numero) {
                  case "01":
                    return "Enero"
                    break;
                  case "02":
                    return "Febrero"
                    break;
                  case "03":
                    return "Marzo"
                    break;
                  case "04":
                    return "Abril"
                    break;   
                  case "05":
                    return "Mayo"
                    break; 
                  case "06":
                    return "Junio"
                    break;   
                  case "07":
                    return "Julio"
                    break;
                  case "08":
                    return "Agosto"
                    break;
                  case "09":
                    return "Septiembre"
                    break;
                  case "10":
                    return "Octubre"
                    break;   
                  case "11":
                    return "Noviembre"
                    break; 
                  case "12":
                    return "Diciembre"
                    break;                                                              
                  default:
                    // code block
            }


}


requestObjetivo = async () => {
    const response = await this.API_CCS.getObjetivos(this.props.campaign)
    return response
}

async updateGraphState(){



this.setState({refreshing: true});



var datos = await this.API_CCS.getData(this.state.selectedInterval,this.props.campaign);


var objetivo = ''

var arrObjetivo = await this.requestObjetivo()
//console.log(arrObjetivo)

   var labels = datos.map((Fecha) => Fecha.Fecha );



 switch(this.state.selectedKPI) {
                  case 0:
                    var datos = datos.map((data) => data.SLA*100 );
                    objetivo = arrObjetivo[0].SLA
                    break;
                  case 1:
                    var datos = datos.map((data) => data.ABA*100 );
                    objetivo = arrObjetivo[0].ABA
                    break;
                  case 2:
                    var datos = datos.map((data) => data.AHT );
                    objetivo = arrObjetivo[0].AHT
                    break;
                  case 3:
                    var datos = datos.map((data) => data.TalkTime*100 );
                    objetivo = arrObjetivo[0].TT
                    break;   
                  case 4:
                    var datos = datos.map((data) => data.Ocupacion*100 );
                    objetivo = arrObjetivo[0].OCCY
                    break; 
                  case 5:
                    var datos = datos.map((data) => data.Calidad*100 );
                    objetivo = arrObjetivo[0].QA
                    break;                                            
                  default:
                    // code block
            }




var arreglo = []
var objetivos = []

   if (labels.length == 1){



        switch(this.state.selectedInterval) {
            case 0:
              var elemento = {x: moment.utc(labels[0]).format('HH:mm'), y: this.round(datos[0],0)}
              break;
            case 1:

              var elemento = {x: moment.utc(labels[0]).format('dddd'), y: this.round(datos[0],0)}
              break;
            case 2:
              var elemento = {x: moment.utc(labels[0]).format('DD/MM/YYYY'), y: this.round(datos[0],0)}
              break;
            case 3:
              var elemento = {x: this.getYear(moment.utc(labels[0]).format('DD')), y: this.round(datos[0],0)}
              break;    
            default:
              // code block
          }

        
        arreglo.push(elemento)
        arreglo.push(elemento)


 
   

        switch(this.state.selectedInterval) {
            case 0:
              var objElemento = {x: moment.utc(labels[0]).format('HH:mm'), y: objetivo}
              break;
            case 1:
              var objElemento = {x: moment.utc(labels[0]).format('dddd'), y: objetivo}
              break;
            case 2:
              var objElemento = {x: moment.utc(labels[0]).format('DD/MM/YYYY'), y: objetivo}
              break;
            case 3:
              var objElemento = {x: this.getYear(moment.utc(labels[0]).format('DD')), y: objetivo}
              break;    
            default:
              // code block
          }

        
        objetivos.push(objElemento)
        objetivos.push(objElemento)



          this.setState({
            data: arreglo,
            obj: objetivos,
            minAxis: (((Math.min(...arreglo.map(s => s.y)) - 5 <0) ? 0 : Math.min(...arreglo.map(s => s.y)) - 5 ) >= objetivo ) == true ? objetivo -5 : ((Math.min(...arreglo.map(s => s.y)) - 5 <0) ? 0 : Math.min(...arreglo.map(s => s.y)) - 5 ),
            maxAxis: ((Math.max(...arreglo.map(s => s.y)) + 5 ) <= objetivo ) == true ? objetivo +5 : ((Math.max(...arreglo.map(s => s.y)) + 5 )),
            xAxisLimit: labels.length
          })
   


   } else {

      for (var i = 0; i < labels.length; i++) {
   

        switch(this.state.selectedInterval) {
            case 0:
              var elemento = {x: moment.utc(labels[i]).format('HH:mm'), y: this.round(datos[i],0)}
              break;
            case 1:
              var elemento = {x: moment.utc(labels[i]).format('dddd'), y: this.round(datos[i],0)}
              break;
            case 2:
              var elemento = {x: moment.utc(labels[i]).format('DD/MM/YYYY'), y: this.round(datos[i],0)}
              break;
            case 3:
              var elemento = {x: this.getYear(moment.utc(labels[i]).format('DD')), y: this.round(datos[i],0)}
              break;    
            default:
              // code block
          }

        
        arreglo.push(elemento)

        }

      for (var i = 0; i < labels.length; i++) {
   

        switch(this.state.selectedInterval) {
            case 0:
              var objElemento = {x: moment.utc(labels[i]).format('HH:mm'), y: objetivo}
              break;
            case 1:
              var objElemento = {x: moment.utc(labels[i]).format('dddd'), y: objetivo}
              break;
            case 2:
              var objElemento = {x: moment.utc(labels[i]).format('DD/MM/YYYY'), y: objetivo}
              break;
            case 3:
              var objElemento = {x: this.getYear(moment.utc(labels[i]).format('DD')), y: objetivo}
              break;    
            default:
              // code block
          }

        
        objetivos.push(objElemento)

        }        


 
          this.setState({
            data: arreglo,
            obj: objetivos,
            minAxis: (((Math.min(...arreglo.map(s => s.y)) - 5 <0) ? 0 : Math.min(...arreglo.map(s => s.y)) - 5 ) >= objetivo ) == true ? objetivo -5 : ((Math.min(...arreglo.map(s => s.y)) - 5 <0) ? 0 : Math.min(...arreglo.map(s => s.y)) - 5 ),
            maxAxis: ((Math.max(...arreglo.map(s => s.y)) + 5 ) <= objetivo ) == true ? objetivo +5 : ((Math.max(...arreglo.map(s => s.y)) + 5 )),
            xAxisLimit: labels.length
          })


this.setState({refreshing: false});



}

}

async componentDidMount() {


this.updateGraphState()

  }



updateKPI (selectedKPI) {

  Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium)

  this.setState({selectedKPI: selectedKPI}, function () {
        this.updateGraphState()
    });
}

updateInterval (selectedInterval) {

  Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium)

  this.setState({selectedInterval: selectedInterval}, function () {
        this.updateGraphState()
    });

}


  _onRefresh = async () => {
  
   
    this.updateGraphState();


  }

  render() {

  const buttons = ['SLA', 'ABA', 'AHT', "TalkTime", "OCCY", "QA"]
  const buttons2 = ['Dia', 'Semana', 'Mes', "Año"]

  const { selectedKPI, selectedInterval } = this.state

    return (
      //<ScrollView  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}>

        <View style={styles.container}>  
          
  

          <View style={{backgroundColor:"white", height:"64.5%", width:"100%", alignItems:"center",justifyContent:"center"}}>


          <Text style={{color:"rgba(192,3,39,1)", fontSize:23, fontWeight: "bold", marginTop:30, marginBottom:30}}>
          {
            this.state.selectedKPI == 0 ? "Nivel de Servicio" : this.state.selectedKPI == 1 ? "Abandono" : this.state.selectedKPI == 2 ? "AHT" : this.state.selectedKPI == 3 ? "Talk Time" :this.state.selectedKPI == 4 ? "Ocupación" : this.state.selectedKPI == 5 ? "Calidad" : null   

          } - 

          {
            this.state.selectedInterval == 0 ? " Dia" : this.state.selectedInterval == 1 ? " Semana" : this.state.selectedInterval == 2 ? " Mes" : this.state.selectedInterval == 3 ? " Año" : null

          }
            </Text>

      {this.state.refreshing 
            ? 
            <View style={{flex:1, flexDirection: "row",alignItems: "center", justifyContent:"center"}}>  
              <ActivityIndicator size="large"/><Text style={{marginLeft:20, color:"grey"}}>Cargando...</Text>
            </View>
            : 
            <VictoryChart
            domain={{y:[this.state.minAxis,this.state.maxAxis]}}
            theme={VictoryTheme.material}
            style={{grid:{stroke:'red'}}}
            animate={{
                  duration: 800, easing: 'bounce',
                  onLoad: { duration: 800, easing: 'bounce' }
                }} 
       
            padding={{ top: 25, bottom: 70, left:60, right:30 }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={this.state.selectedKPI ==2 ? (d) => d.y : (d) => d.y  + "%"}
                onActivated={() => Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium)}
                labelComponent={
                  <VictoryTooltip
                    pointerLength={4}
                    flyoutStyle={{
                      stroke: 'transparent', fill:'rgba(0,0,0,.5)', padding:15, data: {stroke:"white"}
                    }}
                  />
                }

              />}
            >
              <VictoryArea
                style={{ data: { fill: "rgba(192,3,39,.1)", stroke:"rgba(192,3,39,1)", strokeWidth:3 } , labels: { fill: "white", fontWeight:"bold" }}}
                data={this.state.data}
                interpolation="monotoneX" 
              />
              <VictoryArea
                style={{ data: { fill: "transparent", stroke:"rgba(0,0,0,1)", strokeWidth:1.5 } , labels: { fill: "white", fontWeight:"bold" }}}
                data={this.state.obj}
                interpolation="monotoneX" 
              />

              <VictoryAxis standalone={false} style={{ tickLabels: {fontSize: 10, padding: 35, angle: 90}, grid: {stroke:'transparent'}}}/>

                 <VictoryAxis dependentAxis
                 standalone={false}
                style={{ tickLabels: {fontSize: 12},grid: {stroke:'transparent'} }}
              />

              
            
            </VictoryChart>}


          </View>
          <View style={{backgroundColor:"rgba(150,150,150,1)", width:"100%", height:"1%"}}/>

          <LinearGradient 
            start={{x: 0, y: 0.75}} 
            end={{x: 1, y: 0.25}}
            colors={['rgba(192,3,39,1)','rgba(192,3,39,.9)']}
            style={{ height:"34.5%", width:"100%",alignItems:"center",justifyContent:"center"}}
          >
          <View style={{width:"100%", textAlign:"left", paddingLeft:20}}>
          <Text style={{color:"white"}}>Indicador</Text>
          </View>
            <ButtonGroup
              onPress={this.updateKPI}
              selectedIndex={selectedKPI}
              buttons={buttons}
              containerStyle={{height: 30, backgroundColor:"transparent", borderRadius:15}}
              textStyle={{color:"white", fontSize:12}}
              selectedButtonStyle={{backgroundColor:"white"}}
              selectedTextStyle={{color:"#C00327"}}
            />
            <View height={30}/>
            <View style={{width:"100%", textAlign:"left", paddingLeft:20}}>
            <Text style={{color:"white"}}>Intervalo</Text>
            </View>
            <ButtonGroup
              onPress={this.updateInterval}
              selectedIndex={selectedInterval}
              buttons={buttons2}
              containerStyle={{height: 30, backgroundColor:"transparent", borderRadius:15}}
              textStyle={{color:"white", fontSize:12}}
              selectedButtonStyle={{backgroundColor:"white"}}
              selectedTextStyle={{color:"#C00327"}}
            />
            </LinearGradient>
          </View>

      //</ScrollView>
  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    height: (Platform.OS=="ios") ? Dimensions.get('window').height -100 : Dimensions.get('window').height -80
  }
});

const mapStateToProps = state => {
  return {
    campaign: state.campaign.campaign
  }
}

export default connect(mapStateToProps)(Tendencias);

