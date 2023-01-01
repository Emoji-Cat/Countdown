import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import moment, { Moment } from "moment";

import styles from "../styles/Home.module.css";
import { remainDatetime } from "../lib/remain-datetime";

const Home: NextPage = () => {
  const router = useRouter();
  const [partyTime, setPartyTime] = useState(false);
  const [target, setTarget] = useState(moment().add(1, 'day'));
  const [title, setTitle] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function evaluate(target: Moment) {
    const { d, h, m, s } = remainDatetime(target.toDate());

    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);

    if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
      setPartyTime(true);
    }
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function onKeyUpTitle(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    router.replace(
      "/?date=" + target.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + title,
      "/?date=" + target.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + title,
      { shallow: true }
    )
  }

  function onChangeDateTime(event: ChangeEvent<HTMLInputElement>) {
    const newTarget = moment(new Date(event.target.value));
    router.replace(
      "/?date=" + newTarget.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + router.query.title,
      "/?date=" + newTarget.format(moment.HTML5_FMT.DATETIME_LOCAL) + "&title=" + router.query.title,
      { shallow: true }
    )
    setTarget(newTarget);
    evaluate(newTarget);
  }

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.title) {
      setTitle(router.query.title as string);
    }

    if (router.query.finalMessage) {
      setFinalMessage(router.query.finalMessage as string);
    }

    if (router.query.date) {
      const date = moment(router.query.date as string);
      if (date.isValid) {
        setTarget(date);
      }
    }
    evaluate(target);

    const interval = setInterval(() => evaluate(target), 1000);

    return () => clearInterval(interval);
  }, [router.isReady, router.query, target, title]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Countdown Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

      {partyTime ? (
        <>
          <h1>{finalMessage ?? "시간이 다 됐어요!"}</h1>
          {/* <video autoPlay loop muted>
            <source src="/party.mp4" />
          </video> */}
          <Image
            alt="background image"
            src="/background.png"
            fill
          />
        </>
      ) : (
        <>
          <div className="timer-wrapper">
            <div className="timer-segment">
              <span className="time">{days}</span>
              <span className="label">Days</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{hours.toLocaleString('es-US', {minimumIntegerDigits: 2})}</span>
              <span className="label">Hours</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{minutes.toLocaleString('es-US', {minimumIntegerDigits: 2})}</span>
              <span className="label">Minutes</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{seconds.toLocaleString('es-US', {minimumIntegerDigits: 2})}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;