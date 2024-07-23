import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import { NavigationContext } from "@/context/navigation";
import React, { useContext, useState } from "react";

import styles from "./modalshare.module.scss";

enum EStatus {
  PREREQUEST,
  REQUESTED,
  CONFIRMED,
  EMAIL_ERROR,
  REQUEST_ERROR,
  CONFIRM_ERROR,
}

const feedback: Record<EStatus, string> = {
  [EStatus.PREREQUEST]:
    "In order to confirm the sharing request, please provide an email.",
  [EStatus.EMAIL_ERROR]: "The provided email is not valid",
  [EStatus.REQUESTED]:
    "Check your inbox for the confirmation code. IMPORTANT: Sharing this one will disable any previous share links",
  [EStatus.CONFIRMED]: "Here is your confirmation link:",
  [EStatus.REQUEST_ERROR]: "There was an error, please try again",
  [EStatus.CONFIRM_ERROR]: "There was an error, please try again",
};

export const ModalShare = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<EStatus>(EStatus.PREREQUEST);
  const [loading, setLoading] = useState(false);

  const { data, updateData } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  const { closeModal } = useContext(modalContext);

  const handleRequestShare = async () => {
    try {
      if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        setStatus(EStatus.EMAIL_ERROR);
        return;
      }
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}create`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (!res.ok) {
        setStatus(EStatus.REQUEST_ERROR);
        return;
      }
      const respData = await res.json();
      if (respData.status !== 200) {
        setStatus(EStatus.REQUEST_ERROR);
        return;
      }
      setStatus(EStatus.REQUESTED);
    } catch (err) {
      setLoading(false);
      setStatus(EStatus.EMAIL_ERROR);
    }
  };

  const handleConfirmShare = async () => {
    try {
      if (!code.match(/^[a-zA-Z0-9]+$/)) {
        setStatus(EStatus.CONFIRM_ERROR);
        return;
      }
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}confirm`, {
        method: "POST",
        body: JSON.stringify({ email, code, data }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (!res.ok) {
        setStatus(EStatus.CONFIRM_ERROR);
        return;
      }
      const respData = await res.json();
      if (respData.status !== 200) {
        setStatus(EStatus.CONFIRM_ERROR);
        return;
      }
      setStatus(EStatus.CONFIRMED);

      const link = `${window.location.origin}?data=${respData.data}`;

      updateData(
        {
          "temporal share": {
            key: "temporal share",
            title: "Temporal sharing",
            display: "",
            text: `This is your share link:\n\n ${link}\n\n- It will last for 7 days\n- This is just a picture of the current state of your notebook, in order to update it you will need to share again your notebook updated.`,
            showInTree: false,
            showInTabs: false,
          },
        },
        false,
        false,
        true
      );
      setTimeout(() => {
        closeModal();
        navigateTo("temporal share");
      }, 0);
    } catch (err) {
      setLoading(false);
      setStatus(EStatus.CONFIRM_ERROR);
    }
  };
  return (
    <div className={styles.modal}>
      <h2>Share your Notebook</h2>
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        disabled={![EStatus.PREREQUEST, EStatus.EMAIL_ERROR].includes(status)}
        label="Email"
      />
      {[EStatus.PREREQUEST, EStatus.EMAIL_ERROR].includes(status) && (
        <Button onClick={handleRequestShare} disabled={loading}>
          Send me a confirmation code
        </Button>
      )}
      {[EStatus.REQUESTED, EStatus.CONFIRM_ERROR].includes(status) && (
        <>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label={"Code"}
          />
          <Button onClick={handleConfirmShare} disabled={loading}>
            Confirm share
          </Button>
        </>
      )}
      <p className={styles.feedback}>{feedback[status]}</p>
    </div>
  );
};
