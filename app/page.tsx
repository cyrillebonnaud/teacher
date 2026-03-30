export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import AddChildForm from "@/components/add-child-form";

export default async function DashboardPage() {
  const session = await getSession().catch(() => null);
  if (!session) redirect("/login");
  if (session.type === "child") redirect(`/children/${session.id}`);
  const parent = session;

  const { data: children } = await supabase
    .from("children")
    .select("id, first_name, level, access_code")
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: true });

  // Get sequence + eval counts per child
  const childIds = (children ?? []).map((c) => c.id);
  let sequenceCounts: Record<string, number> = {};
  let lastEvalDates: Record<string, string | null> = {};

  if (childIds.length > 0) {
    const { data: seqData } = await supabase
      .from("sequences")
      .select("id, child_id, evaluations(submitted_at)")
      .in("child_id", childIds);

    for (const seq of seqData ?? []) {
      if (!seq.child_id) continue;
      sequenceCounts[seq.child_id] = (sequenceCounts[seq.child_id] ?? 0) + 1;
      for (const ev of (seq.evaluations as { submitted_at: string | null }[]) ?? []) {
        if (ev.submitted_at) {
          const current = lastEvalDates[seq.child_id];
          if (!current || ev.submitted_at > current) {
            lastEvalDates[seq.child_id] = ev.submitted_at;
          }
        }
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes enfants</h1>
      </div>

      {(children ?? []).length === 0 ? (
        <div className="text-center py-10 mb-8">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <p className="text-gray-500 text-lg mb-2">Aucun enfant pour l&apos;instant</p>
          <p className="text-gray-400 text-sm mb-6">
            Ajoute un enfant pour commencer à suivre ses révisions
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 mb-8">
          {(children ?? []).map((child) => {
            const seqCount = sequenceCounts[child.id] ?? 0;
            const lastEval = lastEvalDates[child.id];
            return (
              <Link
                key={child.id}
                href={`/children/${child.id}`}
                className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-4 hover:border-blue-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                  {child.first_name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{child.first_name}</p>
                  <p className="text-sm text-gray-500">
                    {child.level} · code: <span className="font-mono">{child.access_code}</span>
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400 shrink-0">
                  <p>{seqCount} séquence{seqCount !== 1 ? "s" : ""}</p>
                  {lastEval && (
                    <p>
                      dernier quiz{" "}
                      {new Date(lastEval).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}

      <AddChildForm parentId={parent.id} />
    </div>
  );
}
