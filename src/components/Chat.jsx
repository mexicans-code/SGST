import React, { useState, useEffect, useRef } from "react";
import { Send, X, User, Phone, Mail, Minimize2 } from "lucide-react";
import { io } from "socket.io-client";

import { GATEWAY_URL } from "../const/Const";

export default function ChatModal({ isOpen, onClose, anfitrion, establecimiento }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);


    // Conectar a Socket.IO cuando se abre el chat
    useEffect(() => {
        if (isOpen && anfitrion && establecimiento) {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No hay token de autenticación");
                return;
            }

            // Obtener IDs correctos
            const establecimientoId = establecimiento.tipo === 'experiencia'
                ? establecimiento.id_experiencia
                : (establecimiento.id_hosteleria || establecimiento.id_establecimiento);
            
            const anfitrionId = anfitrion.id_usuario; // ✅ CORREGIDO

            if (!establecimientoId || !anfitrionId) {
                console.error("Faltan IDs:", { 
                    establecimientoId, 
                    anfitrionId,
                    establecimiento,
                    anfitrion 
                });
                return;
            }

            console.log("🔌 Conectando al chat con:", {
                establecimientoId,
                anfitrionId,
                tipo: establecimiento.tipo
            });

            // Crear conexión con Socket.IO
            socketRef.current = io(`${GATEWAY_URL}/chat`, {
                auth: {
                    token: token
                }
            });

            // Eventos de Socket.IO
            socketRef.current.on("connect", () => {
                console.log("✅ Conectado al chat");
                setConnected(true);

                // Unirse a la sala específica
                socketRef.current.emit("join chat", {
                    establecimiento_id: establecimientoId,
                    anfitrion_id: anfitrionId
                });
            });

            socketRef.current.on("disconnect", () => {
                console.log("❌ Desconectado del chat");
                setConnected(false);
            });

            socketRef.current.on("connect_error", (error) => {
                console.error("Error de conexión:", error.message);
                setConnected(false);
            });

            // Recibir mensajes previos
            socketRef.current.on("previous messages", (previousMessages) => {
                console.log("📨 Mensajes previos cargados:", previousMessages);
                setMessages(previousMessages);
            });

            // Recibir nuevos mensajes
            socketRef.current.on("chat message", (message) => {
                console.log("📩 Nuevo mensaje recibido:", message);
                setMessages(prev => [...prev, message]);
            });

            // Manejar errores del servidor
            socketRef.current.on("error", (error) => {
                console.error("❌ Error del servidor:", error.message);
                alert(error.message);
            });

            // Cleanup al cerrar
            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        }
    }, [isOpen, anfitrion, establecimiento]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        if (!socketRef.current || !connected) {
            alert("No estás conectado al chat. Intenta recargar la página.");
            return;
        }

        // Obtener IDs
        const establecimientoId = establecimiento?.tipo === 'experiencia'
            ? establecimiento?.id_experiencia
            : (establecimiento?.id_hosteleria || establecimiento?.id_establecimiento);
        
        const anfitrionId = anfitrion?.id_usuario; // ✅ CORREGIDO

        if (!establecimientoId || !anfitrionId) {
            console.error("No se pudieron obtener los IDs", {
                establecimientoId,
                anfitrionId
            });
            return;
        }

        console.log("📤 Enviando mensaje:", {
            message: newMessage,
            anfitrionId,
            establecimientoId
        });

        // Enviar mensaje al servidor
        socketRef.current.emit("chat message", {
            message: newMessage.trim(),
            anfitrion_id: anfitrionId,
            establecimiento_id: establecimientoId
        });

        setNewMessage("");
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener datos del usuario actual desde el token
    const getCurrentUser = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.id_usuario,
                nombre: payload.nombre
            };
        } catch (error) {
            return null;
        }
    };

    const currentUser = getCurrentUser();

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: minimized ? '20px' : '20px',
                right: '20px',
                zIndex: 9999,
                width: minimized ? '320px' : '380px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Header */}
            <div
                style={{
                    backgroundColor: connected ? '#CD5C5C' : '#6c757d',
                    color: 'white',
                    padding: '16px',
                    cursor: minimized ? 'pointer' : 'default'
                }}
                onClick={() => minimized && setMinimized(false)}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            }}
                        >
                            <User size={20} />
                            {/* Indicador de conexión */}
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: connected ? '#28a745' : '#dc3545',
                                    border: '2px solid white'
                                }}
                            />
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                                {anfitrion?.nombre || 'Anfitrión'}
                            </h6>
                            <small style={{ opacity: 0.9, fontSize: '12px' }}>
                                {establecimiento?.nombre || establecimiento?.titulo || 'Chat General'}
                            </small>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMinimized(!minimized);
                            }}
                            style={{
                                color: 'white',
                                background: 'none',
                                border: 'none',
                                width: '24px',
                                height: '24px'
                            }}
                        >
                            <Minimize2 size={16} />
                        </button>
                        <button
                            className="btn btn-sm p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{
                                color: 'white',
                                background: 'none',
                                border: 'none',
                                width: '24px',
                                height: '24px'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content - Solo visible cuando no está minimizado */}
            {!minimized && (
                <>
                    {/* Contact Info */}
                    <div style={{ padding: '12px 16px', backgroundColor: '#F4EFEA' }}>
                        <div className="d-flex gap-3 small text-muted align-items-center" style={{ fontSize: '12px' }}>
                            {!connected && (
                                <span className="text-danger">
                                    ⚠️ Desconectado
                                </span>
                            )}
                            {anfitrion?.telefono && (
                                <span>
                                    <Phone size={12} className="me-1" />
                                    {anfitrion.telefono}
                                </span>
                            )}
                            {anfitrion?.email && (
                                <span>
                                    <Mail size={12} className="me-1" />
                                    {anfitrion.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            height: '400px',
                            overflowY: 'auto',
                            padding: '16px',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <p>No hay mensajes aún</p>
                                <small>Envía el primer mensaje</small>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isOwnMessage = message.user_id === currentUser?.id;

                                return (
                                    <div
                                        key={message.id}
                                        className={`d-flex mb-3 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '75%',
                                                padding: '10px 14px',
                                                borderRadius: '12px',
                                                backgroundColor: isOwnMessage ? '#CD5C5C' : 'white',
                                                color: isOwnMessage ? 'white' : '#333',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {!isOwnMessage && (
                                                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.8 }}>
                                                    {message.user_name}
                                                </div>
                                            )}
                                            <p className="mb-1" style={{ fontSize: '13px', margin: 0 }}>
                                                {message.content}
                                            </p>
                                            <small
                                                style={{
                                                    fontSize: '10px',
                                                    opacity: 0.7,
                                                    display: 'block',
                                                    marginTop: '4px'
                                                }}
                                            >
                                                {formatTime(message.created_at)}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {loading && (
                            <div className="d-flex mb-3">
                                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'white' }}>
                                    <div className="spinner-border spinner-border-sm text-muted" role="status">
                                        <span className="visually-hidden">Escribiendo...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '12px 16px', backgroundColor: 'white', borderTop: '1px solid #e9ecef' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={connected ? "Escribe un mensaje..." : "Conectando..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                disabled={!connected}
                                style={{
                                    border: '2px solid #e9ecef',
                                    borderRadius: '20px 0 0 20px',
                                    fontSize: '13px'
                                }}
                            />
                            <button
                                type="button"
                                className="btn text-white"
                                onClick={handleSendMessage}
                                style={{
                                    backgroundColor: connected ? '#CD5C5C' : '#6c757d',
                                    borderRadius: '0 20px 20px 0',
                                    minWidth: '50px'
                                }}
                                disabled={!newMessage.trim() || loading || !connected}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}