import Reference from "@/components/Page/Reference";
import {
  EMatchKeys,
  ISpecialLineConfig,
  specialLinesConfig,
} from "./constants";
import { splitLineByInsertions } from "./text";
import { IReference } from "@/context/constants";
import Image from "@/components/Page/Image";

export interface IInsertionObject {
  innerHTML: string;
  key?: string;
  id?: string;
}

const generateItemFromMatch = (
  matchKey: string,
  key: string,
  id: string,
  plain: boolean
) => {
  if (matchKey === EMatchKeys.note) {
    return (
      <Reference
        key={id}
        reference={
          {
            id,
            visible: true,
            key,
          } as IReference
        }
        naked={plain}
      ></Reference>
    );
  } else if (matchKey === EMatchKeys.image) {
    return <Image key={id} src={key} />;
  } else if (matchKey === EMatchKeys.link) {
    const [text, href] = key.match(/^([^=]+)=(.+)$/)?.slice(1, 3) || ["", ""];
    return (
      <a key={id} href={href} target="_blank">
        {text}
      </a>
    );
  }
  return <>{key}</>;
};

const isInsideSpoiler = (element: any): boolean => {
  const parent = element.parentElement;
  if (!parent) return false;
  if (parent.id === "text") return false;
  if (parent.className.includes("spoiler")) return true;
  return isInsideSpoiler(parent);
};

export const checkIfVisible = (itemKey: string, canEdit: boolean) => {
  const items = Array.from(
    document.querySelectorAll(`#text .reference${itemKey}`)
  );
  return items.some((item) => {
    // if canEdit is false means that we are in shared mode
    // and therefore, notes inside spoilers should not be
    // shown in the reference list
    if (!canEdit && isInsideSpoiler(item)) return false;
    const boundingRect = item.getBoundingClientRect();
    if (!boundingRect) return false;
    const notesContainer = document.querySelector("#text") as any;
    const titleSpace = 80;
    return (
      boundingRect.top >= titleSpace &&
      boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
    );
  });
};

const formatSpecialLine = (
  line: string,
  index: number,
  plain: boolean,
  wrapped: boolean,
  config: ISpecialLineConfig["config"]
) => {
  if (config.type === "mermaid") {
    return config.component?.(line, `${line.replace(/'/g, "")}`);
  }
  const key = `p-${index}`;
  const content: any = processLine(
    line.slice(config.sliceCount),
    index,
    plain,
    true
  );
  if (config.component) return config.component(key, content, wrapped);
  return (
    <span
      key={key}
      className={`text-${config.type} ${config.extraClasses.join(" ")} text ${
        !wrapped && "paragraph"
      }`}
    >
      {content}
    </span>
  );
};

const formatSplittedLine = (
  lineByInsertions: IInsertionObject[],
  plain: boolean
) => {
  return lineByInsertions.map((item: any) => {
    if (item.id === undefined) return item.innerHTML;
    return generateItemFromMatch(item.innerHTML, item.key, item.id, plain);
  });
};

export const processLine = (
  line: string,
  index: number,
  plain: boolean,
  wrapped: boolean = false
) => {
  for (let key in specialLinesConfig) {
    const { regex, config } = specialLinesConfig[key];
    if (line.match(regex)) {
      return formatSpecialLine(line, index, plain, wrapped, config);
    }
  }
  const lineByInsertions = splitLineByInsertions(line, index);
  const formatedLine = formatSplittedLine(lineByInsertions, plain);

  return (
    <span
      key={line + index}
      className={`text ${!wrapped && "paragraph"}`}
      {...(!wrapped ? { id: `p-${index}` } : {})}
    >
      {formatedLine}
    </span>
  );
};
