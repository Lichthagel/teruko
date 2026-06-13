import type { FunctionComponent, HTMLAttributes } from "react";
import styles from "client-css/m/loader.module.scss";

const SkeletonLoader: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({ ...restProps }) => {
  return (
    <div className={`${styles.skeleton} ${restProps.className}`} {...restProps} />
  );
};

export default SkeletonLoader;
