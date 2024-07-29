import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import { NavigationContext } from "@/context/navigation";
import React, { useContext, useEffect, useState } from "react";

import styles from "./modalshare.module.scss";
import { confirmShareRequest, createShareRequest } from "@/services/share";
import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import Spinner from "@/components/Spinner/Spinner";

enum EStatus {
  PREREQUEST,
  EMAIL_ERROR,
  REQUESTED,
  REQUEST_ERROR,
  CONFIRM_ERROR,
}

const feedbackTexts: Record<EStatus, string> = {
  [EStatus.PREREQUEST]:
    "In order to confirm the sharing request, please provide an email. If you already have a code, please provide the email and the code",
  [EStatus.EMAIL_ERROR]: "The provided email is not valid",
  [EStatus.REQUESTED]:
    "Check your inbox for the confirmation code. IMPORTANT: Sharing this one will disable any previous share links",
  [EStatus.REQUEST_ERROR]: "There was an error, please try again",
  [EStatus.CONFIRM_ERROR]: "There was an error, please try again",
};

export const ModalShare = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<EStatus>(EStatus.PREREQUEST);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(feedbackTexts[EStatus.PREREQUEST]);

  const { data, updateData } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  const { closeModal } = useContext(modalContext);

  const handleRequestShare = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const emailCheck = email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      );
      if (emailCheck === null) {
        setStatus(EStatus.EMAIL_ERROR);
        return;
      }
      setLoading(true);
      await createShareRequest(email);
      setLoading(false);
      setStatus(EStatus.REQUESTED);
      setFeedback(feedbackTexts[EStatus.REQUESTED]);
    } catch (err: any) {
      setLoading(false);
      setStatus(EStatus.REQUEST_ERROR);
      setFeedback(err.message);
    }
  };

  const handleConfirmShare = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (!code.match(/^[0-9]{4}$/)) {
        setStatus(EStatus.CONFIRM_ERROR);
        return;
      }
      setLoading(true);
      saveToLocalStorage({ email }, "user-email");

      const gameCode = await confirmShareRequest(email, code, data);
      setLoading(false);
      openSharePage(gameCode);
    } catch (err: any) {
      setLoading(false);
      setStatus(EStatus.CONFIRM_ERROR);
      setFeedback(err.message);
    }
  };

  const openSharePage = (gameCode: string) => {
    const link = `${window.location.origin}?data=${gameCode}`;

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
  };

  const handleAlreadyHaveCode = () => {
    const emailCheck = email.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    if (emailCheck === null) {
      setStatus(EStatus.EMAIL_ERROR);
      return;
    }
    setStatus(EStatus.REQUESTED);
  };

  useEffect(() => {
    const retrievedEmail = JSON.parse(retrieveLocalStorage("user-email")).email;
    if (!retrievedEmail) return;
    setEmail(retrievedEmail);
  }, []);

  return (
    <form className={styles.modal}>
      <h2>Share your Notebook</h2>
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        disabled={
          ![
            EStatus.PREREQUEST,
            EStatus.EMAIL_ERROR,
            EStatus.REQUEST_ERROR,
          ].includes(status)
        }
        label="Email"
        type="email"
      />
      {[
        EStatus.PREREQUEST,
        EStatus.EMAIL_ERROR,
        EStatus.REQUEST_ERROR,
      ].includes(status) && (
        <>
          <Button onClick={handleRequestShare} disabled={loading}>
            Send me a confirmation code
          </Button>
          <Button onClick={handleAlreadyHaveCode} disabled={loading}>
            I already have a code
          </Button>
        </>
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
      <p className={styles.feedback}>{feedback}</p>
      {loading && <Spinner color="grey" />}
    </form>
  );
};
