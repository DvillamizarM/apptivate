import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
import { Slider } from "react-native-range-slider-expo";
import RadioButton from "expo-radio-button";
import LightBulb from "react-native-vector-icons/FontAwesome";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ChargeScreen from "../Simple/ChargeScreen";

const UpdateMedicalData = (props) => {
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
    setData(props.user.information.medical);
    setCurrent(props.user.information.medical.amputationLevel);
    setCurrent1(props.user.information.medical.amputationPhase);
    setLoading(false);

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
            trainingPhase: props.user.information.control.trainingPhase,
            activeWeek: props.user.information.control.activeWeek,
            activeDay: props.user.information.control.activeDay,
            record: props.user.information.control.record,
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
    width: "65%",
    marginLeft: "18%",
    marginTop: "-5%",
    marginBottom:"10%",
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
