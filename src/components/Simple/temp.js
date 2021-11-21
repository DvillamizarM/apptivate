
  const protocol = [
    { title: "Fase Preprotésica", key: "preprotesico" },
    {
      title: "Fase Protésica",
      key: "protesico",
    },
  ];

  const basicPhaseExercises = async (exercises) => {
    const promises = exercises.map(async (Item) => {
      const numItem = await Item.get();
      return numItem;
    });

    return new Promise(async (resolve, reject) => {
      const numItems = await Promise.all(promises);

      resolve(numItems.map((e) => e.data()));
    });
  };

  const getBasicData = async () => {
    let dbRef = firebase.db
      .collection("protocol")
      .doc("protesico")
      .collection("basic");

    return dbRef.get().then(async (querySnapshot) => {
      const promises = querySnapshot.docs.map(async (doc) => {
        let ejerciciosXfase = Object.values(doc.data());
        let res = basicPhaseExercises(ejerciciosXfase);
        return res;
      });

      const arrayBasicExercises: any = await Promise.all(promises);

      let Array: any = [];

      const promises2 = querySnapshot.docs.map(async (doc, i) => {
        // doc.data() is never undefined for query doc snapshots
        Array.push({
          title1:
            doc.id == "cooldown"
              ? "Enfriamiento"
              : doc.id == "stretch"
              ? "Estiramiento"
              : "Calentamiento",
          collection: [
            {
              title2: "",
              exerciseCollection: arrayBasicExercises[i].map((e, j) => {
                // console.log(
                //   "3838383838383838383838888383838383838383383833838383838383833838383,",
                //   e
                // );
                return {
                  day: "Ejercicio " + (j - -1),
                  time: e.activeTime || "",
                  multimedia: e.gif,
                  materials: e.materials || false,
                  data: { ...e },
                };
              }),
            },
          ],
        });
      });

      //console.log("resultado #1", Array, " anres estaba", information);
      return Array;
    });
  };

  const getInformationWeeks = async () => {
    
    let Array: any = [];
    let array2: any = [];
    let ArraySetup: any = [];

    for (let index = 0; index < 1; index++) {
      let dbRef = firebase.db
        .collection("protocol")
        .doc("protesico")
        .collection("week" + (index + 1))
        .doc("active");

      let res2 = await dbRef.get();
      let ejerciciosXfase = Object.values(res2.data());
      let res = await basicPhaseExercises(ejerciciosXfase);
      // console.log("ooooooooooo", res);
      array2.push(res);

      // Aqui se pide el setup por semanas
      let refSetup = firebase.db
        .collection("protocol")
        .doc("protesico")
        .collection("week" + (index + 1))
        .doc("setup");

      let getSetup = await refSetup.get();
      let setupValues = getSetup.data();
      // console.warn(
      //   "Setup Setup Setup Setup Setup Setup Setup Setup Setup ",
      //   setupValues
      // );
      ArraySetup.push(setupValues);
    }

    let map2 = array2.map((element, index) => {
      Array.push({
        title1: index <= 3 ? "Fase inicial" : "Fase intermedia",
        collection: [
          {
            title2: "Semana " + index + 1,
            exerciseCollection: element.map((e, j) => {
              return {
                day: "Ejercicio " + (j - -1),
                time: e.activeTime || "",
                multimedia: e.gif,
                materials: e.materials || false,
                data: { ...e, ...ArraySetup[j] },
              };
            }),
          },
        ],
      });
    });

    //  console.log("resultado #2", Array, " anres estaba", information);
    return Array;
  };


  exercise rotone reducer------- Array [
    Object {
      "collection": Array [
        Object {
          "exerciseCollection": Array [
            Object {
              "data": Object {
                "description": "Ubicarse en medio dos sillas, apoyarse en ellas y balancear la pierna con prótesis hacia adelante y atrás.",
                "gif": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/BALANCEO%203-4(active1).gif?alt=media&token=68dcf765-1fd4-4091-9c64-9fcd8c469a6f",      
                "materials": "example",
                "repetitions": 10,
                "restTimeMin": 2,
                "restTimeSec": 0,
                "routinePhase": "Activa",
                "series": 2,
                "voz": "cloudstorageID",
              },
              "day": "Ejercicio 1",
              "gif": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicial0",
              "materials": "example",
              "multimedia": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicial0",
              "serie": Object {
                "data": Object {
                  "description": "Ubicarse en medio dos sillas, apoyarse en ellas y balancear la pierna con prótesis hacia adelante y atrás.",
                  "gif": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/BALANCEO%203-4(active1).gif?alt=media&token=68dcf765-1fd4-4091-9c64-9fcd8c469a6f",    
                  "materials": "example",
                  "repetitions": 10,
                  "restTimeMin": 2,
                  "restTimeSec": 0,
                  "routinePhase": "Activa",
                  "series": 2,
                  "voz": "cloudstorageID",
                },
                "day": "Ejercicio 1",
                "materials": "example",
                "multimedia": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/BALANCEO%203-4(active1).gif?alt=media&token=68dcf765-1fd4-4091-9c64-9fcd8c469a6f",
                "time": "",
              },
              "time": "",
              "voz": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicialAudio0",
            },
            Object {
              "data": Object {
                "description": "Ubicarse en medio dos sillas, apoyarse en ellas e inclinar el cuerpo para hacer cargas de peso sobre los miembros inferiores. Mantener la posición por 10 segundos en cada lado.",
                "gif": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/MOVIMIENTO%20LADOS%20FRONTAL%20(active1).gif?alt=media&token=ebe4fa0a-7ffa-4dd5-abf7-07d09c0d5021",
                "routinePhase": "Activa",
                "voz": "cloudstorageID",
              },
              "day": "Ejercicio 2",
              "gif": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicial1",
              "materials": false,
              "multimedia": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicial1",
              "serie": Object {
                "data": Object {
                  "description": "Ubicarse en medio dos sillas, apoyarse en ellas e inclinar el cuerpo para hacer cargas de peso sobre los miembros inferiores. Mantener la posición por 10 segundos en cada lado.",
                  "gif": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/MOVIMIENTO%20LADOS%20FRONTAL%20(active1).gif?alt=media&token=ebe4fa0a-7ffa-4dd5-abf7-07d09c0d5021",
                  "routinePhase": "Activa",
                  "voz": "cloudstorageID",
                },
                "day": "Ejercicio 2",
                "materials": false,
                "multimedia": "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/MOVIMIENTO%20LADOS%20FRONTAL%20(active1).gif?alt=media&token=ebe4fa0a-7ffa-4dd5-abf7-07d09c0d5021",
                "time": "",
              },
              "time": "",
              "voz": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540danivillamizar%252Fapptivate/Fase inicialAudio1",
            },
          ],
          "title2": "Semana 01",
        },
      ],
      "title1": "Fase inicial",
    },
  ]