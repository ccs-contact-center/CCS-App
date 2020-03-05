import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  NativeModules,
  LayoutAnimation,
  UIManager,
  ScrollView,
  RefreshControl,
  ImageBackground
} from "react-native";
import { Haptic, Svg, SecureStore } from "expo";
import { VictoryLabel, VictoryPie, VictoryAnimation } from "victory-native";
import { Avatar } from "react-native-paper";
import { LinearGauge, InvertedLinearGauge } from "../Components/linearGauge";
import API_CCS from "../Services/API_CCS";
import { connect } from "react-redux";

const background = require("../../assets/images/bg_bottom.png");

var base64Icon =
  "data:image/png;base64,iVBRw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kTtIw0Acxr+mlYpUHMwgIhKkOlkQXzhqFYpQIdQKrTqYR1/QpCFJcXEUXAsOPharDi7Oujq4CoLgA8TF1UnRRUr8X1JoEePBcT++u+/j7juAq5cVzQqNAZpum6lEXMhkV4XwK0IYBI8pDEmKZcyJYhK+4+seAbbexViW/7k/R7easxQgIBDPKoZpE28QT2/aBuN9Yl4pSirxOfGoSRckfmS67PEb44LLHMvkzXRqnpgnFgptLLexUjQ14kniqKrplM9lPFYZbzHWylWleU/2wkhOX1lmOs0BJLCIJYgQIKOKEsqwEaNVJ8VCivbjPv5+1y+SSyZXCQo5FlCBBsn1g/3B726t/MS4lxSJAx0vjvMxDIR3gUbNcb6PHadxAgSfgSu95a/UgZlP0mstLXoE9GwDF9ctTd4DLneAvidDMiVXCtLk8nng/Yy+KQv03gJda15vzX2cPgBp6ip5AxwcAiMFyl73eXdne2//nmn29wPH/3LJzj2y0AAAAAZiS0dEAFwAFwCTdM/uvgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+MEHhQ6D7d7jaQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAeLElEQVR42u3deZSk1Xnf8e99q6qre6a36aGZgdEwDMgGyUalJUhgLRBkyz0ISwErR7GN4yR2JOecJDpKZJ8TH+fYUU4W6RzbUmJrs4QEAiQrEZLIAK0NSTgsWkDUIBDDMgjEDMxMd0/v3bW8780f91aoqamq91b1OvD7/GMf1NNV9Xa9z/vc5z73XhARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE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xXRrT0PtxxnNQJ2BVdov7vViTwrNEX4esuXETbr2erK5HB7jW3B7Uj6N2COd/hLtvnMvVmMOQp8CaKOHzIKWLLhcrkcuHVtnRTdE9xeV3etIEBcuIqZ7uPAF621a7JzqzFmooMMa5c/VLVbo7h96WeBTwD3dZJd+YL9G/zvMU0C+7eAg90cPKyAJRs/ZndDwk6XsBwCbsxms10FiJ6ensgHrNVYCziHO735R2uYhVZw5yCmBXWDa2Po7eZ1fLB5oy8nXI/r21rs7LfYLPAWmm+G+DTwucC9tE6xxjUsY8GeAB5sUieYYHW6m8FNjT6wwfdd1dcZbF0GcBj4MRtTK7S4wmbZDyUe3QSxaRl3IMRJZmZmrDHmkLX2AcL2RYqBcWPMPZ00iZ70mK9U+nH1vYdW4XM9Bdy0ffv2pYmJtdka309M/BRXs0uruU0DQ1u3bjULCwsdZjF2ANdIeyfw0S73+t+B68xvXLpUckNBDnR7aMsa30hRAvHduFXtpsmX7sRKXyFfuN2WimM34JZBbLRjEPnhiSmB/QLuwIGNDBC1nRD+hI3fBqV2Ht+pX8RsdqZSqbw/sPZigSlr7cwKAsCStfYzwBdW4XMt5nK55yYmJtZsNtoH5s8B+wNGRokx5kjnwQpwM9j3APdC9HyXb/f1NO+/+glwS74w3nULzel8xLqIrLJScazPJQLjS13++37gPwHv4+QZ6kngg8AnOusHW9cMS0ROJ90GqjrnAL/SEKzKwNdx9bDySn65iu4islrZWQ63o+lFDcP3+4GPgJla6WsoYInIahkC3skLqxUsblbwo0BxNU5HV8ASkVXIrvZFuJnBX/Fxpbbc6lPA/pUOBRWwRGQV2S24XVFre8pPAh/HFdkXVutVFLBEZIXZ1dsNrpXhClxbyiTwN8BH8oXxE6v5WpolFJEVigeA38Ttu3UUt5znr/OF8anVfiUFLBFZQXa1z4B9HW7boIM+s7opXxifX4vXU8ASkRWwQ8Cv4TZR/BRwd74wXlqrV8vogotId9nVVQaSIVwt/AYwB0J3JBUR2YghYaZUHOvRlRARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERF5kfl/siC0VP1mEw4AAAAASUVORK5CYII=";

