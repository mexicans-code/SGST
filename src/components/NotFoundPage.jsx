export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 mt-5" >
            <div className="text-center bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full border">
                
                <h1 className="text-7xl font-extrabold text-red-500">404</h1>

                <h2 className="mt-4 text-3xl font-bold text-gray-800">
                    Página no encontrada
                </h2>

                <p className="mt-2 text-gray-600 text-lg">
                    Lo sentimos, la página que buscas no existe o fue movida.
                </p>

                <div className="mt-6">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="
                            px-6 py-3 bg-primary text-white font-semibold rounded-xl 
                            shadow-lg hover:bg-primary-dark transition-all duration-300
                        "
                    >
                        Volver al inicio
                    </button>
                </div>

                <div className="mt-10">
                    <div className="mx-auto w-48 h-48">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                            alt="Not found"
                            className="opacity-80 hover:opacity-100 transition duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
