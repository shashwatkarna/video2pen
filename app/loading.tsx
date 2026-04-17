export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="brutalist-card bg-white p-8 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <h2 className="font-black text-xl italic uppercase">Waking up the Pro Brain...</h2>
      </div>
    </div>
  );
}
