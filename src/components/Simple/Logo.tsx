import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

function Logo() {
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
      <Image
        source={require("../../assets/images/apptivateLogo.png")}
        style={{
          width: "100%",
          height: "100%",
          marginLeft: "20%",
          marginBottom: "10%",
          borderRadius: 50,
        }}
      />
      {/* </View> */}
    </View>
  );
}
export default Logo;
