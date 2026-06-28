export default function AdminSelectionPage({ params }: { params: { selectionId: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selection Result</h1>
        <p className="text-muted-foreground mt-2">Manage success story details.</p>
      </div>
      <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <p className="text-muted-foreground">Selection form implementation coming soon.</p>
      </div>
    </div>
  );
}
