import * as React from "react";
import { Dispatch } from "redux";

import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";

import * as MyTypes from "../../redux/types/types";

import IconCheck from "react-native-vector-icons/FontAwesome";

import IconLoader from "react-native-vector-icons/FontAwesome";

import { Audio } from "expo-av";

// Iconos para la seccion de informacion
import Check from "react-native-vector-icons/FontAwesome";
import Repeat from "react-native-vector-icons/FontAwesome";
import Wathc from "react-native-vector-icons/Ionicons";
import Play from "react-native-vector-icons/Ionicons";

interface Props {
  exercise: object[];
  setup: object;
}
var { vmin } = require("react-native-expo-viewport-units");
class EjercicioInactivo extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {};

  componentDidMount = async () => {
    console.log("Las props que tenemos en el nuevo son: ", this.props);
    this.setState({
      ...this.props.navigation.state.params.data,
    });
  };

  handlePlaySound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: this.state.voz });
    // setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };

  render() {
    return (
      <View style={styles.containerCard}>
       

        <View style={styles.containerImage}>
          <Image
            source={{ uri: this.state.gif }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </View>
        <View style={styles.containerButtons}>
          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Check name="check-square-o" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Series</Text>
              <Text style={{}}>
                {this.state.series ? this.state.series : "1"}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Repeat name="repeat" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{ fontSize: vmin(3.1) }}>Repeticiones</Text>
              <Text style={{}}>
                {this.state.repetitions ? this.state.repetitions : "1"}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Wathc
                name="md-stopwatch-outline"
                size={vmin(9)}
                color="#999999"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Tiempo</Text>
              <Text style={{}}>{this.state.activeTime || "1"}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.box}
            onPress={() => this.handlePlaySound()}
          >
            <View style={styles.iconContainer}>
              <Play name="play-outline" size={vmin(9)} color="#999999" />
            </View>
            <View style={styles.textContainer}>
              <Text style={{}}>Comando</Text>
              <Text style={{}}>de Voz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.indicatorTextContainer}>
          <Text
            style={{
              fontSize: vmin(4),
              borderBottomWidth:0.3,
              marginBottom:"2%",
              paddingBottom:5
            }}
          >
            Descripción: {this.state.description}
          </Text>
          {
            this.state.materials != "" ? (<Text
            style={{
              fontSize: vmin(4),
            }}
          >
            Materiales: {this.state.materials}
          </Text>) : (console.log("nothing"))
          }
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {};
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({});
export default connect(MapStateToProps, MapDispatchToProps)(EjercicioInactivo);

const styles = StyleSheet.create({
  containerCard: {
    width: "100%",
    height: "100%",
     backgroundColor: "#ffffff",
     justifyContent: "space-evenly",
     alignItems: "center"
  },
  containerHeaderCard: {
    borderRadius: 10,
    height: "8%",
    flexDirection: "row",
    // backgroundColor: "pink",
  },
  headerLeftSection: {
    width: "10%",
    height: "100%",
    alignItems: "flex-end",
    // backgroundColor: "gray",
  },
  greenBall: {
    backgroundColor: "#00C48C",
  },
  headerCenterSection: {
    width: "75%",
    height: "100%",
    // backgroundColor: "orange",
  },
  textHeaderAlert: {
    fontSize: vmin(3),
    color: "#999999",
  },
  textHeaderExercise: {
    fontSize: vmin(4),
    color: "black",
    fontWeight: "bold",
  },
  textHeaderTime: {
    fontSize: vmin(4),
    color: "#999999",
  },
  headerRightSection: {
    width: "15%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: "#6979F8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    height: "55%",
    width: "100%",
    flexDirection: "row",
    marginTop:"5%"
    // backgroundColor: "pink",
  },
  indicatorTextContainer: {
    backgroundColor: "rgba(105,121,248,0.2)",
    height: "15%",
    width: "90%",
    padding: vmin(3),
    borderRadius:10
  },
  // footerSection: {
  //   backgroundColor: "black",
  //   height: "10%",
  //   width: "100%",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //   flexDirection: "row",
  //   paddingLeft: vmin(10),
  // },
  textActiveTime: {
    fontSize: vmin(4),
    color: "#999999",
    padding: vmin(2),
  },
  greenSection: {
    backgroundColor: "#00C48C",
    borderRadius: 20,
    width: "20%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerButtons: {
    height: "20%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "green",
  },

  box: {
    height: "90%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  iconContainer: {
    height: "60%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "peru",
  },

  textContainer: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
