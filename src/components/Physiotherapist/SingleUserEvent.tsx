import React, { useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
var { vmin, vh } = require("react-native-expo-viewport-units");

import Logowhatsapp from "react-native-vector-icons/Ionicons";

function SingleUserEvent(props) {

  const [form, setForm] = React.useState({
    eventType: "",
    description: "",
    eventTime: "",
    degreeOfPain: "",
    creationTime: "",
    userName: "",
    loading: true,
    userPhone: "",
  });

  useEffect(() => {
    setForm({
      ...props.navigation.state.params.report,

      loading: false,
    });
  }, []);

  const saveFormSingleUserEvent = async () => {
    Linking.openURL(
      "https://api.whatsapp.com/send?text=Hola! " +
        form.userName +
        "&phone=+57" +
        form.userPhone
    );
  };

  if (form.loading) {
    return <Text>Cargando... </Text>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>
            Evento Reportado: {form.userName}
          </Text>
          <Text style={styles.textHeader}>
            {new Date(form.creationTime).toDateString()}
          </Text>
        </View>
        <View style={styles.configurationContainer}>
          {/* input tipo de evento */}

          <View
            style={[
              styles.containerInput,
              { height: "20%", marginBottom: "6%", marginTop: "3%" },
            ]}
          >
            <Text style={{}}>Tipo de Evento</Text>
            <TextInput
              style={[styles.repetitionInputContainer, { height: "80%" }]}
              multiline={true}
              editable={false}
              placeholder="Ingrese una descripcion detallada de lo que paso. Incluya lo que estaba haciendo cuando ocurrió el evento."
              onChangeText={(value) => setForm({ ...form, eventType: value })}
              value={form.eventType}
            />
          </View>

          <View style={[styles.containerInput, { height: "20%" }]}>
            <Text style={{ }}>Descripción</Text>
            <TextInput
              style={[styles.repetitionInputContainer, { height: "80%" }]}
              multiline={true}
              editable={false}
              placeholder="Ingrese una descripcion detallada de lo que paso. Incluya lo que estaba haciendo cuando ocurrió el evento."
              onChangeText={(value) => setForm({ ...form, description: value })}
              value={form.description}
            />
          </View>
          <View style={styles.sliderInput}>
            <Text style={{}}>Tiempo de evento en días</Text>
            <View style={styles.sliderContainer}>
              <TextInput
                style={styles.resultText}
                editable={false}
              >
                {form.eventTime}
              </TextInput>
            </View>
          </View>

          <View style={styles.sliderInput}>
            <Text style={{}}>Grado de Dolor (Sí aplica)</Text>
            <View style={styles.sliderContainer}>
              <TextInput style={styles.resultText} 
                editable={false}>{form.degreeOfPain}</TextInput>
            </View>
          </View>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              saveFormSingleUserEvent();
            }}
          >
            <Text style={{ color: "white" }}>Contactar Por Whatsapp</Text>
          </TouchableOpacity>

          <Logowhatsapp name="logo-whatsapp" size={vmin(8)} color="#25D366" />
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    connection: store.User.connection,
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  updateUserControl: (data) => dispatch(actionsUser.UPDATE_USER_CONTROL(data)),
});

export default connect(MapStateToProps, MapDispatchToProps)(SingleUserEvent);

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#151522",
    borderBottomWidth: 0.6,
    marginLeft: "10%",
    marginRight: "10%",
    marginBottom:"3%"
  },
  textHeader: {
    fontSize: vmin(4.5),
    textAlign: "center",
  },

  container: { backgroundColor: "white", width: "100%", height: "100%" },

  configurationContainer: {
    // backgroundColor: "peru",
    width: "100%",
    height: "75%",

    // justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#151522",
   // borderBottomWidth: 1,
  },
  containerPercentajes: {
    // backgroundColor: "peru",
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  resultText: {
    padding: 6,
    borderWidth: 1,
    width: "100%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderRadius: 7,
  },

  sliderInput: {
    marginTop: "5%",
    height: "20%",
    justifyContent: "space-evenly",
    alignItems:"stretch",
    width: "90%",
  },

  sliderContainer: {
    height: vmin(16),
    width: "100%",
    marginTop: "3%",
    marginBottom: "8%",
    alignItems: "center",
    justifyContent: "center",
    padding:5,
   // borderBottomColor: "#151522",
    // backgroundColor: "salmon",
  },

  containerInput: {
    height: "25%",
    width: "100%",
    // backgroundColor: "tomato",
    marginLeft: "15%",
    marginRight: "5%",
    marginBottom: "3%",
    justifyContent: "space-evenly",
  },

  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },

  containerButton: {
    height: "10%",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: vmin(2),
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#6979F8",
    margin: vmin(2),
    width: "80%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  repetitionInputContainer: {
    height: "30%",
    width: "90%",
    borderColor: "rgba(228, 228, 228, 0.8)",
    borderWidth: 1,
    marginTop:"4%",
    borderRadius: 8,
    padding:5,
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

  groupPickerContainer: {
    height: vmin(23),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    // backgroundColor: "green",
  },
});
