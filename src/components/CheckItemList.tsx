import React from "react";
import CheckItemCheckbox from "@/components/CheckItemCheckbox";

interface CheckItemListProps {
  items: { [key: string]: { description?: string; status: boolean } };
  type: "import" | "export";
  onChange: (type: "import" | "export", key: string, checked: boolean) => void;
  title: string;
}

const CheckItemList: React.FC<CheckItemListProps> = ({ items, type, onChange, title }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {Object.entries(items).map(([key, item]) => (
      <CheckItemCheckbox
        key={key}
        name={key}
        checked={item.status}
        onChange={(checked) => onChange(type, key, checked)}
        label={key}
      />
    ))}
  </div>
);

export default CheckItemList;
