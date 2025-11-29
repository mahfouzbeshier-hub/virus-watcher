import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import URLScanner from "@/components/URLScanner";
import ScanResults from "@/components/ScanResults";
import RecentScans from "@/components/RecentScans";
import Stats from "@/components/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Link, Shield } from "lucide-react";

const Index = () => {
  const [scanTarget, setScanTarget] = useState<string | null>(null);
  const [scanType, setScanType] = useState<"file" | "url">("file");
  const [isScanning, setIsScanning] = useState(false);

  const handleFileScan = (file: File) => {
    setScanTarget(file.name);
    setScanType("file");
    setIsScanning(true);
  };

  const handleURLScan = (url: string) => {
    setScanTarget(url);
    setScanType("url");
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 glow-primary animate-glow-pulse">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Analyze suspicious files and URLs
              <span className="block text-gradient mt-2">with 72+ security engines</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free online service for scanning files and URLs for viruses, malware, and other threats.
              Powered by the world's leading antivirus engines.
            </p>
          </div>

          {/* Scan Interface */}
          <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="file" 
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg transition-all"
                >
                  <File className="h-4 w-4" />
                  File
                </TabsTrigger>
                <TabsTrigger 
                  value="url"
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg transition-all"
                >
                  <Link className="h-4 w-4" />
                  URL
                </TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-0">
                <FileUpload onFileSelect={handleFileScan} />
              </TabsContent>
              <TabsContent value="url" className="mt-0">
                <URLScanner onScan={handleURLScan} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Scan Results */}
        {scanTarget && (
          <section className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <ScanResults 
                target={scanTarget} 
                type={scanType} 
                isScanning={isScanning} 
              />
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by millions worldwide
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join the community of security researchers, IT professionals, and everyday users
              who rely on VirusGuard for threat detection.
            </p>
          </div>
          <Stats />
        </section>

        {/* Recent Scans */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <RecentScans />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Engine Scanning</h3>
              <p className="text-muted-foreground">
                Leverage 72+ antivirus engines and URL/domain blacklisting services for comprehensive threat detection.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 mb-4">
                <File className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">File Analysis</h3>
              <p className="text-muted-foreground">
                Deep analysis of executables, documents, archives, and more with behavioral detection capabilities.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 mb-4">
                <Link className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">URL Inspection</h3>
              <p className="text-muted-foreground">
                Scan URLs for phishing, malware distribution, and other malicious activities before visiting.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">VirusGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VirusGuard. Free online virus scanner.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
