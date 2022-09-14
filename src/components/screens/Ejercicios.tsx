import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
  ToastAndroid,
  Modal,
  Image,
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
    routineIDs: [],
    exercises: [],
    defaultSetups: {},
    values: [],
    setup: {},
    currentExercise: 0,
    loading: false,
    showModal: false,
    modalText: "",
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

  alertChange = (text) => {
  
    this.setState({ showModal: true, modalText: text });
    // if(!this.state.loading){
    setTimeout(() => {
      this.setState({ showModal: false });
    }, 5000);
    // }
  };

  getRoutineList = async () => {
    let values: any = [];
    const level = this.props.user.information.medical.amputationPhase === "Protésico" ? "protesico" : "preprotesico";
    const userActiveWeek = this.props.user.information.control.activeWeek;
    const activeWeek = parseInt(userActiveWeek.replace(/\D/g, "")) + 2;
    await firebase.db
      .collection("protocol")
      .doc(level)
      .get()
      .then(async (element: any) => {
        if (element.data() !== undefined) {
          const promises = Object.values(element.data()).map(
            (faseElement: any, index) => {
              if (
                faseElement.title === "Calentamiento" ||
                faseElement.title === "Estiramiento" ||
                 faseElement.order === activeWeek ||
                faseElement.title === "Enfriamiento"
              ) {
                let listInfo: any = {
                  idsList: faseElement.refs,
                  setupsList: faseElement.setup,
                  order: faseElement.order,
                };
                values.push(listInfo);
                if (values.length === 4) {
                  values.sort(
                    (a, b) => parseFloat(a.order) - parseFloat(b.order)
                  );
                  return values;
                }
              }
            }
          );
          let finished: Object = await Promise.all(promises).catch((error)=> console.warn("error000 === ", error));

          finished = Object.values(finished).filter(function (element) {
            return element !== undefined;
          });

          this.setState({
            values: finished[0],
          });
          //get first routine phase exercise list...
          let info: any = [];
          const position =
            this.state.currentPosition === 4 ? 3 : this.state.currentPosition;
          const promises2 = finished[0][position].idsList.map(
            async (ref, index) => {
              await ref.get().then((res) => {
                info.push(res.data());
              });
              return info;
            }
          );
          const finished2: Object = await Promise.all(promises2);
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
    phase === 3 ? (phase = 1) : phase === 4 ? (phase = 3) : (phase = phase);
    const promises = this.state.values[phase].idsList.map(
      async (ref, index) => {
        await ref.get().then((res) => {
          info.push(res.data());
        });
        return info;
      }
    );
    const finished: Object = await Promise.all(promises);
    this.setState({
      exercises: finished[0],
      setup: this.updateSetup(this.state.values[phase].setupsList),
      loading: false,
    });
  };

  getExerciseOffline = (phase) => {
    phase === 3 ? (phase = 1) : phase === 4 ? (phase = 3) : (phase = phase);
    this.setState({ loading: true });
    let exerciseList: any = [];
    let setup: any = {};
    let downloadedExercises = this.props.ExerciseRoutine;
    if (downloadedExercises !== undefined) {
      downloadedExercises.map((exercisess, index) => {
        if (index === phase) {
          let currentList = exercisess.exercises;
          currentList.map((current, index) => {
            let temp = {
              routinePhase: current.routinePhase,
              gif: current.gif,
              description: current.description,
              voz: current.voz,
              activeTime: current.activeTime,
            };

            exerciseList.push(temp);
          });
          setup = exercisess.setup;
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
      newSetup.repetitions = Math.round((repetitionAmount / 100) * aux);
    } else {
      newSetup.repetitions = Math.round(repetitionAmount / 100);
    }
    newSetup.restTimeMin = restTimeMin;
    newSetup.restTimeSec = restTimeSec;
    newSetup.series = setup.series;
   
    return newSetup;
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    this.alertChange("start");
    if (this.props.connection) {
      this.getRoutineList();
    } else {
      this.getExerciseOffline(this.state.currentPosition);
    }
  };

  changeCurrentExercise = () => {
    if (this.state.currentExercise + 1 > this.state.exercises.length - 1) {
      this.alertChange("phase");
      this.changeCurrentPhase();
    } else if (
      this.state.currentExercise + 1 <=
      this.state.exercises.length - 1
    ) {
      this.alertChange("exercise");
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

  LoadingModal = () => {
    const moment = this.state.modalText;
    const text =
      moment === "start"
        ? "¡La rutina está por comenzar!"
        : moment === "phase"
        ? "¡Prepárate para la siguiente etapa!"
        : moment === "exercise"
        ? "¡Prepárate para el siguiente ejercicio!"
        : "¡Prepárate para la siguiente serie!";
    return (
      <Modal visible={this.state.showModal}>
        <View style={styles.modalView}>
          <View style={styles.innermodalView}>
            <View style={styles.imageModalView}>
              {/* <View style={{marginBottom:"3%", marginLeft:"4%"}}> */}
              <Image
                source={
                  moment === "start"
                    ? require("../../assets/images/apptivateLogo.png")
                    : moment === "phase"
                    ? require("../../assets/images/success.png")
                    : moment === "exercise"
                    ? require("../../assets/images/success.png")
                    : require("../../assets/images/success.png")
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 50,
                }}
              />
            </View>

            <Text
              style={{
                textAlign: "center",
                fontSize: vmin(8),
                color: "rgba(153, 153, 153, 1)",
                marginTop: "5%",
              }}
            >
              {text}
            </Text>
            <ActivityIndicator size="large" color="#6979f8" />
          </View>
        </View>
      </Modal>
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
      this.state.exercises[this.state.currentExercise] === undefined ||
      this.state.loading
    ) {
      return (
        <View
          style={{ justifyContent: "center", height: "100%", marginTop: "5%" }}
        >
          <this.LoadingModal moment={this.state.modalText} />
        </View>
      );
    } else {
      return (
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <this.LoadingModal />
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
                  alertChange={this.alertChange}
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    minHeight: "100%",
    width: "100%",
    //backgroundColor: "salmon",
    alignItems: "center",
  },
  innermodalView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalView: {
    height: 150,
    width: 150,
    justifyContent: "center",
    // backgroundColor: "salmon",
    alignItems: "center",
  },
});
