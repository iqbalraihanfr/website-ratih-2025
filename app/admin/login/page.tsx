import { login } from "@/app/actions/auth";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Admin Login
        </h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none"
              placeholder="admin@ratih.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-yellow-500 px-4 py-2 font-semibold text-zinc-900 hover:bg-yellow-400 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
