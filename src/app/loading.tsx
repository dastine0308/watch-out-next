export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    </div>
  );
}
