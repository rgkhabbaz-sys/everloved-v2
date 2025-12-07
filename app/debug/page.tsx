export default function DebugPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-6xl font-bold mb-4 text-red-500">DEBUG V2 PAGE</h1>
            <p className="text-2xl">If you can see this, the deployment IS working.</p>
            <p className="mt-8 text-gray-400">Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
