import { Footer, Navbar } from "./components";
import { Document } from "./document";

export function PanelPage() {
  return (
    <Document>
      <div class="top-0 sticky">
        <Navbar />
      </div>

      <div class="container mx-auto p-3 min-h-screen">
        <main>Panel page</main>
      </div>

      <Footer />
    </Document>
  );
}
