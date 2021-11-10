import * as React from "react";
import { Dispatch } from "redux";

import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";

import * as MyTypes from "../../redux/types/types";

import IconCheck from "react-native-vector-icons/FontAwesome";

import IconLoader from "react-native-vector-icons/FontAwesome";

import { Audio } from "expo-av";

// Iconos para la seccion de informacion
import Check from "react-native-vector-icons/FontAwesome";
import Repeat from "react-native-vector-icons/FontAwesome";
import Wathc from "react-native-vector-icons/Ionicons";
import Play from "react-native-vector-icons/Ionicons";

interface Props {
  exercise: object[];
  setup: object;
}
var { vmin } = require("react-native-expo-viewport-units");
class EjercicioInactivo extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    timer: "00:00",
    stop: true,
    diasbleButton: false,
    mainTimer: 2000,
    serieActual: 1,
    sec: 0,
    min: 0,
    setMin: 0,
    setSec: 1,
    description: "",
    materials: "",
    repetitions: 0,
    gif: null,
    voz: null,
    activeTime: 0,
    series: 0,
    timerType: "",
  };

  startTimer = () => {
    // console.log("El tiempo activo es ",this.state.activeTime)
    if (this.state.activeTime) {
      clearTimeout(this.state.mainTimer);
      // console.log("dentro del if El tiempo activo es ",this.state.activeTime)
      this.setState(
        {
          sec: 1,
          min: this.state.activeTime,
          diasbleButton: true,
        },
        () => {
          this.countdownActive();
        }
      );
    } else {
      if (this.state.serieActual <= this.state.series) {
        if (this.state.stop) {
          this.state.sec = 0;
          this.state.min = 0;
          this.setState({ disableButton: false });
          this.setState({ stop: false }, () => {
            this.timerCycle();
          });
        } else if (!this.state.stop) {
          clearTimeout(this.state.mainTimer);
          this.setState(
            {
              stop: true,
              sec: this.state.setSec,
              min: this.state.setMin,
              diasbleButton: true,
            },
            () => {
              console.log(this.state.setSec, "callback");
              this.setTimerView();
              this.countdown();
            }
          );
        }
      } else {
        this.props.changeCurrentExercise();
      }
    }
  };
  timerCycle = () => {
    this.setState({ timerType: "Tiempo Activo" });
    this.state.mainTimer = setInterval(() => {
      if (!this.state.stop) {
        this.setTimerView();
        if (this.state.sec == 59) {
          if (this.state.min == 60) {
            this.setState({ stop: "true" });
          }
          this.state.min++;
          this.state.sec = 0;
        } else {
          this.state.sec++;
        }
      }
    }, 1000);
    this.state.mainTimer;
  };
  countdown = () => {
    this.setState({ timerType: "Reposo" });
    this.state.mainTimer = setInterval(() => {
      if (this.state.timer == "00:00") {
        this.setState(
          { diasbleButton: false, serieActual: this.state.serieActual + 1 },
          () => {
            clearInterval(this.state.mainTimer);
            this.startTimer();
          }
        );
      } else if (this.state.timer != "00:00") {
        this.setTimerView();
        if (this.state.sec == 0) {
          if (this.state.min == 0) {
            this.setState({ timer: "00:00", timerType: "" });
          }
          this.state.min--;
          this.state.sec = 59;
        } else {
          this.state.sec--;
        }
      }
    }, 1000);
    this.state.mainTimer;
  };

  countdownActive = () => {
    this.setState({ timerType: "Tiempo Activo" });
    //  console.log("[countdownActive] El temporizador comenzo con:", this.state.sec,"segundos y " , this.state.min , " minu" )
    this.state.mainTimer = setInterval(() => {
      //   console.log("Interval: ", this.state.sec,"segundos y " , this.state.min , " minu" )
      this.setTimerView();
      if (this.state.sec == 1 && this.state.min == 0) {
        clearInterval(this.state.mainTimer);
        this.props.changeCurrentExercise();
      }
      if (this.state.sec == 0) {
        if (this.state.min == 0) {
          this.props.changeCurrentExercise();
        }
        this.state.min--;
        this.state.sec = 59;
      } else {
        this.state.sec--;
      }
    }, 1000);
    this.state.mainTimer;
  };

  setTimerView() {
    if (this.state.sec < 10) {
      if (this.state.min < 10) {
        this.setState({ timer: "0" + this.state.min + ":" + this.state.sec });
      }
      this.setState({ timer: this.state.min + ":0" + this.state.sec });
    } else {
      this.setState({ timer: this.state.min + ":" + this.state.sec });
    }
  }

  componentDidMount = async () => {
    console.warn("exercisie----", this.props.exercise);
    if (this.props.exercise) {
      console.log(this.props.setup, "SETUP");
      // SI tiene setup
      if (Object.values(this.props.setup).length > 0) {
        console.log(this.props.setup.restTimeSec, "didmount inactivo");
        this.setState({
          series: this.props.setup.series,
          repetitions: this.props.setup.repetitions,
          setMin: this.props.setup.restTimeMin,
          setSec: this.props.setup.restTimeSec,
        });
      } else {
        console.warn("inactivo didmount-----else");
        this.setState({
          series: null,
          repetitions: null,
          setMin: null,
          setSec: null,
        });
      }

      console.log("Las nuevas props de ejercicos son :", this.props.exercise);

      const res = this.props.exercise;

      console.log("--*inactivo*--->", res);

        let materialList = ""
        res.materials ? materialList = res.materials : materialList = "";
        
        let activeTimeAux: any = 0;
        res.activeTime ? activeTimeAux = res.activeTime : activeTimeAux = null;
        
        this.setState({
          description: res.description,
          gif: res.gif,
          voz: res.voz,
          activeTime: activeTimeAux,
          materials: materialList,
        });
    } else {
      //  console.log(this.props.exercise, "------- UNDEFINED ----------");
    }
  };

  componentWillUnmount = () => {
    clearTimeout(this.state.mainTimer);
  };

  handlePlaySound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: this.state.voz });
    // setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };

  render() {
    return (
      <View style={styles.containerCard}>
        <View style={styles.containerHeaderCard}>
          <View
            style={[
              styles.headerLeftSection,
              {
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={
                this.state.timerType !== "Tiempo Activo"
                  ? [styles.greenSection, { backgroundColor: "red" }]
                  : styles.greenSection
              }
            ></View>
          </View>

          <View
            style={[
              styles.headerCenterSection,
              {
                justifyContent: "center",
              },
            ]}
          >
            <Text style={styles.textHeaderExercise}>
              Ejercicio {this.props.indicator}
            </Text>
            
          </View>

          <View
            style={
              !this.state.diasbleButton
                ? styles.headerRightSection
                : [styles.headerRightSection, { backgroundColor: "#999999" }]
            }
          >
            <TouchableOpacity
              disabled={this.state.diasbleButton}
              onPress={this.startTimer}
            >
              <IconCheck name="check" size={vmin(5.5)} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.containerImage}>
          {this.state.timerType !== "" ? (
            <Image
              source={
                this.state.timerType !== "Reposo"
                  ? { uri: this.state.gif }
                  : require("../../assets/images/stop1.png")
              }
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          ) : (
            <Text
              style={{
                textAlign: "justify",
                fontSize: vmin(5),
                color: "rgba(153, 153, 153, 1)",
                marginTop: "20%",
                marginLeft: "5%",
                marginRight: "5%",
              }}
            >
              Para iniciar el tiempo activo de clic en el botón azul con el
              chulito.
              Realice los ejercicios acorde a sus capacidades y con su acompañante presente.
            </Text>
          )}
        </View>
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              Alert.alert(
                "Series",
                "Agrupan cierto número de repeticiones separadas por un tiempo de reposo."
              );
            }}>
            <View style={styles.iconContainer}>
              <Check name="check-square-o" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{fontSize:vmin(3.6)}}>Serie</Text>
              <Text style={{}}>
                {this.state.series
                  ? this.state.serieActual + " de " + this.state.series
                  : "1"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              Alert.alert(
                "Repeticiones",
                "Número de veces seguidas que repite un mismo movimiento"
              );
            }}
          >
            <View style={styles.iconContainer}>
              <Repeat name="repeat" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{ fontSize: vmin(3.1) }}>Repeticiones</Text>
              <Text style={{}}>
                {this.state.repetitions ? this.state.repetitions : 1}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Wathc
                name="md-stopwatch-outline"
                size={vmin(9)}
                color="#999999"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={{ width: "100%", textAlign: "center", fontSize:  vmin(3.3)}}>
                {this.state.timerType == "" ? "Tiempo" : this.state.timerType}
              </Text>
              <Text style={{}}>{this.state.timer}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.box}
            onPress={() => this.handlePlaySound()}
          >
            <View style={styles.iconContainer}>
              <Play name="play-outline" size={vmin(9)} color="#999999" />
            </View>
            <View style={styles.textContainer}>
              <Text style={{}}>Comando</Text>
              <Text style={{}}>de Voz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.indicatorTextContainer}>
          <Text
            style={{
              fontSize: vmin(4),
              borderBottomWidth:0.3,
              marginBottom:"2%",
              paddingBottom:5
            }}
          >
           Descripción: {this.state.description}
          </Text>
          {
            this.state.materials != "" ? (<Text
            style={{
              fontSize: vmin(4),
            }}
          >
            Materiales: {this.state.materials}
          </Text>) : (console.log("nothing"))
          }
          
        </View>
        

        {/* <View style={styles.footerSection}>
          <Text style={styles.textActiveTime}>Tiempo Activo</Text>
          <View style={styles.greenSection}>
            <Text
              style={{
                color: "white",
              }}
            >
              2:30
            </Text>
          </View>
        </View> */}
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {};
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({});
export default connect(MapStateToProps, MapDispatchToProps)(EjercicioInactivo);

