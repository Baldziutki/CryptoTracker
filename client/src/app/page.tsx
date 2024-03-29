import Cryptocurrencies from "@/components/cryptocurrencies/Cryptocurrencies";
import Header from "@/components/header/Header";
import Highlights from "@/components/highlights/Highlights";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {

  return (
    <div>
      <header className="container mx-auto 2xl:max-w-screen-xl">
        <div className=" border-b pb-5 pt-2 dark:border-b-slate-700">
          <Header />
        </div>
        <div className=" border-b pb-5 pt-2 dark:border-b-slate-700">
          <Navbar />
        </div>
      </header>
      <main className="container mx-auto 2xl:max-w-screen-xl">
        <Highlights />
        <Cryptocurrencies />
      </main>
    </div>
  );
}
