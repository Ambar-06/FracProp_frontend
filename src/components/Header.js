import Link from "next/link";

export function Header() {
  return (
    <header className="bg-green-500 text-white p-4 shadow-md">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">FracProp</h1>
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/properties" className="hover:underline">
              Properties
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </li>
          <li>
            <Link href="/signup" className="hover:underline">
              Signup
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
