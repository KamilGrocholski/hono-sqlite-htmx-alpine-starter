import { Navbar } from "./components";
import { Document } from "./document";

export function AdminPanelPage({
  user,
}: {
  user: { email: string; role: string };
}) {
  return (
    <Document>
      <Navbar user={user} />

      <div>Admin Panel page</div>
    </Document>
  );
}
