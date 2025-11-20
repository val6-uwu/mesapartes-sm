// src/presentación/components/ProtectedRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../data/Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      
      // Si no hay usuario autenticado, redirigir al login
      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Obtener el documento del usuario desde Firestore
        const userDocRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserRole(userData.rol);
          setIsAuthenticated(true);
        } else {
          // Si no existe el documento, no está autorizado
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Verificar autenticación al montar el componente
    checkAuth();

    // Listener para cambios en la autenticación (por si cierra sesión en otra pestaña)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuth();
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Mientras verifica la autenticación, muestra pantalla de carga
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
        backgroundColor: "#18181859",
        fontFamily: "Poppins, sans-serif"
      }}>
        <div style={{
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "1rem"
          }}>⏳</div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado pero no tiene el rol permitido, redirigir a acceso denegado
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si todo está bien, mostrar el componente hijo
  return children;
};

export default ProtectedRoute;