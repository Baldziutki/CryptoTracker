import Cryptocurrencies from "@/components/cryptocurrencies/Cryptocurrencies";
import Highlights from "@/components/highlights/Highlights";


export default function Home() {

  return (
    <div>
      <main className="container mx-auto 2xl:max-w-screen-xl">
        <Highlights />
        <Cryptocurrencies />
      </main>
    </div>
  );
}
