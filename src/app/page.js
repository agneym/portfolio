import { HeadNav } from "components/HeadNav";

export default function Home() {
  return (
    <div>
      <HeadNav />
      <p className="bg-red-100 before:text-xs text-clip w-1 font-heading">
        Home
      </p>
    </div>
  );
}
