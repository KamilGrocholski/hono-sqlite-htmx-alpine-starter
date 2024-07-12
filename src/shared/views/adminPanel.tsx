import { Footer, Navbar } from "./components";
import { Document } from "./document";

export function AdminPanelPage({
  user,
}: {
  user: { email: string; role: string };
}) {
  return (
    <Document>
      <div class="top-0 sticky z-50">
        <Navbar user={user} />
      </div>

      <div class="container mx-auto p-3 min-h-screen">
        <main>
          <div class="flex flex-col gap-5">
            <h1 class="text-center">Admin panel</h1>
            <div class="mx-auto">
              <div
                role="tablist"
                class="tabs tabs-boxed"
                x-data="{activeTab: 'users'}"
              >
                <a
                  role="tab"
                  class="tab"
                  x-bind:class="{'tab-active': activeTab === 'users'}"
                  x-on:click="activeTab = 'users'"
                  hx-get={`/admin/users?page=1&perPage=10`}
                  hx-trigger="load, click"
                  hx-target="#tab-content"
                  hx-swap="innerHTML"
                >
                  Users
                </a>
                <a
                  role="tab"
                  class="tab"
                  x-bind:class="{'tab-active': activeTab === 'sessions'}"
                  x-on:click="activeTab = 'sessions'"
                  hx-get={`/admin/sessions?page=1&perPage=10`}
                  hx-target="#tab-content"
                  hx-swap="innerHTML"
                >
                  Sessions
                </a>
              </div>
            </div>
            <div id="tab-content" role="tabpanel" class="mx-auto"></div>
          </div>
        </main>
      </div>

      <Footer />
    </Document>
  );
}

export function UsersTableTryAgain({
  message,
  page,
  perPage,
}: {
  message: string;
  page: number;
  perPage: number;
}) {
  return (
    <div>
      <span>{message}</span>
      <button
        class="btn btn-ghost text-error"
        hx-get={`/admin/users?page=${page + 1}&perPage=${perPage}`}
        hx-swap="outerHTML"
        hx-target="closest #user-table"
      >
        Try again
      </button>
    </div>
  );
}

export function UsersTable({
  users,
  perPage,
  currentPage,
  hasNext,
  hasPrev,
}: {
  perPage: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  users: {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
  }[];
}) {
  return (
    <div id="users-table" class="flex flex-col items-center gap-5">
      <div class="overflow-x-auto max-w-xs md:max-w-lg lg:max-w-full">
        <table class="table table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>E-mail</th>
              <th>Role</th>
              <th>Created at</th>
              <th>Updated at</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userIdx) => (
              <tr>
                <th>{userIdx + 1}</th>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.createdAt.toLocaleString()}</td>
                <td>{user.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="join">
        <button
          class={`join-item btn ${!hasPrev ? "btn-disabled" : ""}`}
          hx-get={`/admin/users?page=${currentPage - 1}&perPage=${perPage}`}
          hx-swap="outerHTML"
          hx-target="closest #users-table"
        >
          «
        </button>
        <button class="join-item btn">Page {currentPage}</button>
        <button
          class={`join-item btn ${!hasNext ? "btn-disabled" : ""}`}
          hx-get={`/admin/users?page=${currentPage + 1}&perPage=${perPage}`}
          hx-swap="outerHTML"
          hx-target="closest #users-table"
        >
          »
        </button>
      </div>
    </div>
  );
}

export function SessionsTableTryAgain({
  message,
  page,
  perPage,
}: {
  message: string;
  page: number;
  perPage: number;
}) {
  return (
    <div>
      <span>{message}</span>
      <button
        class="btn btn-ghost text-error"
        hx-get={`/admin/sessions?page=${page + 1}&perPage=${perPage}`}
        hx-swap="outerHTML"
        hx-target="closest #sessions-table"
      >
        Try again
      </button>
    </div>
  );
}

export function SessionsTable({
  sessions,
  perPage,
  currentPage,
  hasNext,
  hasPrev,
}: {
  perPage: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  sessions: { id: number; userId: number; createdAt: Date; expiresAt: Date }[];
}) {
  return (
    <div id="sessions-table" class="flex flex-col items-center gap-5">
      <div class="overflow-x-auto max-w-xs md:max-w-lg lg:max-w-full">
        <table class="table table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>User id</th>
              <th>Created at</th>
              <th>Expires at</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, sessionIdx) => (
              <tr>
                <th>{sessionIdx + 1}</th>
                <td>{session.id}</td>
                <td>{session.userId}</td>
                <td>{session.createdAt.toLocaleString()}</td>
                <td>{session.expiresAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="join">
        <button
          class={`join-item btn ${!hasPrev ? "btn-disabled" : ""}`}
          hx-get={`/admin/sessions?page=${currentPage - 1}&perPage=${perPage}`}
          hx-swap="outerHTML"
          hx-target="closest #sessions-table"
        >
          «
        </button>
        <button class="join-item btn">Page {currentPage}</button>
        <button
          class={`join-item btn ${!hasNext ? "btn-disabled" : ""}`}
          hx-get={`/admin/sessions?page=${currentPage + 1}&perPage=${perPage}`}
          hx-swap="outerHTML"
          hx-target="closest #sessions-table"
        >
          »
        </button>
      </div>
    </div>
  );
}
