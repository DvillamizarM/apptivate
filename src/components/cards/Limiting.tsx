import React, { Component, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Alert } from "react-native";

var { vmin } = require("react-native-expo-viewport-units");

import Download from "react-native-vector-icons/Ionicons";
// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import ImcCalculator from "../Simple/imcCalculator";
import {
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import LightBulb from "react-native-vector-icons/FontAwesome";

const Limiting = (props) => {
  const [show, setShow] = useState(false);

  // const {
  //   canStart, // a boolean indicate if you can start tour guide
  //   start, // a function to start the tourguide
  //   stop, // a function  to stopping it
  //   eventEmitter, // an object for listening some events
  // } = useTourGuideController();
  // const handleOnStart = () => console.log("start");
  // const handleOnStop = () => console.log("stop");
  // const handleOnStepChange = (step) => {
  //   console.log("step--", step);
  //   if (step === undefined) {
  //     props.updateShowTour2(false), stop;
  //   } else {
  //     console.log("step num=---", step.order);
  //   }
  //   console.log("stepChange");
  // };
  // useEffect(() => {
  //   console.warn("in if start limiting -----", canStart);
  //   console.warn("in if start showtour2 -----", props.showTour2);
  //   console.warn("in if start repoIndex -----", props.repoIndex);
  //   if (props.showTour2 && props.repoIndex === 1 && canStart) {
  //     // 👈 test if you can start otherwise nothing will happen
  //     console.warn("passed if");
  //     start(6);
  //   }
  // }, [canStart]);

  // useEffect(() => {
  //   // console.warn("third effect-----");
  //   eventEmitter.on("start", handleOnStart);
  //   eventEmitter.on("stop", handleOnStop);
  //   eventEmitter.on("stepChange", handleOnStepChange);

  //   return () => {
  //     eventEmitter.off("start", handleOnStart);
  //     eventEmitter.off("stop", handleOnStop);
  //     eventEmitter.off("stepChange", handleOnStepChange);
  //   };
  // }, []);

  return (
    <ScrollView style={styles.container}>
      <ImcCalculator show={show} setShow={setShow} />
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text style={styles.title}>
          Porcentajes de variación de acuerdo a sus condiciones físicas. Estos
          porcentajes aplican a la cantidad de repeticiones de cada ejercicio.
        </Text>
      </View>

      <View style={styles.rowContainer}>
        {/* <TourGuideZone
          zone={6}
          text="La información esta organizada por categoría. Con las flechas de los lados se puede mover por las categorías."
          borderRadius={16}
        > */}
        <View style={styles.effortContainer}>
         
            <Text style={[styles.title2, {marginRight:"4%"}]}>Esfuerzo Percibido</Text>
            {/* <FontAwesomeIcon icon="fa-solid fa-lightbulb" /> */}
         

          <Text style={styles.grayText}>
          
          Es una forma de clasificar la intensidad de las actividades 
          físicas a través de las propias sensaciones que siente el 
          individuo que realiza la actividad en cuestión. Para medir 
          su esfuerzo percibido siéntese y levántese de una silla 10 
          veces y califique como se siente al finalizar.
            </Text>
        </View>
        {/* </TourGuideZone> */}
      </View>

      <View style={styles.body}>
        <View style={[styles.row, { marginBottom: "4%" }]}>
          <View style={styles.column1}>
            <Text style={[styles.percentages, { fontWeight: "bold" }]}>
              Escala
            </Text>
          </View>

          <View style={styles.column2}>
            <Text style={[styles.percentages, { fontWeight: "bold" }]}>
              Categoría
            </Text>
          </View>

          <View style={styles.column3}>
            <Text style={[styles.percentages, { fontWeight: "bold" }]}>
              Intensidad
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Image
              source={require("../../assets/images/0.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Excesivamente Liviano:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}>100%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Text style={{fontWeight: 800}}>1</Text>
            <Image
              source={require("../../assets/images/1.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Liviano:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}> 90% - 100%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Image
              source={require("../../assets/images/2.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Ni liviano ni pesado:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}>80% - 100%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Image
              source={require("../../assets/images/3.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Pesado:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}>70% - 90%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Image
              source={require("../../assets/images/4.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Muy pesado:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}>60% - 80%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column1}>
            <Image
              source={require("../../assets/images/5.png")}
              style={styles.imageContainer}
            />
          </View>

          <View style={styles.column2}>
            <Text style={styles.description}>Excesivamente Pesado:</Text>
          </View>

          <View style={styles.column3}>
            <Text style={styles.percentages}>50% - 70%</Text>
          </View>
        </View>
      </View>

      <View style={imc_styles.container}>
        {/* <Text style={styles.title}></Text> */}

        <View style={styles.rowContainer}>
          <View style={styles.effortContainer}>
            <Text style={styles.title2}>Índice de masa corporal (IMC)</Text>
            <Text style={styles.grayText}>
              De acuerdo al peso dividido por la estatura
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const temp = !show;
                setShow(temp);
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                Calcular IMC
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[imc_styles.headerRow, { marginTop: "0%" }]}>
          <View style={imc_styles.column1}>
            <Text style={{ fontWeight: "bold" }}>Referencia</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={{ fontWeight: "bold" }}>Valor</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text
              style={[
                imc_styles.percentages,
                {
                  fontWeight: "bold",
                },
              ]}
            >
              Intensidad
            </Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Delgadez</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"< 18.5"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>100%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Normal</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"> 18.5 a < 25"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>100%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Sobrepeso</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"> 25 a < 30"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>70% - 90%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Obesidad </Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"> 30"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>60% - 70%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Obesidad I</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"30 a 34.9"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>60% - 70%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Obesidad II</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"35 a 39.9"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>50% - 60%</Text>
          </View>
        </View>

        <View style={imc_styles.row}>
          <View style={imc_styles.column1}>
            <Text style={imc_styles.description}>Obesidad III</Text>
          </View>

          <View style={imc_styles.column2}>
            <Text style={imc_styles.imcValues}>{"> 40"}</Text>
          </View>

          <View style={imc_styles.column3}>
            <Text style={imc_styles.percentages}>50% - 50%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    repoIndex: store.User.repoIndex,
    showTour2: store.User.showTour2,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  updateShowTour2: (val) => dispatch(actionsUser.SHOW_TOUR2(val)),
  setRepoIndex: (val) => dispatch(actionsUser.SET_REPOINDEX(val)),
});

export default connect(MapStateToProps, MapDispatchToProps)(Limiting);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  title: {
    fontStyle: "italic",
    marginTop: vmin(3),
    marginBottom: vmin(2),
    width: "80%",
    justifyContent: "space-evenly",
    textAlign: "center",
  },

  rowContainer: {
    flexDirection: "row",
    marginBottom: vmin(5),
    margin: "5%",
    width: "90%",
  },
  title2: {
    fontWeight: "bold",
    fontSize: vmin(4.3),
  },
  iconContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  effortContainer: { width: "100%" },
  grayText: { color: "rgba(153, 153, 153, 1)" },
  body: {
    borderColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: vmin(0.4),
    paddingBottom: vmin(10),
    width: "100%",
    height: "auto",
  },

  button: {
    //backgroundColor: "rgba(255, 231, 35,1.3)",

    backgroundColor: "rgba(105,121,248,1)",
    //backgroundColor: "rgba(270, 234, 5, 1)",
    marginTop: "2%",
    width: "60%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  row: { width: "100%", flexDirection: "row", justifyContent: "center" },

  column1: {
    width: "22%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  column2: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },

  column3: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "orange",
  },
  description: { color: "#666666", textAlign: "center" },
  percentages: { fontWeight: "600" },
  imageContainer: {
    width: "100%",
    height: vmin(10),
    resizeMode: "contain",
  },
});

const imc_styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "10%",
    marginTop: vmin(3),
    marginBottom: vmin(8),
    // backgroundColor: "green",
  },

  rowContainer: {
    flexDirection: "row",
    marginBottom: vmin(5),
    margin: "5%",
    width: "90%",
  },

  headerRow: { width: "100%", flexDirection: "row", marginBottom: "3%" },
  row: { width: "100%", flexDirection: "row", marginTop: vmin(1) },

  column1: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  column2: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },

  column3: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },

  description: { color: "#666666" },
  imcValues: { fontWeight: "600", color: "#666666" },
  percentages: { fontWeight: "600" },
});
