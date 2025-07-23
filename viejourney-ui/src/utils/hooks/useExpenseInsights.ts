import { useMemo } from "react";
import { Expense } from "../../services/stores/storeInterfaces";
import { getTypeColor } from "../handlers/utils";

// hooks/useExpenseInsights.ts
export function useExpenseInsights(expenses: Expense[], totalBudget: number) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const budgetRemaining = Math.max(totalBudget - totalSpent, 0);

  const budgetData = useMemo(
    () => [
      { id: "Spent", value: totalSpent, label: "Spent", color: "#ef4444" },
      {
        id: "Remaining",
        value: budgetRemaining,
        label: "Remaining",
        color: "#22c55e",
      },
    ],
    [totalSpent, totalBudget]
  );

  const expenseByType = useMemo(() => {
    const grouped = expenses.reduce((acc, { type = "Other", amount }) => {
      acc[type] = (acc[type] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([label, value]) => ({
      id: label,
      value,
      label,
      color: getTypeColor(label),
    }));
  }, [expenses]);

  const expensesByPerson = useMemo(() => {
    const grouped = expenses.reduce((acc, { payer, amount }) => {
      console.log(acc, payer, amount);
      acc[payer] = (acc[payer] || 0) + Number(amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
    }));
  }, [expenses]);

  const topCategories = useMemo(() => {
    return [...expenseByType].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [expenseByType]);

  return {
    totalSpent,
    budgetRemaining,
    budgetData,
    expenseByType,
    expensesByPerson,
    topCategories,
  };
}
