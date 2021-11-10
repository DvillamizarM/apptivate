import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

import UpdateMedicalData from "../Functional/UpdateMedicalData";
import UpdatePersonalData from "../Functional/UpdatePersonalData";
import UpdataeCompanionData from "../Functional/UpdataeCompanionData";

export default function UpdatePatient(props) {
  const [navigationPosition, setnavigationPosition] = useState(0);
  const navigationTitles = ["Datos Personales", "Datos Médicos", "Correo de Acompañante"];

  const NavigationButton = () => {
    return (
      <View style={navigationButtonStyles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (navigationPosition - 1 >= 0) {
              setnavigationPosition(navigationPosition - 1);
            } else {
              setnavigationPosition(navigationTitles.length - 1);
            }
          }}
          style={navigationButtonStyles.sideButton}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <View style={navigationButtonStyles.navigationButtonText}>
          <Text style={navigationButtonStyles.whiteText}>
            {navigationTitles[navigationPosition]}
          </Text>
        </View>
        <TouchableOpacity
          style={navigationButtonStyles.sideButton}
          onPress={() => {
            if (navigationPosition + 1 < navigationTitles.length) {
              setnavigationPosition(navigationPosition + 1);
            } else {
              setnavigationPosition(0);
            }
          }}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "8%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderBottomColor: "rgba(214, 212, 210,1)",
          marginTop: "10%",
          borderBottomWidth: 1,
        }}
      >
        <View style={{ width: "14%" }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          >
            <Text
              style={{
                fontSize: vmin(7),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {"<"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            width: "50%",
            alignItems: "center",
            fontSize: vmin(5),
          }}
        >
          Editar Perfil
        </Text>
        <TouchableOpacity
          style={styles.button2}
          onPress={async () => {
          //  props.navigation.navigate("Login");
           // await firebase.auth.signOut();
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
          }}
        >
          <Text style={{ color: "white" }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>{NavigationButton()}</View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {navigationPosition == 0 ? (
          <UpdatePersonalData props={props} />
        ) : navigationPosition == 1 ? (
          <UpdateMedicalData props={props} />
        ) : (
          <UpdataeCompanionData props={props} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  container: { flex: 1, backgroundColor: "white", width: "100%", height: "100%" },
  button2: {
    backgroundColor: "rgba(199, 0, 57,1)",
    width: "30%",
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
  scroll: {
    height:"100%",
    width: "100%",
  },
scrollContent:{
  paddingBottom: 60,
},
});


const navigationButtonStyles = StyleSheet.create({
  containerNavigationButton: {
    width: "100%",
    flexDirection: "row",
    height: "80%",
    borderRadius: 10,
    backgroundColor: "rgba(105, 121, 248, 1)",
    justifyContent: "center",
    alignItems: "center",
  },

  sideButton: {
    height: "100%",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  navigationButtonText: {
    height: "70%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderLeftWidth: vmin(0.5),
    borderRightWidth: vmin(0.5),
  },

  whiteText: {
    color: "white",
  },
});
