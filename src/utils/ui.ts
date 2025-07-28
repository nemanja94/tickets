export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Nizak":
      return "text-zinc-600 font-bold";
    case "Srednji":
      return "text-yellow-600 font-bold";
    case "Visok":
      return "text-red-600 font-bold";
    default:
      return "bg-gray-500";
  }
};
