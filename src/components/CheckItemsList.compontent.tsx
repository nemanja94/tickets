import { JsonArray, JsonObject } from "@/generated/prisma/runtime/library";

function CheckItemsList({
  data,
}: {
  data: string | number | boolean | JsonObject | JsonArray;
}) {
  try {
    const items = typeof data === "string" ? JSON.parse(data) : data;
    return (
      <ul className="flex flex-wrap gap-2">
        {Object.entries(items)
          .filter(
            ([, val]) => val && typeof val === "object" && "status" in val,
          )
          .map(([key, val]) => {
            const v = val as { status: boolean };
            return (
              <li
                key={key}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-blue-200"
              >
                <span className="font-mono">{key}:</span>
                <span>{v.status ? "✔️" : "❌"}</span>
              </li>
            );
          })}
      </ul>
    );
  } catch {
    return (
      <ul>
        <li>{String(data)}</li>
      </ul>
    );
  }
}

export default CheckItemsList;
