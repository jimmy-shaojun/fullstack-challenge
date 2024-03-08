import TopNUsers from "@/components/top_n_users";
import TopNavBar from "@/components/top_navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TopNavBar/>
      <div className="z-10 max-w-5xl w-full sticky items-center justify-between font-mono text-xl lg:flex">
        <h1 className="mb-5">Matters Town Top Sponsors</h1>
      </div>
      <div className="relative flex justify-center place-items-top">
        <TopNUsers type='sponsor' daysAgo='90' limit='20'></TopNUsers>
        <TopNUsers type='sponsor' daysAgo='365' limit='20'></TopNUsers>
        <TopNUsers type='sponsor' daysAgo='1095' limit='20'></TopNUsers>
      </div>
    </main>
  );
}
