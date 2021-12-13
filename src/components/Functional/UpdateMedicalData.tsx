import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import { Slider } from "react-native-range-slider-expo";
import StepIndicator from "react-native-step-indicator";
import RadioButton from "expo-radio-button";
import Picker from "../Simple/Picker";
import Add from "react-native-vector-icons/Ionicons";

import Arrow from "react-native-vector-icons/MaterialIcons";

import Check from "react-native-vector-icons/EvilIcons";
import LightBulb from "react-native-vector-icons/FontAwesome";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ChargeScreen from "../Simple/ChargeScreen";

const UpdateMedicalData = (props) => {
  console.log("Las props que llegan son", props);
  const [data, setData] = useState({
    perceivedForce: "",
    size: "",
    weight: "",
    age: "",
    evolutionTime: "",
    amputationLevel: "",
    amputationPhase: "",
    trainingPhase: "",
    corporalMass: 0,
  });

  const [perceivedVal, setPerceivedVal] = useState(0);
  const [current, setCurrent] = useState("");
  const [current1, setCurrent1] = useState("");
  const [rehabPhase, setRehabPhase] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.warn("Las props que llegan son", props.user.information.medical);
    setData(props.user.information.medical);
    setCurrent(props.user.information.medical.amputationLevel);
    setCurrent1(props.user.information.medical.amputationPhase);
    setLoading(false);
    // firebase.db
    //   .collection("users")
    //   .doc(props.user.uid)
    //   .get()
    //   .then((user_db: any) => {
    //     setData({ ...user_db.data().medical });
    //     setCurrent(user_db.data().medical.amputationLevel);
    //     setCurrent1(user_db.data().medical.amputationPhase);
    //     setRehabPhase(user_db.data().control.trainingPhase)
    //     console.warn("asdfasdfasdfasdfasdfasdfasdf", user_db.data().control.trainingPhase);
    //     setLoading(false);
    //   })
    //   .catch((e) => {
    //     console.log("El error es ", e);
    //   });
  }, []);

  const saveMedicalData = async () => {
  
//     var batch = firebase.db.batch();
//     let array = [
// 	"Warmup"
//       {
//         activeTime: 0,
//         description: "Estando de pie con las piernas separadas, sujetar un objeto pesado y agacharse sin doblar las rodillas intentando tocar la punta de los pies.",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P2F.gif?alt=media&token=e71b0c7e-be41-4084-990b-817e8e870b08",
//         materials: "Ladrillo o pesa o botella con agua o arena",
//         routinePhase: "Activa",
//         voz: "",
//       },
//       {
//         activeTime: 0,
//         description: "Ubicarse de pie frente a un espejo, con las piernas separadas, desplazarse hacia un lado y el otro haciendo carga de peso en los pies.",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P2G.gif?alt=media&token=73543874-bf39-4739-9953-10f175514089",
//         materials: "Espejo (que se pueda ver completo)",
//         routinePhase: "Activa",
//         voz: "",
//       },
//       {
//         activeTime: 0,
//         description: "De  pie,  ubicarse  junto  a  una  pared.  Colocar  una  pelota  a  la  altura  de  la  cadera  del  lado  sano  y presionar la pelota durante 10 segundos. ",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P4A.gif?alt=media&token=0dad9eea-1a15-4a4a-82ed-695c706b01d7",
//         materials: "Muro, balón",
//         routinePhase: "Activa",
//         voz: "",
//       },
//       {
//         activeTime: 0,
//         description: "Ubicarse frente una pared y apoyarse con las dos manos. Adelantar la pierna sana y empujar la pared mientras la pierna protésica permanece extendida y con el pie completamente apoyado en el piso.",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P4F.gif?alt=media&token=c4730a0f-81a3-4a56-9b01-42eda092d336",
//         materials: "Muro",
//         routinePhase: "Activa",
//         voz: "",
//       },
//       {
//         activeTime: 0,
//         description: "Acostado con rodillas flexionadas y pies apoyados, extender la rodilla del lado protésico y elevar la cadera. Sostener esta posición por 10 segundos y regresar al punto de partida.",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P5G.gif?alt=media&token=de7f6d7a-c5f4-40a4-b294-6ae8e56aaa14",
//         materials: "",
//         routinePhase: "Activa",
//         voz: "",
//       },
//       {
//         activeTime: 0,
//         description: "Patear un balón contra la pared con la pierna sana.",
//         gif: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/P7H.gif?alt=media&token=0e0f9af7-907d-4b9f-8b28-c97b0baa47e3",
//         materials: "Balón",
//         routinePhase: "Activa",
//         voz: "",
//       },
//     ];
//     array.forEach((doc) => {
//       batch.set(firebase.db.collection("exercise").doc(), doc);
//     });
//     batch.commit().then((docs)=>{
//       let temp = []
//       docs.data().forEach((val)=>{
// temp.push(val);
//       })
//       console.log("val----", temp)
//     }).catch((e) => {});


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
      })
      .then((e) => {
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
        });
        setLoading(false);
      });
  };

  let arraySize: any[] = [data.size];
  for (let index = 130; index < 250; index++) {
    arraySize.push(index);
  }

  let arrayWeight: any[] = [data.weight];
  for (let index = 40; index < 300; index++) {
    arrayWeight.push(index);
  }

  let arrayAge: any[] = [data.age];
  for (let index = 14; index < 100; index++) {
    arrayAge.push(index);
  }
  if (loading) {
    return (
      <View style={{ justifyContent: "center", marginTop: "5%" }}>
        <ChargeScreen />
      </View>
    );
  } else if (false) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            fontSize: vmin(8),
            color: "rgba(153, 153, 153, 1)",
            marginTop: "50%",
          }}
        >
          Bajo construcción
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            updateMedicalDataStyles.containerMedicalData,
            { marginBottom: "30%" },
          ]}
        >
          <View
            style={[
              updateMedicalDataStyles.containerInput,
              { marginTop: "3%" },
            ]}
          >
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

          <View style={updateMedicalDataStyles.containerInput}>
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

          <View style={updateMedicalDataStyles.containerInput}>
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

          <View style={updateMedicalDataStyles.containerInput}>
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
          <View style={updateMedicalDataStyles.containerInput}>
            <View style={[styles.sliderTitle, { height: "24%" }]}>
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
                  let stirngVal = "Liviano";
                  setPerceivedVal(value);
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
              updateMedicalDataStyles.containerInput,
              { height: "18%", marginBottom: "2%" },
            ]}
          >
            <Text style={{}}>Nivel de Amputación</Text>

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
                    setCurrent(value),
                      setData({ ...data, amputationLevel: value });
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
                    setCurrent(value),
                      setData({ ...data, amputationLevel: value });
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
                    setCurrent(value),
                      setData({ ...data, amputationLevel: value });
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
            style={[
              updateMedicalDataStyles.containerInput,
              { height: "14%", marginBottom: "5%" },
            ]}
          >
            <Text style={{}}>Fase de rehabilitación</Text>
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
          {/* <View
            style={[
              styles.containerInput,
              { height: "8%", alignItems: "flex-start" },
            ]}
          >
            <Text style={{ fontSize: vmin(4), fontWeight: "bold" }}>
              Etapa de Rehabilitación
            </Text>
            <View style={[styles.repetitionInputContainer, { borderWidth: 0 }]}>
              <Picker
                width={"100%"}
                height={40}
                placeholder={"Seleccionar"}
                setData={(itemValue, itemIndex) =>{console.warn("in set data---", itemValue )
                  setData({ ...data, trainingPhase: itemValue }) }
                }
                initialValue={props.user.information.control.trainingPhase ? props.user.information.control.trainingPhase : "Seleccionar"}
                list={["Seleccionar", "Inicial", "Intermedia", "Avanzada"]}
              />
            </View>
          </View> */}
          <View
          // style={{ height: "12%", width: "100%", marginBottom: "100%" }}
          >
            <TouchableOpacity
              style={[updateMedicalDataStyles.button]}
              onPress={() => {
                setLoading(true);
                saveMedicalData();
              }}
            >
              <Text style={{ color: "white" }}>Actualizar Datos Médicos</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 104 }} />
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
  setUserMedical: (val) => dispatch(actionsUser.UPDATE_USER_MEDICAL(val)),
  setUserCompanion: (val) => dispatch(actionsUser.UPDATE_USER_COMPANION(val)),
  setUserRole: (val) => dispatch(actionsUser.UPDATE_USER_ROLE(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(UpdateMedicalData);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // backgroundColor: "black",
  },
  imageContainer: {
    width: "100%",
    height: vmin(30),
    resizeMode: "contain",
  },
  radioOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  
  containerInput: {
    height: "10%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: "0%",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
  },
  
  repetitionInputContainer: {
    height: "30%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },
  
  sliderContainer: {
    height: vmin(20),
    width: "100%",
    marginLeft: "2%",
    marginTop: vmin(2),
    marginBottom: "8%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "salmon",
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
    height: "15%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const updateMedicalDataStyles = StyleSheet.create({
  screenContainer: { width: "100%", height: "100%", backgroundColor: "white" },

  containerSteps: {
    backgroundColor: "white",
    borderRadius: 10,
    height: "12%",
    justifyContent: "center",
  },
  containerCard: {
    height: "100%",
    width: "100%",
    // backgroundColor: "yellow",
  },

  containerMedicalData: {
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
    height: "10%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: "0%",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
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
    height: "18%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "10%",
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    marginTop: "2%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    // backgroundColor: "salmon",
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
});
