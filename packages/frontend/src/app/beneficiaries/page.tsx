import Beneficiaries from "./[...slug]/page";


export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  return <Beneficiaries searchParams={ searchParams }/>
}