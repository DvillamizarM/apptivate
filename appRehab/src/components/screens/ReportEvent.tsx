import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import firebase from "../../../database/firebase";

import {
  View,
  Text,
  StyleSheet,
  Picker,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Slider } from "react-native-range-slider-expo";
var { vmin } = require("react-native-expo-viewport-units");

function ReportEvent(props) {
  //
  const [form, setForm] = React.useState({
    eventType: "",
    description: "",
    eventTime: "Seleccionar",
    degreeOfPain: "Seleccionar",
    creationTime: new Date().getTime(),
  });
  const [tokens, setTokens]: any = useState({});

  const getReceiverTokens = async () => {
    let temp: any = [];
    await firebase.db
      .collection("users")
      .where("personal.email", "in", [
        props.user.information.companionEmail,
        props.user.information.physioEmail,
      ])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          temp.push(doc.data().token);
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
      title: "Incidente Reportado " + props.user.information.personal.name,
      body:
        "Grado de dolor:" + form.degreeOfPain + " reporto " + form.description,
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

  const saveFormReportEvent = async () => {
    console.log(
      "el formulario quedo",
      form,
      "El id del usuario es :",
      props.user.uid
    );

    let idRecord = "";

    if (!props.connection) {
      Alert.alert("Por favor escriba un comentario");
    } else {
      let res = await firebase.db.collection("ReportedEvents").add({
        ...form,
        userId: props.user.uid,
        userName: props.user.information.personal.name,
        userPhone: props.user.information.personal.phone,
      });
      idRecord = res.id;
      console.log("El id es ", idRecord);
      props.navigation.navigate("Home");
      // await updateControl(idRecord);
    }
  };

  const updateControl = async (idRecord) => {
    // let trainingPhase = props.user.information.control.trainingPhase;
    // let activeWeek = props.user.information.control.activeWeek;
    // let activeDay = props.user.information.control.activeDay;
    // let old_record = props.user.information.control.record || [];
    // console.log(
    //   "Los antiguos cambios son trainingPhase",
    //   trainingPhase, " activeWeek ," ,
    //   activeWeek, "activeDay" ,
    //   activeDay,
    //   old_record
    // );
    // // Inicial","Intermedia","Avanzada"
    // let new_trainingPhase = "";
    // let new_activeWeek = "";
    // let new_activeDay = 0;
    // if (activeDay + 1 == 5) {
    //   new_activeDay = 0;
    //   new_activeWeek =
    //     "week" + (parseInt(activeWeek.replace("week", ""), 10)  -  (-1));
    //   if (activeWeek == "week11") {
    //     console.log("Finalizacion");
    //     new_trainingPhase = "Finalizada";
    //   } else if (parseInt(activeWeek.replace("week", ""), 10) <= 3) {
    //     new_trainingPhase = "Inicial";
    //   } else if (parseInt(activeWeek.replace("week", ""), 10) <= 7) {
    //     new_trainingPhase = "Intermedia";
    //   } else {
    //     new_trainingPhase = "Avanzada";
    //   }
    // } else {
    //   new_activeDay = activeDay + 1;
    //    new_trainingPhase = trainingPhase;
    //    new_activeWeek =activeWeek;
    // }
    // const aux = old_record.push(idRecord)
    // console.log(idRecord,"Los nuevos cambios son", {
    //   trainingPhase: new_trainingPhase,
    //   activeDay: new_activeDay,
    //   activeWeek: new_activeWeek,
    //   record: old_record,
    // });
    // await firebase.db
    //   .collection("users")
    //   .doc(props.user.uid)
    //   .update({
    //     control: {
    //       trainingPhase: new_trainingPhase,
    //       activeDay: new_activeDay,
    //       activeWeek: new_activeWeek,
    //       record: old_record,
    //     },
    //   })
    //   .then((e) => {
    //     props.navigation.navigate("ProfileScreen");
    //   });
  };

  useEffect(() => {
    getReceiverTokens();
  }, []);

  return (
    
      <View style={styles.container}>
        <ScrollView
      contentContainerStyle = {{ flexGrow: 1 , paddingBottom:80}}
      
    >
        <View style={styles.header}>
          <Text style={styles.textHeader}>
            Reportar alguna ocurrencia respecto a la rehabilitación
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          {/* input tipo de evento */}

          <View
            style={[
              styles.containerInput,
              { height: "20%", marginBottom: "6%" },
            ]}
          >
            <Text style={{fontWeight:"bold"}}>Tipo de Evento</Text>
            <TextInput
              style={[styles.repetitionInputContainer, { height: "80%" }]}
              multiline={true}
              placeholder="Ingrese una descripcion detallada de lo que paso. Incluya lo que estaba haciendo cuando ocurrió el evento."
              onChangeText={(value) => setForm({ ...form, eventType: value })}
              value={form.eventType}
            />
          </View>

          <View style={[styles.containerInput, { height: "20%" }]}>
            <Text style={{fontWeight:"bold"}}>Descripción</Text>
            <TextInput
              style={[styles.repetitionInputContainer, { height: "80%" }]}
              multiline={true}
              placeholder="Ingrese una descripcion detallada de lo que paso. Incluya lo que estaba haciendo cuando ocurrió el evento."
              onChangeText={(value) => setForm({ ...form, description: value })}
              value={form.description}
            />
          </View>
          <View style={styles.sliderInput}>
            <Text style={{}}>Tiempo de evento en días</Text>
            <View style={styles.sliderContainer}>
              <Slider
                min={1}
                max={100}
                step={1}
                valueOnChange={(value) => {
                  setForm({ ...form, eventTime: value.toString() })
                }}
                initialValue={parseInt(form.eventTime)}
                knobColor="#6979F8"
                valueLabelsBackgroundColor="rgba(65,65,65)"
                inRangeBarColor="rgba(65,65,65, 0.7)"
                outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
              />
            </View>
            </View>          

          <View style={styles.sliderInput}>
            <Text style={{}}>Grado de Dolor (Sí aplica)</Text>
            <View style={styles.sliderContainer}>
              <Slider
                min={1}
                max={10}
                step={1}
                valueOnChange={(value) => {
                  setForm({ ...form, degreeOfPain: value.toString() })
                }}
                initialValue={parseInt(form.degreeOfPain)}
                knobColor="#6979F8"
                valueLabelsBackgroundColor="rgba(65,65,65)"
                inRangeBarColor="rgba(65,65,65, 0.7)"
                outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
              />
            </View>
            </View>
          
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              saveFormReportEvent().then(() => {
                sendPushNotification(tokens.values[0]);
                sendPushNotification(tokens.values[1]);
              });
            }}
          >
            <Text style={{ color: "white" }}>Enviar Reporte</Text>
          </TouchableOpacity>
        </View>
      <View style={{ height: "20%" }}></View>
    </ScrollView>
      </View>
  );
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    connection: store.User.connection,
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  updateUserControl: (data) => dispatch(actionsUser.UPDATE_USER_CONTROL(data)),
});

