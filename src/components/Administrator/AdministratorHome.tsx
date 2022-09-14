import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

import firebase from "../../../database/firebase";
var { vmin } = require("react-native-expo-viewport-units");

// iconos

import Settings from "react-native-vector-icons/Ionicons";
import ChargeScreen from "../Simple/ChargeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CompanionHome = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const roleValues = {
    "Usuario público": "",
    Paciente: "paciente",
    Fisioterapeuta: "physiotherapist",
    Administrador: "administrator",
    Acompañante: "companion",
  };

  const objectFlip = (obj) => {
    return Object.entries(obj).reduce((ret, entry: any) => {
      const [key, value] = entry;
      ret[value] = key;
      return ret;
    }, {});
  };

  const reversedRoleValues = objectFlip(roleValues);

  const getUsers = async () => {
    let collection;
    const collection1 = await firebase.db.collection("users").get();
    const collection2 = await firebase.db
      .collection("users")
      .where("personal.id", "==", filter)
      .get();
    filter == "" ? (collection = collection1) : (collection = collection2);

    let users: any = collection.docs.map((doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      };
    });

    setUsers(users);
    setFilter("");
    setLoading(false);
  };

  const logOut = async () => {
    // props.navigation.navigate("Login");
    // await firebase.auth.signOut();

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
            await firebase.auth.signOut().then(() => {
              AsyncStorage.getAllKeys()
                .then((keys) => AsyncStorage.multiRemove(keys))
                .then(() => props.navigation.navigate("Login"));
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderReport = (UserProps, props) => {
    const { personal } = UserProps;

    if (loading) {
      return (
        <View
          style={{
            backgroundColor: "#ffffff",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <ChargeScreen />
        </View>
      );
    }
    return (
      <TouchableOpacity
        key={UserProps.uid}
        style={reportStyles.container}
        onPress={() =>
          props.navigation.navigate("ManageUserData", {
            UserProps,
            getUsers,
          })
        }
      >
        <View style={reportStyles.table}>
          <View style={reportStyles.row}>
            <View style={reportStyles.column1}>
              <Text numberOfLines={1} style={reportStyles.text1}>
                Nombre:
              </Text>
            </View>
            <View style={reportStyles.column2}>
              <Text style={reportStyles.text2}>{personal.name}</Text>
            </View>
          </View>

          <View style={reportStyles.row}>
            <View style={reportStyles.column1}>
              <Text style={reportStyles.text1}>Cédula:</Text>
            </View>
            <View style={reportStyles.column2}>
              <Text style={reportStyles.text2}>{personal.id}</Text>
            </View>
          </View>

          <View style={reportStyles.row}>
            <View style={reportStyles.column1}>
              <Text style={reportStyles.text1}>Teléfono:</Text>
            </View>
            <View style={reportStyles.column2}>
              <Text style={reportStyles.text2}>{personal.phone}</Text>
            </View>
          </View>

          <View style={reportStyles.row}>
            <View style={reportStyles.column1}>
              <Text style={reportStyles.text1}>Rol:</Text>
            </View>
            <View style={reportStyles.column2}>
              <Text style={reportStyles.text2}>
                {reversedRoleValues[UserProps.role]}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <ChargeScreen />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontStyle: "italic", alignItems: "center" }}>
            Lista de todos los usuarios
          </Text>
          <View style={styles.containerInput}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setFilter(value);
              }}
              placeholder={"Filtrar por cédula de usuario"}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setLoading(true);
                getUsers().then(() => {
                  setLoading(false);
                });
              }}
            >
              <Text style={{ color: "white", fontSize: vmin(6) }}>➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.body}>
          {users.length !== 0 ? (
            users.map((user) => renderReport(user, props))
          ) : (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: vmin(8),
                  color: "rgba(153, 153, 153, 1)",
                  marginTop: "50%",
                }}
              >
                {filter !== ""
                  ? "No existe usuario registrado con la cédula digitada."
                  : "No hay usuarios registrados."}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              logOut();
            }}
          >
            <Text style={{ color: "white" }}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
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
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "10%",
    // backgroundColor: "orange",
    borderColor: "rgba(21, 21, 34, 1)",
    // borderBottomWidth: vmin(0.4),
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    width: "100%",
    height: "80%",
    // backgroundColor: "peru",
  },

  footer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    borderRadius: 10,

    marginRight: "5%",
  },

  filterButton: {
    backgroundColor: "#6979F8",
    width: "18%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%",
  },

  containerInput: {
    height: "50%",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "tomato",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "2%",
    marginTop: "2%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  input: {
    height: "100%",
    width: "90%",
    textAlign: "center",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 2,
    borderRadius: 5,
  },
  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },
});

const reportStyles = StyleSheet.create({
  table: {
    width: "90%",
    marginLeft: "5%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  column1: {
    width: "30%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  column2: {
    width: "70%",
    alignItems: "flex-start",
  },
  text1: {
    color: "#666666",
    textAlign: "left",
  },
  text2: {
    color: "black",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    // backgroundColor: "salmon",
  },
  container: {
    width: "90%",
    borderBottomWidth: 1,
    borderColor: "rgba(21, 21, 34, 1)",
    justifyContent: "space-evenly",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,
    // elevation: 14,
    margin: "5%",
    paddingBottom: 10,
    // backgroundColor: "#CDD2FD",
  },
});
