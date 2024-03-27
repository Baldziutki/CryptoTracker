import Header from "@/components/header/Header";
import Highlights from "@/components/highlights/Highlights";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {

  return (
    <div>
      <header className="w-full">
        <div className="w-full border-b pb-5 pt-2">
          <Header />
        </div>
        <div className="w-full border-b pb-5 pt-2">
          <Navbar />
        </div>
      </header>
      <main >
        <div className="w-full">
          <Highlights />
        </div>
      </main>
    </div>
  );
}
