// app/components/DynamicSection.jsx
export async function DynamicSection() {
  const res = await fetch('https://dummyjson.com/users?limit=100', {
    cache: 'no-store', // ensures it's fetched on every request (dynamic)
  });

  const data = await res.json();
  const users = data.users;

  return (
    <div className="p-4 bg-blue-100 rounded mt-4">
      <h2 className="font-semibold text-lg mb-4">Dynamic User List (100)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white rounded shadow text-sm space-y-1"
          >
            <p className="font-semibold">{user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <p>Location: {user.address.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
