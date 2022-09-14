import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import RadioButton from "expo-radio-button";
import Picker from "../Simple/Picker";
import StepIndicator from "react-native-step-indicator";

import Add from "react-native-vector-icons/Ionicons";

import Arrow from "react-native-vector-icons/MaterialIcons";

import Check from "react-native-vector-icons/EvilIcons";
import { Slider } from "react-native-range-slider-expo";
import LightBulb from "react-native-vector-icons/FontAwesome";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import * as MailComposer from "expo-mail-composer";
import yup from "yup";

const steps = (currentPosition, setCurrentPosition) => {
  const labels = [
    "Datos Médicos",
    //  "Datos de la condición",
    "Registro de acompañante",
    "Confirmar",
  ];
  const customStyles = {
    stepIndicatorSize: vmin(6),
    currentStepIndicatorSize: vmin(7),
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "rgba(105,121,248,1)", //borde seleccionado
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "rgba(64,64,64,1)",
    stepStrokeUnFinishedColor: "#CDD2FD", // morado
    separatorFinishedColor: "rgba(64,64,64,1)",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "rgba(64,64,64,1)",
    stepIndicatorUnFinishedColor: "#CDD2FD", //Gris
    stepIndicatorCurrentColor: "rgba(105,121,248,1)", //morado
    stepIndicatorLabelFontSize: vmin(3),
    currentStepIndicatorLabelFontSize: vmin(3),
    stepIndicatorLabelCurrentColor: "white", // label dentro de la bolita
    stepIndicatorLabelFinishedColor: "#CDD2FD", //Gris
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: vmin(3),
    currentStepLabelColor: "black", // color de la label de abajo
  };

  const handleChangePosition = (nextPosition) => {
    if (nextPosition < currentPosition) {
      setCurrentPosition(nextPosition);
    } else {
      Alert.alert("No puedes avanzar hasta esa posición");
    }
  };

  return (
    <View style={styles.containerSteps}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={3}
        onPress={(position) => handleChangePosition(position)}
      />
    </View>
  );
};

