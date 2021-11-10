import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Picker,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

const UpdataeCompanionData = (props) => {
  const [data, setdata] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(true);

  const saveCompanionData = async () => {
    await firebase.db
      .collection("users")
      .doc(props.user.uid)
      .update({
        companionEmail: data.email,
      })
      .then(() => {
        Alert.alert("Se actualizó el correo electrónico del acompañante.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    firebase.db
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((user_db: any) => {
        setdata({ email: user_db.data().companionEmail });
        setLoading(false);
      })
      .catch((e) => {
        console.log("El error es ", e);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  } else {
    return (
      <View
        style={[
          styles.containerMedicalData,
          { justifyContent: "space-evenly", alignItems:"center" },
        ]}
      >
        <View style={styles.containerTextHeader}>
          <Text style={styles.textHeader}>Vinculación del acompañante</Text>
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.headerInput}>Correo Electrónico de acompañante</Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => saveCompanionData()}
        >
          <Text style={{ color: "white" }}>
            Actualizar Correo del Acompañante
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.log("mapstate patient register-----", store.User.user);
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  setUserCompanion: (val) => dispatch(actionsUser.UPDATE_USER_COMPANION(val)),
});
export default connect(
  MapStateToProps,
  MapDispatchToProps
)(UpdataeCompanionData);

const styles = StyleSheet.create({
  screenContainer: { width: "100%", height: "100%", backgroundColor: "white" },

  containerSteps: {
    backgroundColor: "white",
    borderRadius: 10,
    height: "12%",
    justifyContent: "center",
  },
  containerCard: {
    height: "88%",
    width: "100%",
    // backgroundColor: "yellow",
  },

  containerMedicalData: {
    width: "100%",
    height: "100%",
    // backgroundColor: "orange",
  },

  rowText_button: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vmin(1),
  },

  containerInput: {
    height: vmin(14),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "40%",
    marginBottom: "10%",
    justifyContent: "space-evenly",
    // backgroundColor: "green",
  },
  input: {
    height: "60%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    marginTop:"2%"
  },
  containerList: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
  },

  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    width: "48%",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
    marginTop:"5%"
  },

  containerButton: {
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
    // backgroundColor: "red",
  },
  button: {
    backgroundColor: "#6979F8",
    width: "80%",
    height: vmin(10),
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(10),
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },

  groupPickerContainer: {
    height: vmin(16),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    // backgroundColor: "green",
  },

  listItemsContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: "5%",
    marginRight: "15%",
    width: "80%",
  },

  containerFlexRow: {
    width: "100%",
    height: vmin(8),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },

  containerTextHeader: {
    alignItems: "center",
    width: "100%",
    marginTop:"5%"
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: vmin(5),
    textAlign: "center",
  },
});
