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
import * as yup from "yup";
import Password from "../Simple/PasswordTextField";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import UpdateMedicalData from "../Functional/UpdateMedicalData";
import ChargeScreen from "../Simple/ChargeScreen";

function UpdatePersonalData(props) {
  const [data, setdata] = useState({
    email: "",
    password: "",
    name: "",
    id: "",
    genero:"",
    phone: "",
    newPassWord: "",
  });

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    firebase.db
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((user_db: any) => {
        setdata({ ...user_db.data().personal });
        setLoading(false);
        props.navigation.navigate("Home");
      })
      .catch((e) => {
        console.log("El error es ", e);
      });
  }, []);

  const reauthenticate = (currentPassword) => {
    var user: any = firebase.auth.currentUser;
    var cred = firebase.firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  const update = async () => {
    // primero se actualiza el correo
    await reauthenticate(data.password)
      .then(() => {
        var user: any = firebase.auth.currentUser;
        user
          .updateEmail(data.email)
          .then(() => {
            Alert.alert("Correo actualizado");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // Luego se actualiza la contraseña
    if(data.newPassWord !== ""){
       await reauthenticate(data.password)
      .then(() => {
        var user: any = firebase.auth.currentUser;
        user
          .updatePassword(data.newPassWord)
          .then(() => {
            Alert.alert("Contraseña Actualizada");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    }
   
    await firebase.db
      .collection("users")
      .doc(props.user.uid)
      .update({
        personal: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          genero: data.genero,
          id: data.id,
        },
      })
      .then((e) => {
        Alert.alert("Datos personales del usuario actualizados");

        let newUser: any = firebase.auth.currentUser;
        newUser["information"]["personal"] = {
          name: data.name,
          phone: data.phone,
          email: data.email,
          id: data.id,
        };
        props.setUser(newUser);
        props.props.navigation.navigate("Home");
      })
      .catch((e) => {
        console.log("El error es ", e);
      });
      setLoading(false);
  };

  if (loading) {
    return (<View style={{justifyContent:"center", marginTop:"5%"}}><ChargeScreen/></View>);
  } else {
    return (
      <View style={styles.container}>
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

          <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Género</Text>
            <TextInput
              onChangeText={(value) => {
                setdata({ ...data, genero: value });
              }}
              style={styles.input}
              value={data.genero}
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Antigua Contraseña</Text>
            <Password
              label={"Mínimo 8 caracteres"}
              onChange={(value) => {
                setdata({ ...data, password: value });
              }}
              height={40}
              width={"100%"}
              value={data.password}
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.headerInput}> Nueva Contraseña</Text>
            <Password
              label={"Mínimo 8 caracteres"}
              onChange={(value) => {
                setdata({ ...data, newPassWord: value });
              }}
              height={40}
              width={"100%"}
              value={data.newPassWord}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {

              schema
                .validate(data)
                .then(() => {
                  setLoading(true);
                  update();
                })
                .catch(function (err) {
                  console.log(err);
                });
            }}
          >
            <Text style={{ color: "white" }}>Actualizar datos Personales</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(UpdatePersonalData);

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