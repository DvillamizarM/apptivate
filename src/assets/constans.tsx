var { vmin } = require("react-native-expo-viewport-units");
import React from "react";

import { Text, View } from "react-native";
//Variables de configuracion
//Indica la cantidad de tiendas que se pueden adicionar al carrito
const cantidadDeTiendas = 3;
export const Dev = "enable";
//https://www.bego.com.co/
export const begoLink =
  "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x62\x65\x67\x6F\x2E\x63\x6F\x6D\x2E\x63\x6F\x2F";
export const images = begoLink + "images";
export const imgServices = begoLink + "/images/services/";

//Variabes que se utilizan para pruebas
export const ShowStoryIndicators = false;

//Remplaza el link de las imagenes por si desde la base de datos viene con la ruta de BeGo
export const replaceSrcLink = (file: string) => {
  let rem = begoLink + "images";
  let src = file.replace(rem, "");
  let img = begoLink + `images${src}`;
  return img;
};

//Funcion que reemplaza el formato y carpeta de las imagenes de categoria que viene de la base de datos
export const replaceSrcCategoriImage = (file: string) => {
  let rem = "categoria";
  let src = file.replace(rem, "categoriaPNG").replace(".svg", ".png");
  let img = `${begoLink}/${src}`;
  return img;
};

export const FormatoFecha = (inicio: any) => {
  let dia =
    new Date(inicio * 1000).getDate() < 10
      ? "0" + new Date(inicio * 1000).getDate()
      : new Date(inicio * 1000).getDate();
  let mes =
    new Date(inicio * 1000).getMonth() + 1 < 10
      ? "0" + (new Date(inicio * 1000).getMonth() + 1)
      : new Date(inicio * 1000).getMonth() + 1;
  return dia + "-" + mes + "-" + new Date(inicio * 1000).getFullYear();
};

export const FormatoHora = (ped_inicio) => {
  let horas = new Date(ped_inicio * 1000).getHours();

  return horas > 12
    ? horas -
    12 +
    ":" +
    (new Date(ped_inicio * 1000).getMinutes() < 10
      ? "0" + new Date(ped_inicio * 1000).getMinutes()
      : new Date(ped_inicio * 1000).getMinutes()) +
    " PM"
    : horas +
    ":" +
    (new Date(ped_inicio * 1000).getMinutes() < 10
      ? "0" + new Date(ped_inicio * 1000).getMinutes()
      : new Date(ped_inicio * 1000).getMinutes()) +
    " AM";
};

export const FontFamily = () => {
  let funte = "Quicksand-Regular";
  return funte;
};
export const FontFamilyBold = () => {
  let funte = "Quicksand-Bold";
  return funte;
};
export const FontLetter = () => {
  let letter = -0.8;
  return letter;
};

export const cantidadPermitida = (cart, key) => {
  let split = key.split("-") || [0, 0, 0, 0];
  let temp = JSON.parse(JSON.stringify(cart));
  if (!temp[split[1]]) {
    temp[split[1]] = {};
  }
  temp[split[1]][split[3]] = {};

  if (itsAnObject(temp)) {
    return Object.keys(temp).length <= cantidadDeTiendas;
  } else {
    return false;
  }
};

export const nameFontSize = (name: string) => {
  let nameSize = vmin(7);
  if (name) {
    let longitudNombre = name.length;

    if (longitudNombre >= 5 && longitudNombre < 10) {
      nameSize = vmin(5.5);
    } else if (longitudNombre >= 10 && longitudNombre < 20) {
      nameSize = vmin(5);
    } else if (longitudNombre >= 20 && longitudNombre < 30) {
      nameSize = vmin(4.5);
    } else if (longitudNombre >= 30 && longitudNombre < 40) {
      nameSize = vmin(4.2);
    } else if (longitudNombre >= 40 && longitudNombre < 50) {
      nameSize = vmin(4);
    } else if (longitudNombre >= 50) {
      nameSize = vmin(3.5);
    }
  }

  return nameSize;
};
export const nameFontSizeDiversidad = (name: string) => {
  let nameSize = vmin(3.8);
  if (name) {
    let longitudNombre = name.length;

    if (longitudNombre >= 3 && longitudNombre < 10) {
      nameSize = vmin(3.8);
    } else if (longitudNombre >= 10 && longitudNombre < 15) {
      nameSize = vmin(3.3);
    } else if (longitudNombre >= 15 && longitudNombre < 25) {
      nameSize = vmin(2.8);
    } else if (longitudNombre >= 25 && longitudNombre < 30) {
      nameSize = vmin(2.3);
    } else if (longitudNombre >= 30 && longitudNombre < 40) {
      nameSize = vmin(2);
    } else if (longitudNombre >= 40) {
      nameSize = vmin(1.8);
    }
  }

  return nameSize;
};
export const itsAnObject = (element) => {
  return typeof element == "object";
};

export const containerTextQuestions = (child: any) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          textAlign: "right",
        }}
      >
        ¿
      </Text>
      {child}
      <Text
        style={{
          textAlign: "left",
        }}
      >
        ?
      </Text>
    </View>
  );
};

export const FormatoHora2 = (hora: string) => {
  if (hora) {
    let h = hora.substr(0, 2);
    let m = hora.substr(3, 2);
    if (parseInt(h) >= 12) {
      if (parseInt(h) == 12) {
        return h.concat(":", m, " pm");
      } else {
        let ho = (parseInt(h) - 12).toString();
        return ho.concat(":", m, " pm");
      }
    } else {
      if (parseInt(h) == 0) {
        return "12".concat(":", m, " am");
      } else {
        return h.concat(":", m, " am");
      }
    }
  } else {
    return "cargando";
  }
};

export const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
