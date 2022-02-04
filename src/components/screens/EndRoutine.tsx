import React, { useEffect, useState } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { actionsNotifications } from "../../redux/actions/actionsNotifications";
import firebase from "../../../database/firebase";
import Picker from "../Simple/Picker";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import * as Notifications from "expo-notifications";
import { Slider } from "react-native-range-slider-expo";
import { actionsDownload } from "../../redux/actions/actionsDownload";
import LightBulb from "react-native-vector-icons/FontAwesome";
import ChargeScreen from "../Simple/ChargeScreen";

function EndRoutine(props) {
  //
  const [selectedValue, setSelectedValue] = useState("80");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = React.useState({
    endRoutine: "Seleccionar",
    why: "",
    commentary: "",
    percivedEffort: props.user.information.medical.perceivedForce,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    let end = props.navigation.state.params.routineIsNotOver;
    end
      ? setForm({ ...form, endRoutine: "No" })
      : setForm({ ...form, endRoutine: "Si" });
  }, []);

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Rutina Finalizada!" + props.user.information.personal.name,
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

  // useEffect(()=>{
  //   setForm({ ...form, percivedEffort: props.user.information.medical.perceivedForce });
  // }, []);

  const sendCompletion = async () => {
    await firebase.db
      .collection("users")
      .where("personal.email", "in", [
        props.user.information.companionEmail,
        props.user.information.physioEmail,
      ])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          sendPushNotification(doc.data().token);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const saveFormEndRoutine = async () => {
    let idRecord = "";
    const force = form.percivedEffort;
    if (!props.connection) {
      props.saveEndRoutine(form);
      props.navigation.navigate("ProfileScreen");
      setLoading(false);
    } else {
      await firebase.db
        .collection("users")
        .doc(props.user.uid)
        .update({
          ["medical.perceivedForce"]: force,
        });
      let res = await firebase.db
        .collection("endRoutine")
        .add({
          ...form,
          day: props.user.information.control.activeDay,
          week: props.user.information.control.activeWeek,
          reportTime: new Date().getTime(),
          uid: props.user.uid,
        })
        .catch((error) => {
          props.saveEndRoutine(form);
          props.navigation.navigate("ProfileScreen");
        });
      idRecord = res.id;
      console.log("El id es ", idRecord);
      if (form.endRoutine === "Si") {
        console.warn("in eyes");
        await updateControl(idRecord);
      }
      props.navigation.navigate("ProfileScreen");
      setLoading(false);
    }
  };

  const cacheEndRoutine = () => {};

  const updateControl = async (idRecord) => {
    let trainingPhase = props.user.information.control.trainingPhase;
    let activeWeek = props.user.information.control.activeWeek;
    let activeDay = props.user.information.control.activeDay;

    let old_record = props.user.information.control.record || [];

    console.log(
      "Los antiguos cambios son trainingPhase",
      trainingPhase,
      " activeWeek ,",
      activeWeek,
      "activeDay",
      activeDay,
      old_record
    );
    // Inicial","Intermedia","Avanzada"

    let new_trainingPhase = "";
    let new_activeWeek = "";
    let new_activeDay = 0;

    if (form.endRoutine == "Si") {
      console.warn("entro a si");
      if (activeDay + 1 == 5) {
        new_activeDay = 0;
        new_activeWeek =
          "week" + (parseInt(activeWeek.replace("week", ""), 10) - -1);

        if (new_activeWeek == "week11") {
          const list = await sendCompletion();
          console.log("Finalizacion");
          new_trainingPhase = "Finalizada";
        } else if (parseInt(new_activeWeek.replace("week", ""), 10) <= 3) {
          new_trainingPhase = "Inicial";
        } else if (parseInt(new_activeWeek.replace("week", ""), 10) <= 7) {
          new_trainingPhase = "Intermedia";
        } else {
          new_trainingPhase = "Avanzada";
        }
      } else {
        new_activeDay = activeDay + 1;
        new_trainingPhase = trainingPhase;
        new_activeWeek = activeWeek;
      }

      const aux = old_record.push(idRecord);

      console.log(idRecord, "Los nuevos cambios son", {
        trainingPhase: new_trainingPhase,
        activeDay: new_activeDay,
        activeWeek: new_activeWeek,
        record: old_record,
      });

      await firebase.db
        .collection("users")
        .doc(props.user.uid)
        .update({
          control: {
            trainingPhase: new_trainingPhase,
            activeDay: new_activeDay,
            activeWeek: new_activeWeek,
            record: old_record,
          },
        })
        .then((e) => {
          props.updateUserControl({
            trainingPhase: new_trainingPhase,
            activeDay: new_activeDay,
            activeWeek: new_activeWeek,
            record: old_record,
          });
          console.warn("new active week---", new_activeWeek);
        });

      // Cuando se termina la semana 10 el contador aumneta y queda "week11" esto siginifica que acabo el protocolo
    }
  };

  const handleLocalNotification = async () => {
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } catch (error) {
      console.warn("handler error ---", error);
    }
  };
  const cancelLocalNotification = async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn("cancelationError---------", error);
    }
  };
  const scheduleActivityControl = async () => {
    let activityControlNotificationId;
    const date = new Date(Date.now()); //temp
    const trigger2 = new Date(Date.now() + 168 * 3600 * 1000 - 60 * 60 * 1000); //una semana después y una hora antes de fecha actual
    const trigger = new Date(Date.now() + 3 * 60 * 1000);
    if (props.activityControlNotificationId != "") {
      cancelLocalNotification(props.activityControlNotificationId);
    }
    handleLocalNotification();
    try {
      activityControlNotificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "ALERTA: Inactividad",
            body: "Esta recibiendo esta notificación porque lleva una semana de inactividad en la plataforma. Por favor ingrese a la app para continuar con su proceso de rehabilitación.",
            data: { data: "goes here" },
          },
          trigger: trigger2,
        });
      props.setActivityControlNotificationId(activityControlNotificationId);
    } catch (error) {
      console.warn("schedulerError-----", error);
    }
  };

  const askIfCompleted = () => {
    let routineIsNotOver = props.navigation.state.params.routineIsNotOver;
    console.warn("routine is not over---", routineIsNotOver);
    if (loading) {
      return (
        <View
          style={{
            backgroundColor: "#ffffff",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            marginTop: "5%",
          }}
        >
          <ChargeScreen />
        </View>
      );
    } else {
      return (
        <View style={styles.repetitionInputContainer}>
          <Picker
            width={"100%"}
            height={40}
            placeholder={"Seleccionar"}
            setData={(itemValue, itemIndex) => {
              console.warn("itenn====", itemValue);
              setForm({ ...form, endRoutine: itemValue });
            }}
            initialIndex={!routineIsNotOver ? 1 : 2}
            list={["Seleccionar", "Si", "No"]}
            disabled={routineIsNotOver}
          />
        </View>
      );
    }
  };

  const questionWhy = () => {
    return (
      <View style={styles.repetitionInputContainer}>
        <Picker
          width={"100%"}
          height={40}
          placeholder={"Seleccionar"}
          setData={(itemValue, itemIndex) =>
            setForm({ ...form, why: itemValue })
          }
          initialIndex={form.why}
          list={[
            "Seleccionar",
            "No entendí",
            "Estaba muy cansado",
            "Sentia dolor",
            "Estaba muy complicado",
            "No entiendo como usar la app",
            "No me alcanzó el tiempo",
            "Están muy avanzados",
            "Esto era una prueba",
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>
          Por favor registre el progreso que obtuve en la rutina.
        </Text>
      </View>
      <View style={styles.configurationContainer}>
        <View style={styles.containerInput}>
          <Text style={styles.titleText}>¿Finalizo la Rutina?</Text>

          {askIfCompleted()}
        </View>
        {form.endRoutine === "No" ? (
          <View style={styles.containerInput}>
            <Text style={styles.titleText}>
              ¿Por qué no terminó la rutina completa?
            </Text>
            {questionWhy()}
          </View>
        ) : (
          <View></View>
        )}

        <View style={styles.containerInput}>
          <TouchableOpacity
            style={{
              borderColor: "rgba(255, 231, 35,1)",
              paddingBottom: "1%",
              borderBottomWidth: vmin(0.8),
              marginBottom: "8%",
              marginTop: "5%",
              width: "55%",
              flexDirection: "row",
            }}
            onPress={() => {
              Alert.alert(
                "Esfuerzo Percibido",
                "Es una forma de clasificar la intensidad de las actividades físicas a través de las propias sensaciones que siente el individuo que realiza la actividad en cuestión. Para medir su esfuerzo percibido siéntese y levántese de una silla 10 veces y califique como se siente al finalizar. "
              );
            }}
          >
            <Text style={styles.titleText}>Esfuerzo Percibido</Text>
            <LightBulb
              name="lightbulb-o"
              size={vmin(6)}
              color="rgba(255, 231, 35,1)"
            />
          </TouchableOpacity>
          <View style={styles.sliderContainer}>
            <Slider
              min={1}
              max={5}
              step={1}
              valueOnChange={(value) => {
                let stirngVal = "Liviano";
                switch (value) {
                  case 1:
                    stirngVal = "Excesivamente Liviano";
                    break;
                  case 2:
                    stirngVal = "Liviano";
                    break;
                  case 3:
                    stirngVal = "Ni liviano ni pesado";
                    break;
                  case 4:
                    stirngVal = "Pesado";
                    break;
                  case 5:
                    stirngVal = "Excesivamente Pesado";
                    break;
                  default:
                    stirngVal = "Liviano";
                    break;
                }
                setForm({ ...form, percivedEffort: stirngVal });
              }}
              initialValue={
                form.percivedEffort == "Excesivamente Liviano"
                  ? 1
                  : form.percivedEffort == "Liviano"
                  ? 2
                  : form.percivedEffort == "Ni liviano ni pesado"
                  ? 3
                  : form.percivedEffort == "Pesado"
                  ? 4
                  : 5
              }
              knobColor="#6979F8"
              valueLabelsBackgroundColor="rgba(65,65,65)"
              inRangeBarColor="rgba(65,65,65, 0.7)"
              outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
            />
          </View>
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.titleText}>Comentario</Text>
          <TextInput
            multiline={true}
            style={[
              styles.repetitionInputContainer,
              {
                marginTop: "4%",
                height: "80%",
                borderWidth: 1,
                flexWrap: "wrap",
              },
            ]}
            onChangeText={(value) => setForm({ ...form, commentary: value })}
            value={form.commentary}
          />
        </View>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (form.endRoutine === "Si") {
              if (form.commentary !== "") {
                setLoading(true);
                saveFormEndRoutine();
                if (props.user.information.control.activeWeek !== "week11") {
                  scheduleActivityControl();
                }
              } else {
                Alert.alert("Por favor ingrese toda la información.");
              }
            }
            if (form.endRoutine === "No") {
              if (form.commentary !== "" && form.why !== "") {
                setLoading(true);
                saveFormEndRoutine();
                if (props.user.information.control.activeWeek !== "week11") {
                  scheduleActivityControl();
                }
              } else {
                Alert.alert("Por favor ingrese toda la información.");
              }
            }
          }}
        >
          <Text style={{ color: "white" }}>Registrar Finalización</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.log(store.User.user.information.medical.perceivedForce);
  return {
    activityControlNotificationId:
      store.NotificationReducer.activityControlNotificationId,
    connection: store.User.connection,
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  updateUserControl: (data) => dispatch(actionsUser.UPDATE_USER_CONTROL(data)),
  setUserMedical: (val) => dispatch(actionsUser.UPDATE_USER_MEDICAL(val)),
  saveEndRoutine: (val) => dispatch(actionsDownload.ADD_END_ROUTINE(val)),
  setActivityControlNotificationId: (val) =>
    dispatch(actionsNotifications.NOTIFICATION_ACTIVITY_CONTROL(val)),
});

export default connect(MapStateToProps, MapDispatchToProps)(EndRoutine);

const styles = StyleSheet.create({
  header: {
    height: "15%",
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
  titleText: {
    fontWeight: "bold",
    fontSize: vmin(4),
    marginRight: "4%",
  },

  container: { backgroundColor: "white", width: "100%", height: "100%" },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "70%",

    // justifyContent: "center",
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
    height: "20%",
    width: "90%",
    // backgroundColor: "tomato",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "8%",
    justifyContent: "space-evenly",
  },

  sliderContainer: {
    height: vmin(16),
    width: "100%",
    marginLeft: "2%",
    marginTop: vmin(2),
    marginBottom: "8%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "salmon",
  },
  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    width: "45%",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },

  containerButton: {
    height: "15%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "80%",
    borderRadius: 10,
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },

  repetitionInputContainer: {
    height: "35%",
    width: "100%",
    marginBottom: "5%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    // borderWidth: 1,
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
});
