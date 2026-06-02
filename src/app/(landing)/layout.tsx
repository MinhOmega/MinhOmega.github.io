import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative w-full lg:h-screen lg:overflow-hidden p-0 sm:p-5">
      <div className="w-full h-full rounded-2xl sm:border flex flex-wrap lg:flex-nowrap justify-between lg:divide-x">
        <div className="w-full lg:w-2/5 p-2 md:p-8 lg:h-full lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
          <Hero />
        </div>
        <div
          id="tab-section"
          className="relative w-full mt-3 max-w-6xl mx-auto lg:mt-0 lg:w-3/5 lg:h-full lg:min-h-0 lg:overflow-y-auto scrollbar-hide p-2 md:p-8 pb-16 lg:pb-20"
        >
          <Navbar />
          {children}
        </div>
      </div>
    </main>
  );
}
