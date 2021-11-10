import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Picker,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

import Check from "react-native-vector-icons/EvilIcons";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import * as MailComposer from "expo-mail-composer";

const MedicalData = ({ props }) => {
  const [data, setData] = useState({
    perceivedForce: "Seleccionar",
    size: "Seleccionar",
    weight: "Seleccionar",
    amputationLevel: "Seleccionar",
    amputationPhase: "Seleccionar",
    trainingPhase: "",
    age: "",
    evolutionTime: "",
    medicineList: [],
    conditionList: [],
    medicine: "",
    condition: "",
    corporalMass: 0,
  });

  const saveMedicalData = async () => {
    console.log("Se guardaran los datos medicos");
    await firebase.db
      .collection("users")
      .doc(props.user.uid)
      .update({
        medical: {
          perceivedForce: data.perceivedForce,
          size: data.size,
          weight: data.weight,
          age: data.age,
          evolutionTime: data.evolutionTime,
          amputationLevel: data.amputationLevel,
          amputationPhase: data.amputationPhase,
          medicineList: data.medicineList,
          conditionList: data.conditionList,
          //   corporalMass: parseInt(data.weight) / parseInt(data.size),
        },
        // "Inicial","Intermedia","Avanzada"
        control: {
          trainingPhase: "Inicial",
          activeWeek: "week1",
          activeDay: 0,
          record: [],
        },
      })
      .then((e) => {
        props.setUserMedical({
          medical: {
            perceivedForce: data.perceivedForce,
            size: data.size,
            weight: data.weight,
            age: data.age,
            evolutionTime: data.evolutionTime,
            amputationLevel: data.amputationLevel,
            amputationPhase: data.amputationPhase,
            medicineList: data.medicineList,
            conditionList: data.conditionList,
            corporalMass: parseInt(data.weight) / parseInt(data.size),
          },
          control: {
            trainingPhase: "Inicial",
            activeWeek: "week1",
            activeDay: 0,
            record: [],
          },
        });
      });
    props.navigation.navigate("Home");
  };

  let arraySize: any[] = ["Seleccionar"];
  for (let index = 130; index < 250; index++) {
    arraySize.push(index);
  }

  let arrayWeight: any[] = ["Seleccionar"];
  for (let index = 40; index < 300; index++) {
    arrayWeight.push(index);
  }

  //   let arrayAge: any[] = ["Seleccionar"];
  //   for (let index = 14; index < 100; index++) {
  //     arrayAge.push(index);
  //   }

  return (
    <View style={styles.containerMedicalData}>
      <View style={styles.containerTextHeader}>
        <Text style={styles.textHeader}>Datos Médicos</Text>
        <Text style={{}}>
          Estos datos son necesarios para poder personalizar su rutina de
          ejercicios
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.textInput}>Estatura (CM)</Text>
        <Picker
          selectedValue={data.size + ""}
          style={{ height: "100%", width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setData({ ...data, size: itemValue })
          }
        >
          {arraySize.map((element, index) => {
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
        <Text style={styles.textInput}>Peso (KG)</Text>
        <Picker
          selectedValue={data.weight + ""}
          style={{ height: "100%", width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setData({ ...data, weight: itemValue })
          }
        >
          {arrayWeight.map((element, index) => {
            return (
              <Picker.Item
                key={"s" + index}
                label={element + ""}
                value={element + ""}
              />
            );
          })}
        </Picker>
      </View>

      <View style={styles.containerInput}>
        <Text style={{}}>Nivel de Amputación</Text>

        <View style={styles.repetitionInputContainer}>
          <Picker
            selectedValue={data.amputationLevel + ""}
            style={{ height: "100%", width: "100%" }}
            onValueChange={(itemValue, itemIndex) =>
              setData({ ...data, amputationLevel: itemValue })
            }
          >
            {[
              "Seleccionar",
              "Transtibial",
              "Transfemoral",
              "Desarticulación de rodilla",
            ].map((element, index) => {
              return (
                <Picker.Item
                  key={"p" + index}
                  label={element + ""}
                  value={element + ""}
                />
              );
            })}
          </Picker>
        </View>
      </View>

      <View style={styles.containerInput}>
        <Text style={{}}>Fase de rehabilitación</Text>

        <View style={styles.repetitionInputContainer}>
          <Picker
            selectedValue={data.amputationPhase + ""}
            style={{ height: "100%", width: "100%" }}
            onValueChange={(itemValue, itemIndex) =>
              setData({ ...data, amputationPhase: itemValue })
            }
          >
            {["Seleccionar", "Preprotésico", "Protésico"].map(
              (element, index) => {
                return (
                  <Picker.Item
                    key={"p" + index}
                    label={element + ""}
                    value={element + ""}
                  />
                );
              }
            )}
          </Picker>
        </View>
      </View>

      <View style={styles.containerInput}>
        <Text style={{}}>Esfuerzo Percibido</Text>

        <View style={styles.repetitionInputContainer}>
          <Picker
            selectedValue={data.perceivedForce + ""}
            style={{ height: "100%", width: "100%" }}
            onValueChange={(itemValue, itemIndex) =>
              setData({ ...data, perceivedForce: itemValue })
            }
          >
            {[
              "Seleccionar",
              "Excesivamente Liviano",
              "Liviano",
              "Ni liviano ni pesado",
              "Pesado",
              "Excesivamente Pesado",
            ].map((element, index) => {
              return (
                <Picker.Item
                  key={"p" + index}
                  label={element + ""}
                  value={element + ""}
                />
              );
            })}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (Object.values(data).includes("Seleccionar")) {
            Alert.alert("Por favor seleccione todos los campos");
          } else {
            saveMedicalData();
          }
        }}
      >
        <Text style={{ color: "white" }}>Guardar Datos Médicos</Text>
      </TouchableOpacity>
    </View>
  );
};

const RecordTrainingData = (props) => {
  return (
    <View style={styles.screenContainer}>
      <MedicalData props={props} />
    </View>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.log("mapstate patient register-----", store.User.user);
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  setUserMedical: (val) => dispatch(actionsUser.UPDATE_USER_MEDICAL(val)),
  setUserRole: (val) => dispatch(actionsUser.UPDATE_USER_ROLE(val)),
  updateStatus: (val) => dispatch(actionsUser.UPDATE_STATUS(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(RecordTrainingData);

const styles = StyleSheet.create({
  screenContainer: { width: "100%", height: "100%", backgroundColor: "white" },

  containerSteps: {
    backgroundColor: "white",
    borderRadius: 10,
    height: "12%",
    justifyContent: "center",
  },
  containerCard: {
    height: "88%",
    width: "100%",
    // backgroundColor: "yellow",
  },

  containerMedicalData: {
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
  },

  rowText_button: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vmin(1),
  },

  containerInput: {
    height: vmin(14),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
    // backgroundColor: "green",
  },
  input: {
    height: "60%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },
  containerList: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
  },

  timeContainer: {
    height: vmin(14),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
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
    width: "90%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(10),
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },

  groupPickerContainer: {
    height: vmin(16),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    // backgroundColor: "green",
  },

  listItemsContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: "5%",
    marginRight: "15%",
    width: "80%",
  },

  containerFlexRow: {
    width: "100%",
    height: vmin(8),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },

  containerTextHeader: {
    alignItems: "center",
    width: "90%",
    height: "10%",
    marginLeft: "5%",
  },

  containerTextHeader2: {
    alignItems: "center",
    height: "30%",
    marginTop: "5%",
    width: "100%",
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: vmin(5),
    textAlign: "center",
  },
});
