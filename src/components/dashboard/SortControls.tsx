import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown, DollarSign, Percent } from "lucide-react";

export type SortField = 'change_rate' | 'trade_price_24h';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

export const SortControls = ({ sortConfig, onSortChange }: SortControlsProps) => {
  const handleSort = (field: SortField) => {
    if (sortConfig.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sortConfig.direction === 'desc' ? 'asc' : 'desc'
      });
    } else {
      // Default to desc for new field (usually what users want for these metrics)
      onSortChange({
        field,
        direction: 'desc'
      });
    }
  };

  const getIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortConfig.direction === 'desc' ? 
      <ArrowDown className="h-3 w-3 text-neon-blue" /> : 
      <ArrowUp className="h-3 w-3 text-neon-blue" />;
  };

  const getVariant = (field: SortField) => {
    return sortConfig.field === field ? "secondary" : "ghost";
  };

  return (
    <div className="flex flex-col gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
      <Button
        variant={getVariant('change_rate')}
        size="sm"
        onClick={() => handleSort('change_rate')}
        className="h-7 text-xs justify-between w-28 px-2"
      >
        <span className="flex items-center gap-1.5">
          <Percent className="h-3.5 w-3.5 text-gray-400" />
          Change
        </span>
        {getIcon('change_rate')}
      </Button>

      <Button
        variant={getVariant('trade_price_24h')}
        size="sm"
        onClick={() => handleSort('trade_price_24h')}
        className="h-7 text-xs justify-between w-28 px-2"
      >
        <span className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          Volume
        </span>
        {getIcon('trade_price_24h')}
      </Button>
    </div>
  );
};
