import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

function SurveyButton(props) {
  const layout = useWindowDimensions();
  return (
    <View
      style={{
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <View style={{marginBottom:"3%", marginLeft:"4%"}}> */}
      <TouchableOpacity
        style={{
          height: "85%",
          width: "90%",
          backgroundColor: "rgba(225, 126, 62,1)",
          borderRadius: 5,
          justifyContent: "center",
          alignItems:"center",
          marginLeft: "5%",
          marginRight: "15%",
        }}
        onPress={props.navigation.navigate("SatisfactionSurvey")}
      >
      <Image
        source={require("../../assets/images/feedback.png")}
        style={{
          width: "90%",
          height: "90%",
          marginBottom: "10%",
        }}
      />
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
}
export default SurveyButton;

