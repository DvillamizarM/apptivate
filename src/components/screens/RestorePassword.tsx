import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

export default function RestorePassword(props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => {
    firebase.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent!
        // ..
        setSent(true);
      })
      .catch((error) => {
        console.log(" El error de reestablecer contraseña es: ", error);
      });
  };

  if (!sent)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Reestablecer Contraseña</Text>
          <Text style={{fontSize:vmin(4.5)}}>
            Ingrese el correo electrónico asociado a la cuenta para recibir un
            codigo para reestablecer la contraseña.
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          <TextInput
            style={[styles.repetitionInputContainer]}
            onChangeText={(value) => {
              setEmail(value);
            }}
            value={email}
            placeholder={"test@ejemplo.com"}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                reset();
              }}
            >
              <Text style={{ color: "white" }}>Reestablecer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  // despues que se envio el correo cambia la interfaz

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Reestablecer Contraseña</Text>
        <Text style={{fontSize:vmin(6)}}>
          Se ha enviado un correo a {email} , revísalo para cambiar tu
          contraseña y volver a iniciar sesión
        </Text>
      </View>
      <View style={styles.configurationContainer}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            <Text style={{ color: "white" }}>Regresar a inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "40%",
    width: "80%",
    justifyContent: "center",
    //   alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  textHeader: {
    fontSize: vmin(6),
    fontWeight: "bold",
    textAlign: "left",
    margin: "2%",
  },

  container: { backgroundColor: "white", width: "100%", height: "100%" },

  containerInput: {
    height: "30%",
    width: "90%",
    // backgroundColor: "tomato",
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
    margin: vmin(3),
    width: "90%",
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "60%",

    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 1,
  },
  repetitionInputContainer: {
    height: "10%",
    width: "90%",
    borderColor: "rgba(228, 228, 228, 1)",
    borderWidth: 1,
    borderRadius: 5,
    margin: "5%",
  },

  textToNavigate: {
    color: "#8E9AFA",
  },
  footer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "30%",
    width: "100%",
  },
  containText: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
