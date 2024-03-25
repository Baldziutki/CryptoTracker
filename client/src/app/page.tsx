import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-between">
      <header className="w-full border-b pb-5 pt-2">
        <Header />
      </header>
      <div className="w-full border-b pb-5 pt-2">
        <Navbar />
      </div>
    </main>
  );
}
