import React, { Component, useEffect, useState } from "react";
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

import { AnimatedCircularProgress } from "react-native-circular-progress";

const GeneralProfileScreen = (props) => {
  const [initializing, setInitializing] = useState(false);
  
  const [percent, setPercent] = useState([]);
  const [control, setControl] = useState({
    trainingPhase: props.props.user.information.control.trainingPhase,
    activeWeek:
      parseInt(
        props.props.user.information.control.activeWeek.replace("week", "")
      ) - 1,
    activeDay: props.props.user.information.control.activeDay,
  });

  let width = "";
  props.props.user.information.role === "paciente" ||
  props.props.user.information.role === ""
    ? (width = "42%")
    : (width = "84%");

  const [userInformation, setUserInformation] = useState({ loading: true });
  let info: any = {};


  const getInformation = async () => {
    let patientIdentifier = props.props.user.uid;
    await firebase.db
      .collection("users")
      .doc(patientIdentifier)
      .get()
      .then((user: any) => {
        info = user.data();
        info["loading"] = false;
      })
      .catch((e) => {
        Alert.alert("Error conectando con la base de datos vuelva a intentar");
        props.props.navigation.navigate("ProfileScreen");
      });
    let record = await firebase.db
      .collection("endRoutine")
      .where("uid", "==", patientIdentifier)
      .get();

    info["record"] = filterRecord(record);
    setUserInformation(info);
  };

  const setPercents = async () => {
    setControl({
      trainingPhase: props.user.information.control.trainingPhase,
      activeWeek:
        parseInt(
          props.user.information.control.activeWeek.replace("week", "")
        ) - 1,
      activeDay: props.user.information.control.activeDay,
    });
    let tempTraingingPercent = 0;
    let tempWeekPercent = 0;
    let tempDayPercent = 0;
    if (control.activeWeek == 11) {
      tempTraingingPercent = 100;
      tempWeekPercent = 100;
      tempDayPercent = 100;
    } else {
      tempTraingingPercent =
        control.trainingPhase === "Inicial"
          ? 0
          : control.trainingPhase === "Intermedia"
          ? 30
          : control.trainingPhase === "Avanzada"
          ? 70
          : 100;
      tempWeekPercent = control.activeWeek * 10;
      tempDayPercent = control.activeDay * 20;
    }
    setPercent([tempTraingingPercent, tempWeekPercent, tempDayPercent]);
    setInitializing(false);
  };

  useEffect(() => {
    if (props.user !== undefined) {
      setInitializing(true);
      setPercents();
    } else {
      setInitializing(true);
    }
  }, []);

  const filterRecord = (collection) => {
    let record: any = {};
    collection.docs.forEach((doc, index) => {
  
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
   
        //Verificacion si existe la semana
        if (record[trainingPhase][activeWeek]) {
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

    return record;
  };

  const validateStartData = async () => {

    if (
      props.props.user.information.role === "paciente" &&
      props.props.user.information.companionRef !== ""
    ) {
      props.props.navigation.navigate("CustomizeRoutine", {
        btnText: "Continuar",
      });
    } else if (props.props.user.information.role === "") {
      validateExistenceOfData();
    } else {

      Alert.alert(
        "No puedes empezar la rutina hasta que tu acompañante inicie sesión"
      );
    }
  };

  const validateEditData = async () => {
    if (
      props.props.user.information.medical.size !== "" ||
      props.props.user.information.medical.perceivedForce !== ""
    ) {
      props.props.navigation.navigate("CustomizeRoutine", {
        btnText: "Guardar",
      });
    } else {
      props.props.navigation.navigate("RecordTrainingData", { start: false });
    }
  };

  const validateExistenceOfData = () => {
    if (
      props.props.user.information.medical.size === "" ||
      props.props.user.information.medical.perceivedForce === ""
    ) {
      props.props.navigation.navigate("RecordTrainingData", { start: true });
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
              props.props.user.information.role === "paciente" && (
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
                  <ScalableText
                    style={{ color: "#6979F8", fontWeight: "bold" }}
                  >
                    Reportar Incidente
                  </ScalableText>
                </TouchableOpacity>
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
                Fase {control.trainingPhase}
              </Text>
            </View>
            <View style={styles.progressSection_circle}>
              <AnimatedCircularProgress
                size={vmin(20)}
                width={vmin(2)}
                fill={percent[0] ? percent[0] : 0}
                tintColor="#6979F8"
                backgroundColor="rgba(228, 228, 228, 1)"
                rotation={0}
              >
                {(fill) => <Text>{percent[0]}%</Text>}
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
                Semana {control.activeWeek + 1} de 10
              </Text>
            </View>
            <View style={styles.progressSection_circle}>
              <AnimatedCircularProgress
                size={vmin(20)}
                width={vmin(2)}
                fill={percent[1] ? percent[1] : 0}
                tintColor="#6979F8"
                backgroundColor="rgba(228, 228, 228, 1)"
                rotation={0}
              >
                {(fill) => <Text>{percent[1]}%</Text>}
              </AnimatedCircularProgress>
            </View>
          </View>
          {props.props.user.information.control.activeWeek !== "week11" && (
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
                  Dia {control.activeDay + 1} de 5
                </Text>
              </View>
              <View style={styles.progressSection_circle}>
                <AnimatedCircularProgress
                  size={vmin(20)}
                  width={vmin(2)}
                  fill={percent[2] ? percent[2] : 0}
                  tintColor="#6979F8"
                  backgroundColor="rgba(228, 228, 228, 1)"
                  rotation={0}
                >
                  {(fill) => <Text>{percent[2]}%</Text>}
                </AnimatedCircularProgress>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {(props.props.user.information.role === "paciente" ||
          props.props.user.information.role === "") &&
          props.props.user.information.control.activeWeek !== "week11" && (
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => validateEditData()}
              >
                <ScalableText style={{ color: "white", fontWeight: "bold" }}>
                  Editar intensidad y tiempo de reposo
                </ScalableText>
              </TouchableOpacity>
            </View>
          )}
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    control: store.User.user.information.control,
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
    height: "80%",
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
    height: "76%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "3%",
    borderRadius: 10,
    backgroundColor: "rgba(93,93,93,0.1)",
  },
  footerButtons: {
    width: "100%",
    height: "10%",
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
