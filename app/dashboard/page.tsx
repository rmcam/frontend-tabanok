const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-slate-200">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 bg-black">
        <div className="aspect-video rounded-xl bg-muted/50 bg-slate-600" />
        <div className="aspect-video rounded-xl bg-muted/50 bg-gray-900" />
        <div className="aspect-video rounded-xl bg-muted/50 bg-gray-900" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min bg-red-700" />
      
    </div>
  );
};

export default DashboardPage;
