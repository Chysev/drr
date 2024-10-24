// components/Alert.tsx
interface AlertProps {
  message: string;
  type: "success" | "error";
}

export default function Alert({ message, type }: AlertProps) {
  const alertStyles =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return <div className={`p-4 rounded-md ${alertStyles} mb-4`}>{message}</div>;
}
