import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Picker,
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
    medicineList: [],
    conditionList: [],
    medicine: "",
    condition: "",
    corporalMass: 0,
  });

  const [perceivedVal, setPerceivedVal] = useState(0);
  const [current, setCurrent] = useState("");
  const [current1, setCurrent1] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Las props que llegan son", props);

    firebase.db
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((user_db: any) => {
        setData({ ...user_db.data().medical });
        setCurrent(user_db.data().medical.amputationLevel);
        setCurrent1(user_db.data().medical.amputationPhase);
        console.log("asdfasdfasdfasdfasdfasdfasdf", user_db.data().medical);
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
        });
        Alert.alert("Se actualizaron los datos médicos");
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
    return <ActivityIndicator size="large" color="#00ff00" />;
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
        <View style={updateMedicalDataStyles.containerMedicalData}>
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
            {/* <View style={updateMedicalDataStyles.repetitionInputContainer}>
            <Picker
              selectedValue={data.size + ""}
              style={{ height: "100%", width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                setData({ ...data, size: itemValue })
              }
            >
              {arraySize.map((element, index) => {
                return (
                  <Picker.Item
                    key={"m" + index}
                    label={element + ""}
                    value={element + ""}
                  />
                );
              })}
            </Picker>
          </View> */}
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
              { height: "16%", marginBottom: "5%" },
            ]}
          >
            <Text style={{}}>Nivel de Amputación</Text>

            <View style={styles.radioOptions}>
              <View style={{ width: "30%" }}>
                <Image
                  source={require("../../assets/images/transfemoral.jpg")}
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
                  source={require("../../assets/images/rodilla.jpg")}
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
                  source={require("../../assets/images/transtibial.jpg")}
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
              { height: "13%", marginBottom: "5%" },
            ]}
          >
            <Text style={{}}>Fase de rehabilitación</Text>
            <View style={styles.radioOptions}>
              <View style={{ width: "30%" }}>
                <Image
                  source={require("../../assets/images/transfemoral.jpg")}
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
                  source={require("../../assets/images/rodilla.jpg")}
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
          <View style={{ height: "12%", width: "100%", marginBottom: "100%" }}>
            <TouchableOpacity
              style={updateMedicalDataStyles.button}
              onPress={() => saveMedicalData()}
            >
              <Text style={{ color: "white" }}>Actualizar Datos Médicos</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 54 }} />
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
  imageContainer: {
    width: "100%",
    height: vmin(30),
    resizeMode: "contain",
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
    alignItems:"center"
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
    height: "30%",
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

/* <View style={updateMedicalDataStyles.containerList}>
        <Text style={{}}>Lista de Medicamentos</Text>
        <View style={updateMedicalDataStyles.rowText_button}>
          <TextInput
            style={[
              updateMedicalDataStyles.input,
              { width: "90%", height: vmin(12) },
            ]}
            onChangeText={(value) => {
              setData({ ...data, medicine: value });
            }}
            value={data.medicine}
            placeholder={"Medicamentos.. "}
          />
          <TouchableOpacity
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              let oldList: string[] = JSON.parse(
                JSON.stringify(data.medicineList)
              );
              oldList.push(data.medicine);
              setData({
                ...data,
                medicineList: oldList,
                medicine: "",
              });
            }}
          >
            <Add name="add" size={vmin(8)} color="rgba(153,153,153,1)" />
          </TouchableOpacity>
        </View>

        <View
          style={
            data.medicineList.length > 0
              ? updateMedicalDataStyles.listItemsContainer
              : {}
          }
        >
          {data.medicineList.map((e, i) => {
            return (
              <View
                key={i + "ml"}
                style={updateMedicalDataStyles.containerFlexRow}
              >
                <View style={{ width: "20%" }}>
                  <Arrow
                    name="arrow-right"
                    size={vmin(5)}
                    color="rgba(153,153,153,1)"
                  />
                </View>
                <Text style={{ width: "80%" }}> {e} </Text>
              </View>
            );
          })}
        </View>
      </View> */

/* contenedor para las condiciones */

/* <View style={updateMedicalDataStyles.containerList}>
        <Text style={{}}>Lista de Condiciones Médicas</Text>
        <View style={updateMedicalDataStyles.rowText_button}>
          <TextInput
            style={[
              updateMedicalDataStyles.input,
              { width: "90%", height: vmin(12) },
            ]}
            onChangeText={(value) => {
              setData({ ...data, condition: value });
            }}
            value={data.condition}
            placeholder={"Condiciones Médicas ..."}
          />
          <TouchableOpacity
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              let oldList: string[] = JSON.parse(
                JSON.stringify(data.conditionList)
              );
              oldList.push(data.condition);
              setData({
                ...data,
                conditionList: oldList,
                condition: "",
              });
            }}
          >
            <Add name="add" size={vmin(8)} color="rgba(153,153,153,1)" />
          </TouchableOpacity>
        </View>

        <View
          style={
            data.conditionList.length > 0
              ? updateMedicalDataStyles.listItemsContainer
              : {}
          }
        >
          {data.conditionList.map((e, i) => {
            return (
              <View
                key={i + "ml"}
                style={updateMedicalDataStyles.containerFlexRow}
              >
                <View style={{ width: "20%" }}>
                  <Arrow
                    name="arrow-right"
                    size={vmin(5)}
                    color="rgba(153,153,153,1)"
                  />
                </View>
                <Text style={{ width: "80%" }}> {e} </Text>
              </View>
            );
          })}
        </View>
      </View> */
