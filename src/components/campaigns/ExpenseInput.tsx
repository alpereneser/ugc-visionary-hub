import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { CurrencySelect } from "@/components/products/CurrencySelect";

type Expense = {
  name: string;
  amount: string;
  currency: string;
};

interface ExpenseInputProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export const ExpenseInput = ({ expenses, setExpenses }: ExpenseInputProps) => {
  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: "", currency: "USD" }]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: keyof Expense, value: string) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    setExpenses(updatedExpenses);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Additional Expenses</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addExpense}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
      {expenses.map((expense, index) => (
        <div key={index} className="flex gap-4 items-start">
          <Input
            placeholder="Expense name"
            value={expense.name}
            onChange={(e) => updateExpense(index, "name", e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) => updateExpense(index, "amount", e.target.value)}
              className="w-32"
            />
            <CurrencySelect
              value={expense.currency}
              onChange={(value) => updateExpense(index, "currency", value)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeExpense(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};