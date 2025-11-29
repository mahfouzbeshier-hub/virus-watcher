import { useState } from "react";
import { Link, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLScannerProps {
  onScan: (url: string) => void;
}

const URLScanner = ({ onScan }: URLScannerProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Enter URL to scan (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 h-12 bg-secondary border-border focus:border-primary focus:ring-primary"
          />
        </div>
        <Button type="submit" variant="hero" size="lg" className="md:w-auto w-full">
          <Search className="h-5 w-5 mr-2" />
          Scan URL
        </Button>
      </div>
    </form>
  );
};

export default URLScanner;
