import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <p className="font-display text-8xl font-bold gradient-text">404</p>
      <h1 className="heading mt-4">Property not found</h1>
      <p className="subheading mx-auto mt-3">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="btn-primary mt-8">Back home</Link>
    </div>
  );
}
