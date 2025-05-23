function Top() {
    return ( 
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold">Customers</h1>
            <div className="flex items-center gap-3">
                <button className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:shadow-lg">
                    + New
                </button>
            </div>
        </div>
     );
}

export default Top;