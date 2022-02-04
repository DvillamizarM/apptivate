import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Picker from "../Simple/Picker";
var { vmin, vh } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ChargeScreen from "../Simple/ChargeScreen";

function ManageUserData(props) {
  const { UserProps, getUsers } = props.navigation.state.params;

  const [selectedValue, setSelectedValue] = useState({});
  const [physioList, setPhysioList] = useState({});
  const [loading, setLoading] = React.useState(true);
  const [tokens, setTokens] = useState({});

  //console.log("estado de role :", selectedValue.roleValue);
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

  const getPhysioList = async () => {
    // console.log("getting list of physio")
    let temp: any = [];
    temp.push("Seleccionar");
    await firebase.db
      .collection("users")
      .where("role", "==", "physiotherapist")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log("data---",doc.data().personal.email)
          temp.push(doc.data().personal.email);
          //console.log("insnapshot",temp)
        });
        setPhysioList({ ...physioList, values: temp });
        // console.log("in get list after setting",temp)
        return temp;
      })
      .catch((error) => {
        console.log("Error getting doments: ", error);
      });
  };

  const getReceiverTokens = async () => {
    console.warn(
      "user props",
      UserProps.personal.email,
      "    ",
      UserProps.companionEmail,
      "    ",
      UserProps.physioEmail
    );
    let temp: any = [];
    await firebase.db
      .collection("users")
      .where("personal.email", "in", [
        UserProps.companionEmail,
        UserProps.physioEmail,
        UserProps.personal.email,
      ])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("doc data----", doc.data().token);
          temp.push(doc.data().token);
          sendPushNotification(doc.data().token);
        });
        setTokens({ ...tokens, values: temp });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Apertura de Seguimiento " + UserProps.personal.name,
      body: "Se ha activado el seguimiento del paciente",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    //console.log("use effect")

    if (UserProps.role == "paciente") {
      setSelectedValue({
        ...UserProps,
        roleValue: reversedRoleValues[UserProps.role],
        physioValue: UserProps.physioEmail,
      });
      getPhysioList().then(function (result) {
        //getReceiverTokens();
        setLoading(false);
      });
    } else {
      setSelectedValue({
        ...UserProps,
        roleValue: reversedRoleValues[UserProps.role],
      });
      setLoading(false);
    }
    // if(selectedValue.roleValue != "Paciente") {
    //   setSelectedValue({
    //     ...UserProps,
    //     roleValue: reversedRoleValues[UserProps.role],
    //   });setLoading(false)
    //   //if(selectedValue.roleValue!="Paciente"){ console.log("in if not pacient"); setLoading(false)};
    // }
    // if (UserProps.role == "paciente"|| selectedValue.roleValue == "Paciente") {
    //   console.log("use effect of role paciente")
    //   let physio = ""
    //   UserProps.physioEmail == "" ? physio = "Seleccionar" : physio = UserProps.physioEmail
    //   setSelectedValue({
    //     ...UserProps,
    //     roleValue: reversedRoleValues[UserProps.role],
    //     physioValue: physio,
    //   });
    //   getPhysioList().then(function (result) {
    //     console.log("temp---", result)
    //     setLoading(false);
    //   });
    // }
  }, []);

  const updateConfig = async () => {
    console.log(
      "SE ACTUALIZARA EL ROL DEL USUARIO ",
      selectedValue.uid,
      selectedValue.roleValue,
      roleValues[selectedValue.roleValue]
    );
    if (selectedValue.roleValue == "Paciente") {
      await firebase.db.collection("users").doc(selectedValue.uid).update({
        role: roleValues[selectedValue.roleValue],
        physioEmail: selectedValue.physioValue,
      });
    } else {
      await firebase.db.collection("users").doc(selectedValue.uid).update({
        role: roleValues[selectedValue.roleValue],
      });
    }
  };

  const repetitionSelector = () => {
    return (
      <View style={styles.repetitionInputContainer}>
        <Picker
          width={"100%"}
          height={40}
          placeholder={"Seleccionar"}
          setData={(itemValue, itemIndex) => {
            console.warn("in set data---", itemValue);
            setSelectedValue({ ...selectedValue, roleValue: itemValue });
          }}
          initialValue={selectedValue.roleValue}
          list={[
            "Usuario público",
            "Paciente",
            "Fisioterapeuta",
            "Administrador",
            "Acompañante",
          ]}
        />
      </View>
    );
  };

  const physioSelector = () => {
    const temp = physioList.values;
    if (temp == undefined) {
      getPhysioList();
    } else {
      //console.log("sleector-----", physioList.values);
      return (
        <View style={styles.repetitionInputContainer}>
          <Picker
            width={"100%"}
            height={40}
            placeholder={"Seleccionar"}
            setData={(itemValue, itemIndex) => {
              console.warn("in set data---", itemValue);
              setSelectedValue({ ...selectedValue, physioValue: itemValue });
            }}
            initialValue={selectedValue.physioValue}
            list={temp}
          />
        </View>
      );
    }
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
        <View style={styles.configurationContainer}>
          <View style={{ height:"10%", marginTop: "4%" }}>
            <Text style= {{fontWeight: "bold"}}>Usuario: {UserProps.personal.name}</Text>
          </View>

          <View style={styles.containerInput}>
            <Text style={{}}>Rol </Text>
            {repetitionSelector()}
        <View style={styles.header2}>
          <Text> ALERTA : No cambiar los usuarios ACOMPAÑANTE o FISIOTERAPEUTA a PACIENTE. </Text>
        </View>
          </View>
          {selectedValue.roleValue == "Paciente" ? (
            <View style={styles.containerInput2}>
              <Text style={{}}>Fisioterapeuta Encargado </Text>
              {physioSelector()}
            </View>
          ) : (
            <View></View>
          )}
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setLoading(true);
              updateConfig().then(async function () {
                console.log("update config then");
                if (selectedValue.roleValue == "Paciente") {
                  const token = await getReceiverTokens();
                  //tokens.then(function () {
                  // console.log("reciever then", tokens);
                  // if (tokens.values !== undefined) {
                  //   console.log("get tokens if--", tokens.values);
                  //   tokens.values.forEach((element) => {
                  //     sendPushNotification(element);
                  //   });
                  // }
                  //});
                }
                getUsers();
                props.navigation.navigate("Home");
                setLoading(false);
              });
            }}
          >
            <Text style={{ color: "white" }}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    connection: store.User.connection,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(ManageUserData);

const styles = StyleSheet.create({
  header: {
    height: "25%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 1,
    marginLeft: "10%",
    marginRight: "10%",
  },
  textHeader: {
    fontSize: vmin(5),
  },
  header2: {
    height: "40%",
    width: "90%",
    padding: 15,
    justifyContent: "center",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",
    backgroundColor: "#fff300",
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "80%",
    alignItems: "center",

    // justifyContent: "center",
  },
  containerPercentajes: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "peru",
  },

  containerInput: {
    height: "30%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "10%",
    justifyContent: "space-evenly",
    // backgroundColor: "tomato",
  },

  containerInput2: {
    height: "20%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "10%",
    justifyContent: "flex-start",
    // backgroundColor: "tomato",
  },

  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    //  borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    width: "45%",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },

  containerButton: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
    // backgroundColor: "red",
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "80%",
    borderRadius: 10,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  repetitionInputContainer: {
    height: "30%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    //  borderWidth: 1,
    borderRadius: 5,
  },

  timeInputContainer: {
    height: "50%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
