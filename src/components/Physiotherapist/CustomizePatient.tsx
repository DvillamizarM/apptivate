import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Picker from "../Simple/Picker";
var { vmin, vh } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ChargeScreen from "../Simple/ChargeScreen";

function CustomizePatient({ props }) {
  const { userInformation } = props.props;
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
    let difference = maximunAverage - minimunAverage;

    for (let index = minimunAverage; index <= maximunAverage; index += 10) {
      range.push(index);
    }
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
    setTime(user.configuration.restTimeMin + ":" + sec);
    setLoading(false);
  };

  useEffect(() => {
    calculatePercentajes(userInformation);
  }, []);

  const updateConfig = async () => {
    await firebase.db
      .collection("users")
      .doc(userInformation.uid)
      .update({
        configuration: {
          repetitionAmount: selectedValue.repetitionAmount,
          restTimeMin: minutes,
          restTimeSec: seconds,
          repetitionMax: selectedValue.max,
          repetitionMin: selectedValue.min,
        },
      });
  };

  const pull_repData = (data) => {
    setSelectedValue({ ...selectedValue, repetitionAmount: data });
  };

  const pull_timeData = (data) => {
    setTime(data);
    let timeSelected = data.split(":");
    setMinutes(parseInt(timeSelected[0]));
    setSeconds(parseInt(timeSelected[1]));
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <ChargeScreen />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>
            {selectedValue.perceivedForce !== ""
              ? "El esfuerzo percibido del paciente es " +
                selectedValue.perceivedForce +
                " y su IMC es " +
                selectedValue.imcCategory +
                " por ende puede hacer entre el " +
                selectedValue.min +
                "% y " +
                selectedValue.max +
                "% de las repeticiones."
              : "Usuario no tiene datos médicos registrados, por ende esta función no está disponible."}
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          <View style={styles.containerPercentajes}>
            <Text>Config. Actual {selectedValue.repetitionAmount}%</Text>
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Repeticiones </Text>
            <Picker
              width={"100%"}
              setData={pull_repData}
              placeholder={"Seleccionar"}
              height={40}
              disabled={selectedValue.perceivedForce === ""}
              initialValue={selectedValue.repetitionAmount}
              list={selectedValue.range}
              percentajes={true}
            />
            {/* {repetitionSelector()} */}
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Tiempo de Reposo entre series</Text>
            <Picker
              width={"100%"}
              height={40}
              disabled={selectedValue.perceivedForce === ""}
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
            disabled={selectedValue.perceivedForce === ""}
            onPress={() => {
              if (
                selectedValue.repetitionAmount &&
                selectedValue.repetitionAmount != "Seleccionar%"
              ) {
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
