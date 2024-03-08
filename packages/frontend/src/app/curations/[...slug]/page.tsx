import TopNavBar from "@/components/top_navbar";
import { getApolloClientServerSide } from "@/lib/ApolloClientWrapper";
import { gql } from "@apollo/client";
import CurationsTable from "./curations_table";

export interface CurationsParams {
  params: { slug: string[] }
  searchParams: Record<string, string>;
}

export default async function Curations({ params, searchParams }: CurationsParams) {

  const slug = params.slug;
  const sponsorAddress = slug.length > 0 ? slug[0] : undefined;
  const beneficiaryAddress = slug.length > 1 ? slug[1] : undefined;
  const daysAgoRaw = Number(searchParams['daysAgo']);
  const daysAgo = Math.min(isNaN(daysAgoRaw)?180:daysAgoRaw, 365);
  const toDate = new Date();
  const fromDate = new Date(toDate);
  const IPFX_PREFIX = process.env.NEXTJS_PUBLIC_IPFS_URL;
  fromDate.setDate(toDate.getDate() - daysAgo);

  const query = gql 
    `query curationEvents($sponsorAddress:String, $beneficiaryAddress:String, $fromDate:DateTime, $toDate:DateTime) {
        findCurationEvents(sender: $sponsorAddress, receiver: $beneficiaryAddress, from: $fromDate, to: $toDate) {
            id
            txnHash
            logIndex
            from
            to
            uri
            token {
              symbol
              decimals
              contractAddress
              name
              chainId
            }
            amount
            amountInDecimals
            formattedAmount
            blockNumber
            date
        }
    }`;
  
  const client = getApolloClientServerSide();
  try {
      const response = await client.query({
          query: query,
          variables: { sponsorAddress, beneficiaryAddress, fromDate, toDate }
      });
      
      const curationEvents = response.data['findCurationEvents']
      return (
        <main className="flex min-h-max flex-col items-center justify-between p-24">
          <TopNavBar/>
          <div className="z-10 max-w-5xl w-full sticky items-center justify-between font-mono text-xl lg:flex">
            <h1 className="mb-5">Recent curations</h1>
          </div>
          <div className="relative flex justify-center place-items-top">
          <CurationsTable 
            curationEvents={curationEvents} 
            sponsorAddress={sponsorAddress}
            beneficiaryAddress={beneficiaryAddress}
            daysAgo={daysAgo}
            ipfsPrefix={IPFX_PREFIX}
            >
            </CurationsTable>
          </div>
        </main>
      );
  } catch ( error ) {
      const errorMsg = JSON.stringify(error);
      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <TopNavBar/>
          <div className="z-10 max-w-5xl w-full sticky items-center justify-between font-mono text-xl lg:flex">
            <h1 className="mb-5">Matters Town Top</h1>
          </div>
          <div className="relative flex justify-center place-items-top">
            <div> { errorMsg } </div>
          </div>
        </main>
      );
  }
}
