import { Plus } from "lucide-react";
import NextLink from "next/link";

const Nav: React.FC = () => (
  <nav className="navbar bg-base-100">
    <div className="container mx-auto">
      <div className="flex-1">
        <NextLink className="btn-ghost btn text-xl normal-case" href="/">
          てる子
        </NextLink>
      </div>
      <div className="flex-none">
        <NextLink className="btn-ghost btn-square btn" href="/new">
          <Plus />
        </NextLink>
      </div>
    </div>
  </nav>
);

export default Nav;
