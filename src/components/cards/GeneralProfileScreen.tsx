import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

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
  const [initializing, setInitializing] = useState(false);
  let trainingPhase = "";
  let activeWeek = "";
  let activeDay = 0;
  let width = "";
  const [userInformation, setUserInformation] = useState({ loading: true });
  let info: any = {};
  console.warn("props---", props.props.user.information.role);
  const getInformation = async () => {
    let patientIdentifier = props.props.user.uid;
    console.warn(
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

  props.props.user.information.role === "paciente" ||
  props.props.user.information.role === ""
    ? (width = "42%")
    : (width = "84%");
  //console.log("rolee====",props.props)
  if (
    props.props.user.information.role === "paciente" ||
    props.props.user.information.role === ""
  ) {
    trainingPhase = props.props.user.information.control.trainingPhase;
    activeWeek = props.props.user.information.control.activeWeek;
    activeDay = props.props.user.information.control.activeDay;
  } else if (props.props.user.information.role === "companion") {
    // console.log(props.activeDay)
    trainingPhase = props.props.user.information.control.trainingPhase;
    activeWeek = props.props.user.information.control.activeWeek;
    activeDay = props.props.user.information.control.activeDay;
  }

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
    var weekkk = String(parseInt(activeWeek.replace("week", "")) - 1);
    var activeWeekPercentage = parseInt(weekkk, 10) * 10;
    var activeDayPercentage = activeDay * 20;
    console.warn("day---", activeDay);
    var trainingPhasePercentage =
      trainingPhase === "Inicial"
        ? 0
        : trainingPhase === "Intermedio"
        ? 30
        : trainingPhase === "Avanzada"
        ? 70
        : 100;
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
  const validateStartData = async () => {
    // Validacion para determinar si el acompanante ya inicio sesion
    // props.props.navigation.navigate("CustomizeRoutine", {
    //   btnText: "Continuar",
    // });
    if (
      props.props.user.information.role == "paciente" &&
      props.props.user.information.companionRef != ""
    ) {
      props.props.navigation.navigate("CustomizeRoutine", {
        btnText: "Continuar",
      });
    } else if (props.props.user.information.role === "") {
      validateExistenceOfData();
    } else {
      console.log(
        " -- - - --   No puedes empezar la rutina hasta que tu acompañante inicie sesión"
      );
      Alert.alert(
        "No puedes empezar la rutina hasta que tu acompañante inicie sesión"
      );
    }
  };

  const validateExistenceOfData = () => {
    if (
      props.props.user.information.medical.size === "" ||
      props.props.user.information.medical.perceivedForce === ""
    ) {
      props.props.navigation.navigate("RecordTrainingData");
    } else {
      props.props.navigation.navigate("CustomizeRoutine", {
        btnText: "Continuar",
      });
    }
  };
  if (initializing)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View
          style={{
            width: "80%",
            height: "30%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: vmin(8),
              color: "rgba(153, 153, 153, 1)",
              marginTop: "5%",
            }}
          >
            Cargando
          </Text>
          <ActivityIndicator size="large" color="#6979f8" />
        </View>
      </View>
    );
  else {
    return (
      <View style={styles.container}>
        {(props.props.user.information.role === "paciente" ||
          props.props.user.information.role === "") &&
        props.props.user.information.control.activeWeek !== "week11" ? (
          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "rgba(225, 126, 62,1)" },
              ]}
              onPress={() => {
                console.warn("legnth----", props.donwloaded);
                if (props.connection || props.donwloaded.length === 4) {
                  validateStartData();
                } else {
                  Alert.alert(
                    "Error",
                    "No se puede iniciar la rutina porque no hay conexión a internet. Para hacer la rutina sin internet por favor descargue todos los ejercicios del catálogo y vuelva a intentar."
                  );
                }
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                Iniciar Rutina
              </Text>
            </TouchableOpacity>
            {props.connection &&
            props.props.user.information.role === "paciente" ? (
              <TouchableOpacity
                onPress={() => props.props.navigation.navigate("ReportEvent")}
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
                <ScalableText style={{ color: "#6979F8", fontWeight: "bold" }}>
                  Reportar Incidente
                </ScalableText>
              </TouchableOpacity>
            ) : (
              console.log("no")
            )}
          </View>
        ) : (
          <View></View>
        )}

        {props.props.user.information.control.activeWeek == "week11" ? (
          <View
            style={{
              width: "100%",
              height: "10%",
              marginTop: "0%",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "rgba(225, 126, 62,1)",
                  marginBottom: "8%",
                  width: "90%",
                },
              ]}
              onPress={() => {
                props.props.navigation.navigate("SatisfactionSurvey");
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                Responder cuestionario de satisfacción
              </Text>
            </TouchableOpacity>
            {props.connection &&
            props.props.user.information.role === "paciente" ? (
              <TouchableOpacity
                onPress={() => props.props.navigation.navigate("ReportEvent")}
                style={[
                  styles.button,
                  {
                    width: "90%",
                    backgroundColor: "white",
                    borderColor: "#6979F8",
                    borderWidth: vmin(0.3),
                  },
                ]}
              >
                <Text style={{ color: "#6979F8", fontWeight: "bold" }}>
                  Reportar Incidente
                </Text>
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
          </View>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          onPress={async () => {
            setInitializing(true);
            const myPromise = new Promise((resolve, reject) => {
              resolve(getInformation());
            });

            myPromise.then(() => {
              console.warn("usring---", info);

              props.props.navigation.navigate("RoutineHistory", {
                userInformation: info,
              });
              setInitializing(false);
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
            Los porcentajas se calculan automáticamente con base a su progreso
            en el plan.
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
                Semana {(activeWeekPercentage + 10) / 10} de 10
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
          {props.props.user.information.control.activeWeek !== "week11" ? (
            <View style={styles.progressSection}>
              <View style={styles.progressSection_texts}>
                <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
                  Dia de la Semana
                </Text>
                <Text
                  style={{
                    fontSize: vmin(3.5),
                    color: "rgba(153, 153, 153, 1)",
                  }}
                >
                  Dia {(activeDayPercentage + 20) / 20} de 5
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
          ) : (
            console.warn("nohtihn")
          )}
        </TouchableOpacity>

        {(props.props.user.information.role === "paciente" ||
          props.props.user.information.role === "") &&
        props.props.user.information.control.activeWeek !== "week11" ? (
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.button2}
              onPress={() =>
                props.props.navigation.navigate("ScheduleRoutines")
              }
            >
              <ScalableText style={{ color: "white", fontWeight: "bold" }}>
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
              <ScalableText style={{ color: "white", fontWeight: "bold" }}>
                Editar intensidad y tiempo de reposo
              </ScalableText>
            </TouchableOpacity>
          </View>
        ) : (
          console.log("gfd")
        )}
      </View>
    );
  }
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
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
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
    height: "66%",
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