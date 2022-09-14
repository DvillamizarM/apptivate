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
  ViewBase,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";
// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { Slider } from "react-native-range-slider-expo";

const SatisfactionSurvey = (props) => {
  const [values, setValues] = useState({
    understandingExercises: 0,
    sentimentPercentage: 0,
    appUX: 0,
    openContent: "",
    openApp: "",
  });

  const saveFormReportEvent = async () => {
    let idRecord = "";

    let res = await firebase.db.collection("satisfactionSurvey").add({
      ...values,
      userId: props.user.uid,
      userName: props.user.information.personal.name,
      userPhone: props.user.information.personal.phone,
    });
    idRecord = res.id;
    props.navigation.navigate("Home");
  };
  return (
    <View style={styles.Contenedor}>
      <ScrollView
        style={{ minHeight: "100%" }}
        contentContainerStyle={{ marginTop: "5%", paddingBottom: 200, }}
      >
        <View style={{width:"90%", marginLeft:"5%", padding: 5, borderRadius:10, backgroundColor: "rgba(225, 126, 62, 0.4)"}}>
        <Text style={{fontSize:vmin(4.5), textAlign:"justify"}}>
              Gracias por tomarte el tiempo de dejar tu retroalimetación. Tus
              comentarios son muy valiosos para la mejora constante de la app.
            </Text>
        </View>
        {/* <View style={{marginTop:"5%",height:"100%", backgroundColor:"yellow"}}> */}
        <View style={styles.containerInput}>
          
          <View style={styles.sliderTitle}>
            <Text style={{ fontSize: vmin(4.5) }}>
              ¿Cómo califica la facilidad de comprensión de los ejercicios y
              animaciones?
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              min={1}
              max={5}
              step={1}
              valueOnChange={(value) => {
                setValues({ ...values, understandingExercises: value });
              }}
              initialValue={values.understandingExercises}
              knobColor="#6979F8"
              valueLabelsBackgroundColor="rgba(65,65,65)"
              inRangeBarColor="rgba(65,65,65, 0.7)"
              outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
            />
          </View>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {values.understandingExercises}</Text>
          </View>
        </View>

        <View style={styles.containerInput}>
          <View style={styles.sliderTitle}>
            <Text style={{ fontSize: vmin(4.5) }}>
              ¿Cómo califica su experiencia usando la aplicación?
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              min={1}
              max={5}
              step={1}
              valueOnChange={(value) => {
                setValues({ ...values, appUX: value });
              }}
              initialValue={values.appUX}
              knobColor="#6979F8"
              valueLabelsBackgroundColor="rgba(65,65,65)"
              inRangeBarColor="rgba(65,65,65, 0.7)"
              outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
            />
          </View>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {values.appUX}</Text>
          </View>
        </View>

        <View style={styles.containerInput}>
          <View style={styles.sliderTitle}>
            <Text style={{ fontSize: vmin(4.5) }}>
              ¿Cómo se siente después de completar el plan de rehabilitación?
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              min={1}
              max={5}
              step={1}
              valueOnChange={(value) => {
                setValues({ ...values, sentimentPercentage: value });
              }}
              initialValue={values.sentimentPercentage}
              knobColor="#6979F8"
              valueLabelsBackgroundColor="rgba(65,65,65)"
              inRangeBarColor="rgba(65,65,65, 0.7)"
              outOfRangeBarColor="rgba(228, 228, 228, 0.5)"
            />
          </View>
          <View style={styles.resultSlider}>
            <Text style={{}}>Valor: {values.sentimentPercentage}</Text>
          </View>
        </View>

        <View
          style={[styles.containerInput, { height: "15%", marginTop: "5%" }]}
        >
          <Text style={{ fontSize: vmin(4.5) }}>
            Sugerencias sobre la información y contenido de la aplicación
          </Text>
          <TextInput
            style={[styles.repetitionInputContainer, { height: "70%" }]}
            multiline={true}
            placeholder="Por favor ingresa tu opinión y sugerencias sobre la información que encontraste dentro de la aplicación."
            onChangeText={(value) =>
              setValues({ ...values, openContent: value })
            }
            value={values.openContent}
          />
        </View>

        <View
          style={[styles.containerInput, { height: "15%", marginTop: "5%" }]}
        >
          <Text style={{ fontSize: vmin(4.5) }}>
            Sugerencias sobre el diseño, estructura y funciones de la aplicación
          </Text>
          <TextInput
            style={[styles.repetitionInputContainer, { height: "70%" }]}
            multiline={true}
            placeholder="Por favor ingresa tu opinión y sugerencias con respecto a tu experiencia usando la aplicación."
            onChangeText={(value) =>
              setValues({ ...values, openApp: value })
            }
            value={values.openApp}
          />
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              saveFormReportEvent();
            }}
          >
            <Text style={{ color: "white" }}>Registrar Respuestas</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
        {/* </View> */}
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
});

export default connect(MapStateToProps, MapDispatchToProps)(SatisfactionSurvey);

const styles = StyleSheet.create({
  Contenedor: {
    backgroundColor: "white",
    // justifyContent: "space-around",
    height: "100%",
    // flexGrow:1,
  },
  textHeader: {
    fontSize: vmin(6),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginBottom: vmin(5),
  },
  ContainerQuestions: {
    width: "90%",
    margin: "auto",
    height: "25%",
  },
  containerInput: {
    height: "20%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(1),
    marginBottom: "3%",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
  },
  ContainerQuestion: {
    width: "100%",
    height: "auto",
    marginTop: vmin(3),
  },
  Question: {
    fontSize: vmin(5),
    textAlign: "left",
  },

  repetitionInputContainer: {
    height: "30%",
    width: "100%",
    borderColor: "rgba(25, 25, 25, 0.56)",
    borderBottomWidth: 1,
    borderRadius: 5,
    fontSize: vmin(4.5),
  },
  ContainerAnswer: {
    width: "100%",
    height: vmin(15),
    borderColor: "#e4e4e4",
    borderWidth: vmin(0.5),
    marginTop: vmin(2),
    borderRadius: vmin(4),
  },
  sliderContainer: {
    height: vmin(16),
    width: "100%",
    marginLeft: "2%",
    //paddingTop: 4,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "salmon",
  },
  resultSlider: {
    width: "32%",
    height: "25%",
    backgroundColor: "rgba(105, 121, 248, 0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-8%",
  },
  sliderTitle: {
    height: "55%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  containerButton: {
    height: "8%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    //padding: vmin(2),
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "90%",
    borderRadius: 10,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});
