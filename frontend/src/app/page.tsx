import TestButton from "../components/TestButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Frontend Test</h1>
      <TestButton />
    </main>
  );
}