var CustomLayoutSpring = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 700
  }
};

class Dashboard extends React.Component {
  renderButton(index) {
    return (
      <TouchableOpacity
        key={"button" + index}
        margin={1}
        style={{
          flex: 1,
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(115,114,118,0.08)",
          flexGrow: 1,
          margin: 4,
          borderRadius: 10
        }}
        onPress={() => this.onPress(index)}
      >
        <Text>{index}</Text>
      </TouchableOpacity>
    );
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });

    this.setState({
      data: this.getData(0)
    });

    var datos = await this.API_CCS.getData(4, this.props.campaign);

    this.setState({
      SLA: datos[0].SLA,
      ABA: datos[0].ABA,
      AHT: datos[0].AHT,
      TT: datos[0].TalkTime,
      OCC: datos[0].Ocupacion,
      QA: datos[0].Calidad
    });

    let percent = this.round(this.state.SLA * 100, 2);
    this.setState({
      percent,
      data: this.getData(percent)
    });

    this.setState({
      curTime: new Date().toLocaleString()
    });
    this.setState({ refreshing: false });
  };

  onPress = index => {
    LayoutAnimation.configureNext(CustomLayoutSpring);

    this.state.index == index && this.state.toggler == false
      ? this.setState({ toggler: true })
      : this.setState({ toggler: false });

    this.setState({ index: index });

    Platform.OS === "ios" && Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
  };

  requestObjetivo = async () => {
    const response = await this.API_CCS.getObjetivos(this.props.campaign);
    return response;
  };

  getData(percent) {
    return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
  }

  round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  getColor(value, objetive, porcentual, upOrDown) {

    console.log('value: '+ value + ' objetive' + objetive + ' lokes' + (300 -
      Math.round((Math.round((objetive * 0.9) / 10) * 10 * 0.9) / 10) *
        10 *
        3) /
      2)
    if (porcentual == 1 && upOrDown == 1) {
      if (
        value <
        objetive * .8
      ) {
        return "rgba(192,3,39,0.5)";
      } else if (value < objetive) {
        return "rgba(255,215,0,1)";
      } else {
        return "rgba(0,128,0,0.5)";
      }
    } else if (porcentual == 1 && upOrDown == 0) {
      if (value <= objetive) {
        return "rgba(0,128,0,0.5)";
      } else if (value < (objetive * 6) / 3) {
        return "rgba(255,215,0,1)";
      } else {
        return "rgba(192,3,39,0.5)";
      }
    } else if (porcentual == 0 && upOrDown == 1) {
      return "rgba(0,0,0,0.5)";
    } else if (porcentual == 0 && upOrDown == 0) {
      if (value * 30 <= objetive) {
        return "rgba(0,128,0,0.5)";
      } else if (value * 30 < (objetive * 6) / 3) {
        return "rgba(255,215,0,1)";
      } else {
        return "rgba(192,3,39,0.5)";
      }
    } else {
      return "rgba(0,0,0,0.5)";
    }
  }

  constructor(props) {
    super(props);

    if (this.props.profile[0].su == 0) {
    } else {
    }

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    this.API_CCS = new API_CCS();

    this.state = {
      index: 0,
      refreshing: false,
      toggler: false,
      curTime: new Date().toLocaleString(),
      percent: 0,
      data: this.getData(0),
      SLA: null,
      ABA: null,
      AHT: null,
      TT: null,
      OCC: null,
      QA: null,
      objetivos: [
        {
          ABA: 0,
          AHT: 0,
          OCCY: 0,
          QA: 0,
          SLA: 0,
          TT: 0,
          campania: 0,
          id_campania: 0
        }
      ]
    };

    // this.API_CCS.getCampaignAvatar(this.props.campaign)
    // .then(res =>{
    //   console.log('avatar fetched')
    //   base64Icon = res[0].avatar

    // })
    // .catch(err =>{

    // base64Icon = 'data:image/png;base64,iVBRw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kTtIw0Acxr+mlYpUHMwgIhKkOlkQXzhqFYpQIdQKrTqYR1/QpCFJcXEUXAsOPharDi7Oujq4CoLgA8TF1UnRRUr8X1JoEePBcT++u+/j7juAq5cVzQqNAZpum6lEXMhkV4XwK0IYBI8pDEmKZcyJYhK+4+seAbbexViW/7k/R7easxQgIBDPKoZpE28QT2/aBuN9Yl4pSirxOfGoSRckfmS67PEb44LLHMvkzXRqnpgnFgptLLexUjQ14kniqKrplM9lPFYZbzHWylWleU/2wkhOX1lmOs0BJLCIJYgQIKOKEsqwEaNVJ8VCivbjPv5+1y+SSyZXCQo5FlCBBsn1g/3B726t/MS4lxSJAx0vjvMxDIR3gUbNcb6PHadxAgSfgSu95a/UgZlP0mstLXoE9GwDF9ctTd4DLneAvidDMiVXCtLk8nng/Yy+KQv03gJda15vzX2cPgBp6ip5AxwcAiMFyl73eXdne2//nmn29wPH/3LJzj2y0AAAAAZiS0dEAFwAFwCTdM/uvgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+MEHhQ6D7d7jaQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAeLElEQVR42u3deZSk1Xnf8e99q6qre6a36aGZgdEwDMgGyUalJUhgLRBkyz0ISwErR7GN4yR2JOecJDpKZJ8TH+fYUU4W6RzbUmJrs4QEAiQrEZLIAK0NSTgsWkDUIBDDMgjEDMxMd0/v3bW8780f91aoqamq91b1OvD7/GMf1NNV9Xa9z/vc5z73XhARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE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xXRrT0PtxxnNQJ2BVdov7vViTwrNEX4esuXETbr2erK5HB7jW3B7Uj6N2COd/hLtvnMvVmMOQp8CaKOHzIKWLLhcrkcuHVtnRTdE9xeV3etIEBcuIqZ7uPAF621a7JzqzFmooMMa5c/VLVbo7h96WeBTwD3dZJd+YL9G/zvMU0C+7eAg90cPKyAJRs/ZndDwk6XsBwCbsxms10FiJ6ensgHrNVYCziHO735R2uYhVZw5yCmBXWDa2Po7eZ1fLB5oy8nXI/r21rs7LfYLPAWmm+G+DTwucC9tE6xxjUsY8GeAB5sUieYYHW6m8FNjT6wwfdd1dcZbF0GcBj4MRtTK7S4wmbZDyUe3QSxaRl3IMRJZmZmrDHmkLX2AcL2RYqBcWPMPZ00iZ70mK9U+nH1vYdW4XM9Bdy0ffv2pYmJtdka309M/BRXs0uruU0DQ1u3bjULCwsdZjF2ANdIeyfw0S73+t+B68xvXLpUckNBDnR7aMsa30hRAvHduFXtpsmX7sRKXyFfuN2WimM34JZBbLRjEPnhiSmB/QLuwIGNDBC1nRD+hI3fBqV2Ht+pX8RsdqZSqbw/sPZigSlr7cwKAsCStfYzwBdW4XMt5nK55yYmJtZsNtoH5s8B+wNGRokx5kjnwQpwM9j3APdC9HyXb/f1NO+/+glwS74w3nULzel8xLqIrLJScazPJQLjS13++37gPwHv4+QZ6kngg8AnOusHW9cMS0ROJ90GqjrnAL/SEKzKwNdx9bDySn65iu4islrZWQ63o+lFDcP3+4GPgJla6WsoYInIahkC3skLqxUsblbwo0BxNU5HV8ASkVXIrvZFuJnBX/Fxpbbc6lPA/pUOBRWwRGQV2S24XVFre8pPAh/HFdkXVutVFLBEZIXZ1dsNrpXhClxbyiTwN8BH8oXxE6v5WpolFJEVigeA38Ttu3UUt5znr/OF8anVfiUFLBFZQXa1z4B9HW7boIM+s7opXxifX4vXU8ASkRWwQ8Cv4TZR/BRwd74wXlqrV8vogotId9nVVQaSIVwt/AYwB0J3JBUR2YghYaZUHOvRlRARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERF5kfl/siC0VP1mEw4AAAAASUVORK5CYII='

    //   console.log(err)
    // })
  }

  async componentDidMount() {
    var arrObjetivo = await this.requestObjetivo();

    //console.log(arrObjetivo)

    var datos = await this.API_CCS.getData(4, this.props.campaign);

    this.setState({
      SLA: datos[0].SLA || 0,
      ABA: datos[0].ABA,
      AHT: datos[0].AHT,
      TT: datos[0].TalkTime,
      OCC: datos[0].Ocupacion,
      QA: datos[0].Calidad,
      objetivos: arrObjetivo
    });

    let percent = this.round(this.state.SLA * 100, 2);
    this.setState({
      percent,
      data: this.getData(percent)
    });
  }

  render() {
    return (
      <ImageBackground
        style={{ flex: 1, width: null, height: null }}
        source={background}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ flex: 1, flexDirection: "row" }} height={300}>
            <View
              margin={1}
              style={{
                backgroundColor: "rgba(115,114,118,0.08)",
                flexGrow: 1,
                margin: 4,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  alignSelf: "stretch",
                  marginTop: -25,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                height={32}
              >
                <Text allowFontScaling={false} style={{ color: "white" }}>
                  Resumen Semanal
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{ color: "white", fontSize: 9 }}
                >
                  Última Actualizacion: {this.state.curTime}
                </Text>
              </View>

              <View style={{ marginTop: -15 }}>
                <Svg viewBox="0 0 350 315" width="300" height="250">
                  <VictoryPie
                    startAngle={360}
                    endAngle={0}
                    standalone={false}
                    animate={{
                      duration: 1200,
                      easing: "bounce",
                      onLoad: { duration: 1200, easing: "bounce" }
                    }}
                    width={360}
                    height={360}
                    data={this.state.data}
                    innerRadius={115}
                    labels={() => null}
                    style={{
                      data: {
                        fill: d => {
                          const color =
                            d.y > 30 ? "rgba(0,128,0,0.5)" : "#C00327";
                          return d.x === 1 ? color : "transparent";
                        }
                      }
                    }}
                  />
                  <VictoryAnimation duration={1000} data={this.state}>
                    {newProps => {
                      return (
                        <VictoryLabel
                          textAnchor="middle"
                          verticalAnchor="middle"
                          x={180}
                          y={180}
                          text={this.round(this.state.SLA * 100, 2) + "%"}
                          style={{ fontSize: 45, fill: "rgba(0,0,0,0.5)" }}
                        />
                      );
                    }}
                  </VictoryAnimation>
                </Svg>

                <Avatar.Image
                  size={45}
                  source={{ uri: this.props.setAvatar }}
                  style={{
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: -10,
                    right: 0,
                    alignSelf: "flex-end"
                  }}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.buttonValue,
                    { fontSize: 18, position: "absolute", bottom: -4, left: 0 }
                  ]}
                >
                  SLV
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 0, flexDirection: "row" }} height={100}>
            <TouchableOpacity
              key={"button" + 1}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 1)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(1)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.SLA * 100,
                      this.state.objetivos[0].SLA,
                      1,
                      1
                    )
                  }
                ]}
              >
                {this.round(this.state.SLA * 100, 2) + "%"}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Nivel de Servicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              key={"button" + 2}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 2)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(2)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.ABA * 100,
                      this.state.objetivos[0].ABA,
                      1,
                      0
                    )
                  }
                ]}
              >
                {this.round(this.state.ABA * 100, 2) + "%"}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Abandono
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              key={"button" + 3}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 3)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(3)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.AHT / 30,
                      this.state.objetivos[0].AHT,
                      0,
                      0
                    )
                  }
                ]}
              >
                {this.round(this.state.AHT, 0)}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                AHT
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 0, flexDirection: "row" }} height={100}>
            <TouchableOpacity
              key={"button" + 4}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 4)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(4)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.TT * 100,
                      this.state.objetivos[0].TT,
                      1,
                      1
                    )
                  }
                ]}
              >
                {this.round(this.state.TT * 100, 2) + "%"}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                TalkTime
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              key={"button" + 5}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 5)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(5)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.OCC * 100,
                      this.state.objetivos[0].OCCY,
                      1,
                      1
                    )
                  }
                ]}
              >
                {this.round(this.state.OCC * 100, 2) + "%"}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Ocupacion
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              key={"button" + 6}
              margin={1}
              style={[
                styles.button,
                (this.state.toggler == false) & (this.state.index == 6)
                  ? styles.buttonActive
                  : null
              ]}
              onPress={() => this.onPress(6)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonValue,
                  {
                    color: this.getColor(
                      this.state.QA * 100,
                      this.state.objetivos[0].QA,
                      1,
                      1
                    )
                  }
                ]}
              >
                {this.round(this.state.QA * 100, 2) + "%"}
              </Text>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Calidad
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.index == 1 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 1
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.SLA * 100, 2) + "%"}
                  </Text>
                  <LinearGauge
                    obj={this.state.objetivos[0].SLA}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 1
                        ? 200
                        : 0
                    }
                    value={this.round(this.state.SLA * 100, 0)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: >{this.state.objetivos[0].SLA}%
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Porcentaje de las llamadas atendidas antes de 20 segundos.{" "}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.index == 2 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 2
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.ABA * 100, 2) + "%"}
                  </Text>
                  <InvertedLinearGauge
                    obj={this.state.objetivos[0].ABA}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 2
                        ? 200
                        : 0
                    }
                    value={this.round(this.state.ABA * 100, 0)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: &lt;{this.state.objetivos[0].ABA}%
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Porcentaje de llamadas abandonadas.{" "}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.index == 3 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 3
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.AHT, 0)}
                  </Text>
                  <InvertedLinearGauge
                    obj={this.state.objetivos[0].AHT}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 3
                        ? 200
                        : 0
                    }
                    value={this.state.AHT / 30}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: &lt;{this.state.objetivos[0].AHT}
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Duración promedio de llamada.{" "}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.index == 4 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 4
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.TT * 100, 2) + "%"}
                  </Text>
                  <LinearGauge
                    obj={this.state.objetivos[0].TT}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 4
                        ? 200
                        : 0
                    }
                    value={this.round(this.state.TT * 100, 0)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: >{this.state.objetivos[0].TT}%
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Porcentaje de tiempo hablado.{" "}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.index == 5 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 5
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.OCC * 100, 2) + "%"}
                  </Text>
                  <LinearGauge
                    obj={this.state.objetivos[0].OCCY}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 5
                        ? 200
                        : 0
                    }
                    value={this.round(this.state.OCC * 100, 0)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: >{this.state.objetivos[0].OCCY}%
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Porcentaje de tiempo de ocupación de la estación, menos
                    auxiliares (Descanso, Comida... ).
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.index == 6 ? (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                height:
                  this.state.toggler == true
                    ? 0
                    : this.state.index == 6
                    ? 200
                    : 0
              }}
            >
              <View style={styles.contentCard} margin={4}>
                <View style={{ padding: 35 }}>
                  <Text allowFontScaling={false} style={styles.buttonValue}>
                    {this.round(this.state.QA * 100, 2) + "%"}
                  </Text>
                  <LinearGauge
                    obj={this.state.objetivos[0].QA}
                    height={
                      this.state.toggler == true
                        ? 0
                        : this.state.index == 6
                        ? 200
                        : 0
                    }
                    value={this.round(this.state.QA * 100, 0)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={styles.buttonValueObjetivo}
                  >
                    Objetivo: >{this.state.objetivos[0].QA}%
                  </Text>
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Nota de calidad promedio de los agentes evaluados en el
                    servicio.{" "}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  contentCard: {
    backgroundColor: "rgba(244,244,244,.8)",
    flexGrow: 1,
    borderRadius: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244,244,244,.8)",
    flexGrow: 1,
    margin: 4,
    borderRadius: 10
  },
  buttonActive: {
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,.3)"
  },
  buttonAlert: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(192,3,39,.18)",
    flexGrow: 1,
    margin: 4,
    borderRadius: 10
  },
  buttonText: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 13
  },
  buttonValue: {
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    fontSize: 19
  },
  buttonValueObjetivo: {
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 10
  }
});

const mapStateToProps = state => {
  return {
    profile: state.profile.profile,
    campaign: state.campaign.campaign,
    setAvatar: state.setAvatar.setAvatar
  };
};

export default connect(mapStateToProps)(Dashboard);
