import { Document } from "./document";

export function LandingPage() {
  return (
    <Document>
      <div
        class="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)",
        }}
      >
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content text-neutral-content text-center">
          <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
            <p class="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <a href="/register" class="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </Document>
  );
}

// function Navbar() {
//   return (
//     <div class="navbar bg-base-100">
//       <div class="flex-1">
//         <a class="btn btn-ghost text-xl">daisyUI</a>
//       </div>
//       <div class="flex-none gap-2">
//         <a class="btn btn-secondary" href="/register">
//           Register
//         </a>
//         <a class="btn btn-ghost" href="/login">
//           Login
//         </a>
//       </div>
//     </div>
//   );
// }
