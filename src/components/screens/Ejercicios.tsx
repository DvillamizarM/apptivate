import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import EjercicioInactivo from "../cards/EjercicioInactivo";
import * as MyTypes from "../../redux/types/types";

interface Props {}
var { vmin } = require("react-native-expo-viewport-units");

import StepIndicator from "react-native-step-indicator";
import firebase from "../../../database/firebase";
import Logo from "../Simple/Logo";
import ChargeScreen from "../Simple/ChargeScreen";

class Ejercicios extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    currentPosition: 0,
    routineIDs: [],
    exercises: [],
    defaultSetups: {},
    values: [],
    setup: {},
    currentExercise: 0,
    loading: false,
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show(
      "Estás en una rutina por favor utiliza el botón rojo de Abandonar Rutina si quieres salir.",
      ToastAndroid.SHORT
    );
    return true;
  }

  getRoutineList = async () => {
    let values: any = [];
    const userActiveWeek = this.props.user.information.control.activeWeek;
    const activeWeek = parseInt(userActiveWeek.replace(/\D/g, "")) + 2;
    await firebase.db
      .collection("protocol")
      .doc("protesico")
      .get()
      .then(async (element: any) => {
        if (element.data() !== undefined) {
          const promises = Object.values(element.data()).map(
            (element: any, index) => {
              if (
                element.order === 1 ||
                element.order === 2 ||
                element.order === activeWeek ||
                element.order === 13
              ) {
                let listInfo: any =  {
                  idsList: element.refs,
                  setupsList: element.setup,
                  order: element.order,
                };
                values.push(listInfo);
                if (values.length === 4) {
                  values.sort(
                    (a, b) => parseFloat(a.order) - parseFloat(b.order)
                    );
                    console.log("values====r---",values);
                  return values;
                }
              }
            }
          );
          let finished: Object = await Promise.all(promises);

          finished = Object.values(finished).filter(function (element) {
            return element !== undefined;
          });

          console.log("finished routine----", finished[0]);
          
          this.setState({
            values: finished[0]
          });
          //get first routine phase exercise list... 
          let info: any = [];
          const position = this.state.currentPosition === 4 ? 3 : this.state.currentPosition
          const promises2 = finished[0][position].idsList.map(async (ref, index) => {
            await ref.get().then((res) => {
              info.push(res.data());
            });
            return info;
          });
          const finished2: Object = await Promise.all(promises2);
          console.log("phase list---", finished2);
          this.setState({
            exercises: finished2[0],
            setup: this.updateSetup(finished[0][position].setupsList),
            loading: false,
          });
        }
      });
  };

  getPhaseList = async (phase) => {
    let info: any = [];
    phase === 3 ? phase = 1 : phase === 4 ? phase = 3 : phase = phase ;
    console.warn("phase number--- ", phase)
    const promises = this.state.values[phase].idsList.map(async (ref, index) => {
      console.log("in promise mapp---", this.state.values[phase])
      await ref.get().then((res) => {
        info.push(res.data());
      });
      return info;
    });
    const finished: Object = await Promise.all(promises);
    console.log("phase list---", finished);
    this.setState({
      exercises: finished[0],
      setup: this.updateSetup(this.state.values[phase].setupsList),
      loading: false,
    });
  };

  getExerciseOffline = (phase) => {
    this.setState({ loading: true });
    console.log("offflien phase---", phase);
    let exerciseList: any = [];
    let setup: any = {};
    let downloadedExercises = this.props.ExerciseRoutine;
    if (downloadedExercises !== undefined) {
      console.warn("dowlonad-----", downloadedExercises);
      downloadedExercises.map((exercisess, index) => {
        if (index === phase) {
          console.warn(
            "conoled----",
            exercisess.collection[0].exerciseCollection
          );
          console.warn("map resutl----", exercisess);
          let currentList = exercisess.collection[0].exerciseCollection;
          console.warn("ucrueen--", currentList);
          currentList.map((current, index) => {
            let temp = {
              routinePhase: current.data.routinePhase,
              gif: current.gif,
              description: current.data.description,
              voz: current.voz,
              activeTime: current.data.activeTime,
            };
            if (current.data.series !== undefined) {
              setup = {
                series: current.data.series,
                repetitions: current.data.repetitions,
                restTimeMin: current.data.restTimeMin,
                restTimeSec: current.data.restTimeSec,
              };
            }
            exerciseList.push(temp);
          });
        }
      });

      this.setState({
        exercises: exerciseList,
        // setup:setup ,
        setup: this.updateSetup(setup),
        loading: false,
      });
    }
  };

  updateSetup(setup) {
    const { repetitionAmount, restTimeMin, restTimeSec } =
      this.props.navigation.state.params;
    let newSetup = {};
    let aux = parseInt(setup.repeticiones);
    if (aux) {
      console.log("if------", repetitionAmount);
      newSetup.repetitions = Math.round((repetitionAmount / 100) * aux);
      console.log("after set if------", repetitionAmount);
    } else {
      console.log("else");
      newSetup.repetitions = Math.round(repetitionAmount / 100);
    }
    newSetup.restTimeMin = restTimeMin;
    newSetup.restTimeSec = restTimeSec;
    newSetup.series = setup.series;
    // console.log(
    //   "setup---",
    //   setup.repetitions,
    //   "  |||| newSetup rep--- ",
    //   newSetup.repetitions
    // );
    return newSetup;
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    if (this.props.connection) {
      console.warn("did mount routine list");
      this.getRoutineList();
    } else {
      this.getExerciseOffline(this.state.currentPosition);
    }
  };

  changeCurrentExercise = () => {
    if (this.state.currentExercise + 1 > this.state.exercises.length - 1) {
      this.changeCurrentPhase();
    } else {
      this.setState({ currentExercise: this.state.currentExercise + 1 });
    }
  };

  changeCurrentPhase = () => {
    if (this.state.currentPosition > 4) {
      this.props.navigation.navigate("EndRoutine", {
        props: this.props,
        routineIsNotOver: false,
      });
    } else {
      if (this.state.currentPosition + 1 === 5) {
        this.props.navigation.navigate("EndRoutine", {
          routineIsNotOver: false,
        });
      }
      this.setState({
        currentPosition: this.state.currentPosition + 1,
        exercises: [],
        setup: {},
        currentExercise: 0,
        loading: false,
      });
      console.log("position  +1---", this.state.currentPosition + 1);
      this.props.connection
        ? this.getPhaseList(this.state.currentPosition + 1)
        : this.getExerciseOffline(this.state.currentPosition + 1);
    }
  };

  confirmationFinishRoutine = () => {
    Alert.alert(
      "Estás seguro de que quieres terminar la rutina? ",
      "Si cancelas la rutina perderás el progreso de este día. ",
      [
        {
          text: "Regresar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cancelar Rutina",
          onPress: () => {
            this.props.navigation.navigate("EndRoutine", {
              routineIsNotOver: true,
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    const labels = ["Calentar", "Estirar", "Activar", "Estirar", "Enfriar"];
    const customStyles = {
      stepIndicatorSize: vmin(6),
      currentStepIndicatorSize: vmin(7),
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: "rgba(105,121,248,1)", //borde seleccionado
      stepStrokeWidth: 3,
      stepStrokeFinishedColor: "rgba(64,64,64,1)",
      stepStrokeUnFinishedColor: "#CDD2FD", // morado
      separatorFinishedColor: "rgba(64,64,64,1)",
      separatorUnFinishedColor: "#aaaaaa",
      stepIndicatorFinishedColor: "rgba(64,64,64,1)",
      stepIndicatorUnFinishedColor: "#CDD2FD", //Gris
      stepIndicatorCurrentColor: "rgba(105,121,248,1)", //morado
      stepIndicatorLabelFontSize: vmin(3),
      currentStepIndicatorLabelFontSize: vmin(3),
      stepIndicatorLabelCurrentColor: "white", // label dentro de la bolita
      stepIndicatorLabelFinishedColor: "#CDD2FD", //Gris
      stepIndicatorLabelUnFinishedColor: "#aaaaaa",
      labelColor: "#999999",
      labelSize: vmin(3),
      currentStepLabelColor: "black", // color de la label de abajo
    };

    if (
      this.state.exercises[this.state.currentExercise] == undefined ||
      this.state.loading
    ) {
      return (
        <View
          style={{ justifyContent: "center", height: "100%", marginTop: "5%" }}
        >
          <ChargeScreen />
        </View>
      );
    } else {
      // console.log("changnee----", Object.values(this.state.exercises));
      return (
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <View style={{ height: "5%" }}>
            <Text>{""}</Text>
          </View>
          <View
            style={{
              width: "100%",
              height: "8%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              borderBottomColor: "rgba(214, 212, 210,1)",
              borderBottomWidth: 1,
            }}
          >
            <Logo />
            <Text
              style={{
                marginLeft: "5%",
                fontSize: vmin(5),
                fontWeight: "bold",
              }}
            >
              Rutina
            </Text>
            <TouchableOpacity
              style={[
                styles.button2,
                {
                  marginLeft: "20%",
                },
              ]}
              onPress={() => {
                //this.confirmationFinishRoutine();
                Alert.alert(
                  "Abandonar rutina",
                  "¿Esta segur@ que quiere abandonar la rutina? Se va a perder todo el progreso que lleva hasta el momento.",
                  [
                    {
                      text: "Cancelar",
                    },
                    {
                      text: "ABANDONAR",
                      onPress: () =>
                        this.props.navigation.navigate("EndRoutine", {
                          routineIsNotOver: true,
                        }),
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={{ color: "white" }}>Abandonar Rutina</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", height: "90%" }}>
            <View style={styles.screenContainer}>
              <View style={styles.containerSteps}>
                <StepIndicator
                  customStyles={customStyles}
                  currentPosition={this.state.currentPosition}
                  labels={labels}
                  stepCount={5}
                />
              </View>

              <View style={styles.containerCard}>
                <EjercicioInactivo
                  key={"ejercicio" + this.state.currentExercise}
                  indicator={`${this.state.currentExercise + 1} de ${
                    this.state.exercises.length
                  }`}
                  setup={this.state.setup}
                  exercise={this.state.exercises[this.state.currentExercise]}
                  changeCurrentExercise={this.changeCurrentExercise}
                />
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  // console.warn("exercise [rpos======= ", store.DownloadReducer.ExerciseRoutine);
  // console.warn("user [rpos======= ", store.User.user);
  return {
    user: store.User.user,
    connection: store.User.connection,
    ExerciseRoutine: store.DownloadReducer.ExerciseRoutine,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({});
export default connect(MapStateToProps, MapDispatchToProps)(Ejercicios);

const styles = StyleSheet.create({
  screenContainer: { width: "100%", height: "100%", backgroundColor: "white" },
  // header: {
  //   width: "100%",
  //   alignItems: "center",
  //   backgroundColor: "peru",
  //   height: "7%",
  //   justifyContent: "center",
  // },
  // title: {
  //   textAlign: "center",
  //   fontWeight: "bold",
  // },
  containerSteps: {
    backgroundColor: "white",
    borderRadius: 10,
    height: "12%",
    justifyContent: "center",
    // alignItems: "center",
  },
  containerCard: {
    height: "88%",
  },
  containerButton: {
    height: "10%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  button2: {
    backgroundColor: "rgba(199, 0, 57,1)",
    width: "40%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
