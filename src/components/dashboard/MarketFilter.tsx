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
        <Button variant="outline" size="sm" className="font-mono">
          FILTER [{visibleMarkets.size}/{markets.length}]
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>MARKET_FILTER_PROTOCOL</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAll(true)}
            disabled={allVisible}
            className="flex-1"
          >
            SELECT ALL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAll(false)}
            disabled={noneVisible}
            className="flex-1"
          >
            DESELECT ALL
          </Button>
        </div>

        <div className="mb-4">
          <Label htmlFor="search" className="mb-2 block text-neon-blue">Search Markets</Label>
          <Input
            id="search"
            placeholder="SEARCH_MARKET_CODE..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="mt-1 font-mono"
          />
        </div>

        <div className="flex-1 overflow-y-auto border-2 border-gray-800 bg-black/50 p-2 custom-scrollbar">
          <div className="space-y-2">
            {filteredMarkets.map((market) => (
              <div key={market} className="flex items-center space-x-3 p-2 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-700">
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
                  className="text-sm font-bold cursor-pointer flex-1 text-white"
                >
                  {market.replace("KRW-", "")}
                </Label>
              </div>
            ))}
            {filteredMarkets.length === 0 && searchTerm && (
              <p className="text-sm text-gray-500 text-center py-4 font-mono">
                NO_DATA_FOUND: "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
