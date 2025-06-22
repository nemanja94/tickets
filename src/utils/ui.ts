export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Low":
      return "text-green-600 font-bold";
    case "Medium":
      return "text-yellow-600 font-bold";
    case "High":
      return "text-red-600 font-bold";
    default:
      return "bg-gray-500";
  }
};
