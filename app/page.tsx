"use client";

import { useState, useMemo } from "react";

// inreface declaration , normally i create a separate file for types but for demo purposes i keep it here
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  wilaya: string;
  status: string;
  date: string;
}

// I have generated these users randomly for demo purposes using an online tool.
const db: UserData[] = [
  {
    id: 1,
    name: "Amine Benali",
    email: "amine.b@example.dz",
    role: "Admin",
    wilaya: "Algiers",
    status: "Active",
    date: "2026-01-15",
  },
  {
    id: 2,
    name: "Fatima Zohra",
    email: "fatima.z@example.dz",
    role: "Editor",
    wilaya: "Oran",
    status: "Active",
    date: "2026-02-20",
  },
  {
    id: 3,
    name: "Yacine Brahimi",
    email: "yacine.br@example.dz",
    role: "Viewer",
    wilaya: "Constantine",
    status: "Inactive",
    date: "2026-03-10",
  },
  {
    id: 4,
    name: "Meriem Mansouri",
    email: "meriem.m@example.dz",
    role: "Admin",
    wilaya: "Setif",
    status: "Active",
    date: "2026-04-05",
  },
  {
    id: 5,
    name: "Karim Bouzid",
    email: "karim.bouzid@example.dz",
    role: "Editor",
    wilaya: "Annaba",
    status: "Pending",
    date: "2026-05-12",
  },
  {
    id: 6,
    name: "Noura Saadi",
    email: "noura.s@example.dz",
    role: "Viewer",
    wilaya: "Tlemcen",
    status: "Active",
    date: "2026-06-01",
  },
  {
    id: 7,
    name: "Riad Mahrez",
    email: "riad.m@example.dz",
    role: "Editor",
    wilaya: "Algiers",
    status: "Active",
    date: "2026-06-15",
  },
  {
    id: 8,
    name: "Samia Khelif",
    email: "samia.k@example.dz",
    role: "Viewer",
    wilaya: "Batna",
    status: "Inactive",
    date: "2026-07-01",
  },
  {
    id: 9,
    name: "Sofiane Feghouli",
    email: "sofiane.f@example.dz",
    role: "Viewer",
    wilaya: "Oran",
    status: "Pending",
    date: "2026-07-20",
  },
  {
    id: 10,
    name: "Leila Zerrouki",
    email: "leila.z@example.dz",
    role: "Admin",
    wilaya: "Bejaia",
    status: "Active",
    date: "2026-08-05",
  },
  {
    id: 11,
    name: "Khaled Mami",
    email: "khaled.m@example.dz",
    role: "Editor",
    wilaya: "Biskra",
    status: "Active",
    date: "2026-08-12",
  },
  {
    id: 12,
    name: "Houda Benamer",
    email: "houda.b@example.dz",
    role: "Viewer",
    wilaya: "Blida",
    status: "Inactive",
    date: "2026-09-01",
  },
  {
    id: 13,
    name: "Tarek Boudebouz",
    email: "tarek.b@example.dz",
    role: "Editor",
    wilaya: "Algiers",
    status: "Pending",
    date: "2026-09-15",
  },
  {
    id: 14,
    name: "Zahra Drif",
    email: "zahra.d@example.dz",
    role: "Admin",
    wilaya: "Tizi Ouzou",
    status: "Active",
    date: "2026-10-02",
  },
  {
    id: 15,
    name: "Bilal Dziri",
    email: "bilal.d@example.dz",
    role: "Viewer",
    wilaya: "Algiers",
    status: "Active",
    date: "2026-10-20",
  },
];

const LIMIT = 5;

// quick map for colors for diffirent status
const statusColors: Record<string, string> = {
  Active: "bg-lime-100 text-lime-800",
  Inactive: "bg-pink-100 text-pink-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export default function Directory() {
  const [q, setQ] = useState(""); // use it to store search term
  const [sort, setSort] = useState<{
    col: keyof UserData | "";
    ord: "asc" | "desc";
  }>({
    col: "",
    ord: "asc",
  }); // use it for sorting purposes
  const [page, setPage] = useState(1);

  // handle filtering + sorting
  const filtered = useMemo(() => {
    let res = [...db];

    // filter  = search (logicly the search is done by the backend for optimization, but we'll do it here for demo purposes)
    if (q) {
      const lower = q.toLowerCase();
      res = res.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          u.wilaya.toLowerCase().includes(lower) ||
          u.role.toLowerCase().includes(lower) ||
          u.status.toLowerCase().includes(lower) ||
          u.date.toLowerCase().includes(lower),
      );
    }

    // sort logic
    if (sort.col) {
      const key = sort.col;
      res.sort((a, b) => {
        if (a[key] < b[key]) return sort.ord === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sort.ord === "asc" ? 1 : -1;
        return 0;
      });
    }

    return res;
  }, [q, sort]);

  // pagination math to get the number of pages and slice the data for each page
  const maxPage = Math.ceil(filtered.length / LIMIT);
  const offset = (page - 1) * LIMIT;
  const rows = filtered.slice(offset, offset + LIMIT);

  const toggleSort = (col: string) => {
    const key = col as keyof UserData;
    let newOrd: "asc" | "desc" = "asc";

    if (sort.col === key && sort.ord === "asc") {
      newOrd = "desc";
    }
    setSort({ col: key, ord: newOrd });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header section */}
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">
            User listing - Laravel Full Stack Developer Test
          </h1>

          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              className="focus:ring-sky-500 focus:border-sky-500 block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 text-gray-600"
              placeholder="Search..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1); // reset to page 1 on  each search so we don't have empty pages
              }}
            />
            {/* i will get the svg of magnifaying glass from https://www.svgrepo.com/svg/511119/search-magnifying-glass?edit=true  */}
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#9d9d9d"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="Interface / Search_Magnifying_Glass">
                    {" "}
                    <path
                      id="Vector"
                      d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
                      stroke="#9b9b9b"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </span>
          </div>
        </div>

        {/* Table section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Email", "Role", "Wilaya", "Status", "Date"].map(
                    (h) => {
                      const k =
                        h.toLowerCase() === "date"
                          ? "date"
                          : (h.toLowerCase() as keyof UserData);
                      return (
                        <th
                          key={k}
                          className="cursor-pointer select-none px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                          onClick={() => toggleSort(k === "date" ? "date" : k)}
                        >
                          {h}
                          {/* we add a sorting indicator */}
                          {sort.col === (k === "date" ? "date" : k) ? (
                            <span className="ml-1 text-sky-600">
                              {sort.ord === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="ml-1 text-gray-300">↕</span>
                          )}
                        </th>
                      );
                    },
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.length > 0 ? (
                  rows.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {u.role}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {u.wilaya}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[u.status] || "bg-gray-100 text-gray-800"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {u.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      No matching records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination  */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{maxPage || 1}</span>
              </p>

              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {/* we loop throu pages , PS: I didnt limit the number of visible pages, we display all pages */}
                {[...Array(maxPage)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium cursor-pointer ${
                      page === i + 1
                        ? "border-sky-500 bg-sky-50 text-sky-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  disabled={page === maxPage || !maxPage}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>

            {/* pagination for small screens like mobile  */}
            <div className="flex w-full justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium disabled:opacity-50 text-gray-500"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                disabled={page === maxPage}
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium disabled:opacity-50 text-gray-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
