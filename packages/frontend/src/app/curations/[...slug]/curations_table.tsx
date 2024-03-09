'use client'

import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";

export default function CurationsTable(props: any) {

    const { curationEvents, sponsorAddress, beneficiaryAddress, daysAgo, ipfsPrefix } = props;
    const [page, setPage] = useState(1);
    const pages = Math.max(1, Math.ceil(curationEvents.length / 20));
    const curationEventsThisPage = curationEvents.slice(20*(page - 1), 20*page);

    function formatIpfsUrl( uri?: string) {
        if(typeof uri === 'string'){
            if (uri.startsWith('ipfs://') || !uri.includes("://")) {
                const cid = uri.replace('ipfs://', '');
                return `${ipfsPrefix}${cid}`;
            }
            else{
                return uri;
            }
        }

        return '#'
    }

    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange} = useDisclosure();
    const [selectedCuration, setSelctedCuration] = useState(undefined as any);

    function displayLocalDate(date: any) {
        const dateObj: Date = new Date(date);
        return dateObj.toLocaleString();
    }

    function handleSearchDaysChange(event: ChangeEvent<HTMLSelectElement>) {
        const pathname = document.location.pathname;
        const url = `${pathname}?daysAgo=${event.target.value}`;
        document.location.href = url;
    }

    return (
        <div className="flex-rows justify-center place-items-top">
        <h2>{ `
            Curation events ${ sponsorAddress?("from "+sponsorAddress+" "):"" }
            ${beneficiaryAddress?("to "+beneficiaryAddress+" "):""}for past`}
            <select name="daysAgo" value={daysAgo} onChange={handleSearchDaysChange}>       
              { 
              [90, 120, 150, 180, 365, 730, 1095].map((days) => {
                return <option key={`daysAgo${days}`} value={days}>{days}</option>  
              })
              }
            </select>

             { ` days.`}
             </h2>
            <Table
                aria-label={ `Recent curations` }
                bottomContent={ 
                    pages > 1 && <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                    </div>
                }
                >
            <TableHeader>
                <TableColumn key='from'>Sponsor</TableColumn>
                <TableColumn key='to'>Beneficiary</TableColumn>
                <TableColumn key='blockNumber'>Block Number</TableColumn>
                <TableColumn key='txhHash'>Transaction Hash</TableColumn>
                <TableColumn key='amount'>Amount</TableColumn>
                <TableColumn key='uri'>Uri</TableColumn>
                <TableColumn key='date'>Date</TableColumn>
            </TableHeader>
            <TableBody emptyContent={`No curation events for the past ${daysAgo} days.`}>
                {
                    curationEventsThisPage.map((curation: any, i: number) => {
                        return (
                        <TableRow key={curation.txnHash + curation.logIndex}>
                            <TableCell>
                                <Tooltip content={curation.from}>
                                <span>{ curation.from.slice(0,10) }</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip content={curation.to}>
                                <span>{ curation.to.slice(0,10) }</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{ curation.blockNumber }</TableCell>
                            <TableCell>
                                <Tooltip content={curation.txnHash}>
                                <span>{ curation.txnHash.slice(0,10) }</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{ curation.formattedAmount }</TableCell>
                            <TableCell>
                                <Link href={ `\#${curation.uri}`} onClick={ () => { setSelctedCuration(curation); onModalOpen() } }>
                                    { curation.uri }
                                </Link>
                            </TableCell>
                            <TableCell>{ curation.date }</TableCell>
                        </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
        <Modal size="full" isOpen={isModalOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader>
                    { selectedCuration && selectedCuration.uri } got reward {selectedCuration.formattedAmount} from this content on {displayLocalDate(selectedCuration.date)}.
                    <Link href={formatIpfsUrl(selectedCuration.uri)} isExternal showAnchorIcon><Button>Open in new window</Button></Link>
                </ModalHeader>
                <ModalBody>
                    <iframe className="flex-1 h-full" src={ formatIpfsUrl(selectedCuration.uri) }></iframe>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
              </>
            )}
            </ModalContent>
        </Modal>
        </div>
    )
}