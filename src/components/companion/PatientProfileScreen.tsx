import React, { Component, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";

var { vmin } = require("react-native-expo-viewport-units");
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ScalableText from "react-native-text";
// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import firebase from "../../../database/firebase";

// import ProgressCircle from "react-native-progress-circle";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const GeneralProfileScreen = (props) => {
  console.warn("profile patient----------", props.navigation.state)
  let trainingPhase = "";
  let activeWeek = "";
  let activeDay = 0;
  let width = "";
  const [userInformation, setUserInformation]: any = useState({ loading: true });
  let info: any = {};
  console.warn("props---",    props.navigation.state.params.uid);
  const getInformation = async () => {
    let patientIdentifier =  props.navigation.state.params.uid;
    console.log(
      "{}{}{}{}P{}{}{}{}{}{}{}{}{}}el id del paciente que llegas es ",
      patientIdentifier
    );
    await firebase.db
      .collection("users")
      .doc(patientIdentifier)
      .get()
      .then((user: any) => {
        info = user.data();
        info["loading"] = false;
        console.log("La informaicon qudo asi ;", info);
      })
      .catch((e) => {
        // setLoading(false);
      });

    let record = await firebase.db
      .collection("endRoutine")
      .where("uid", "==", patientIdentifier)
      .get();

    info["record"] = filterRecord(record);
    console.log(
      "La informacion es :::::::::::: :::::::::::: :::::::::::: :::::::::::: ::::::::::::",
      info
    );
    setUserInformation(info);
  };

  const filterRecord = (collection) => {
    let record: any = {};
    collection.docs.forEach((doc, index) => {
      console.warn(
        "Esta es la iteracion numerooooooooooooooooooooooooooooooooooooo",
        index,
        record
      );
      let currentDocument = {
        ...doc.data(),
        id: doc.id,
      };
      let activeWeek = currentDocument.week;
      let activeDay = currentDocument.day;
      let trainingPhase = "";
      if (parseInt(activeWeek.replace("week", ""), 10) <= 3) {
        trainingPhase = "Fase Inicial";
      } else if (parseInt(activeWeek.replace("week", ""), 10) <= 7) {
        trainingPhase = "Fase Intermedia";
      } else {
        trainingPhase = "Fase Avanzada";
      }
      // Verificacion para saber si la fase existe
      if (record[trainingPhase]) {
        console.log(
          "Aqui la fase ya habia sido creada aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          record
        );
        //Verificacion si existe la semana
        if (record[trainingPhase][activeWeek]) {
          console.table("Aqui la semana 1 ya existia ", record);
          //Verificacion si existe el dia
          if (record[trainingPhase][activeWeek][activeDay] != 0) {
            record[trainingPhase][activeWeek][activeDay].push({
              ...currentDocument,
            });
          }
          // Verificaccion si no existe el dia
          else {
            record[trainingPhase][activeWeek][activeDay] = [
              { ...currentDocument },
            ];
          }
        }
        // Si no existe la semana
        else {
          console.log("La semana no existia ", record);
          record[trainingPhase][activeWeek] = [0, 0, 0, 0, 0, 0, 0];
          record[trainingPhase][activeWeek][activeDay] = [
            { ...currentDocument },
          ];
        }
      }
      // si no existe la fase
      else {
        record[trainingPhase] = {};
        record[trainingPhase][activeWeek] = [0, 0, 0, 0, 0, 0, 0];
        record[trainingPhase][activeWeek][activeDay] = [{ ...currentDocument }];
      }
    });
    console.log("======= El resuldato de la semana es :", record);

    return record;
  };

  props.user.information.role == "paciente" ? (width = "42%") : (width = "84%");
  //console.log("rolee====",props.props)
 
    // console.log(props.activeDay)
    trainingPhase = props.navigation.state.params.trainingPhase;
    activeWeek = props.navigation.state.params.activeWeek;
    activeDay = props.navigation.state.params.activeDay;
 
  //console.log("weekkk----",activeWeek)
  if (
    parseInt(activeWeek.replace("week", ""), 10) == 1 &&
    trainingPhase == "Inicial" &&
    activeDay == 0
  ) {
    var trainingPhasePercentage = 0;
    var activeWeekPercentage = 0;
    var activeDayPercentage = 0;
  } else {
    var weekkk = String(parseInt(activeWeek.replace("week", "")) - 1)
    var activeWeekPercentage =
      parseInt(weekkk, 10) * 10;
      var activeDayPercentage = activeDay * 20;
      console.warn("day---", activeDay)
    var trainingPhasePercentage =
    parseInt(activeWeek.replace("week", "")) > 4 ? 30 : parseInt(activeWeek.replace("week", "")) > 7 ? 60 : parseInt(activeWeek.replace("week", "")) > 9 ? 90 : 0;
    
  }
  if (trainingPhasePercentage == 110) {
    trainingPhasePercentage = 100;
  }
  if (activeWeekPercentage == 110) {
    trainingPhasePercentage = 100;
    activeWeekPercentage = 100;
  }
  if (activeDayPercentage == 110) {
    activeDayPercentage = 100;
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowButtons}>
        
          <TouchableOpacity
            onPress={() => props.navigation.navigate("PatientEvent", {uid: props.navigation.state.params.uid})}
            style={[
              styles.button,
              {
                width: width,
                backgroundColor: "white",
                borderColor: "#6979F8",
                borderWidth: vmin(0.3),
              },
            ]}
          >
            <ScalableText style={{ color: "#6979F8", fontWeight:"bold" }}>
              Reportar Incidente
            </ScalableText>
          </TouchableOpacity>
       
      </View>

      <TouchableOpacity
        onPress={async () => {
          const myPromise = new Promise((resolve, reject) => {
            resolve(getInformation());
          });

          myPromise.then(() => {
            console.warn("usring---",info);

            props.navigation.navigate("PatientHistory", {
              userInformation: info,
            });
          });
        }}
        style={styles.progressContainer}
      >
        <Text
          style={{
            fontSize: vmin(5),
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
          }}
        >
          Control
        </Text>
        <Text
          style={{
            fontSize: vmin(3),
            width: "80%",
            textAlign: "center",
            marginBottom: "2%",
          }}
        >
          Los porcentajas se calculan automáticamente con base a su progreso en
          el plan.
        </Text>
        <View style={styles.progressSection}>
          <View style={styles.progressSection_texts}>
            <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
              Plan de Ejercicios
            </Text>
            <Text
              style={{ fontSize: vmin(3.5), color: "rgba(153, 153, 153, 1)" }}
            >
              Fase {trainingPhase}
            </Text>
          </View>
          <View style={styles.progressSection_circle}>
            <AnimatedCircularProgress
              size={vmin(23)}
              width={vmin(2)}
              fill={trainingPhasePercentage}
              tintColor="#6979F8"
              backgroundColor="rgba(228, 228, 228, 1)"
              rotation={0}
            >
              {(fill) => <Text>{trainingPhasePercentage}%</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressSection_texts}>
            <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
              Semana del Plan
            </Text>
            <Text
              style={{ fontSize: vmin(3.5), color: "rgba(153, 153, 153, 1)" }}
            >
              Semana {(activeWeekPercentage+10) / 10} de 10
            </Text>
          </View>
          <View style={styles.progressSection_circle}>
            <AnimatedCircularProgress
              size={vmin(23)}
              width={vmin(2)}
              fill={activeWeekPercentage}
              tintColor="#6979F8"
              backgroundColor="rgba(228, 228, 228, 1)"
              rotation={0}
            >
              {(fill) => <Text>{activeWeekPercentage}%</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressSection_texts}>
            <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
              Dia de la Semana
            </Text>
            <Text
              style={{ fontSize: vmin(3.5), color: "rgba(153, 153, 153, 1)" }}
            >
              Dia {(activeDayPercentage + 20 ) / 20} de 5
            </Text>
          </View>
          <View style={styles.progressSection_circle}>
            <AnimatedCircularProgress
              size={vmin(23)}
              width={vmin(2)}
              fill={activeDayPercentage}
              tintColor="#6979F8"
              backgroundColor="rgba(228, 228, 228, 1)"
              rotation={0}
            >
              {(fill) => <Text>{activeDayPercentage}%</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>
      </TouchableOpacity>

      {props.user.information.role == "paciente" ? (
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => props.navigation.navigate("ScheduleRoutines")}
          >
            <ScalableText style={{ color: "white" , fontWeight:"bold"}}>
              Configurar alarmas de la rutina semanal
            </ScalableText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() =>
              props.props.navigation.navigate("CustomizeRoutine", {
                btnText: "Guardar",
              })
            }
          >
            <ScalableText style={{ color: "white", fontWeight:"bold" }}>
              Editar intensidad y tiempo de reposo
            </ScalableText>
          </TouchableOpacity>
        </View>
      ) : (
        console.log("gfd")
      )}
    </View>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.warn("storeee---", store.DownloadReducer.ExerciseRoutineIndentifiers);
  return {
    user: store.User.user,
    connection: store.User.connection,
    donwloaded: store.DownloadReducer.ExerciseRoutineIndentifiers,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(
  MapStateToProps,
  MapDispatchToProps
)(GeneralProfileScreen);

const styles = StyleSheet.create({
  container: {
    maxWidth: wp("100%"),
    maxHeight: hp("100%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  rowButtons: {
    width: "100%",
    height: "10%",
    marginTop: "3%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "pink",
  },

  button: {
    width: "42%",
    height: "90%",
    backgroundColor: "#6979F8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  button2: {
    width: "90%",
    height: "40%",
    marginBottom: "4%",
    backgroundColor: "#6979F8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  containerHeader: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },

  progressContainer: {
    width: "95%",
    height: "85%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "3%",
    borderRadius: 10,
    backgroundColor: "rgba(93,93,93,0.1)",
  },
  footerButtons: {
    width: "100%",
    height: "20%",
    marginTop: "4%",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "salmon",
  },
  containerButton: {
    height: "10%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
  },

  progressSection: {
    width: "90%",
    height: "24%",
    backgroundColor: "white",
    marginBottom: "2%",
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },

  progressSection_texts: {
    height: "100%",
    width: "65%",
    justifyContent: "space-evenly",
    paddingLeft: "5%",
  },

  progressSection_circle: {
    height: "100%",
    width: "35%",
    marginBottom: "5%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "peru",
  },
});
