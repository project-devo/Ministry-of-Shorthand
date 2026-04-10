import { getAdminInquiries } from "@/lib/admin";

const AdminInquiriesPage = async () => {
  const inquiries = await getAdminInquiries();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Inquiries</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Admission and course leads
        </h1>
      </div>

      <div className="space-y-4">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{inquiry.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email} | {inquiry.phone}
                    </p>
                  </div>
                  <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {inquiry.interest}
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {inquiry.message}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Status: {inquiry.status}</p>
                  <p>
                    Received:{" "}
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(inquiry.createdAt)}
                  </p>
                  <a href={`mailto:${inquiry.email}`} className="block text-primary hover:underline">
                    Reply by email
                  </a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            No inquiries have been submitted yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiriesPage;
