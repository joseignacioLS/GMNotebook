import ListItem from "@/components/ListItem/ListItem";
import Mermaid from "@/components/Mermaid/Mermaid";
import Quote from "@/components/Quote/Quote";
import Spoiler from "@/components/Spoiler/Spoiler";
import Title from "@/components/Title/Title";
import { ReactNode } from "react";

export enum EMatchKeys {
  note = "note:",
  image = "img:",
  link = "link:",
}

interface IRegExpDict {
  [key: string]: RegExp;
}

export const regex: IRegExpDict = {
  insertions: new RegExp("(note:|img:|link:)", "g"),
  noteInsertion: new RegExp("note:[A-Záéíóúüïñ0-9\-äëïöüÄËÏÖÜ]+"),
  linkInsertion: new RegExp("link:[A-Záéíóúüïñ0-9]+=[A-Za-z.,:/\\0-9?=]+"),
  imageInsertion: new RegExp("img:[^\n ]+"),
  title: new RegExp(/^\# /),
  subtitle: new RegExp(/^\#\# /),
  list: new RegExp(/^- /),
  spoiler: new RegExp(/^\* /),
  quote: new RegExp(/^> /),
  mermaid: new RegExp(/'''[A-Za-z0-9\-> \n\;\[\(\)\]]+'''/),
  command: new RegExp(/!:[a-z]+(\([a-z0-9]*\))? /),
};

export interface ISpecialLineConfig {
  regex: RegExp;
  config: {
    component: (...params: any) => ReactNode;
    type: string;
    sliceCount: number;
    extraClasses: string[];
  };
}

export const specialLinesConfig: { [key: string]: ISpecialLineConfig } = {
  title: {
    regex: regex.title,
    config: {
      component: (key, content, wrapped) => (
        <Title key={key} id={key} content={content} wrapped={wrapped} />
      ),
      type: "title",
      sliceCount: 2,
      extraClasses: [],
    },
  },
  subtitle: {
    regex: regex.subtitle,
    config: {
      component: (key, content, wrapped) => (
        <Title
          key={key}
          id={key}
          content={content}
          wrapped={wrapped}
          subtitle={true}
        />
      ),
      type: "subtitle",
      sliceCount: 3,
      extraClasses: [],
    },
  },
  list: {
    regex: regex.list,
    config: {
      component: (key, content, wrapped) => (
        <ListItem key={key} id={key} content={content} wrapped={wrapped} />
      ),
      type: "list",
      sliceCount: 2,
      extraClasses: [],
    },
  },
  spoiler: {
    regex: regex.spoiler,
    config: {
      component: (id, text, wrapped) => (
        <Spoiler key={id} id={id} text={text} wrapped={wrapped} />
      ),
      type: "spoiler",
      sliceCount: 2,
      extraClasses: [],
    },
  },
  mermaid: {
    regex: regex.mermaid,
    config: {
      component: (id, diagram) => <Mermaid key={id} diagram={diagram} />,
      type: "mermaid",
      sliceCount: 0,
      extraClasses: [],
    },
  },
  quote: {
    regex: regex.quote,
    config: {
      component: (key, content, wrapped) => (
        <Quote key={key} id={key} content={content} wrapped={wrapped} />
      ),
      type: "quote",
      sliceCount: 2,
      extraClasses: [],
    },
  },
};

// COMMANDS

export enum ECommands {
  name = "!:name",
  place = "!:place",
  today = "!:today",
  chr = "!:chr",
}
