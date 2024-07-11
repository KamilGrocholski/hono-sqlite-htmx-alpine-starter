import { Footer, Navbar } from "./components";
import { Document } from "./document";

export function AdminPanelPage({
  user,
}: {
  user: { email: string; role: string };
}) {
  return (
    <Document>
      <div class="top-0 sticky">
        <Navbar user={user} />
      </div>

      <div class="container mx-auto p-3 min-h-screen">
        <main>
          <div class="flex flex-col gap-5">
            <h1 class="text-center">Admin panel</h1>
            <div class="mx-auto">
              <button
                hx-get={`/admin/users?page=1&perPage=20`}
                hx-swap="outerHTML"
                class="btn btn-primary max-w-xs"
              >
                Check users
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </Document>
  );
}
