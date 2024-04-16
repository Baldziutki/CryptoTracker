import Cryptocurrencies from "@/components/cryptocurrencies/Cryptocurrencies";
import Highlights from "@/components/highlights/Highlights";


export default function Home() {

  return (
    <div>
      <main className="">
        <Highlights />
        <Cryptocurrencies />
      </main>
    </div>
  );
}
