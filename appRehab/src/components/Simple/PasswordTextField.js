import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Password(props) {
  const [value, onChangeText] = React.useState(props.value);
  const [visible, setVisibility] = React.useState(false);

  const icon = !visible ? "eye-slash" : "eye";
  const height = props.height;
  const width = props.width;

  return (
    <View
      style={{
        display: "flex",
        width: width,
        marginVertical: 5,
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={{
            height: height,
            flex: 1,
            alignSelf: "stretch",
            paddingHorizontal: 10,
          }}
          onChangeText={(text) => {
            onChangeText(text);
            props.onChange(text);
          }}
          value={value}
          placeholder={props.label}
          secureTextEntry={!visible}
        />
        <TouchableOpacity style={[styles.icons, { height: height, width: height }]}>
          <Icon
            name={icon}
            color={"#808080"}
            size={24}
            onPress={() => setVisibility(!visible)}
           
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

Password.defaultProps = {
  label: "",
  height: 20,
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    borderColor: "#e3e3e3",
    borderWidth: 1,
    borderRadius: 4,
  },
  icons: {
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems:"center",
    // marginBottom:"10%",
    // marginTop:"10%",
   // marginRight:"1%",
    borderRadius: 4,
  },
});
