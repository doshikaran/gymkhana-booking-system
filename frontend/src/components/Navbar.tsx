"use client";
import { clearToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const sport = useAuthStore((s) => s.sport);
  const logout = useAuthStore((s) => s.logout);
  const setSport = useAuthStore((s) => s.setSport);
  const router = useRouter();
  const pathname = usePathname();

  // Hide navbar entirely on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register"))
    return null;

  const onLogout = () => {
    clearToken();
    Cookies.remove("access_token");
    logout();
    router.push("/login");
  };

  const onLogoClick = () => {
    setSport(null);
    router.push("/select-sport");
  };

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-md mx-auto flex items-center justify-between p-3">
        <button
          onClick={onLogoClick}
          className="font-semibold text-black text-sm flex items-center gap-1 tracking-widest hover:text-primary transition"
        >
          🏸 <span>Jolly Sport Center</span>
        </button>

        <div className="flex gap-3 text-sm items-center">
          {user ? (
            <>
              {sport && (
                <span className=" tracking-wider font-thin text-gray-600">
                  {sport}
                </span>
              )}
              <Link href="/book" className="hover:text-primary">
                Book
              </Link>
              <Link href="/history" className="hover:text-primary">
                History
              </Link>
              <button onClick={onLogout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
