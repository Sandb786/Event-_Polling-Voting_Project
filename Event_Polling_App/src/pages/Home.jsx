export default function Home() 
{
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Event & Polling App</h1>
        <h3>{localStorage.getItem("token")}</h3>
        <p className="text-gray-600">Create events, invite friends, and vote on polls!</p>
      </div>
    </div>
  );
}
