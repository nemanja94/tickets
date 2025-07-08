import { getTicketById } from "@/actions/ticket.actions";
import { logEvent } from "@/utils/sentry";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPriorityColor } from "@/utils/ui";
import CloseTicketButton from "@/components/CloseTicketButton";
import { getCurrentUser } from "@/lib/current-user";

const TicketDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await props.params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  logEvent("Viewing ticket details", "ticket", { ticketId: ticket.id }, "info");

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-200 p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">{ticket.subject}</h1>

        <div className="text-gray-700">
          <h2 className="text-lg font-semibold mb-2">Opis</h2>
          <p>{ticket.description}</p>
        </div>

        <div className="text-gray-700">
          <h2 className="text-lg font-semibold mb-2">Prioritet</h2>
          <p className={getPriorityColor(ticket.priority)}>{ticket.priority}</p>
        </div>

        <div className="text-gray-700">
          <h2 className="text-lg font-semibold mb-2">Datum kreiranja</h2>
          <p>{new Date(ticket.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex flex-col gap-2">
          {ticket.importCheckItems && (
            <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-800">
              <span className="font-semibold block mb-1">Ulazni spisak provera:</span>
              <ul className="flex flex-wrap gap-2">
                {(() => {
                  try {
                    const items =
                      typeof ticket.importCheckItems === "string"
                        ? JSON.parse(ticket.importCheckItems)
                        : ticket.importCheckItems;
                    return (
                      Object.entries(items)
                        .filter(([, val]) => val && typeof val === "object" && "status" in val)
                        .map(([key, val]) => {
                          const v = val as { status: boolean };
                          return (
                            <li key={key} className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-blue-200">
                              <span className="font-mono">{key}:</span>
                              <span>{v.status ? "✔️" : "❌"}</span>
                            </li>
                          );
                        })
                    );
                  } catch {
                    return <li>{String(ticket.importCheckItems)}</li>;
                  }
                })()}
              </ul>
            </div>
          )}
          {ticket.exportCheckItems && (
            <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-800">
              <span className="font-semibold block mb-1">Izlazni spisak provera:</span>
              <ul className="flex flex-wrap gap-2">
                {(() => {
                  try {
                    const items =
                      typeof ticket.exportCheckItems === "string"
                        ? JSON.parse(ticket.exportCheckItems)
                        : ticket.exportCheckItems;
                    return (
                      Object.entries(items)
                        .filter(([, val]) => val && typeof val === "object" && "status" in val)
                        .map(([key, val]) => {
                          const v = val as { status: boolean };
                          return (
                            <li key={key} className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-green-200">
                              <span className="font-mono">{key}:</span>
                              <span>{v.status ? "✔️" : "❌"}</span>
                            </li>
                          );
                        })
                    );
                  } catch {
                    return <li>{String(ticket.exportCheckItems)}</li>;
                  }
                })()}
              </ul>
            </div>
          )}
        </div>

        <Link
          href="/tickets"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ← Nazad na listu tiketa
        </Link>

        {ticket.status !== "Closed" && (
          <CloseTicketButton
            ticketId={ticket.id}
            isClosed={ticket.status === "Closed"}
          />
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;
