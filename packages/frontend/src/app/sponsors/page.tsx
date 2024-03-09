import Sponsors from "./[...slug]/page";


export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  return <Sponsors searchParams={ searchParams }/>
}