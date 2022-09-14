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

const RecordTrainingData = (props) => {
  const [data, setData] = useState({
    perceivedForce: "",
    size: "",
    weight: "",
    age: "",
    evolutionTime: "",
    amputationLevel: "",
    amputationPhase: "",

    corporalMass: 0,
  });

  const [perceivedVal, setPerceivedVal] = useState(0);
  const [current, setCurrent] = useState("");
  const [current1, setCurrent1] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.db
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((user_db: any) => {
        setData({ ...user_db.data().medical });
        setCurrent(user_db.data().medical.amputationLevel);
        setCurrent1(user_db.data().medical.amputationPhase);
        setLoading(false);
      })
      .catch((e) => {
        console.log("El error es ", e);
      });
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
          corporalMass: parseInt(data.weight) / parseInt(data.size),
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

          control: {
            trainingPhase: "Inicial",
            activeWeek: "week1",
            activeDay: 0,
            record: [],
          },
        });
        props.navigation.state.params.start
          ? props.navigation.navigate("CustomizeRoutine", {
              btnText: "Continuar",
            })
          : props.navigation.navigate("ProfileScreen");
      });
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
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={{
              height: "10%",
              width: "80%",
              marginLeft: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: vmin(5) }}>
              Datos Médicos
            </Text>
            <Text
              style={{ fontSize: vmin(4), flexWrap: "wrap", textAlign: "left" }}
            >
              Por favor ingrese sus datos médicos para aplicar restricciones de
              seguridad e iniciar la rutina.
            </Text>
          </View>
          <View style={{ height: "90%" }}>
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
              <View style={styles.sliderTitle}>
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
                  initialValue={1}
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
                { height: "23%", marginBottom: "5%" },
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
                { height: "18%", marginBottom: "5%" },
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
            <View
            // style={{ height: "12%", width: "100%", marginBottom: "100%" }}
            >
              <TouchableOpacity
                style={updateMedicalDataStyles.button}
                onPress={() => {
                  if (
                    data.age !== "" &&
                    data.amputationLevel !== "" &&
                    data.amputationPhase !== "" &&
                    data.evolutionTime !== "" &&
                    data.perceivedForce !== "" &&
                    data.size !== "" &&
                    data.weight !== ""
                  ) {
                    saveMedicalData();
                  } else {
                    Alert.alert("Por favor ingrese toda la información.")
                  }
                }}
              >
                <Text style={{ color: "white" }}>Actualizar Datos Médicos</Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 50 }} />
          </View>
        </ScrollView>
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
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
export default connect(MapStateToProps, MapDispatchToProps)(RecordTrainingData);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  sliderContainer: {
    height: vmin(20),
    width: "65%",
    marginLeft: "18%",
    marginTop: "-5%",
    marginBottom:"10%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "salmon",
  },
  imageContainer: {
    width: "100%",
    height: vmin(30),
    resizeMode: "contain",
  },

  scroll: {
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  radioOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
    height: "25%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const updateMedicalDataStyles = StyleSheet.create({
  screenContainer: { width: "100%", height: "100%", backgroundColor: "white" },
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

  containerFlexRow: {
    width: "100%",
    height: "100%",
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
  textHeader: {
    fontWeight: "bold",
    fontSize: vmin(5),
    textAlign: "center",
  },
});
