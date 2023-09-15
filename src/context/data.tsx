import { getTextReferences, splitTextIntoReferences } from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";

export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  baseEntry?: string;
}

export interface textPieceI {
  content: string;
  key?: string;
  visible?: boolean;
  color?: string;
  id?: string;
}

interface contextOutputI {
  data: dataI;
  item: itemI;
  textPieces: textPieceI[];
  updateTextPieces: (cb: (value: textPieceI[]) => textPieceI[]) => void;
  updateData: (value: dataI, reset: boolean) => void;
  addNewEntry: (item: itemI) => void;
  updateItem: (key: string) => void;
  replaceReferencesByDisplay: any;
  includeRerencesInText: any;
  resetData: () => void;
}
export interface dataI {
  [key: string]: itemI;
}

const emptyItem: itemI = {
  title: "Titulo de prueba",
  key: "Key de prueba",
  display: "Display de prueba",
  text: "Texto de prueba Adrian.",
};

export const DataContext = createContext<contextOutputI>({
  data: {},
  item: emptyItem,
  textPieces: [],
  updateTextPieces: (cb: (value: textPieceI[]) => {}) => {},
  updateData: (value: dataI, reset: boolean) => {},
  addNewEntry: (item: itemI) => {},
  updateItem: (key: string) => {},
  replaceReferencesByDisplay: () => {},
  includeRerencesInText: () => {},
  resetData: () => {},
});

const saveToLocalStorage = (value: dataI) => {
  window.localStorage.setItem("data", JSON.stringify(value));
};

