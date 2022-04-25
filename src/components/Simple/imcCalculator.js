import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ListViewBase,
} from "react-native";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
var { vmin } = require("react-native-expo-viewport-units");

export default function imcCalculator(props) {
  //     console.warn(props.modalVisible)
  const [weight, setWeight] = useState(0);
  const [size, setSize] = useState(0);
  const [imc, setIMC] = useState(0);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onBackdropPress={() => console.log("Pressed")}
      visible={props.show}
      onRequestClose={() => {
        props.setShow(false);
      }}
      //style={{justifyContent: "center", alignItems:"center"}}

      // onRequestClose={ResetValues}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          width:"100%",
          height: "100%",
          minHeight: "100%",
          alignItems: "center",
          backgroundColor: "rgba(244,244,244,0.7)",
        }}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#ffffff",
            borderRadius: 20,
            alignSelf: "center",
            width: "80%",
            height: "60%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: "15%",
              marginLeft: "6%",
              marginBottom: "3%",
              flexDirection:"row",
              justifyContent: "center",
              alignItems: "center",
             // backgroundColor:"salmon",
            }}
          >
            <Text
              style={{
                fontSize: vmin(5),
                fontWeight: "bold",
                textAlign:"left",
                //backgroundColor:"salmon",
                textAlignVertical: "bottom"
              }}
            >
              Calculadora de IMC
            </Text>
            <TouchableOpacity
              style={{
                alignItems: "center",
                height: "60%",
                width: "15%",
                marginLeft: "7%",
                borderRadius: 8,
                backgroundColor: "#d8d8d8",
                alignItems:"center",
                marginRight: "5%",
              }}
              onPress={() => {
                props.setShow(false);
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: vmin(6),
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "bold",
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            {/* 
            <Text
              style={{
                alignItems: "center",
                height: "10%",
                width: "8%",
                marginLeft: "5%",
                marginRight: "7%",
              }}
            >
              <Icon.Button
                name={"close"}
                onPress={() => {
                  props.setShow(false);
                }}
                color={"#ffffff"}
                size={24}
                backgroundColor={"rgba(225, 126, 62,0.7)"}
                borderRadius={13}
                style={{}}
              />
            </Text> */}
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              marginTop: "9%",
              height: "60%",
            }}
          >
            <View style={styles.containerInput}>
              <Text style={styles.headerInput}>Peso en kilogramos</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                  setWeight(value);
                }}
                value={weight}
                placeholder={"Peso en kilogramos"}
              />
            </View>
            <View style={styles.containerInput}>
              <Text style={styles.headerInput}>Estatura en centímetros</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                  setSize(value);
                }}
                value={size}
                placeholder={"Estatura en centímetros"}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  const imcFormula = (weight / Math.pow(size,2))*100;
                  console.warn("preseed", imcFormula, "    ",Math.pow(size,2), "       ", weight);
                setIMC(imcFormula*100);
              }}
            >
              <Text style={{ color: "#ffffff" }}>Calcular IMC</Text>
            </TouchableOpacity>
            <View
              style={[
                {
                  width: "90%",
                  height: "23%",
                  marginLeft:"5%",
                  alignItems: "center",
                    backgroundColor: "#e9e9e9",
                    padding: "3%",
                    borderRadius:7,
                  marginTop: "15%",
                },
              ]}
            >
              <Text style={[styles.headerInput, { textAlign: "center" }]}>
                Índice de masa corporal (IMC) 
              </Text>
              <Text style={[styles.headerInput, { textAlign: "center", fontSize: vmin(4) }]}>
              {imc}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerInput: {
    height: vmin(25),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "20%",
    justifyContent: "space-evenly",
  },

  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },

  input: {
    height: "60%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#6979F8",
    marginBottom: "7%",
    marginLeft: "5%",
    width: "90%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
