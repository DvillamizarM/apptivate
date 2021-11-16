import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import Logo from "./Logo";
var { vmin } = require("react-native-expo-viewport-units");

function ChargeScreen() {
  const layout = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        height: "100%",
        minHeight:"100%",
        width: "100%",
        //backgroundColor: "salmon",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 150,
            width: 150,
            justifyContent: "center",
           // backgroundColor: "salmon",
            alignItems: "center",
          }}
        >
          {/* <View style={{marginBottom:"3%", marginLeft:"4%"}}> */}
          <Image
            source={require("../../assets/images/apptivateLogo.png")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 50,
            }}
          />
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: vmin(8),
            color: "rgba(153, 153, 153, 1)",
            marginTop: "5%",
          }}
        >
          Cargando
        </Text>
        <ActivityIndicator size="large" color="#6979f8" />
      </View>

    </View>
  );
}
export default ChargeScreen;
