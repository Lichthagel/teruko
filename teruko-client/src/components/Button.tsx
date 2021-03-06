import clsx from "clsx";
import { FunctionComponent } from "preact";

const Button: FunctionComponent<{
    text: string;
    color?: string;
    className?: string;
    onClick?: () => void;
// eslint-disable-next-line react/prop-types
}> = ({ text, color, onClick, className }) =>
    <div
        className={clsx("inline-block bg-indigo-700 text-white leading-9 px-4 m-1 rounded select-none", { "cursor-pointer": onClick }, className)}
        style={{ backgroundColor: color }}
        onClick={() => onClick && onClick()}>
        {text}
    </div>;
export default Button;