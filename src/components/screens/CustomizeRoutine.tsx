import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { State } from "react-native-gesture-handler";
//import { Picker } from "@react-native-picker/picker";
import Picker from "../Simple/Picker";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ChargeScreen from "../Simple/ChargeScreen";

function CustomizeRoutine(props) {
  const [selectedValue, setSelectedValue] = useState({
    min: 0,
    max: 0,
    repetitionAmount: 0,
    range: [],
    imcCategory: "",
    perceivedForce: "",
  });
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [time, setTime] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const values = [
    "Excesivamente Liviano",
    "Liviano",
    "Ni liviano ni pesado",
    "Pesado",
    "Excesivamente Pesado",
  ];
  const calculatePerceivedEffort = (category) => {
    console.log("Parametro de fueza percivida", category);
    let min = 0;
    let max = 0;

    switch (category) {
      case values[0]:
        min = 100;
        max = 100;
        break;

      case values[1]:
        min = 90;
        max = 100;
        break;

      case values[2]:
        min = 80;
        max = 100;
        break;

      case values[3]:
        min = 70;
        max = 90;
        break;

      case values[4]:
        min = 60;
        max = 80;
        break;

      case values[5]:
        min = 50;
        max = 70;
        break;

      default:
        min = 0;
        max = 0;
        break;
    }

    return { min, max };
  };

  const imcPercentaje = (imc) => {
    console.log("El imc que llega como parametro es ;", imc);
    let min = 0;
    let max = 0;
    let category = "";

    if (imc < 18.5) {
      category = "Delgadez";
      min = 100;
      max = 100;
    } else if (imc < 25) {
      category = "Normal";
      min = 100;
      max = 100;
    } else if (imc < 30) {
      category = "Sobrepeso";
      min = 70;
      max = 90;
    } else if (imc < 35) {
      category = "Obesidad I";
      min = 60;
      max = 70;
    } else if (imc < 40) {
      category = "Obesidad II";
      min = 50;
      max = 60;
    } else {
      category = "Obesidad III";
      min = 50;
      max = 50;
    }
    return { min, max, category };
  };

  const calculatePercentajes = (user) => {
    console.log("peso: ", user.medical.weight, "tama;o: ", user.medical.size);
    const imc = imcPercentaje(
      user.medical.weight /
        ((user.medical.size / 100) * (user.medical.size / 100))
    );

    const perceivedEffort = calculatePerceivedEffort(
      user.medical.perceivedForce
    );

    let minimunAverage = (imc.min + perceivedEffort.min) / 2;
    let maximunAverage = (imc.max + perceivedEffort.max) / 2;

    minimunAverage % 10 == 5
      ? (minimunAverage -= 5)
      : (minimunAverage = minimunAverage);
    maximunAverage % 10 == 5
      ? (maximunAverage -= 5)
      : (maximunAverage = maximunAverage);
    let range: any = ["Seleccionar"];

    for (let index = minimunAverage; index <= maximunAverage; index += 10) {
      range.push(index);
    }
    console.log("category----", imc.category);
    setSelectedValue({
      min: minimunAverage,
      max: maximunAverage,
      repetitionAmount: user.configuration.repetitionAmount,
      range,
      imcCategory: imc.category,
      perceivedForce: user.medical.perceivedForce,
    });
    let sec = "";
    user.configuration.restTimeSec === 0
      ? (sec = 0 + "" + user.configuration.restTimeSec)
      : (sec = user.configuration.restTimeSec);

    setSeconds(user.configuration.restTimeSec);
    setMinutes(user.configuration.restTimeMin);
    console.warn("setting time--", user.configuration.restTimeMin + ":" + sec);
    setTime(user.configuration.restTimeMin + ":" + sec);
    setLoading(false);

    console.log("LLLLLLLLLLLLLLLLLLLos resultados son:", imc, perceivedEffort, {
      min: minimunAverage,
      max: maximunAverage,
      repetitionAmount: user.configuration.repetitionAmount,
    });
  };

  const titleText = (user) => {
    if (user.information.role == "paciente") {
      return "";
    }
  };
  const pull_repData = (data) => {
    setSelectedValue({ ...selectedValue, repetitionAmount: data });
    console.warn("rep data pulled==========", data); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
  };

  const pull_timeData = (data) => {
    console.warn("time data pulled==========", data); //
    setTime(data);
    let timeSelected = data.split(":");
    setMinutes(parseInt(timeSelected[0]));
    setSeconds(parseInt(timeSelected[1]));
  };

  useEffect(() => {
    console.warn("entered state setter ue effect");
    if (props.connection) {
      console.log("checking database");
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser?.uid)
        .get()
        .then((user) => {
          calculatePercentajes(user.data());
        })
        .catch((e) => {
          setLoading(false);
        });
    } else {
      calculatePercentajes(props.user.information);
      setLoading(false);
    }
    console.warn("time----", time);
  }, []);

  // useEffect(() => {
  //   let sec = "";
  //   console.warn("enter model use effect");
  //   props.user.information.configuration.restTimeSec === 0
  //     ? (sec = 0 + "" + props.user.information.configuration.restTimeSec)
  //     : (sec = props.user.information.configuration.restTimeSec);
  //   if (props.navigation.state.params.btnText == "Continuar") {
  //     Alert.alert(
  //       "Antes de comenzar: ",
  //       "¿Quiere modifcar su configuración actual a la intensidad de repeticiones o tiempo de reposo? \n\nActualmente la configuración es: \nIntensidad - " +
  //         props.user.information.configuration.repetitionAmount +
  //         "% \nReposo - " +
  //         props.user.information.configuration.restTimeMin +
  //         ":" +
  //         sec,
  //       [
  //         {
  //           text: "Editar intensidad y reposo ",
  //           onPress: () => {},
  //         },
  //         {
  //           text: "Iniciar rutina",
  //           onPress: () =>
  //             props.navigation.navigate("Ejercicios", {
  //               repetitionAmount: parseInt(
  //                 props.user.information.configuration.repetitionAmount
  //               ),
  //               restTimeMin: parseInt(
  //                 props.user.information.configuration.restTimeMin
  //               ),
  //               restTimeSec: parseInt(
  //                 props.user.information.configuration.restTimeSec
  //               ),
  //             }),
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   }
  // }, []);

  const updateConfig = async () => {
    if (props.connection) {
      console.warn("inside updateconfig");
      await firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser?.uid)
        .update({
          configuration: {
            repetitionAmount: selectedValue.repetitionAmount,
            restTimeMin: minutes,
            restTimeSec: seconds,
          },
        })
        .then(() => {
          console.warn(
            "insdide then of updateconfig ",
            selectedValue.repetitionAmount
          );
          props.updateConfiguration({
            repetitionAmount: selectedValue.repetitionAmount,
            restTimeMin: minutes,
            restTimeSec: seconds,
          });
        });
    } else {
    }
    if (props.navigation.state.params.btnText == "Continuar") {
      props.navigation.navigate("Ejercicios", {
        repetitionAmount: selectedValue.repetitionAmount,
        restTimeMin: minutes,
        restTimeSec: seconds,
      });
    } else {
      setLoading(false);
      props.navigation.navigate("ProfileScreen");
    }
  };

  if (loading) {
    return (
      <View
        style={{ justifyContent: "center", height: "100%" }}
      >
        <ChargeScreen />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View
          style={
            props.navigation.state.params.btnText === "Continuar"
              ? styles.header2
              : styles.header
          }
        >
          {props.navigation.state.params.btnText === "Continuar" ? (
            <Text style={styles.textHeader}>
              ANTES DE INICIAR: Por favor verifica que la configuración de
              intensidad de repeticiones y tiempo de reposo este acorde a sus
              capacidades actuales.
            </Text>
          ) : (
            <Text style={styles.textHeader}>
              Su esfuerzo percibido es {selectedValue.perceivedForce}, y su IMC
              es {selectedValue.imcCategory} por ende usted puede hacer entre el{" "}
              {selectedValue.min}% y {selectedValue.max}% de las repeticiones.
            </Text>
          )}
        </View>
        <View style={styles.configurationContainer}>
          {/* <View style={styles.containerPercentajes}>
            <Text>Config. Actual {selectedValue.repetitionAmount}%</Text>
          </View> */}

          <View style={styles.containerInput}>
            <Text style={{}}>Repeticiones </Text>
            <Picker
              width={"100%"}
              setData={pull_repData}
              placeholder={"Seleccionar"}
              height={40}
              initialValue={selectedValue.repetitionAmount}
              list={selectedValue.range}
              percentajes={true}
            />
            {/* {repetitionSelector()} */}
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Tiempo de Reposo entre series </Text>
            <Text style={{ fontSize: vmin(4), fontWeight: "700" }}>
              (MINUTO : SEGUNDO)
            </Text>
            <Picker
              width={"100%"}
              height={40}
              placeholder={"00:00"}
              setData={pull_timeData}
              initialValue={time}
              list={["0:30", "1:00", "1:30", "2:00"]}
            />
            {/* {unifiedTimeSlector()} */}
          </View>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setLoading(true);
              console.warn("reps----", selectedValue.repetitionAmount);
              if (
                selectedValue.repetitionAmount !== 0 &&
                (seconds !== 0 || minutes !== 0)
              ) {
                await updateConfig();
              } else {
                Alert.alert(
                  "Por favor seleccione el porcentaje de repeticiones."
                );
                setLoading(false);
              }
            }}
          >
            <Text style={{ color: "white" }}>
              {props.navigation.state.params.btnText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.warn("configu---", store.User.user.information.configuration);
  return {
    user: store.User.user,
    connection: store.User.connection,
    configuration: store.User.user.information.configuration,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  updateConfiguration: (val) =>
    dispatch(actionsUser.UPDATE_USER_CONFIGURATION(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(CustomizeRoutine);

const styles = StyleSheet.create({
  header: {
    height: "25%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 1,
    marginLeft: "10%",
    marginRight: "10%",
  },
  header2: {
    height: "25%",
    width: "90%",
    padding: 15,
    justifyContent: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "3%",
    alignItems: "center",
    backgroundColor: "#fff300",
  },

  textHeader: {
    fontSize: vmin(5),
    textAlign: "justify",
  },

  container: {
    backgroundColor: "white",
    maxWidth: wp("100%"),
    maxHeight: hp("100%"),
  },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "55%",
    //borderBottomWidth: 1,
    borderBottomColor: "#151522",
    alignItems: "center",

    // justifyContent: "center",
  },
  containerPercentajes: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "peru",
  },

  containerInput: {
    height: "30%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "10%",
    justifyContent: "space-evenly",
    // backgroundColor: "tomato",
  },

  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    width: "45%",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },

  containerButton: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
    // backgroundColor: "red",
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "80%",
    height: "40%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },

  timeInputContainer: {
    height: "50%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
