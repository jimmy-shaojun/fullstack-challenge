import { gql } from '@apollo/client';
import { toUpperFirstLetter } from '../lib/utils';
import { getApolloClientServerSide } from '@/lib/ApolloClientWrapper';
import TopNUsersTable from './top_n_users_table';

function queryStatsFor(type: 'sponsor' | 'beneficiary') {
    const queryFor = toUpperFirstLetter(type)
    const queryString = 
    `query statsFor${queryFor}($fromDate:DateTime!, $toDate:DateTime!) {
        ${type}Stats(from: $fromDate, to: $toDate) {
            ${type}
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
        }
    }`;
    return gql(queryString);
}

export default async function TopNUsers(props:any) {
    const searchParams = props.searchParams;
    const queryType = props.type
    const daysAgo = Number(props.daysAgo);
    const query = queryStatsFor(queryType);
    const toDate = new Date();
    const fromDate = new Date(toDate);
    const limit = Number(props.limit);

    fromDate.setDate(toDate.getDate() - daysAgo);

    const client = getApolloClientServerSide();
    try {
        const response = await client.query({
            query: query,
            variables: { fromDate: fromDate, toDate: toDate }
        });
        
        const stats = response.data[`${queryType}Stats`]
        return (
               <TopNUsersTable type={ queryType } daysAgo={ daysAgo } stats={ stats } total={ stats.length } limit={ limit }/>
        );
    } catch ( error ) {
        const errorMsg = JSON.stringify(error);
        return (
            <div> { errorMsg } </div>
        )
    }

}