import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative w-full h-[80vh] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-6 text-center text-white">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Подари усмивка с перфектния подарък!
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Намери уникални подаръци за всяка специална личност и момент.
          </p>
          <Link href={"/categories"}>
            <Button
              variant="default"
              color="primary"
              size="lg"
              className="px-8 py-3 rounded-full font-semibold"
            >
              Разгледай подаръците
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
