import Image from "next/image";
import HeaderLayout from "./header/layout";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div>
      <HeaderLayout/>
      </div>
    </main>
  );
}
