'use client'
import { Button, Navbar, NavbarItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useState } from 'react';

export default function TopNUsersTable(props: any) {
    const { stats, daysAgo, type, total, limit } = props;
    const [totalDisplay, setTotalDisplay] = useState(limit);

    const typeStr = type == 'sponsor'? "Sponsors" : 'Beneficaries';

    function ShowMoreButton() {
        if (total <= limit) return (<div></div>);

        return (
            <Navbar>
                { totalDisplay < total && <NavbarItem><Button onClick={() => setTotalDisplay(Math.min(totalDisplay+10, total))}>Show More...</Button></NavbarItem> }
                { totalDisplay > limit && <NavbarItem><Button onClick={() => setTotalDisplay(Math.max(totalDisplay-10, limit))}>Show Less...</Button></NavbarItem> }
                { total > limit && totalDisplay != limit && <NavbarItem><Button onClick={() => setTotalDisplay(limit)}>Show {limit}</Button></NavbarItem> }
            </Navbar>
        )
    }

    return (
            <div>
                <h2>{ `Top ${totalDisplay} of total ${total} ${typeStr} for past ${daysAgo} days.` }</h2>
                <Table
                 aria-label={ `Top ${typeStr} by amount` }
                 bottomContent={ <ShowMoreButton/> }
                 >
                <TableHeader>
                    <TableColumn key='rank'>Rank</TableColumn>
                    <TableColumn key='address'>Address</TableColumn>
                    <TableColumn key='amount'>Total Amount</TableColumn>
                </TableHeader>
                <TableBody emptyContent={`No ${typeStr} for the past ${daysAgo} days.`}>
                    {
                        stats.slice(0, totalDisplay).map((stat: any, i: number) => {
                            return (
                            <TableRow key={stat[type] + stat.token.contractAddress}>
                                <TableCell>{ i+1 }</TableCell>
                                <TableCell>{ stat[type] }</TableCell>
                                <TableCell>{ stat.formattedAmount }</TableCell>
                            </TableRow>
                            )
                        })
                    }
                </TableBody>
                </Table>
            </div>
    );
}