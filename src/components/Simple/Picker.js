import React from "react";
import { TextInput, View, StyleSheet, Text, Modal,  TouchableOpacity, ScrollView} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";


export default function Picker(props) {
  let temp =""
  let temp2 = ""
  props.initialValue ? temp = props.initialValue : temp = props.placeholder
  props.initialIndex ? temp = props.list[props.initialIndex] : temp2 = 0
  const [value, setValue] = React.useState(temp);
  const [show, setShow] = React.useState(false);
  const [itemHeight, setItemHeight] = React.useState(0)

  // const icon = !visible ? "eye-slash" : "eye";
  const height = props.height;
  const width = props.width;

  
  return (
    <View
      style={{
        display: "flex",
        width: width,
        marginVertical: 5,
        borderRadius:10,
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        onBackdropPress={() => console.log("Pressed")}
        visible={show}
        propagateSwipe={true}
        onRequestClose={() => {
          setShow(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius:10,
            minHeight: "100%",
            alignItems: "center",
            backgroundColor: "rgba(244,244,244,0.7)",
          }}
        >
          {props.list.map((element, index) => {
            return (
              <View
                key={element + index}
                style={{
                  // position: "absolute",
                  backgroundColor: "#ffffff",
                  // borderRadius: 20,
                  alignSelf: "center",
                  width: "80%",
                  height: "8%",
                }}
              >
                {/* <ScrollView> */}
                <View
                  style={{
                    height: "96%",
                    width: "100%",
                   // backgroundColor: "yellow",
                  }}
                >
                  <TouchableOpacity
                    style={{
                     // backgroundColor: "green",
                      width: "100%",
                      justifyContent:"center",
                      height: "100%",

                    }}
                    onPress={() => {
                     console.warn("clicked====", element)
                     props.setData(element,index )
                      setValue(element)
                      setShow(false);
                    }}
                  >
                    <Text
                      style={{
                       textAlignVertical:"center", 
                       marginLeft:"5%",
                      }}
                    >
                      {element}
                      {(props.percentajes && element !=="Seleccionar")? "%":""}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* </ScrollView> */}
              </View>
            );
          })}
        </View>
      </Modal>
      <View style={[styles.container,{ height:height}]}>
        <TouchableOpacity
          style={{ minWidth: "100%", height:height}}
          disabled={props.disabled ? true : false}
          onPress={() => {
            setShow(true);
          }}
        >
          <View style={{ width: "100%", height: height, flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: "90%",

                flex: 1,
                alignSelf: "stretch",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  textAlignVertical: "center",
                  color: "#000000",
                }}
              >
               {value}{(props.percentajes && value !=="Seleccionar")? "%":""}</Text>
            </View>
            <View style={{ width: "15%", height: "100%" }}>
              <View style={styles.icons}>
                <Icon
                  style={{ paddingBottom: 8 }}
                  name={"sort-down"}
                  color={"#808080"}
                  size={24}
                  
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width:"100%",
  //  alignSelf: "stretch",
    borderColor: "#e3e3e3",
  //  / minHeight: "100%",
    borderWidth: 1,
    //backgroundColor:"orange",
    borderRadius: 4,
  },
  icons: {
    //   backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderRadius: 4,
  },
});
