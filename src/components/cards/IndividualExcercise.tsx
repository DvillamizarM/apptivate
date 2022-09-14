import * as React from "react";
import { Dispatch } from "redux";

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { connect } from "react-redux";

import * as MyTypes from "../../redux/types/types";

import { Audio, Video } from "expo-av";

// Iconos para la seccion de informacion
import Check from "react-native-vector-icons/FontAwesome";
import Repeat from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

interface Props {
  exercise: object[];
  setup: object;
}
var { vmin } = require("react-native-expo-viewport-units");
class EjercicioInactivo extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    info: [],
    setup: [],
    playing: false,
    imgLoading: false,
    display: "",
    video: null,
  };

  componentDidMount = async () => {
    this.setState({
      info: this.props.navigation.state.params.data,
      setup: this.props.navigation.state.params.setup,
    });
  };


  async handlePlaySound(audio) {
    this.setState({ playing: true });
    const { sound } = await Audio.Sound.createAsync({ uri: audio });

    new Promise((resolve, reject) => {
      sound.playAsync();
      setTimeout(() => {
        resolve("foo");
      }, 15000);
    })
      .then(() => {
        sound.unloadAsync();
        this.setState({ playing: false });
      })
      .catch((err) => {
        Alert.alert("No se cargo el audio correctamente.");
      });
  }
  render() {
    return (
      <View style={styles.containerCard}>
        <View style={styles.containerImage}>
          {this.state.info.gif && this.state.info.gif.includes("gif") ? (
            <Image
              source={{ uri: this.state.info.gif }}
        
              style={
                this.state.imgLoading
                  ? {
                      width: "100%",
                      display: "none",
                      height: "100%",
                      resizeMode: "contain",
                    }
                  : {
                      width: "100%",
                      display: "flex",
                      height: "100%",
                      resizeMode: "contain",
                    }
              }
            />
          ) : (
            <Video
              source={{ uri: this.state.info.gif }}
              resizeMode="stretch"
              isLooping
              usePoster
              shouldPlay
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {this.state.imgLoading ? (
            <ActivityIndicator size="large" color="#6979f8" />
          ) : (
            <View></View>
          )}
        </View>
        <View style={styles.containerButtons}>
          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Check name="check-square-o" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Series</Text>
              <Text style={{}}>
                {this.state.setup.series ? this.state.setup.series : "1"}
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
                {this.state.setup.repeticiones
                  ? this.state.setup.repeticiones
                  : "1"}
              </Text>
            </View>
          </View>

          {/* <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Wathc
                name="md-stopwatch-outline"
                size={vmin(9)}
                color="#999999"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Tiempo</Text>
              <Text style={{}}>{this.state.info.activeTime || "1"}</Text>
            </View>
          </View> */}
          <TouchableOpacity
            style={styles.box}
            disabled={this.state.playing}
            onPress={() => {
              this.handlePlaySound(this.state.info.voz);
            }}
          >
            <View style={styles.iconContainer}>
              {this.state.playing ? (
                <ActivityIndicator size="large" color="#6979f8" />
              ) : (
                <AntDesign name="sound" size={vmin(9)} color="#999999" />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={{}}>Audio</Text>
              <Text style={{}}>Guía</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.indicatorTextContainer}>
          <Text
            style={{
              fontSize: vmin(4),
              marginBottom: "2%",
              padding: 5,
              backgroundColor: "rgba(105,121,248,0.2)",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Descripción: </Text>{" "}
            {this.state.info.description}
          </Text>
          {this.state.info.materials != "" && (
            <Text
              style={{
                fontSize: vmin(4),
                padding: 7,
                backgroundColor: "rgba(105,121,248,0.2)",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Materiales: </Text>{" "}
              {this.state.info.materials}
            </Text>
          )}
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
    justifyContent: "flex-start",
    alignItems: "center",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "2%",
    //  backgroundColor: "pink",
  },
  indicatorTextContainer: {
    // backgroundColor: "rgba(105,121,248,0.2)",
    borderRadius: 10,
    height: "23%",
    width: "95%",
    justifyContent: "space-evenly",
    padding: vmin(1),
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
    height: "18%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: "2%",
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
