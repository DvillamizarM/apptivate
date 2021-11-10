import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

import firebase from "../../../database/firebase";
var { vmin } = require("react-native-expo-viewport-units");

// iconos

import NavigateNext from "react-native-vector-icons/MaterialIcons";

import BookOutline from "react-native-vector-icons/Ionicons";

import Dumbbell from "react-native-vector-icons/MaterialCommunityIcons";

import User_o from "react-native-vector-icons/FontAwesome";

import Download from "react-native-vector-icons/Ionicons";

import Settings from "react-native-vector-icons/Ionicons";

const CompanionHome = (props) => {
  const [patientInformation, setPatientInformation]: any = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientInformation();
    console.warn("patinet ingoo---", patientInformation)
  }, []);

  const getPatientInformation = async () => {
    const collection = await firebase.db
      .collection("users")
      .where("companionRef", "==", props.user.uid)
      .get();

    let exercisesProcessed: any = collection.docs.map((doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      };
    });

    setPatientInformation(exercisesProcessed[0]);
    setLoading(false);
  };

  const userBody = () => {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <TouchableOpacity
          style={companionStyles.groupContainerBlue}
          onPress={() => {
            console.log("roleee---", props.user);
            props.navigation.navigate("Repository", {
              amputationLevel: patientInformation.medical.amputationLevel,
            });
          }}
        >
          <View style={companionStyles.containerIcon}>
            <BookOutline name="book-outline" size={vmin(10)} />
          </View>

          <View style={companionStyles.containerText}>
            <Text style={companionStyles.tile1}>
              Catálogo de Información
            </Text>
            <Text style={companionStyles.tile2}>
              Consultar colección de información general, planes y restricciones
            </Text>
          </View>

          <View style={companionStyles.arrowContainer}>
            <NavigateNext name="navigate-next" size={vmin(7)} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={companionStyles.groupContainerOrange}
          onPress={() => {
            //console.log(patientInformation.control.activeWeek);
            props.navigation.navigate("PatientProfileScreen", {
              uid: patientInformation.uid,
              trainingPhase: patientInformation.control.trainingPhase,
              activeWeek: patientInformation.control.activeWeek,
              activeDay: patientInformation.control.activeDay,
            });
          }}
        >
          <View style={companionStyles.containerIcon}>
            <Dumbbell name="dumbbell" size={vmin(10)} />
          </View>

          <View style={companionStyles.containerText}>
            <Text style={companionStyles.tile1}>Plan de Ejercicios</Text>
            <Text style={companionStyles.tile2}>
              Consultar proceso personal del plan de ejercicios
            </Text>
          </View>

          <View style={companionStyles.arrowContainer}>
            <NavigateNext name="navigate-next" size={vmin(7)} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const logOut = async () => {
    props.navigation.navigate("Login");
    await firebase.auth.signOut();

    // this.checkAsync();
    Alert.alert(
      "Cerrar Sesión",
      "¿Está seguro que quiere cerrar sesión? ",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          onPress: async () => {
            props.navigation.navigate("Login");
            await firebase.auth.signOut();
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  } else {
    if (patientInformation.uid) {
      console.log(
        "El id del paciente que tiene a cargo es ",
        patientInformation
      );
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.cardContainer}>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.percentages,
                    {
                      fontWeight: "bold",
                      width: "100%",
                      marginTop: "3%",
                      textAlign: "center",
                      fontStyle: "italic",
                      fontSize: vmin(4),
                    },
                  ]}
                >
                  Datos del paciente
                </Text>
              </View>

              <View style={styles.row}>
                <View style={styles.column1}>
                  <Text style={[styles.percentages, { fontWeight: "bold" }]}>
                    Acompaña a:
                  </Text>
                </View>

                <View style={styles.column2}>
                  <Text style={[styles.description, { fontWeight: "bold" }]}>
                    {patientInformation.personal.name}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column1}>
                  <Text style={[styles.percentages, { fontWeight: "bold" }]}>
                    Fase de amputación:
                  </Text>
                </View>

                <View style={styles.column2}>
                  <Text style={[styles.description, { fontWeight: "bold" }]}>
                    {patientInformation.medical.amputationPhase}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column1}>
                  <Text style={[styles.percentages, { fontWeight: "bold" }]}>
                    Fase de rehabilitación:
                  </Text>
                </View>

                <View style={styles.column2}>
                  <Text style={[styles.description, { fontWeight: "bold" }]}>
                    {patientInformation.control.trainingPhase}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column1}>
                  <Text style={[styles.percentages, { fontWeight: "bold" }]}>
                    Semana:
                  </Text>
                </View>

                <View style={styles.column2}>
                  <Text style={[styles.description, { fontWeight: "bold" }]}>
                    {parseInt(
                      patientInformation.control.activeWeek.replace("week", ""),
                      10
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column1}>
                  <Text style={[styles.percentages, { fontWeight: "bold" }]}>
                    Dia:
                  </Text>
                </View>

                <View style={styles.column2}>
                  <Text style={[styles.description, { fontWeight: "bold" }]}>
                    {patientInformation.control.activeDay}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.body}>{userBody()}</View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.warn("in")
                props.navigation.navigate("UpdateCompanionInfo", {props:props})
              }}
            >
              <Text style={{ color: "white" }}> Editar Perfil </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Usted no tiene a ningún paciente a cargo </Text>
        </View>
      );
    }
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.log(store.User.user);
  return {
    user: store.User.user,
    connection: store.User.connection,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(CompanionHome);

const styles = StyleSheet.create({
  header: {
    height: "25%",
    width: "100%",
    // backgroundColor: "pink",
    // backgroundColor: "blue",
  },
  body: {
    height: "65%",
    width: "100%",
  },
  container: {
    height: "100%",
    width: "100%",
  },

  footer: {
    height: "10%",
    width: "100%",
    // backgroundColor:"peru"
  },
  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: "5%",
  },

  row: { width: "100%", flexDirection: "row" },

  column1: {
    width: "50%",
    alignItems: "flex-start",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  column2: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },
  percentages: { fontWeight: "600" },
  description: { color: "#666666" },
  cardContainer: {
    // shadowColor: "#000",
    height: "90%",
    width: "90%",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,
    // elevation: 14,
    borderRadius: 10,
    justifyContent: "space-evenly",
    marginBottom: "5%",
    marginTop: "2%",
    marginLeft: "5%"
  },
});

const companionStyles = StyleSheet.create({
  containerIcon: {
    width: "25%",
    // backgroundColor:"gray",
     marginTop: "3%",
     height: "20%",
     alignItems: "center",
     justifyContent: "center",
   },
  groupContainerOrange: {
    width: "100%",
    height: "50%",
    marginTop: "2%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  //  borderBottomWidth: 1,
    backgroundColor: "rgba(225, 126, 62,0.5)",
  //  borderBottomColor: "rgba(21, 21, 34, 1)",
  },
  groupContainerBlue: {
    width: "100%",
    height: "50%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
   //borderBottomWidth: 1,
    backgroundColor: "rgba(105,121,248,0.3)",
 //   borderBottomColor: "rgba(21, 21, 34, 1)",
  },
  containerText: {
    width: "80%",
    // backgroundColor:"yellow",
    height: "40%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowContainer: {
    width: "10%",
    // backgroundColor:"salmon",
    height: "20%",
    justifyContent: "center",
  },

  tile1: {
    fontSize: vmin(4.5),
    fontWeight: "bold",
    marginBottom: vmin(1),
  },

  tile2: {
    fontSize: vmin(3),
    color: "background: rgba(153, 153, 153, 1)",
  },
});
