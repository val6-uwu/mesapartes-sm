import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../data/Firebase/firebaseConfig";

// Escucha los trámites en tiempo real
export const listenTramites = (callback) => {
    const unsub = onSnapshot(collection(db, "tramites"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(data);
    });

    return unsub; // Devuelve la función para detener la escucha
};

// Actualiza el estado o campos del trámite (por ejemplo, marcar como rechazado)
export const updateTramite = async(id, nuevosDatos) => {
    const ref = doc(db, "tramites", id);
    await updateDoc(ref, nuevosDatos);
};