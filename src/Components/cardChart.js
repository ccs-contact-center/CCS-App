import React from 'react';
import {
  Avatar,
  Paragraph,
  Card,
  Button,
  IconButton,
  withTheme,
  Text,
  type Theme,
} from 'react-native-paper';
import { Alert, ScrollView, StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import { VictoryChart, VictoryLine, VictoryGroup, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip, VictoryLabel } from "victory-native";
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { Haptic } from 'expo';

const data = [
  { quarter: 1, earnings: 13},
  { quarter: 2, earnings: 16},
  { quarter: 3, earnings: 14},
  { quarter: 4, earnings: 19}
];



class CardChart extends React.Component {



  render() {
    return (

    <View style={styles.content}>
          <Card style={{borderRadius:10, margin: 4, backgroundColor: this.props.color}}>
            <Card.Content>

              <TouchableOpacity onPress={() => {Alert.alert(this.props.color)}} style={{position: 'absolute', right: 10, top: 10}}>
                <EvilIcons name="refresh" size={30} color={(this.props.theme == 'dark') ? 'black' : 'white'} />
              </TouchableOpacity>

          <Text style={{color:(this.props.theme == 'dark') ? 'black' : 'white', fontSize:30}}>25</Text>
          <Text style={{color:(this.props.theme == 'dark') ? 'black' : 'white'}}>Quejas</Text>

            <VictoryGroup 
              data={data} 
              x="quarter" 
              y="earnings"  
              style={{ parent: { maxWidth: "50%" }}} 
              padding={{left:15, right: 66, top: 40, bottom: 10}} 
              height={120}
              animate={{
                  duration: 500,
                  onLoad: { duration: 500 }
                }} 
              containerComponent={
              <VictoryVoronoiContainer
                labels={(d) => d.earnings}
                onActivated={() => Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium)}
                labelComponent={
                  <VictoryTooltip
                    
                    pointerLength={4}
                    flyoutStyle={{
                      stroke: 'transparent', fill:'rgba(0,0,0,.5)', padding:6
                    }}
                  />
                }

              />}>
              
              <VictoryLine 
                interpolation="monotoneX" 
                style={{ data: { stroke: (this.props.theme == 'dark') ? 'black' : '#E2E6E8'}, labels:{fontSize:0.0000000000001, fill:'white'}}}/>

                <VictoryScatter size={5} style={
                  {data: 
                    { fill: this.props.color,  stroke: (this.props.theme == 'dark') ? 'black' : '#E2E6E8', strokeWidth: 1.5 } ,
                    labels: {fill: "white"}
                  }}/>

            </VictoryGroup>
          </Card.Content>
        </Card>
     </View>            

    )
  }
}

const styles = StyleSheet.create({

  content: {
    padding: 4,
  }

});

export { CardChart }



