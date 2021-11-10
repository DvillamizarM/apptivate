import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Picker,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
var { vmin, vh } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

function CustomizePatient({ props }) {
  const { userInformation } = props.props;
console.warn("props protocolo customize", props);  
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
    console.log(
      "peso: ",
      user.medical.weight,
      "tama;o: ",
      user.medical.size,
      "Informacion completa: ",
      user
    );
    const imc = imcPercentaje(
      user.medical.weight /
        ((user.medical.size / 100) * (user.medical.size / 100))
    );

    const perceivedEffort = calculatePerceivedEffort(
      user.medical.perceivedForce
    );

    let minimunAverage =(imc.min+perceivedEffort.min) / 2;
    let maximunAverage = (imc.max + perceivedEffort.max) / 2;
    console.log(minimunAverage% 10, "     ", maximunAverage% 10)
minimunAverage % 10 == 5 ? minimunAverage -= 5 : minimunAverage = minimunAverage;
maximunAverage% 10 == 5 ? maximunAverage -= 5 : maximunAverage = maximunAverage;

    let range: any = ["Seleccionar"];
    let difference = maximunAverage - minimunAverage;

    for (let index = minimunAverage; index <= maximunAverage; index+=10) {
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
    setSeconds(user.configuration.restTimeSec);
    setMinutes(user.configuration.restTimeMin);
    setLoading(false);

    console.log("LLLLLLLLLLLLLLLLLLLos resultados son:", imc, perceivedEffort, {
      min: minimunAverage,
      max: maximunAverage,
      repetitionAmount: user.configuration.repetitionAmount,
    });
  };

  useEffect(() => {
    calculatePercentajes(userInformation);
  }, []);

  const updateConfig = async () => {
    console.log("uid---", userInformation.uid)
      console.log("uid---", userInformation.uid)
      await firebase.db
        .collection("users")
        .doc(userInformation.uid)
        .update({
          configuration: {
            repetitionAmount:selectedValue.repetitionAmount,
            restTimeMin:minutes,
            restTimeSec: seconds,
            repetitionMax: selectedValue.max,
            repetitionMin: selectedValue.min,
          },
        });
  };

  const repetitionSelector = () => {
    return (
      <View style={styles.repetitionInputContainer}>
        <Picker
          selectedValue={selectedValue.repetitionAmount + ""}
          style={{ height: "100%", width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValue({ ...selectedValue, repetitionAmount: itemValue })
          }
        >
          {selectedValue.range.map((element, index) => {
            return (
              <Picker.Item
                key={"p" + index}
                label={element + "%"}
                value={element + ""}
              />
            );
          })}
        </Picker>
      </View>
    );
  };

  const timeSelector = () => {
    return (
      <View style={styles.timeInputContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.textInput}>Minutos</Text>
          <Picker
            selectedValue={minutes + ""}
            style={{ height: "100%", width: "100%" }}
            onValueChange={(itemValue, itemIndex) => setMinutes(itemValue)}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((element, index) => {
              return (
                <Picker.Item
                  key={"m" + index}
                  label={element + ""}
                  value={element + ""}
                />
              );
            })}
          </Picker>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.textInput}>Segundos</Text>
          <Picker
            selectedValue={seconds + ""}
            style={{ height: "100%", width: "100%" }}
            onValueChange={(itemValue, itemIndex) => setSeconds(itemValue)}
          >
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
              (element, index) => {
                return (
                  <Picker.Item
                    key={"s" + index}
                    label={element + ""}
                    value={element + ""}
                  />
                );
              }
            )}
          </Picker>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>
            El esfuerzo percibido del paciente es {selectedValue.perceivedForce}, y su IMC es{" "}
            {selectedValue.imcCategory} por ende puede hacer entre el{" "}
            {selectedValue.min}% y {selectedValue.max}% de las repeticiones.
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          <View style={styles.containerPercentajes}>
            <Text style={{ fontWeight: "bold" }}>
              Min {selectedValue.min}% - Max. {selectedValue.max}%
            </Text>

            <Text>Config. Actual {selectedValue.repetitionAmount}%</Text>
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Repeticiones </Text>
            {repetitionSelector()}
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Tiempo de Reposo entre series</Text>
            {timeSelector()}
          </View>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.warn("reps----", selectedValue.repetitionAmount);
              if (
                selectedValue.repetitionAmount &&
                selectedValue.repetitionAmount != "Seleccionar%"
              ) {
                console.log("b4 update")
                updateConfig();
              } else {
                Alert.alert(
                  "Por favor seleccione el porcentaje de repeticiones."
                );
              }
            }}
          >
            <Text style={{ color: "white" }}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    connection: store.User.connection,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(CustomizePatient);

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
  textHeader: {
    fontSize: vmin(5),
  },

  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    minHeight: vh(80),
  },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "60%",
    borderBottomWidth: 1,
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
    marginBottom: "10%",
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
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
    // backgroundColor: "red",
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "100%",
    height: "100%",
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
