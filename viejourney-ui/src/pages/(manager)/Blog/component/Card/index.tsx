import { Card } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card
      elevation={0}
      className="shadow-sm p-4 flex justify-between items-center"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`bg-neutral-100 p-3 rounded-full`}>{icon}</div>
    </Card>
  );
}
