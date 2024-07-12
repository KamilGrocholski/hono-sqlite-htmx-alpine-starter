import { Footer, Navbar } from "./components";
import { Document } from "./document";

export function PanelPage({ user }: { user: { email: string; role: string } }) {
  return (
    <Document>
      <div class="top-0 sticky z-50">
        <Navbar user={user} />
      </div>

      <div class="container mx-auto p-3 min-h-screen">
        <main>Panel page</main>
      </div>

      <Footer />
    </Document>
  );
}
