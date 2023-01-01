import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { remainDatetime } from "../lib/remain-datetime";

const Home: NextPage = () => {
  const router = useRouter();
  const [partyTime, setPartyTime] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function evaluate(target) {
    const { d, h, m, s } = remainDatetime(target);

    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);

    if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
      setPartyTime(true);
    }
  }

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    var target: Date = new Date();
    if (router.query.date) {
      target = new Date(router.query.date as string);
    }
    evaluate(target);

    const interval = setInterval(() => evaluate(target), 1000);

    return () => clearInterval(interval);
  }, [router.isReady]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Countdown Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {partyTime ? (
        <>
          <h1>{router.query.title ?? "시간이 다 됐어요!"}</h1>
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
              <span className="time">{hours}</span>
              <span className="label">Hours</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{minutes}</span>
              <span className="label">Minutes</span>
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{seconds}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;