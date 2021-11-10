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
  ViewBase,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

const SatisfactionSurvey = (props) => {
  const [values, setValues] = useState({
    understandingExercises: "",
    applicationUnderstanding: "",
    sentimentPercentage: "Neutro",
  });

  const saveFormReportEvent = async () => {
    let idRecord = "";

    let res = await firebase.db.collection("satisfactionSurvey").add({
      ...values,
      userId: props.user.uid,
      userName: props.user.information.personal.name,
      userPhone: props.user.information.personal.phone,
    });
    idRecord = res.id;
    props.navigation.navigate("Home");
  };
  useEffect(()=>{
    console.warn("survey effect")
  },[])
  return (
    <View style={styles.Contenedor}>
      <View style={styles.ContainerQuestions}>
        <View style={styles.ContainerQuestion}>
          <Text style={styles.Question}>
            {" "}
            Logro comprender los ejercicios?{" "}
          </Text>
          <TextInput
            value={values.understandingExercises}
            onChangeText={(text) =>
              {setValues({ ...values, understandingExercises: text })}
            }
            style={styles.ContainerAnswer}
          />
        </View>
      </View>
      <View style={styles.ContainerQuestions}>
        <View style={styles.ContainerQuestion}>
          <Text style={styles.Question}> Entendio la aplicacion?</Text>
          <TextInput
            style={styles.ContainerAnswer}
            value={values.applicationUnderstanding}
            onChangeText={(text) =>
              {setValues({ ...values, applicationUnderstanding: text })}
            }
          />
        </View>
      </View>

      <View style={styles.ContainerQuestions}>
        <View style={styles.ContainerQuestion}>
          <Text style={styles.Question}>
            Como se siente después de completar el protocolo?
          </Text>

          <Picker
            selectedValue={values.sentimentPercentage + ""}
            style={{ height: vmin(15), width: "100%" }}
            onValueChange={(itemValue, itemIndex) =>
              {setValues({ ...values, sentimentPercentage: itemValue })}
            }
          >
            {["Mal", "Neutro", "Excelente"].map((element, index) => {
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

      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>{ saveFormReportEvent()}}
        >
          <Text style={{ color: "white" }}>Registrar Respuestas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});

export default connect(MapStateToProps, MapDispatchToProps)(SatisfactionSurvey);

const styles = StyleSheet.create({
  Contenedor: {
    backgroundColor: "white",
    justifyContent: "space-around",
    height: "100%",
  },
  textHeader: {
    fontSize: vmin(6),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginBottom: vmin(5),
  },
  ContainerQuestions: {
    width: "90%",
    margin: "auto",
    height: "25%",
  },
  ContainerQuestion: {
    width: "100%",
    height: "auto",
    marginTop: vmin(3),
  },
  Question: {
    fontSize: vmin(5),
    textAlign: "left",
  },
  ContainerAnswer: {
    width: "100%",
    height: vmin(15),
    borderColor: "#e4e4e4",
    borderWidth: vmin(0.5),
    marginTop: vmin(2),
    borderRadius: vmin(4),
  },

  containerButton: {
    height: "15%",
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
});
