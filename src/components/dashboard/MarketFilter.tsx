import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MarketFilterProps {
  markets: string[];
  visibleMarkets: Set<string>;
  onToggleMarket: (market: string) => void;
  onToggleAll: (visible: boolean) => void;
  onSetMarketVisible?: (market: string, visible: boolean) => void;
}

export const MarketFilter = ({
  markets,
  visibleMarkets,
  onToggleMarket,
  onToggleAll,
  onSetMarketVisible,
}: MarketFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) =>
      market.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [markets, searchTerm]);

  const handleToggleAll = (visible: boolean) => {
    onToggleAll(visible);
  };

  const allVisible = visibleMarkets.size === markets.length;
  const noneVisible = visibleMarkets.size === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Filter Markets ({visibleMarkets.size}/{markets.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Filter Markets</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAll(true)}
            disabled={allVisible}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAll(false)}
            disabled={noneVisible}
          >
            Deselect All
          </Button>
        </div>

        <div className="mb-4">
          <Label htmlFor="search">Search Markets</Label>
          <Input
            id="search"
            placeholder="Search by market code..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="mt-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md p-2">
          <div className="space-y-2">
            {filteredMarkets.map((market) => (
              <div key={market} className="flex items-center space-x-2">
                <Checkbox
                  id={market}
                  checked={visibleMarkets.has(market)}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    onSetMarketVisible
                      ? onSetMarketVisible(market, Boolean(checked))
                      : onToggleMarket(market)
                  }
                />
                <Label
                  htmlFor={market}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {market.replace("KRW-", "")}
                </Label>
              </div>
            ))}
            {filteredMarkets.length === 0 && searchTerm && (
              <p className="text-sm text-gray-500 text-center py-4">
                No markets found matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
