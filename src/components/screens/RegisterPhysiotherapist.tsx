import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import * as yup from "yup";
import Password from "../Simple/PasswordTextField";
import ChargeScreen from "../Simple/ChargeScreen";
import Picker from "../Simple/Picker";

export default function RegisterPhysiotherapist(props) {
  const [data, setdata] = useState({
    email: "",
    password: "",
    name: "",
    genero:"",
    id: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("El campo es obligatorio")
      .email("Por favor ingrese un correo válido"),
    password: yup
      .string()
      .required("El campo es obligatorio")
      .max(20, "No puede contener mas de ${max} letras")
      .min(6, "No puede contener menos de ${min} letras"),
    name: yup
      .string()
      .required("El campo es obligatorio")
      .max(30, "No puede contener mas de ${max} letras")
      .min(8, "No puede contener menos de ${min} letras")
      .matches(/^[^0-9]+$/, "No puede contener números o símbolos"),
    id: yup
      .string()
      .required("El campo es obligatorio")
      .matches(/^\d+$/, "No puede contener letras o símbolos")
      .max(15, "No puede contener mas de ${max} letras")
      .min(8, "No puede contener menos de ${min} letras"),
    phone: yup
      .string()
      .required("El campo es obligatorio")
      .matches(/^\d+$/, "No puede contener letras o símbolos")
      .max(12, "No puede contener mas de ${max} letras")
      .min(7, "No puede contener menos de {min} letras"),
  });

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
              genero:data.genero,
              email: data.email,
              id: data.id,
            },
            token: "",
            role: "",
          });
        props.navigation.navigate("Home");
        setLoading(false);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Correo ya está en uso");
        }
        if (error.code === "auth/invalid-email") {
          Alert.alert("Correo inválido!");
        }
        console.error(error);
        setLoading(false);
      });
  };

  if (loading) {
    return (<View style={{backgroundColor: "#ffffff", justifyContent:"center",height:"100%", width:"100%" , marginTop:"5%"}}><ChargeScreen/></View>);
  }else{
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>
          Por favor ingrese todos los datos para el registro.
        </Text>
      </View>
      <ScrollView style={styles.scroll}>
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

        <View>
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
          <Text style={styles.headerInput}>Sexo</Text>

          <View style={[styles.repetitionInputContainer, {borderWidth:0}]}>
          <Picker
                width={"100%"}
                height={40}
                placeholder={"Seleccionar"}
                setData={(itemValue, itemIndex) =>{
                setdata({ ...data, genero: itemValue.toString() })}
                }
                initialValue={"Seleccionar"}
                list={["Seleccionar", "Femenino", "Masculino"]}
              />
          </View>
        </View>

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

          {/* <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setdata({ ...data, password: value });
                setPasswords({ ...passwords, password1: value });
              }}
              value={data.password}
              placeholder={"Mínimo 8 caracteres"}
              secureTextEntry
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setPasswords({ ...passwords, password2: value });
              }}
              value={passwords.password2}
              placeholder={"Mínimo 8 caracteres"}
              secureTextEntry
            />
          </View> */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {

              if(passwords.password1 == passwords.password2){
                schema
                .validate(data)
                .then(() => {
                  setLoading(true);
                  signIn();
                })
                .catch(function (err) {
                  Alert.alert(err);
                  console.log(err);
                });
              }else{
                console.log("las contrasemas no coinciden.")
                Alert.alert("Las contraseñas no coinciden.")
              }
            }}
          >
            <Text style={{ color: "white" }}>Registrar y Acceder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  ); 
  }
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
