

'use client';
import styles from '../../public/BouncingLoader.module.css';

export  function BouncingLoader() {

  return (
   <div className="flex flex-col items-center gap-4">
      <div className={styles.wrapper}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
      </div>
      <p className="text-white text-lg font-medium tracking-wide">
        Authenticating...
      </p>
    </div>
  );
}
