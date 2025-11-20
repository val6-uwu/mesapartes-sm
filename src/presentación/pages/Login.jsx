import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../data/Firebase/firebaseConfig";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../Styles/login.css";
import logo from "../../assets/logo-san-miguel.jpg";
import colegio from "../../assets/Colegio-San-Miguel-.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Intentar iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Obtener el rol desde Firestore
      const userDocRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        setError("No tienes permiso para acceder al sistema.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const userRole = userData.rol;

      // ✅ Registrar inicio de sesión en Firestore
      await addDoc(collection(db, "historial"), {
        accion: "inicio_sesion",
        usuario: user.email || "Usuario desconocido",
        rol: userRole,
        fecha: serverTimestamp(),
        tramite: null,
        estado: null,
        prioridad: null,
        areaAsignada: null,
        expediente: null,
        observaciones: `Usuario con rol ${userRole} inició sesión`,
      });

      // 🔹 Redirigir según el rol
      switch (userRole) {
        case "admin":
          navigate("/DashboardPrinc", { replace: true });
          break;
        case "secretaria":
          navigate("/dashboard-secretaria", { replace: true });
          break;
        case "subdireccion":
          navigate("/dashboard-subdireccion", { replace: true });
          break;
        default:
          setError("Rol no reconocido. Contacta al administrador.");
          await auth.signOut();
          setLoading(false);
          return;
      }

    } catch (err) {
      console.error("Error en login:", err.code);
      if (err.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo.");
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta.");
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de correo inválido.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={colegio} alt="Colegio San Miguel" />
      </div>
      <div className="login-right">
        <div className="login-header">
          <img src={logo} alt="Escudo San Miguel" className="logo" />
          <div>
            <h2>SAN MIGUEL</h2>
            <p>
              Sistema de Gestión Documental <br /> Mesa de Partes
            </p>
          </div>
        </div>
        <div className="login-form-box">
          <h3>Iniciar Sesión</h3>
          <p>Ingresa tus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@colegio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <a href="#" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>

            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;