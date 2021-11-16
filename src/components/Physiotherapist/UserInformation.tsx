import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Picker,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

var { vmin } = require("react-native-expo-viewport-units");

// Iconos
import StepIndicator from "react-native-step-indicator";
import Add from "react-native-vector-icons/Ionicons";
import Arrow from "react-native-vector-icons/MaterialIcons";
import Check from "react-native-vector-icons/EvilIcons";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { ScrollView } from "react-native-gesture-handler";
import ChargeScreen from "../Simple/ChargeScreen";

const medicalInformation = (userInformation) => {
  if (userInformation.loading) {
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
    let data = userInformation.medical;
    let data1 = userInformation.control;
    console.log("Los datos medicos son :", data1.trainingPhase);

    return (
      <View style={medicalStyles.containerMedicalData}>
        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Estatura (CM)
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.size}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>Peso (KG)</Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.weight}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>EDAD</Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.age}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Evolución (Meses)
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.evolutionTime}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Nivel de Amputación
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.amputationLevel}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Etapa de Entrenamiento
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.amputationPhase}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Esfuerzo Percibido
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data.perceivedForce}
          />
        </View>

        <View style={medicalStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Etapa de Plan
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            editable={false}
            value={data1.trainingPhase}
          />
        </View>
      </View>
    );
  }
};

const personalInformation = (userInformation) => {
  if (userInformation.loading) {
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
    let companionEmail = userInformation.companionEmail;
    let data = userInformation.personal;
    console.log(userInformation, " yy y y y yy y y y y y yy");
    return (
      <View style={personalInformationStyles.container}>
        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Nombre Completo
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            onChangeText={(value) => {}}
            value={data.name}
            placeholder={"Ingrese Nombres y Apellidos"}
            editable={false}
          />
        </View>

        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Documento de Identidad
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            onChangeText={(value) => {}}
            value={data.id}
            placeholder={"Tarjeta de Identidad o Cédula"}
            editable={false}
          />
        </View>

        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>Teléfono</Text>
          <TextInput
            style={personalInformationStyles.input}
            onChangeText={(value) => {}}
            value={data.phone}
            placeholder={"Número telefónico celular"}
            editable={false}
          />
        </View>

        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Correo Electrónico
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            onChangeText={(value) => {}}
            value={data.email}
            placeholder={"Dirección de correo electrónico"}
            editable={false}
          />
        </View>

        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>
            Correo de Acompañante
          </Text>
          <TextInput
            style={personalInformationStyles.input}
            value={companionEmail}
            editable={false}
          />
        </View>

        {/* Genero */}

        <View style={personalInformationStyles.containerInput}>
          <Text style={personalInformationStyles.headerInput}>Genero</Text>
          <TextInput
            style={personalInformationStyles.input}
            value={data.genero}
            editable={false}
          />
        </View>
      </View>
    );
  }
};

const UserInformation = ({ props: props2 }) => {
  const [navigationPosition, setnavigationPosition] = useState(0);
  const navigationTitles = ["Personales", "Médicos"];

  const NavigationButton = () => {
    return (
      <View style={navigationButtonStyles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (navigationPosition - 1 >= 0) {
              setnavigationPosition(navigationPosition - 1);
            } else if (navigationPosition === 0) {
              setnavigationPosition(1);
            }
          }}
          style={navigationButtonStyles.sideButton}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <View style={navigationButtonStyles.navigationButtonText}>
          <Text style={navigationButtonStyles.whiteText}>
            {navigationTitles[navigationPosition]}
          </Text>
        </View>
        <TouchableOpacity
          style={navigationButtonStyles.sideButton}
          onPress={() => {
            if (navigationPosition + 1 < navigationTitles.length) {
              setnavigationPosition(navigationPosition + 1);
            } else if (navigationPosition === 1) {
              setnavigationPosition(0);
            }
          }}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log("Las props son ///////////////////////", props2);

  let { userInformation, props } = props2;

  console.log(
    "El user information es :::::::::::::::::::::::::",
    userInformation
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>{NavigationButton()}</View>

      <ScrollView style={styles.body}>
        {navigationPosition === 0
          ? personalInformation(userInformation)
          : medicalInformation(userInformation)}
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
export default connect(MapStateToProps, MapDispatchToProps)(UserInformation);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "10%",
    borderColor: "rgba(21, 21, 34, 1)",
    //  borderBottomWidth: vmin(0.4),
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "orange",
  },

  body: {
    width: "100%",
    height: "90%",
    // backgroundColor: "peru",
  },
  containerMedicalData: {
    width: "100%",
    marginTop: "4%",
    height: "100%",
    // justifyContent: "space-evenly",
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
  headerInput: {
    width: "100%",
    textAlign: "left",
    fontSize: vmin(4),
    fontWeight: "bold",
    left: vmin(1.5),
  },

  containerInput: {
    height: "8%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(2),
    marginBottom: "5%",
    justifyContent: "space-evenly",
    // backgroundColor: "green",
  },

  footer: {
    width: "100%",
    height: "10%",
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
});

const personalInformationStyles = StyleSheet.create({
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  textHeader: {
    fontSize: vmin(5),
  },

  container: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  containerInput: {
    height: vmin(25),
    width: "90%",
    // backgroundColor: "tomato",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "2%",
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
    paddingLeft: vmin(2),
    borderWidth: 1,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: vmin(12),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: "5%",
    marginTop: vmin(10),
    marginBottom: vmin(10),
  },

  scroll: {
    height: "90%",
    width: "100%",
  },

  repetitionInputContainer: {
    height: "50%",
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
  },
});

const navigationButtonStyles = StyleSheet.create({
  containerNavigationButton: {
    width: "90%",
    flexDirection: "row",
    height: "80%",
    borderRadius: 10,
    backgroundColor: "rgba(105, 121, 248, 1)",
    justifyContent: "center",
    alignItems: "center",
  },

  sideButton: {
    height: "100%",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  navigationButtonText: {
    height: "70%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderLeftWidth: vmin(0.5),
    borderRightWidth: vmin(0.5),
  },

  whiteText: {
    color: "white",
  },
});

const medicalStyles = StyleSheet.create({
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
    height: vmin(14),
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: vmin(2.5),
    marginBottom: vmin(1),
    justifyContent: "space-evenly",
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
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    width: "48%",
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
    marginTop: vmin(10),
  },

  repetitionInputContainer: {
    height: "50%",
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
  textHeader: {
    fontWeight: "bold",
    fontSize: vmin(5),
    textAlign: "center",
  },
});
