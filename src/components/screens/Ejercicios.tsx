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

class Ejercicios extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    currentPosition: 0,
    exercises: [],
    setup: {},
    currentExercise: 0,
    loading: false,
  };

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

handleBackButton() {
    ToastAndroid.show('Estás en una rutina por favor utiliza el botón rojo de Abandonar Rutina si quieres salir.', ToastAndroid.SHORT);
    return true;
}

  // var messageRef = db.collection('rooms').doc('roomA')
  // .collection('messages').doc('message1');
  getExercise = async (phase) => {
    this.setState({ loading: true });
    let exercises = [];
    let setup = {};
    let dbRef: any = "";
    let doc = "";
    let exerciseList = [];
    let protocolType = this.props.user.information.medical.amputationLevel;
    protocolType == "Preprotésico"
      ? (protocolType = "preprotesico")
      : (protocolType = "protesico");
    switch (phase) {
      case 0:
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("basic")
          .doc("warmup");
        doc = await dbRef.get();
        exerciseList = doc.data();
        break;
      case 1:
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("basic")
          .doc("stretch");
        doc = await dbRef.get();
        exerciseList = doc.data();
        break;
      case 2:
        //setup
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("week1")
          .doc("setup");
        doc = await dbRef.get();
        setup = doc.data();
        //exercise
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("week1")
          .doc("active");
        doc = await dbRef.get();
        exerciseList = doc.data();
        break;

      case 3:
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("basic")
          .doc("stretch");
        doc = await dbRef.get();
        exerciseList = doc.data();
        break;

      case 4:
        dbRef = firebase.db
          .collection("protocol")
          .doc(protocolType)
          .collection("basic")
          .doc("cooldown");
        doc = await dbRef.get();
        exerciseList = doc.data();
        break;
    }

    console.log("exercises son >>>>>>>>>", Object.values(exerciseList));

    let exerciseVales = Object.values(exerciseList);

    let result = await this.basicPhaseExercises(exerciseVales);

    console.warn("Los ejercicios esperados son: ", result);

    this.setState({
      exercises: result,
      setup: this.updateSetup(setup),
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
          //   exerciseList = {
          //     routinePhase: current.data.routinePhase,
          //     gif: current.gif,
          //     description: current.data.description,
          //     voz: current.data.voz,
          //     activeTime: current.data.activeTime
          // }
          //  exerciseList=exerciseCollection;
          // exerciseCollection.map((exercise, index)=>{
          //   if(index===day){
          //     exerciseList = exercise
          //   }
          // })
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
  basicPhaseExercises = async (exercises) => {
    const promises = exercises.map(async (Item) => {
      const numItem = await Item.get();
      return numItem;
    });

    return new Promise(async (resolve, reject) => {
      const numItems = await Promise.all(promises);
      resolve(numItems.map((e) => e.data()));
    });
  };

  updateSetup(setup) {
    const { repetitionAmount, restTimeMin, restTimeSec } =
      this.props.navigation.state.params;
    let newSetup = {};
    let aux = parseInt(setup.repetitions);
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
    console.log(
      "setup---",
      setup.repetitions,
      "  |||| newSetup rep--- ",
      newSetup.repetitions
    );
    return newSetup;
  }

  componentDidMount = () => {
    
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.warn("conectiononoo====", this.props.connection);
    if (this.props.connection) {
      console.warn("if---- didmount");
      this.getExercise(this.state.currentPosition);
    } else {
      console.warn("else---- didmount");
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
      this.props.navigation.navigate("EndRoutine", { props: this.props, routineIsNotOver: false, });
    } else {
      if (this.state.currentPosition + 1 == 5) {
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
      this.props.connection
        ? this.getExercise(this.state.currentPosition + 1)
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
      return <ActivityIndicator size="large" color="#00ff00" />;
    } else {
      console.log("changnee----", Object.values(this.state.exercises));
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
          <Logo/>
            <Text
              style={{
                marginLeft: "5%",
                fontSize:vmin(5),
                fontWeight: "bold",
              }}
            >
              Rutina
            </Text>
            <TouchableOpacity
              style={[styles.button2,{
                marginLeft: "20%",}]}
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
                {console.warn(
                  "sfdfg",
                  this.state.exercises[this.state.currentExercise]
                )}
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
  console.warn("exercise [rpos======= ", store.DownloadReducer.ExerciseRoutine);
  console.warn("user [rpos======= ", store.User.user);
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
