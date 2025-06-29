"use client";

import { createTicket } from "@/actions/ticket.actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import CheckItemList from "@/components/CheckItemList";

type ImportCheckItems = {
  [key: string]: {
    description?: string;
    status: boolean;
  };
};

type ExportCheckItems = {
  [key: string]: {
    description?: string;
    status: boolean;
  };
};

const initialImportCheckItems: ImportCheckItems = {
  importCheckitem1: { description: "", status: false },
  importCheckitem2: { description: "", status: false },
  importCheckitem3: { description: "", status: false },
  importCheckitem4: { description: "", status: false },
  importCheckitem5: { description: "", status: false },
};

const initialExportCheckItems: ExportCheckItems = {
  exportCheckitem1: { description: "", status: false },
  exportCheckitem2: { description: "", status: false },
  exportCheckitem3: { description: "", status: false },
  exportCheckitem4: { description: "", status: false },
  exportCheckitem5: { description: "", status: false },
};

const NewTicketForm = () => {
  const [state, formAction] = useActionState(createTicket, {
    success: false,
    message: "",
  });
  const [importCheckItems, setImportCheckItems] = useState(
    initialImportCheckItems
  );
  const [exportCheckItems, setExportCheckItems] = useState(
    initialExportCheckItems
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Ticket created successfully");
      router.push("/tickets");
    }
  }, [state.success, router]);

  const handleCheckboxChange = (
    type: "import" | "export",
    key: string,
    checked: boolean
  ) => {
    if (type === "import") {
      setImportCheckItems((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: checked },
      }));
    } else {
      setExportCheckItems((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: checked },
      }));
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Submit a Support Ticket
      </h1>
      {state.message && !state.success && (
        <p className="text-red-500 mb-4 text-center">{state.message}</p>
      )}
      <form
        action={async (formData) => {
          formData.append("importCheckItems", JSON.stringify(importCheckItems));
          formData.append("exportCheckItems", JSON.stringify(exportCheckItems));
          formAction(formData);
        }}
        className="space-y-4 text-gray-700"
      >
        <input
          className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="subject"
          placeholder="Subject"
        />
        <textarea
          className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="description"
          placeholder="Describe your issue"
          rows={4}
        />
        <select
          className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          name="priority"
          defaultValue="Low"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <CheckItemList
          items={importCheckItems}
          type="import"
          onChange={handleCheckboxChange}
          title="Import Check Items"
        />
        <button
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicketForm;
