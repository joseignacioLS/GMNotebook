import Reference from "@/components/Page/Reference";
import { EMatchKeys, specialLinesConfig } from "./constans";
import { splitLineByInsertions } from "./text";
import { IReference } from "@/context/constants";
import Image from "@/components/Page/Image";
import Mermaid from "@/components/Mermaid/Mermaid";

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

export const checkIfVisible = (itemKey: string) => {
  const items = Array.from(
    document.querySelectorAll(`#text .reference${itemKey}`)
  );
  return items.some((item) => {
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
  config: { type: string; sliceCount: number }
) => {
  if (config.type === "mermaid") {
    // return <span key={line}>{line}</span>;
    return <Mermaid key={line} diagram={`${line.replace(/'/g, "")}`} />;
    // return <div className="mermaid">{`graph TD; ${line.replace(/'/g, "")}`}</div>;
  }
  if (wrapped) {
    return (
      <span key={line} id={`p-${index}`} className={`text-${config.type}`}>
        {processLine(line.slice(config.sliceCount), index, plain, true)}
      </span>
    );
  }
  return (
    <p key={line} id={`p-${index}`} className={`text-${config.type}`}>
      {processLine(line.slice(config.sliceCount), index, plain, true)}
    </p>
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

  return wrapped ? (
    <span key={line + index}>{formatedLine}</span>
  ) : (
    <p key={line + index} id={`p-${index}`}>
      {formatedLine}
    </p>
  );
};
