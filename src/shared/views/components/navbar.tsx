export function Navbar() {
  return (
    <div class="navbar bg-base-200">
      <div class="container mx-auto">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl" href="/panel">
            Panel
          </a>
        </div>
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href="/profile" class="btn btn-ghost btn-sm">
                  Profile
                </a>
              </li>
              <div class="divider"></div>
              <li>
                <button hx-delete="/logout" class="btn text-error btn-sm">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
