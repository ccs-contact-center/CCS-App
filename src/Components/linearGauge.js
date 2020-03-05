import React from 'react';
import {
  Avatar,
  Paragraph,
  Card,
  Button,
  IconButton,
  withTheme,
  Text,
  Theme,
} from 'react-native-paper';
import { Alert, ScrollView, StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import { VictoryChart, VictoryLine, VictoryGroup, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip, VictoryLabel,VictoryStack,VictoryBar,VictoryClipContainer } from "victory-native";
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { Haptic, Svg } from 'expo';



class LinearGauge extends React.Component {



  render() {

  var strokeColor = null;

      if (this.props.value <this.props.obj*.8 )  {
        strokeColor = "rgba(192,3,39,0.5)"
      } else if (this.props.value <this.props.obj) {
        strokeColor = "rgba(255,215,0,0.5)"
      } else {
        strokeColor = "rgba(0,128,0,0.5)"
      }

    return (

<View style={styles.svgContainer}>

<Svg height={(this.props.height==200) ? 25 : 0} width={300} style={styles.svg1}>



          <Svg.Rect
            x={0}
            y={5}
            width={(Math.round(((Math.round((this.props.obj*.9)/10)*10)*.9)/10)*10)*3}
            height={6}
            fill="rgba(192,3,39,0.5)"
          />
          <Svg.Rect
            x={(Math.round(((Math.round((this.props.obj*.9)/10)*10)*.9)/10)*10)*3}
            y={5}
            width={(300-(Math.round(((Math.round((this.props.obj*.9)/10)*10)*.9)/10)*10)*3)}
            height={6}
            fill="rgba(255,215,0,0.5)"
          />
          <Svg.Rect
            x={this.props.obj*3}
            y={5}
            width={(300-(Math.round(((Math.round((this.props.obj*.9)/10)*10)*.9)/10)*10)*3)}
            height={6}
            fill="rgba(0,128,0,0.5)"
          />
          <Svg.Circle
            cy={8}
            cx={(this.props.value*3)}
            r={6}
            fill="rgba(226,230,232,1)"
            stroke={strokeColor}
            strokeWidth={2.5}
          />          


</Svg>

</View>

    )
  }
}


class InvertedLinearGauge extends React.Component {



  render() {

var strokeColor = null;

 
if (this.props.obj > 100) {

  if (this.props.value*30 <= this.props.obj)  {
    strokeColor = "rgba(0,128,0,0.5)"
  } else if (this.props.value*30 < (this.props.obj*6)/3) {
    strokeColor = "rgba(255,215,0,0.5)"
  } else {
    strokeColor = "rgba(192,3,39,0.5)"
  }

} else {

  if (this.props.value <= this.props.obj)  {
    strokeColor = "rgba(0,128,0,0.5)"
  } else if (this.props.value < (this.props.obj*6)/3) {
    strokeColor = "rgba(255,215,0,0.5)"
  } else {
    strokeColor = "rgba(192,3,39,0.5)"
  }

}




    return (
<View style={styles.svgContainer}>


{ this.props.obj > 100 


? <Svg height={(this.props.height==200) ? 25 : 0} width={300} style={styles.svg1}>

          <Svg.Rect
            x={0}
            y={5}
            width={30}
            height={6}
            fill="rgba(0,128,0,0.5)"
          />
          <Svg.Rect
            x={30}
            y={5}
            width={30}
            height={6}
            fill="rgba(255,215,0,0.5)"
          />          
          <Svg.Rect
            x={60}
            y={5}
            width={240}
            height={6}
            fill="rgba(192,3,39,0.5)"
          />


          <Svg.Circle
            cy={8}
            cx={this.props.value*3}
            r={6}
            fill="rgba(226,230,232,1)"
            stroke={strokeColor}
            strokeWidth={2.5}
          />          


</Svg>  

: <Svg height={(this.props.height==200) ? 25 : 0} width={300} style={styles.svg1}>

          <Svg.Rect
            x={0}
            y={5}
            width={this.props.obj*3}
            height={6}
            fill="rgba(0,128,0,0.5)"
          />
          <Svg.Rect
            x={this.props.obj*3}
            y={5}
            width={this.props.obj*6}
            height={6}
            fill="rgba(255,215,0,0.5)"
          />          
          <Svg.Rect
            x={this.props.obj*6}
            y={5}
            width={(300-(this.props.obj*6))}
            height={6}
            fill="rgba(192,3,39,0.5)"
          />


          <Svg.Circle
            cy={8}
            cx={this.props.value*3}
            r={6}
            fill="rgba(226,230,232,1)"
            stroke={strokeColor}
            strokeWidth={2.5}
          />          


</Svg>

}

</View>

    )
  }
}

const styles = StyleSheet.create({
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  svg1:{

    alignItems: 'center',
    justifyContent: 'center',
     }
})


export { LinearGauge, InvertedLinearGauge }



