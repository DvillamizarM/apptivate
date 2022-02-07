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
    genero: "",
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
    console.warn("prps", props.user);
    setdata(props.user.information.personal);
    setLoading(false);
    // firebase.db
    //   .collection("users")
    //   .doc(props.user.uid)
    //   .get()
    //   .then((user_db: any) => {
    //   })
    //   .catch((e) => {
    //     console.log("El error es ", e);
    //   });
  }, []);

  const reauthenticate = (currentPassword) => {
    var user: any = firebase.auth.currentUser;
    var cred = firebase.firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  const updateEmail = async () => {
    const user = props.user.information.personal;
    if (user.email !== data.email) {
      console.warn("in update email===", user);
      Alert.alert(
        "Actualizar Correo ",
        "¿Está seguro que quiere actualizar el correo?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: ()=>{
              setLoading(false);
            }
          },
          {
            text: "Aceptar",
            onPress: async () => {
              await reauthenticate(data.password)
                .then(() => {
                  var user: any = firebase.auth.currentUser;
                  user
                    .updateEmail(data.email)
                    .then(() => {
                      Alert.alert("Correo actualizado");
                      if (
                        props.user.information.personal.name !== data.name ||
                        props.user.information.personal.genero !==
                          data.genero ||
                        props.user.information.personal.email !== data.email ||
                        props.user.information.personal.phone !== data.phone ||
                        props.user.information.personal.id !== data.id
                      ) {
                        console.warn("else if");
                        updateFirestore();
                      }
                    })
                    .catch((error) => {
                      console.log(error.code);
                      Alert.alert("Error");
                      setLoading(false);
                    });
                })
                .catch((error) => {
                  console.log(error.code);
                  if (error.code == "auth/wrong-password")
                    Alert.alert("Contraseña incorrecta");
                  setLoading(false);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }

    // Luego se actualiza la contraseña
  };

  const updatePassword = async () => {
    if (data.newPassWord !== undefined && data.newPassWord !== "") {
      console.warn("new password info===?  ", data.newPassWord);
      Alert.alert(
        "Actualizar Contraseña ",
        "¿Está seguro que quiere actualizar la contraseña?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: ()=>{
              setLoading(false);
            }
          },
          {
            text: "Aceptar",
            onPress: async () => {
              await reauthenticate(data.password)
                .then(() => {
                  var user: any = firebase.auth.currentUser;
                  user
                    .updatePassword(data.newPassWord)
                    .then(() => {
                      Alert.alert("Contraseña Actualizada");
                      setLoading(false);
                    })
                    .catch((error) => {
                      console.log(error.code);
                      Alert.alert("Contraseña incorrecta");
                      setLoading(false);
                    });
                })
                .catch((error) => {
                  console.log(error.code);
                  if (error.code == "auth/wrong-password")
                    Alert.alert("Contraseña incorrecta");
                  setLoading(false);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const updateFirestore = async () => {
    console.warn("in firebase update ", props);

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

        let newUser: any = props.user;
        newUser["information"]["personal"] = {
          name: data.name,
          phone: data.phone,
          email: data.email,
          id: data.id,
          genero: data.genero,
        };
        props.setUser(newUser);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error.code);
        Alert.alert("Error");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={{ justifyContent: "center", marginTop: "5%" }}>
        <ChargeScreen />
      </View>
    );
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
              autoCapitalize="none"
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
          <View
            style={{
              borderBottomWidth: 2,
              width: "90%",
              marginLeft: "5%",
              marginRight: "5%",
              marginTop: "5%",
            }}
          ></View>
          <Text
            style={{
              width: "90%",
              margin: "5%",
              textAlign: "left",
              fontSize: vmin(3),
              fontWeight: "700",
              color: "#800000",
            }}
          >
            LLENAR EL CAMPO DE CONTRASEÑA UNICAMENTE SI QUIERE CAMBIAR EL CORREO
            O LA CONTRASEÑA ACTUAL
          </Text>
          <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Contraseña</Text>
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
          <View
            style={{
              borderBottomWidth: 2,
              width: "90%",
              marginLeft: "5%",
              marginRight: "5%",
            }}
          ></View>
          <Text
            style={{
              width: "90%",
              margin: "5%",
              textAlign: "left",
              fontSize: vmin(3),
              fontWeight: "700",
              color: "#800000",
            }}
          >
            LLENAR EL CAMPO DE CONTRASEÑA NUEVA UNICAMENTE SI QUIERE CAMBIAR LA
            CONTRASEÑA ACTUAL
          </Text>
          <View style={styles.containerInput}>
            <Text style={styles.headerInput}>Contraseña Nueva</Text>
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
              console.warn("pressed", data.newPassWord);
              if (
                (data.newPassWord !== undefined &&
                  data.password !== undefined) ||
                (data.email !== props.user.information.personal.email &&
                  data.password !== undefined)
              ) {
                console.warn("if");
                schema
                  .validate(data)
                  .then(() => {
                    console.warn("yup valid");
                    setLoading(true);
                    if (
                      data.newPassWord &&
                      data.email !== props.user.information.personal.email
                    ) {
                       setLoading(false);
                      setdata({
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        id: data.id,
                        genero: data.genero,
                        password: undefined,
                        newPassWord: undefined,
                      });
                      Alert.alert(
                        "No se puede modifcar correo y contraseña al mismo tiempo."
                      );
                    } else if (
                      data.newPassWord !== undefined &&
                      data.newPassWord !== ""
                    ) {
                      updatePassword();
                    } else if (
                      data.email !== props.user.information.personal.email
                    )
                      updateEmail();
                  })
                  .catch(function (err) {
                    Alert.alert(err);
                  });
              } else if (
                data.email !== props.user.information.personal.email &&
                data.password === undefined
              ) {
                Alert.alert(
                  "Para actaulizar el correo debe digitar la contraseña actual en el campo de Contraseña."
                );
              } else if (
                data.newPassWord !== undefined &&
                data.password === undefined
              ) {
                Alert.alert(
                  "Para actaulizar el correo debe digitar la contraseña actual en el campo de Contraseña."
                );
              } else if (
                props.user.information.personal.name !== data.name ||
                props.user.information.personal.genero !== data.genero ||
                props.user.information.personal.phone !== data.phone ||
                props.user.information.personal.id !== data.id
              ) {
                console.warn("else if");
                setLoading(true);
                updateFirestore();
              }
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
