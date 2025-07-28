"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/utils/sentry";
import { getCurrentUser } from "@/lib/current-user";

// Create New Ticket
export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logEvent("Unauthorized ticket creation attempt", "ticket", {}, "warning");
      return { success: false, message: "Unauthorized" };
    }

    // Extract form data
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const chassisNumber = formData.get("chassisNumber") as string;
    const importCheckItems = formData.get("importCheckItems") as string;
    const exportCheckItems = formData.get("exportCheckItems") as string;

    if (!subject || !description || !priority || !chassisNumber) {
      logEvent(
        "Validation Error: Missing ticket data",
        "ticket",
        {
          subject,
          description,
          priority,
        },
        "warning",
      );

      return { success: false, message: "All fields are required" };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        chassisNumber,
        importCheckItems,
        exportCheckItems,
        user: {
          connect: { id: user.id },
        },
      },
    });

    logEvent(
      `Ticket created successfully: ${ticket.id}`,
      "ticket",
      { ticketId: ticket.id },
      "info",
    );

    revalidatePath("/tickets");

    return { success: true, message: "Ticket created successfully" };
  } catch (error) {
    logEvent(
      "Failed to create ticket",
      "ticket",
      {
        formData: Object.fromEntries(formData.entries()),
      },
      `error`,
      error,
    );
    return { success: false, message: "Failed to create ticket" };
  }
}

// Get all user tickets
export async function getTickets() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logEvent("Unauthorized access to ticket list", "ticket", {}, "warning");
      return [];
    }

    const tickets = await prisma.ticket.findMany({
      // where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    logEvent(
      "Fetched ticket list",
      "ticket",
      { count: tickets.length },
      "info",
    );

    return tickets;
  } catch (error) {
    logEvent("Error fetching tickets", "ticket", {}, "error", error);

    return [];
  }
}

// Get single ticket details
export async function getTicketById(id: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      logEvent("Ticket not found", "ticket", { ticketId: id }, "warning");
    }

    return ticket;
  } catch (error) {
    logEvent(
      "Error fetching ticket details",
      "ticket",
      { ticketId: id },
      "error",
      error,
    );
    return null;
  }
}

// Close Ticket
export async function closeTicket(
  prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const ticketId = Number(formData.get("ticketId"));

  if (!ticketId) {
    logEvent("Missing ticket ID", "ticket", {}, "warning");
    return { success: false, message: "Ticket ID is Required" };
  }

  const user = await getCurrentUser();

  if (!user) {
    logEvent("Missing user ID", "ticket", {}, "warning");

    return { success: false, message: "Unauthorized" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.userId !== user.id) {
    logEvent(
      "Unauthorized ticket close attempt",
      "ticket",
      { ticketId, userId: user.id },
      "warning",
    );

    return {
      success: false,
      message: "You are not authorized to close this ticket",
    };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "Closed" },
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, message: "Ticket closed successfully" };
}

// Update Ticket
export async function updateTicket(
  prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const ticketId = Number(formData.get("ticketId"));

  if (!ticketId) {
    logEvent("Missing ticket ID", "ticket", {}, "warning");
    return { success: false, message: "Ticket ID is Required" };
  }

  const user = await getCurrentUser();

  if (!user) {
    logEvent("Missing user ID", "ticket", {}, "warning");
    return { success: false, message: "Unauthorized" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.userId !== user.id) {
    logEvent(
      "Unauthorized ticket update attempt",
      "ticket",
      { ticketId, userId: user.id },
      "warning",
    );

    return {
      success: false,
      message: "You are not authorized to update this ticket",
    };
  }

  // Extract form data
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const chassisNumber = formData.get("chassisNumber") as string;
  const importCheckItems = formData.get("importCheckItems") as string;
  const exportCheckItems = formData.get("exportCheckItems") as string;

  if (!subject || !description || !priority || !chassisNumber) {
    logEvent(
      "Validation Error: Missing ticket data",
      "ticket",
      {
        subject,
        description,
        priority,
      },
      "warning",
    );

    return { success: false, message: "All fields are required" };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      subject,
      description,
      priority,
      chassisNumber,
      importCheckItems,
      exportCheckItems,
    },
  });

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, message: "Ticket updated successfully" };
}

// Update import check items
export async function updateImportCheckItems(
  prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const ticketId = Number(formData.get("ticketId"));

  if (!ticketId) {
    logEvent(
      "Missing ticket ID for import check items update",
      "ticket",
      {},
      "warning",
    );
    return { success: false, message: "Ticket ID is Required" };
  }

  const user = await getCurrentUser();

  if (!user) {
    logEvent(
      "Unauthorized import check items update attempt",
      "ticket",
      {},
      "warning",
    );
    return { success: false, message: "Unauthorized" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.userId !== user.id) {
    logEvent(
      "Unauthorized import check items update attempt",
      "ticket",
      { ticketId, userId: user.id },
      "warning",
    );

    return {
      success: false,
      message: "You are not authorized to update this ticket",
    };
  }

  const importCheckItems = formData.get("importCheckItems") as string;

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { importCheckItems },
  });

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, message: "Import check items updated successfully" };
}

// Update export check items
export async function updateExportCheckItems(
  prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const ticketId = Number(formData.get("ticketId"));

  if (!ticketId) {
    logEvent(
      "Missing ticket ID for export check items update",
      "ticket",
      {},
      "warning",
    );
    return { success: false, message: "Ticket ID is Required" };
  }

  const user = await getCurrentUser();

  if (!user) {
    logEvent(
      "Unauthorized export check items update attempt",
      "ticket",
      {},
      "warning",
    );
    return { success: false, message: "Unauthorized" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.userId !== user.id) {
    logEvent(
      "Unauthorized export check items update attempt",
      "ticket",
      { ticketId, userId: user.id },
      "warning",
    );

    return {
      success: false,
      message: "You are not authorized to update this ticket",
    };
  }

  const exportCheckItems = formData.get("exportCheckItems") as string;

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { exportCheckItems },
  });

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, message: "Export check items updated successfully" };
}
