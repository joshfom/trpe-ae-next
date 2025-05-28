import "../globals.css";

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <h1 className="text-4xl font-bold text-primary">Tailwind CSS v4 Test</h1>
      <div className="mt-4 rounded-lg bg-card p-6 shadow-lg">
        <p className="text-card-foreground">
          If this text is styled, Tailwind CSS is working!
        </p>
        <button className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Styled Button
        </button>
      </div>
    </div>
  );
}