const MedicalData = ({ props, setCurrentPosition, currentPositionValue }) => {
  const [data, setData] = useState({
    perceivedForce: "0",
    size: "0",
    weight: "0",
    age: "0",
    evolutionTime: "0",
    amputationLevel: "Seleccionar",
    amputationPhase: "Seleccionar",
    corporalMass: 0,
    trainingPhase: "Seleccionar",
  });
  const [value, setValue] = useState(0);
  const [perceivedVal, setPerceivedVal] = useState(0);
  const [current, setCurrent] = useState("");
  const [current1, setCurrent1] = useState("");

  const checkData = () => {
    if (props.user.information.medical.amputationLevel != "") {
      let medical = props.user.information.medical;
      setData({
        ...data,
        perceivedForce: medical.perceivedForce,
        size: medical.size,
        weight: medical.weight,
        age: medical.age,
        evolutionTime: medical.evolutionTime,
        amputationLevel: medical.amputationLevel,
        amputationPhase: medical.amputationPhase,
        trainingPhase: props.user.information.control.trainingPhase,
        corporalMass: parseInt(medical.weight) / parseInt(medical.size),
      });

      setCurrent(medical.amputationLevel);
      setCurrent1(medical.amputationPhase);
    }
  };

  useEffect(() => {
    checkData();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const saveMedicalData = async () => {
    await firebase.db
      .collection("users")
      .doc(props.user.uid)
      .update({
        medical: {
          perceivedForce: data.perceivedForce,
          size: data.size,
          weight: data.weight,
          age: data.age,
          evolutionTime: data.evolutionTime,
          amputationLevel: data.amputationLevel,
          amputationPhase: data.amputationPhase,
          corporalMass:
            (parseInt(data.weight) / Math.pow(parseInt(data.size), 2)) * 100,
        },
        // "Inicial","Intermedia","Avanzada"
        control: {
          trainingPhase: data.trainingPhase,
          activeWeek:
            data.trainingPhase == "Inicial"
              ? "week1"
              : data.trainingPhase == "Intermedio"
              ? "week4"
              : "week7",
          activeDay: 0,
          record: [],
        },
      })
      .then((e) => {
        setCurrentPosition(1);
        props.setUserMedical({
          medical: {
            perceivedForce: data.perceivedForce,
            size: data.size,
            weight: data.weight,
            age: data.age,
            evolutionTime: data.evolutionTime,
            amputationLevel: data.amputationLevel,
            amputationPhase: data.amputationPhase,
            corporalMass: parseInt(data.weight) / parseInt(data.size),
          },
          control: {
            trainingPhase: data.trainingPhase,
            activeWeek:
              data.trainingPhase == "Inicial"
                ? "week1"
                : data.trainingPhase == "Intermedio"
                ? "week4"
                : "week7",
            activeDay: 0,
            record: [],
          },
        });
      });
  };

  let intArray: any[] = ["Seleccionar"];
  for (let i = 0; i <= 100; i++) {
    intArray.push(i);
  }

  let arraySize: any[] = ["Seleccionar"];
  for (let index = 130; index < 250; index++) {
    arraySize.push(index);
  }

  let arrayWeight: any[] = ["Seleccionar"];
  for (let index = 20; index < 300; index++) {
    arrayWeight.push(index);
  }

  let arrayAge: any[] = ["Seleccionar"];
  for (let index = 14; index < 100; index++) {
    arrayAge.push(index);
  }

  //if (currentPositionValue == 0) {
  return (
    <View style={styles.containerMedicalData}>
      <View style={styles.containerTextHeader}>
        <Text style={styles.textHeader}>Datos Médicos</Text>
      </View>

      <View style={[styles.containerInput, { marginTop: "4%" }]}>
        <View style={styles.sliderTitle}>
          <Text style={{}}>Estatura (CM)</Text>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {data.size}</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            min={120}
            max={250}
            step={1}
            valueOnChange={(value) => {
              setValue(value);
              setData({ ...data, size: value + "" });
            }}
            initialValue={parseInt(data.size)}
            knobColor="#6979F8"
            valueLabelsBackgroundColor="rgba(65,65,65)"
            inRangeBarColor="rgba(65,65,65, 0.7)"
            outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
          />
        </View>
      </View>

      <View style={styles.containerInput}>
        <View style={styles.sliderTitle}>
          <Text style={{}}>Peso (KG)</Text>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {data.weight}</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            min={20}
            max={300}
            step={1}
            valueOnChange={(value) => {
              setValue(value);
              setData({ ...data, weight: value + "" });
            }}
            initialValue={parseInt(data.weight)}
            knobColor="#6979F8"
            valueLabelsBackgroundColor="rgba(65,65,65)"
            inRangeBarColor="rgba(65,65,65, 0.7)"
            outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
          />
        </View>
      </View>

      <View style={styles.containerInput}>
        <View style={styles.sliderTitle}>
          <Text style={{}}>Edad</Text>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {data.age}</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            min={10}
            max={100}
            step={1}
            valueOnChange={(value) => {
              setValue(value);
              setData({ ...data, age: value + "" });
            }}
            initialValue={parseInt(data.age)}
            knobColor="#6979F8"
            valueLabelsBackgroundColor="rgba(65,65,65)"
            inRangeBarColor="rgba(65,65,65, 0.7)"
            outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
          />
        </View>
      </View>

      <View style={styles.containerInput}>
        <View style={styles.sliderTitle}>
          <Text style={{}}>Tiempo con la lesión (Meses)</Text>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {data.evolutionTime}</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            min={1}
            max={100}
            step={1}
            valueOnChange={(value) => {
              setValue(value);
              setData({ ...data, evolutionTime: value + "" });
            }}
            initialValue={parseInt(data.evolutionTime)}
            knobColor="#6979F8"
            valueLabelsBackgroundColor="rgba(65,65,65)"
            inRangeBarColor="rgba(65,65,65, 0.7)"
            outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
          />
        </View>
      </View>

      <View style={styles.containerInput}>
        <View style={[styles.sliderTitle, { marginBottom: "5%" }]}>
          <TouchableOpacity
            style={{
              borderColor: "rgba(255, 231, 35,1)",
              paddingBottom: "1%",
              borderBottomWidth: vmin(0.8),
              height: "100%",
              marginBottom: "4%",
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
            <Text style={{}}>Esfuerzo Percibido</Text>

            <LightBulb
              name="lightbulb-o"
              size={vmin(6)}
              color="rgba(255, 231, 35,1)"
            />
            {/* <FontAwesomeIcon icon="fa-solid fa-lightbulb" /> */}
          </TouchableOpacity>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {perceivedVal}</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            min={1}
            max={5}
            step={1}
            valueOnChange={(value) => {
              setPerceivedVal(value);
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
              setValue(value);
              setData({ ...data, perceivedForce: stirngVal });
            }}
            initialValue={
              data.perceivedForce == "Excesivamente Liviano"
                ? 1
                : data.perceivedForce == "Liviano"
                ? 2
                : data.perceivedForce == "Ni liviano ni pesado"
                ? 3
                : data.perceivedForce == "Pesado"
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

      <View
        style={[
          styles.containerInput,
          { height: "18%", marginBottom: "5%", alignItems: "flex-start" },
        ]}
      >
        <Text
          style={{ marginLeft: "5%", fontSize: vmin(4), fontWeight: "bold" }}
        >
          Nivel de Amputación
        </Text>
        <View style={styles.radioOptions}>
          <View style={{ width: "30%" }}>
            <Image
              source={require("../../assets/images/transfemoral.png")}
              style={styles.imageContainer}
            />
            <RadioButton
              value="Transfemoral"
              containerStyle={{ flexDirection: "column-reverse" }}
              selected={current}
              onSelected={(value) => {
                setCurrent(value), setData({ ...data, amputationLevel: value });
              }}
              radioBackground="#6979F8"
            >
              <Text style={{ textAlign: "center" }}>
                {"\n"}Transfemoral{"\n"}
              </Text>
            </RadioButton>
          </View>
          <View style={{ width: "30%", flexDirection: "column" }}>
            <Image
              source={require("../../assets/images/desarticulacion.png")}
              style={styles.imageContainer}
            />
            <RadioButton
              value="Desarticulación de rodilla"
              containerStyle={{ flexDirection: "column-reverse" }}
              selected={current}
              onSelected={(value) => {
                setCurrent(value), setData({ ...data, amputationLevel: value });
              }}
              radioBackground="#6979F8"
            >
              <Text style={{ flexWrap: "wrap", textAlign: "center" }}>
                Desarticulación de rodilla
              </Text>
            </RadioButton>
          </View>
          <View style={{ width: "30%", flexDirection: "column" }}>
            <Image
              source={require("../../assets/images/transtibial.png")}
              style={styles.imageContainer}
            />
            <RadioButton
              value="Transtibial"
              containerStyle={{ flexDirection: "column-reverse" }}
              selected={current}
              onSelected={(value) => {
                setCurrent(value), setData({ ...data, amputationLevel: value });
              }}
              radioBackground="#6979F8"
            >
              <Text style={{ textAlign: "center" }}>
                {"\n"}Transtibial {"\n"}
              </Text>
            </RadioButton>
          </View>
        </View>
      </View>
      <View
        style={[styles.containerInput, { height: "13%", marginBottom: "5%" }]}
      >
        <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
          Fase de rehabilitación
        </Text>
        <View style={styles.radioOptions}>
          <View style={{ width: "30%" }}>
            <Image
              source={require("../../assets/images/desarticulacion.png")}
              style={styles.imageContainer}
            />
            <RadioButton
              value="Preprotésico"
              containerStyle={{ flexDirection: "column-reverse" }}
              selected={current1}
              onSelected={(value) => {
                setCurrent1(value),
                  setData({ ...data, amputationPhase: value });
              }}
              radioBackground="#6979F8"
            >
              <Text style={{ textAlign: "center" }}>Preprotésico</Text>
            </RadioButton>
          </View>
          <View style={{ width: "30%", flexDirection: "column" }}>
            <Image
              source={require("../../assets/images/protesis.png")}
              style={styles.imageContainer}
            />
            <RadioButton
              value="Protésico"
              containerStyle={{ flexDirection: "column-reverse" }}
              selected={current1}
              onSelected={(value) => {
                setCurrent1(value),
                  setData({ ...data, amputationPhase: value });
              }}
              radioBackground="#6979F8"
            >
              <Text style={{ flexWrap: "wrap", textAlign: "center" }}>
                Protésico
              </Text>
            </RadioButton>
          </View>
        </View>
      </View>


      <View
        style={[
          styles.containerInput,
          { height: "8%", alignItems: "flex-start" },
        ]}
      >
        <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
          Etapa de Rehabilitación
        </Text>

        <View style={[styles.repetitionInputContainer, {borderWidth:0}]}>
          <Picker
            width={"100%"}
            height={40}
            placeholder={"Seleccionar"}
            setData={(itemValue, itemIndex) =>
              setData({ ...data, trainingPhase: itemValue })
            }
            initialIndex={data.trainingPhase}
            list={["Seleccionar", "Inicial", "Intermedia", "Avanzada"]}
          />
        </View>
      </View>
      <View style={{ height: "12%", width: "100%", marginBottom: "70%" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            saveMedicalData();
          }}
        >
          <Text style={{ color: "white" }}>
            Continuar con el registro del acompañante
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SaveCompanion = ({ props, setCurrentPosition }) => {
  const [data, setdata] = useState({
    email: "",
  });
  const checkData = () => {
    if (props.user.information.companionEmail != "") {
      let info = props.user.information;
      setdata({ ...data, email: info.companionEmail });
    }
  };
  useEffect(() => {
    checkData();
  }, []);

  const sendMail = async () => {
    MailComposer.composeAsync({
      subject: "Invitación de Acompañante a la app móvil Apptivate",
      recipients: [data.email],
      body: "¡Cordial Saludo! Un usuario de la aplicación móvil indicó que usted es el acompañante en el plan de entrenamiento. Por ende está recibiendo este correo con un link para instalar la app. Siga las instrucciones en el link para poder instalar la app y después regístrese como Acompañante con el correo electrónico al que le llego este mensaje. Muchas gracias. exp://exp.host/@danivillamizar/apptivate",
    });
  };

  const saveCompanionData = async () => {
    // verifica que otro usuario no tenga esta acompanante
    const users = await firebase.db
      .collection("users")
      .where("role", "==", "paciente")
      .where("companionEmail", "==", data.email)
      .get();
    //  if (users?.docs?.length == 0) {
    await firebase.db
      .collection("users")
      .doc(props.user.uid)
      .update({
        companionEmail: data.email,
      })
      .then(() => {
        setCurrentPosition(2);
        props.setUserCompanion(data.email);
        sendMail();
      })
      .catch((error) => {
        console.error(error);
      });
   
  };
  return (
    <View
      style={[styles.containerMedicalData, { justifyContent: "space-evenly" }]}
    >
      <View style={styles.containerTextHeader2}>
        <Text style={styles.textHeader}>Vincular acompañante</Text>
      </View>
      <View style={[styles.containerInput, { height: "35%" }]}>
        <Text style={styles.headerInput}>
          Correo Electrónico del Acompañante
        </Text>
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
        onPress={() => {
          if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
          ) {
            saveCompanionData();
          } else {
            Alert.alert("Por favor ingrese un correo válido");
          }
        }}
      >
        <Text style={{ color: "white" }}>Enviar Invitación al Acompañante</Text>
      </TouchableOpacity>
    </View>
  );
};

const Confirm = ({ props }) => {
  const finalizeForm = () => {
    props.updateShowTour1(true);
    props.updateShowTour2(true);
    props.updateShowTour3(true);
    props.updateShowTour4(true);
    props.updateShowTour5(true);
    props.navigation.navigate("Home");
    //props.navigation.navigate("GeneralInformation", { update: true });
    props.updateStatus("updated" + new Date().getTime());
  };

  return (
    <View
      style={[
        styles.containerMedicalData,
        {
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "90%",
          marginLeft: "5%",
          marginRight: "5%",
        },
      ]}
    >
      <Check name="check" size={vmin(70)} color="rgba(105, 121, 248, 1)" />
      <Text style={{ fontSize: vmin(7), fontWeight: "bold" }}>
        Felicitaciones!
      </Text>
      <Text
        style={{
          fontSize: vmin(3.5),
          color: "rgba(153, 153, 153, 1)",
          width: "100%",
          alignItems: "center",
        }}
      >
        El estado de su cuenta a cambiado a USUARIO ACTIVO. Ahora tendra acceso
        a otras funciones adicionales
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => finalizeForm()}>
        <Text style={{ color: "white" }}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterPatient = (props) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  return (
    <View style={styles.screenContainer}>
      <View style={styles.containerSteps}>
        {steps(currentPosition, setCurrentPosition)}
      </View>

      <ScrollView style={styles.containerCard}>
        {currentPosition == 0 ? (
          <MedicalData
            props={props}
            setCurrentPosition={setCurrentPosition}
            currentPositionValue={currentPosition}
          />
        ) : currentPosition == 1 ? (
          <SaveCompanion
            props={props}
            setCurrentPosition={setCurrentPosition}
          />
        ) : (
          <Confirm props={props} />
        )}
      </ScrollView>
    </View>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  updateShowTour1: (val) => dispatch(actionsUser.SHOW_TOUR1(val)),
  updateShowTour2: (val) => dispatch(actionsUser.SHOW_TOUR2(val)),
  updateShowTour3: (val) => dispatch(actionsUser.SHOW_TOUR3(val)),
  updateShowTour4: (val) => dispatch(actionsUser.SHOW_TOUR4(val)),
  updateShowTour5: (val) => dispatch(actionsUser.SHOW_TOUR5(val)),
  setUserMedical: (val) => dispatch(actionsUser.UPDATE_USER_MEDICAL(val)),
  setUserCompanion: (val) => dispatch(actionsUser.UPDATE_USER_COMPANION(val)),
  setUserRole: (val) => dispatch(actionsUser.UPDATE_USER_ROLE(val)),
  updateStatus: (val) => dispatch(actionsUser.UPDATE_STATUS(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(RegisterPatient);

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
    marginTop: "4%",
    height: "100%",
    // justifyContent: "space-evenly",
  },

  resultSlider: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(105, 121, 248, 0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderTitle: {
    height: "30%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowText_button: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vmin(1),
  },

  containerInput: {
    height: "10%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: "0%",
    display:"flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
  },

  containerRadio: {
    height: "30%",
    width: "100%",
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
    // backgroundColor: "green",
  },
  imageContainer: {
    width: "100%",
    height: vmin(30),
    resizeMode: "contain",
  },
  input: {
    height: "60%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },
  containerList: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
  },

  radioOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "3%",
    alignItems: "stretch",
    width: "100%",
  },
  timeContainer: {
    height: vmin(14),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
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
    width: "90%",
    height: vmin(10),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(6),
    borderRadius: 10,
    marginBottom: vmin(6),
  },

  repetitionInputContainer: {
    height: "30%",
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
  },

  containerTextHeader2: {
    alignItems: "center",
    height: "30%",
    marginTop: "5%",
    width: "100%",
  },

  sliderContainer: {
    height: vmin(16),
    width: "65%",
    marginLeft: "18%",
    marginTop: "-5%",
    marginBottom:"10%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "salmon",
  },

  textHeader: {
    fontWeight: "bold",
    fontSize: vmin(5),
    textAlign: "center",
  },
});
