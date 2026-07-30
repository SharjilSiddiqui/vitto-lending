import type { ReactNode } from "react";

type CardProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function Card({ title, icon, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        {icon ? <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-primary">{icon}</div> : null}
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}
