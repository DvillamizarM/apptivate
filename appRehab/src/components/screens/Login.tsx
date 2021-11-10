import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import Password from "../Simple/PasswordTextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {
    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        props.navigation.navigate("Home");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          Alert.alert("Correo Inválido");
        }
        Alert.alert("Usuario no encontrado.");
      });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={128}
      enableOnAndroid
    >
      <View style={[styles.container, { minHeight: "90%" }]}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Inicio de Sesión</Text>
          <Text>
            Por favor ingrese su correo y contraseña para acceder a la
            plataforma.
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          <TextInput
            style={[styles.repetitionInputContainer]}
            onChangeText={(value) => {
              setEmail(value);
            }}
            value={email}
            keyboardType={"email-address"}
            placeholder={"test@ejemplo.com"}
          />

          <Password
            style={{ width: "90%" }}
            label={"Contraseña"}
            onChange={(value) => {
              setPassword(value);
            }}
            width={"90%"}
            height={40}
            value={password}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              logIn();
            }}
          >
            <Text style={{ color: "white" }}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { marginTop: "0%", backgroundColor: "rgba(225, 126, 62,1)" },
            ]}
            onPress={() => {
              props.navigation.navigate("TermsAndConditions");
            }}
          >
            <Text style={{ color: "white" }}>Crear nuevo usuario</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <View style={styles.containText}>
              <Text> Olvidaste tu contraseña? </Text>
              <Text
                style={styles.textToNavigate}
                onPress={() => {
                  AsyncStorage.clear(),
                    props.navigation.navigate("RestorePassword");
                }}
              >
                Recuperar cuenta.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "20%",
    width: "80%",
    justifyContent: "center",
    //   alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  textHeader: {
    fontSize: vmin(8),
    fontWeight: "bold",
    textAlign: "left",
    margin: "2%",
  },

  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    flex: 1,
  },

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
    marginTop: "2%",
    width: "90%",
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "80%",

    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 1,
  },
  repetitionInputContainer: {
    height: "8%",
    width: "90%",
    borderColor: "rgba(228, 228, 228, 1)",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: "3%",
    margin: "5%",
  },

  textToNavigate: {
    color: "#8E9AFA",
  },
  footer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "30%",
  },
  containText: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
