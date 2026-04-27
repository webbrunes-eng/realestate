import { getDict } from "@/lib/i18n";

export default async function ListPropertyPage() {
  const { dict } = await getDict();
  return (
    <div className="container py-16 max-w-3xl text-center">
      <h1 className="heading">{dict.listProperty.title}</h1>
      <p className="subheading mx-auto mt-4">{dict.listProperty.sub}</p>
      <form className="card p-8 mt-10 text-left space-y-4 shadow-card-lg">
        <input className="input" placeholder={dict.listProperty.fullName} required />
        <input className="input" type="email" placeholder={dict.listProperty.email} required />
        <input className="input" placeholder={dict.listProperty.phone} required />
        <select className="input" required>
          <option value="">{dict.listProperty.type}</option>
          <option>Apartment</option><option>Villa</option><option>Duplex</option>
          <option>Office</option><option>Shop</option><option>Land</option>
        </select>
        <input className="input" placeholder={dict.listProperty.location} />
        <textarea className="input resize-none" rows={4} placeholder={dict.listProperty.tellUs} />
        <button className="btn-primary w-full">{dict.listProperty.submit}</button>
      </form>
    </div>
  );
}
