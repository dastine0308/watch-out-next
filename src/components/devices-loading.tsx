export default function DevicesLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
        <p className="text-sm text-slate-500">Loading devices...</p>
      </div>
    </div>
  );
}
