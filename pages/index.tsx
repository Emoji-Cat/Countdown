import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import moment from "moment";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  const [partyTime, setPartyTime] = useState(false);
  const [target, setTarget] = useState(moment().add(1, 'day'));
  const [remain, setRemain] = useState(moment.duration(0));
  const [title, setTitle] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  function clear() {
    const aDayAfter = moment().add(1, 'day');

    router.replace(
      "/",
      "/",
      { shallow: true }
    )

    setTitle("");
    setTarget(aDayAfter);
  }

  function evaluate() {
    const duration = target.diff(moment());
    setRemain(moment.duration(duration));
    setPartyTime(duration <= 0);
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function onKeyUpTitle(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    router.replace(
      "/?date=" + target.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + (title ?? ""),
      "/?date=" + target.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + (title ?? ""),
      { shallow: true }
    )
  }

  function onChangeDateTime(event: ChangeEvent<HTMLInputElement>) {
    const newTarget = moment(new Date(event.target.value));

    setTarget(newTarget);
    evaluate();

    router.replace(
      "/?date=" + newTarget.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + (title ?? ""),
      "/?date=" + newTarget.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + (title ?? ""),
      { shallow: true }
    )
  }

  useEffect(() => {
    if (router.isReady) {
      if (router.query.title) {
        setTitle(router.query.title as string);
      }

      if (router.query.finalMessage) {
        setFinalMessage(router.query.finalMessage as string);
      }

      const date = moment(router.query.date as string);
      if (router.query.date && date.isValid) {
        setTarget(date);
      }
    } else {
      return;
    }

    evaluate();

    const interval = setInterval(evaluate, 1000);

    return () => clearInterval(interval);
  }, [router.isReady, router.query, partyTime]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{Boolean(title) ? title : "Countdown Timer"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {partyTime ? (
        <>
          <h1>{Boolean(finalMessage) ? finalMessage : "시간이 다 됐어요!"}</h1>
          <button onClick={(e) => clear()}>다시하기</button>
        </>
      ) : (
        <div className={styles.card}>
          <input
            type="text"
            value={title}
            placeholder="어떤 기념일인가요?"
            onChange={(e) => onChangeTitle(e)}
            onKeyUp={(e) => onKeyUpTitle(e)}
          />
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={target.format(moment.HTML5_FMT.DATETIME_LOCAL)}
            min={moment().format(moment.HTML5_FMT.DATETIME_LOCAL)}
            onChange={(e) => onChangeDateTime(e)}
          />
        </div>
      )}

      {partyTime ? (
        <div className={styles.background}>
          {/* <video autoPlay loop muted>
            <source src="/party.mp4" />
          </video> */}
          <Image
            alt="background image"
            src="/background.png"
            fill
          />
        </div>
      ) : (
        <>
          <div className="timer-wrapper">
            <div className="timer-segment">
              <span className="time">{remain.days()}</span>
              <span className="label">Days</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{remain.hours().toLocaleString('es-US', { minimumIntegerDigits: 2 })}</span>
              <span className="label">Hours</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{remain.minutes().toLocaleString('es-US', { minimumIntegerDigits: 2 })}</span>
              <span className="label">Minutes</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{remain.seconds().toLocaleString('es-US', { minimumIntegerDigits: 2 })}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;