const retrieveLocalStorage = () => {
  return window.localStorage.getItem("data") || "{}";
};

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>({});
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [item, setItem] = useState<string>("");

  const updateData = (value: dataI, resetEntry: boolean = true) => {
    setData({});
    setTimeout(() => {
      setData(value);
      if (resetEntry) getBaseEntry(value);
    }, 0);
    saveToLocalStorage(value);
  };

  const resetData = () => {
    // setData({
    //   RootPage: {
    //     title: "RootPage",
    //     text: "",
    //     display: "root",
    //     key: "RootPage",
    //     baseEntry: "1",
    //   },
    // });
    setData({
      NotasDelGM: {
        title: "El crisol del grupo",
        key: "NotasDelGM",
        display: "NotasDelGM",
        text: "Arco de historia de set-up de DnD5e compuesto por [Q1], [Q2] y [Q3].",
        baseEntry: "1",
      },
      Cour: {
        title: "Cour, al sur de Windside",
        key: "Cour",
        display: "Cour",
        text: "Pequeño pueblo costero al sur de Windside. WIP",
      },
      Windside: {
        title: "Windside, capital del reino",
        key: "Windside",
        display: "Windside",
        text: "Windside es la capital de Hearchia, un reino costero en el que conviven todas las razas, aunque con predominancia humana.",
      },
      Carmen: {
        title: "La Exploradora",
        key: "Carmen",
        display: "Exploradora",
        text: "Personaje de Carmen. Es una elfa del bosque.",
      },
      CarmenV: {
        title: "La Hechicera",
        key: "CarmenV",
        display: "Hechicera",
        text: "Personaje de Carmen. Es una Tiefling.",
      },
      Adrian: {
        title: "El Monje",
        key: "Adrian",
        display: "Monje",
        text: "Personaje de Adri. Drow albino, exhiliado del underdark por su condición. Fue acogido en un monasterio, donde se inició en su entrenamiento como monje.",
      },
      Q1: {
        title: "El colgante de la Viuda",
        key: "Q1",
        display: "El colgante de la Viuda",
        text: "[Adrian], [Carmen] y [CarmenV] conforman un trío de aventureros que viajan de ciudad en ciudad en busca de fortuna y oro.<br>Tras días de viaje llegan a la ciudad de [Windside], donde planean pasar unos días resolviendo asuntos locales, adquiriendo nuevo equipo y disfrutando de la gran ciudad. Los guardias y los locales les recomiendan alojarse en [tabernaOlga]. Allí [Olga] les recibe amablemente y si no preguntan ellos les consultará si están buscando trabajo.<br>En la taberna podrán ver a [Viuda], que pide ayuda para recuperar el [colganteUmberlee] de su marido fallecido hace poco.<br>El colgante se encuentra junto al cuerpo del marido, en la [criptaWindside]. Para acceder a la catedral hay que superar al guarda que la vigila o encontrar una entrada alternativa. Una vez dentro hay que acceder a la zona pudiente, donde los cadáveres de la gente rica se guardan, lo que requiere atravesar una puerta cerrada.<br>Superado este obstáculo, puede buscarse el colgante, pero una vez encontrado los muertos comenzarán a levantarse y atacar a la party.",
      },
      Olga: {
        title: "Olga, la tabernera",
        key: "Olga",
        display: "Olga",
        text: "Es una orca de gran tamaño, algo intimidante. Su cabeza está rapada y sus dos colmillos inferiores salen de su boca, sobre todo cuando sonrie. Viste ropajes de trabajo, con un delantal y un trapo al hombro. Es la dueña de y regenta [tabernaOlga], y además hace de enlace entre los grupos de aventureros y los locales, apuntando los posibles trabajos y repartiendolos entre los grupos.",
      },
      tabernaOlga: {
        title: "El barril de Olga",
        key: "tabernaOlga",
        display: "El barril de Olga",
        text: "La taberna de Olga es el lugar de referencia para los aventureros de [Windside], e incluso el reino entero.",
      },
      Viuda: {
        title: "La Viuda",
        key: "Viuda",
        display: "Viuda",
        text: "Humana de aspecto muy afligido. Viste totalmente de negro y sus ojos muestran los signos de haber estado llorando sin parar. Forma parte de la secta de Umberlee, y conseguirle el colganteUmberlee hará posible el ritual de Windside.",
      },
      colganteUmberlee: {
        title: "El Colgante de Umberlee",
        key: "colganteUmberlee",
        display: "colgante",
        text: "Colgante de la deidad [Umberlee]",
      },
      criptaWindside: {
        title: "Cripta de la catedral",
        key: "criptaWindside",
        display: "Cripta de la catedral de Windside",
        text: "Criptas bajo la catedral de [Windside]. Se accede por un portón en el lateral del edificio, normalmente custodiado por guardias, que da lugar a unas escaleras. Al descender se accede a una gran sala, levemente iluminada por antorchas en las paredes, repleta de mesas de piedra donde yacen los cuerpos de los muertos. Hay una zona donde se custodian los cuerpos de las familias de bien, protegida tras un enrejado, y donde también se encuentran algunos sepulcros.",
      },
      Q2: {
        title: "Los kobolds del bosque",
        key: "Q2",
        display: "Los kobolds del bosque",
        text: "La party viaja desde [Windside] a [Cour], cuando cruzando el bosque se encuentran con un carromato siendo asaltado por un grupo de Kobolds. El objetivo de su ataque es un [comerciante], que tras ser rescatado hablará del enfado que tiene por el estado de los caminos del bosque que ya no son seguros.<br>Más adelante llegan a [posadaBosque]. Allí, tanto la tabernera como los huéspedes confirman que cada vez es más peligroso cruzar los bosques, y que estarían dispuestos a recompensar a aquellos que acabaran con estos malditos kobolds.",
      },
      comerciante: {
        title: "Comerciante asaltado",
        key: "comerciante",
        display: "comerciante",
        text: "Un humano con signos de vejez ya. Viste con buenas ropas, aunque gastadas. Lleva toda la vida en los caminos, transportando mercancías y comerciando con ellas. Está muy indignado por el estado de los cominos del bosque.",
      },
      posadaBosque: {
        title: "El Carro Cansado",
        key: "posadaBosque",
        display: "El Carro Cansado",
        text: "Una alegre posada en los caminos del bosque entre [Cour] y [Windside]. Se encuentra a pie del camino, en un pequeño claro entre los árboles. Es un edificio de madera de 2 plantas con espacio para dejar carromatos y caballos en el exterior y amplio porche. El interior es acogedor y los precios no son extremadamente caros. Está regentada por la enana Ila, y su marido Ek.",
      },
      Q3: {
        title: "El pescador desconsolado",
        key: "Q3",
        display: "El pescador desconsolado",
        text: "[Olga] pide a la party que viaje a [Cour] para localizar a una niña desaparecida hace unas semanas sin idea de como.",
      },
      Umberlee: {
        title: "Umberlee",
        key: "Umberlee",
        display: "Umberlee",
        text: "Umberlee es la diosa del mar, una maliciosa entidad que busca el caos y el sacrificio como máxima.",
      },
    });
    setItem("NotasDelGM");
  };

  const addNewEntry = (item: itemI) => {
    setData((oldValue) => {
      return { ...oldValue, item };
    });
  };

  const replaceReferencesByDisplay = (text: string) => {
    text = includeRerencesInText(text);
    Object.keys(data).forEach((key: string) => {
      text = text.replace(new RegExp(`\\[${key}\\]`, "g"), data[key].display);
    });
    text = text.replace(/<br>/g, " ");
    return text;
  };

  const includeRerencesInText = (text: string, excludeRefs: string[] = []) => {
    Object.keys(data).forEach((key: string) => {
      if (excludeRefs.includes(key)) return;
      const regex = new RegExp(`(^|[ ])(${key})([ \.,\-])`, "g");
      text = text?.replace(regex, `$1[$2]$3`) || "";
    });
    return text;
  };

  const getBaseEntry = (data: dataI) => {
    setItem(
      Object.keys(data).find((key: string) => {
        return data[key].baseEntry === "1";
      }) || ""
    );
  };

  useEffect(() => {
    const retrieved = retrieveLocalStorage();
    try {
      const parsed = JSON.parse(retrieved) as dataI;
      console.log(parsed);
      setData(parsed);
      getBaseEntry(parsed);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (!data?.[item]) return;
    const referenceText = data[item].text;
    const references = getTextReferences(referenceText);
    if (!references) return setTextPieces([]);
    const refes = splitTextIntoReferences(references, referenceText);
    setTextPieces(refes);
  }, [item, data]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[item] || emptyItem,
        textPieces,
        updateTextPieces: setTextPieces,
        updateData,
        addNewEntry,
        updateItem: setItem,
        replaceReferencesByDisplay,
        includeRerencesInText,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
