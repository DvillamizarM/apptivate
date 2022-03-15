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
          height: 40,
          width: 40,
          // elevation: 5,
        }}
      >
        {/* <View style={{marginBottom:"3%", marginLeft:"4%"}}> */}
        <Image
          source={require("../../assets/images/apptivateLogo.png")}
          style={{
            width: "100%",
            height: "100%",
            marginLeft: "30%",
            marginBottom: "10%",
            borderRadius: 10,
          }}
        />
        {/* </View> */}
      </View>
  );
}
export default Logo;
