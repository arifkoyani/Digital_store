import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

function usePageSEO({ title, description, canonical }: { title: string; description: string; canonical: string }) {
  useEffect(() => {
    document.title = title;

    // Meta description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    link.href = `${origin}${canonical}`;
  }, [title, description, canonical]);
}

const Home = () => {
  usePageSEO({
    title: "Dashboard | Total amount today",
    description: "Dashboard home showing total amount (Today).",
    canonical: "/",
  });

  return (
    <>
      <header className="sr-only">
        <h1>Dashboard – Total amount today</h1>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <section aria-labelledby="today-card" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article>
            <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-foreground/10 p-2">
                    <Zap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p id="today-card" className="text-sm/6 font-medium opacity-90">
                    Total amount (Today)
                  </p>
                </div>

                <div className="mt-3 text-4xl font-extrabold tracking-tight">
                  12,526.555 <span className="align-top text-base font-semibold opacity-90">PKR</span>
                </div>
                <p className="mt-3 text-sm opacity-90">↗ Today</p>
              </CardContent>
            </Card>
          </article>
        </section>

        <aside className="mt-6">
          <Link to="/accounts">
            <Button variant="secondary">Go to Accounts</Button>
          </Link>
        </aside>
      </main>
    </>
  );
};

export default Home;
