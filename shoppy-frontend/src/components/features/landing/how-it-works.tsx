import { CreditCard, Radio, Tag } from "lucide-react";

const steps = [
  { icon: Tag, title: "List it", body: "Add a name, description, price and an optional photo. It appears in the marketplace immediately." },
  { icon: CreditCard, title: "Buyer pays with Stripe", body: "Checkout happens on Stripe's own page, so card details never touch our servers." },
  { icon: Radio, title: "It's marked sold", body: "Stripe confirms the payment, the listing flips to sold, and sellers get a notification in real time." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">From listing to sold in three steps</h2>
      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Icon className="size-6" /></span>
              <span className="font-display text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