export default connect(MapStateToProps, MapDispatchToProps)(ReportEvent);

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 1,
    marginLeft: "5%",
    marginRight: "5%",
  },
  textHeader: {
    fontSize: vmin(4),
    textAlign: "center",
  },


  container: {
    backgroundColor: "white",
    width: "100%",
    minHeight: "100%",
    height: "100%",
    flex:1,
  },
  
  sliderInput: {
    marginTop:"5%",
    height: "20%",
    justifyContent: "space-evenly",
    width: "90%",
  },

  sliderContainer: {
    height: vmin(16),
    width: "100%",
    marginLeft: "2%",
    marginTop: "8%",
    marginBottom: "8%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "salmon",
  },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "72%",

    justifyContent: "center",
    alignItems: "center",
  },
  containerPercentajes: {
    // backgroundColor: "peru",
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  containerInput: {
    height: "25%",
    width: "100%",
    // backgroundColor: "tomato",
    marginLeft: "15%",
    marginRight: "5%",
    marginBottom: "3%",
    justifyContent: "space-evenly",
  },

  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
  },

  containerButton: {
    height: "10%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  repetitionInputContainer: {
    height: "30%",
    width: "90%",
    borderColor: "rgba(25, 25, 25, 0.56)",
    borderBottomWidth: 1,
    borderRadius: 5,
  },

  timeInputContainer: {
    height: "50%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },

  groupPickerContainer: {
    height: vmin(23),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    // backgroundColor: "green",
  },
});
