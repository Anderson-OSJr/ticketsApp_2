import TicketPriority from "@/components/TicketPriority";
import TicketStatusBadge from "@/components/TicketStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket } from "@prisma/client";


interface Props {
    tickets: Ticket[],
}

const DataTable = ({tickets}:Props) => {
    return (
        <div className="w-full mt-5">
            <div className="rounded-md sm:border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>
                                <div className="flex justify-center">
                                    Status
                                </div>                                
                            </TableHead>
                            <TableHead>
                                <div className="flex justify-center">
                                    Priority
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex justify-center">
                                    Created At
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets ? tickets.map((ticket) => (
                            <TableRow key={ticket.id} data-href="/">
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <TicketStatusBadge status={ticket.status}/>
                                    </div>                                    
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <TicketPriority priority={ticket.priority}/>
                                    </div>                                    
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        {ticket.createdAt.toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default DataTable;