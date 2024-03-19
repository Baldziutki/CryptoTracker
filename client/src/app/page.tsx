import HeaderLayout from "./header/layout";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full border-b pb-5 pt-2">
      <HeaderLayout/>
      </div>
    </main>
  );
}
