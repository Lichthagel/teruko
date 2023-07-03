import { Home } from "lucide-react";

type ErrorMessageProps = {
  title?: string;
  subtitle?: string;
  message?: string;
  error?: Error;
};

const ErrorMessage = ({
  title,
  subtitle,
  message,
  error,
}: ErrorMessageProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="container">
      <div className="my-3 px-8 text-white">
        <a className="flex flex-row items-center space-x-1" href="/">
          <Home />
          <span>return home</span>
        </a>
      </div>
      <div className="rounded border-4 border-error bg-neutral p-8 text-neutral-content">
        <h1 className="mb-2 text-5xl">{title || "An error occurred"}</h1>
        {subtitle ||
          (error && (
            <h2 className="my-2 text-3xl">{subtitle || error?.message}</h2>
          ))}
        {message && <span>{message}</span>}
      </div>
    </div>
  </div>
);

export default ErrorMessage;