const styles = StyleSheet.create({
  containerCard: {
    width: "100%",
    height: "100%",
    alignItems:"center"
    //  backgroundColor: "salmon"
  },
  containerHeaderCard: {
    borderRadius: 10,
    height: "8%",
    flexDirection: "row",
    // backgroundColor: "pink",
  },
  headerLeftSection: {
    width: "10%",
    height: "100%",
    alignItems: "flex-end",
    // backgroundColor: "gray",
  },
  greenBall: {
    backgroundColor: "#00C48C",
  },
  headerCenterSection: {
    width: "75%",
    height: "100%",
    // backgroundColor: "orange",
  },
  textHeaderAlert: {
    fontSize: vmin(3),
    color: "#999999",
  },
  textHeaderExercise: {
    fontSize: vmin(4),
    color: "black",
    fontWeight: "bold",
  },
  textHeaderTime: {
    fontSize: vmin(4),
    color: "#999999",
  },
  headerRightSection: {
    width: "15%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: "#6979F8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    height: "53%",
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "pink",
  },
  indicatorTextContainer: {
    backgroundColor: "rgba(105,121,248,0.2)",
    height: "15%",
    width: "90%",
    padding: vmin(3),
    borderRadius:10,
    marginTop: "2%"
  },
  // footerSection: {
  //   backgroundColor: "black",
  //   height: "10%",
  //   width: "100%",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //   flexDirection: "row",
  //   paddingLeft: vmin(10),
  // },
  textActiveTime: {
    fontSize: vmin(4),
    color: "#999999",
    padding: vmin(2),
  },
  greenSection: {
    backgroundColor: "#00C48C",
    borderRadius: 20,
    width: "50%",
    height: "40%",
  },
  containerButtons: {
    height: "17%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
  },

  box: {
    height: "90%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  iconContainer: {
    height: "60%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "peru",
  },

  textContainer: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
/**
 * if(this.state.stop){
        sec--;
    console.log("timer "+this.state.timer)
        console.log("countdown if"+sec)
        if(sec == 0) {
          console.log("countdown if sec 0 | ")
          if (minute==0) {
            console.log("countdown if min 0 | ")
              clearTimeout(timer);
              
              this.setState({timer: "00:00"});
              console.log("countdown end")
            
          }
          minute--;
          sec = 59;
          console.log(minute+"|"+sec)
          this.setState({timer: minute + ':' + sec});
        }
        timer = setTimeout(this.countdown(timer, minute, sec), 1000);
        }
 */
