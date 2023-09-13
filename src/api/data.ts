
export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  baseEntry?: string;
}

export interface referenceI {
  key: string;
  index: number;
  id: string;
  data: itemI;
  visible: boolean;
  color: string;
}

export const data: { [key: string]: itemI } = {
  Q1: {
    title: "El pescador desconsolado",
    key: "Q1",
    display: "hehe",
    text: `La party llega a Windside y en busca de descanso acaba en la tabernaOlga. Allí, Olga les sugiere que si necesitan dinero pueden viajar a Cour, para ayudar en la búsqueda de una niña desaparecida.`,
  },
  Olga: {
    title: "Olga, la tabernera",
    key: "Olga",
    display: "Olga",
    text: "Olga es la dueña de tabernaOlga.",
  },
  Cour: {
    title: "Cour, al sur de Windside",
    key: "Cour",
    display: "Cour",
    text: "Pequeño pueblo costero al sur de Windside"
  },
  Windside: {
    title: "Windside, capital del reino",
    key: "Windside",
    display: "Windside",
    text: "Windside es la capital de Hearchia, un "
  },
  tabernaOlga: {
    title: "El barril de Olga",
    key: "tabernaOlga",
    display: "El barril de Olga",
    text: "La taberna de Olga es el lugar de referencia para los aventureros de Windside, e incluso el reino entero."
  }
};