

export default function PageNotFound() {
    return (
        <div className="container">
            <h1 className="text-center">404 - Página no encontrada</h1>
            <p className="text-center">Lo siento, la página que estás buscando no existe.</p>

            <div className="text-center">
                <button 
                className="btn btn-primary"
                onClick={() => window.location.href = "/"}
                >Volver al inicio</button>
            </div>
        </div>
    );
}