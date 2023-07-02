import clsx from "clsx";

type StatusBarProps = {
  busy: boolean;
  error: boolean;
};

const StatusBar = ({ busy, error }: StatusBarProps) => (
  <div
    className={clsx("fixed bottom-0 left-0 right-0 h-1", {
      "bg-error": error,
      "animate-load bg-primary": busy,
    })}
  />
);

export default StatusBar;
