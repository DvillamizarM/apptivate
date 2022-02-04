import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import Picker from "../Simple/Picker";
import Password from "../Simple/PasswordTextField";
import * as yup from "yup";
import ChargeScreen from "../Simple/ChargeScreen";

function UserRegister(props) {
  const [data, setdata] = useState({
    email: "",
    password: "",
    name: "",
    id: "",
    phone: "",
    gender: "",
  });

  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const [loading, setLoading] = React.useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Por favor ingrese un correo electrónico para registrarse.")
      .email("Por favor ingrese un correo válido"),
    password: yup
      .string()
      .required("Por favor ingrese una contraseña para registrarse.")
      .max(20, "La contraseña no puede contener más de ${max} letras")
      .min(6, "La contraseña no puede contener menos de ${min} letras"),
    name: yup
      .string()
      .required("Por favor ingrese un nombre para registrarse.")
      .max(30, "El nombre no puede contener más de ${max} letras")
      .min(8, "El nombre no puede contener menos de ${min} letras")
      .matches(/^[^0-9]+$/, "El nombre no puede contener números o símbolos"),
    id: yup
      .string()
      .required("Por favor ingrese una cédula para registrarse.")
      .matches(/^\d+$/, "La cédula no puede contener letras o símbolos")
      .max(15, "La cédula no puede contener más de ${max} letras")
      .min(8, "La cédula no puede contener menos de ${min} letras"),
    phone: yup
      .string()
      .required("Por favor ingrese un número telefónico para registrarse.")
      .matches(/^\d+$/, "El teléfono no puede contener letras o símbolos")
      .max(12, "El teléfono no puede contener mas de ${max} letras")
      .min(7, "El teléfono no puede contener menos de {min} letras"),
  });

  const reauthenticate = (currentPassword) => {
    var user: any = firebase.auth.currentUser;
    var cred = firebase.firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };
  const signIn = () => {
    firebase.auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(async (currentUser: any) => {
        // Despues de registrar se crea la referencia del usuario en la tabla Usuarios
        await firebase.db
          .collection("users")
          .doc(currentUser.user.uid)
          .set({
            personal: {
              name: data.name,
              phone: data.phone,
              email: data.email,
              id: data.id,
              genero: data.gender,
            },
            medical: {
              perceivedForce: "",
              size: "",
              weight: "",
              age: "",
              evolutionTime: "",
              amputationLevel: "",
              amputationPhase: "",
            },
            configuration: {
              repetitionAmount: 0,
              repetitionMax: 0,
              repetitionMin: 0,
              restTimeMin: 0,
              restTimeSec: 0,
            },
            control: {
              trainingPhase: "Inicial",
              activeWeek: "week1",
              activeDay: 0,
              record: [],
            },
            event: [],
            companionEmail: "",
            physioEmail: "",
            role: "",
            token: "",
          });
        console.log("acaboooooooo user register");

        await reauthenticate(data.password)
          .then(() => {
            props.navigation.navigate("Home");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setLoading(false);
          Alert.alert("Ya existe un usuario registrado con ese correo");
        }
        if (error.code === "auth/invalid-email") {
          setLoading(false);
          Alert.alert("Correo Inválido");
        }
        console.error(error);
      });
  };
  if (loading){
  return (<View style={{backgroundColor: "#ffffff", justifyContent:"center",height:"100%", width:"100%" }}><ChargeScreen/></View>);}
  else{return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>
          Por favor ingrese todos los datos para el registro.
        </Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setdata({ ...data, name: value });
            }}
            value={data.name}
            placeholder={"Ingrese Nombres y Apellidos"}
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Documento de Identidad</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setdata({ ...data, id: value });
            }}
            value={data.id}
            keyboardType={"number-pad"}
            placeholder={"Tarjeta de Identidad o Cédula"}
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Teléfono</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setdata({ ...data, phone: value });
            }}
            value={data.phone}
            keyboardType={"phone-pad"}
            placeholder={"Número telefónico celular"}
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setdata({ ...data, email: value });
            }}
            value={data.email}
            keyboardType={"email-address"}
            placeholder={"Dirección de correo electrónico"}
          />
        </View>

        {/* Genero */}

        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Sexo</Text>

          <View style={[styles.repetitionInputContainer, {borderWidth:0}]}>
          <Picker
                width={"100%"}
                height={40}
                placeholder={"Seleccionar"}
                setData={(itemValue, itemIndex) =>{console.warn("in set data---", itemValue )
                setdata({ ...data, gender: itemValue })}
                }
                initialValue={"Seleccionar"}
                list={["Seleccionar", "Femenino", "Masculino"]}
              />
          </View>
        </View>

        {/* Genero */}

        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Contraseña</Text>
          <Password
            label={"Mínimo 8 caracteres"}
            onChange={(value) => {
              setdata({ ...data, password: value });
              setPasswords({ ...passwords, password1: value });
            }}
            width={"100%"}
            height={40}
            value={data.password}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Confirmar Contraseña</Text>
          <Password
            label={"Mínimo 8 caracteres"}
            onChange={(value) => {
              setPasswords({ ...passwords, password2: value });
            }}
            height={40}
            width={"100%"}
            value={passwords.password2}
          />
         
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setLoading(true);
            if (passwords.password1 == passwords.password2) {
              schema
                .validate(data)
                .then(() => {
                  signIn();
                })
                .catch(function (err) {
                  setLoading(false);
                  Alert.alert(err.message);
                  console.warn(err);
                });
            } else {
              setLoading(false);
              Alert.alert("Las contraseñas no coinciden.");
            }
          }}
        >
          <Text style={{ color: "white" }}>Registrar y Acceder</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );}
}
export default UserRegister;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  textHeader: {
    fontSize: vmin(5),
  },

  container: { backgroundColor: "white", width: "100%", height: "100%" },

  containerInput: {
    height: vmin(25),
    width: "90%",
    // backgroundColor: "tomato",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "2%",
    justifyContent: "space-evenly",
  },

  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },

  input: {
    height: "60%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: vmin(12),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: "5%",
    marginTop: vmin(10),
    marginBottom: vmin(10),
  },

  scroll: {
    height: "90%",
    width: "100%",
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },
});
