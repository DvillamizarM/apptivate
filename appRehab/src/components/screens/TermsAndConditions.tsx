import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Picker,
  ActivityIndicator,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import ScalableText from 'react-native-text';

const confirmation = (props) => {
  Alert.alert(
    "Confirmar",
    "Si no aceptas terminos y condiciones no vas a poder acceder a la App. ",
    [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      { text: "No acepto", onPress: () => props.navigation.navigate("Login") },
    ],
    { cancelable: false }
  );
};

const navigation = (props) => {
  Alert.alert(
    "Tipo de Usuario",
    "Por favor indique el tipo de usuario. ",
    [
      {
        text: "Fisioterapeuta",
        onPress: () => props.navigation.navigate("RegisterPhysiotherapist"),
      },
      {
        text: "Acompañante",
        onPress: () => props.navigation.navigate("RegisterCompanion"),
      },
      {
        text: "Paciente",
        onPress: () => props.navigation.navigate("UserRegister"),
      },
    ],
    { cancelable: false }
  );
};

export default function TermsAndConditions(props) {
  return (
    <View style={styles.container}>
      <View style={styles.configurationContainer}>
        <View
          style={{
            width: "90%",
            height: "100%",
            justifyContent: "center",
            marginBottom: vmin(5),
          }}
        >
<ScrollView>
          <ScalableText 
            style={{
              color: "#999999",
              textAlign: "justify",
              fontSize: vmin(4.8),
            }}
          >
            El objetivo de esta aplicación es apoyar la rehabilitación
            fisioterapéutica a través de la implementación de un programa de
            entrenamiento con el fin de lograr la reincorporación del usuario en
            el rol familiar, social y laboral, para lo cual se requiere una
            actitud más activa y responsable sobre su salud. La participación es
            completamente voluntaria y la información suministrada será
            confidencial. Sin embargo, aún después de dar su aceptación para
            utilizarla, usted podrá desinstalarla en el momento que desee.
          </ScalableText>
          <ScalableText 
            style={{
              color: "#000000",
              backgroundColor: "#fff300",
              textAlign: "justify",
              fontSize: vmin(5.0),
            }}
          >
            Al momento de realizar los ejercicios debe contar con un acompañante 
            para evitar el riesgo de caída, el cual aumenta de acuerdo a su 
            condición de salud y edad.
          </ScalableText>
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            //props.navigation.navigate("UserRegister");
            //props.navigation.navigate("RegisterCompanion")
            //props.navigation.navigate("RegisterPhysiotherapist")
            navigation(props);
          }}
        >
          <Text style={{ color: "white" }}>Estoy de acuerdo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            confirmation(props);
          }}
        >
          <Text style={{ color: "black" }}>No estoy de acuerdo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "10%",
    marginRight: "10%",
  },
  textHeader: {
    fontSize: vmin(5),
    fontWeight: "bold",
    textAlign: "center",
  },
  container: { backgroundColor: "white", width: "100%", height: "100%" },
  containerInput: {
    height: "30%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "10%",
    justifyContent: "space-evenly",
  },

  textInput: {
    width: "100%",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  button2: {
    backgroundColor: "white",
    width: "90%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "rgba(205, 210, 253, 1)",
  },
  configurationContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    borderBottomColor: "#646464",
    borderBottomWidth: 1,

    marginTop: vmin(5),
    paddingBottom: vmin(3),
  },
  footer: {
    width: "100%",
    height: "16%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
