import { Document } from "./document";

export function LandingPage() {
  return (
    <Document>
      <Navbar />

      <div>Langing page</div>
    </Document>
  );
}

function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none gap-2">
        <a class="btn btn-secondary" href="/register">
          Register
        </a>
        <a class="btn btn-ghost" href="/login">
          Login
        </a>
      </div>
    </div>
  );
}
