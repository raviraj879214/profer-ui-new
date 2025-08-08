

// app/components/StaticSection.jsx
export  function StaticSection() {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h1 className="text-xl font-bold">Welcome to the site!</h1>
      <p>This section is prerendered at build time.</p>
    </div>
  );
}
