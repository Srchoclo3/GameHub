// =======================
// CONFIG
// =======================
const API_URL = "https://gameblog-d8ac.onrender.com"; // Cambia si usas otro dominio

// =======================
// MODO OSCURO / CLARO
// =======================
const themeToggleBtn = document.createElement("button");
themeToggleBtn.textContent = "🌓";
themeToggleBtn.style.position = "fixed";
themeToggleBtn.style.bottom = "20px";
themeToggleBtn.style.right = "20px";
themeToggleBtn.style.padding = "10px";
document.body.appendChild(themeToggleBtn);

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode") ? "light" : "dark"
    );
});

// =======================
// LOGIN
// =======================
const loginForm = document.querySelector("form[action='/login']");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

            localStorage.setItem("token", data.token);
            alert("✅ Inicio de sesión exitoso");
            window.location.href = "/perfil"; // Redirigir al perfil
        } catch (err) {
            alert("❌ " + err.message);
        }
    });
}

// =======================
// REGISTRO
// =======================
const registerForm = document.querySelector("form[action='/registro']");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = registerForm.username.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al registrarse");

            alert("✅ Registro exitoso, ahora inicia sesión");
            window.location.href = "/login";
        } catch (err) {
            alert("❌ " + err.message);
        }
    });
}

// =======================
// PERFIL
// =======================
async function cargarPerfil() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/profile`, {
            headers: { Authorization: token }
        });
        const user = await res.json();
        if (!res.ok) throw new Error(user.message);

        const perfilDiv = document.querySelector("#perfil");
        if (perfilDiv) {
            perfilDiv.innerHTML = `
                <h2>Hola, ${user.username}</h2>
                <img src="${user.profileImage || '/default.png'}" alt="Foto de perfil" width="120">
                <p>Email: ${user.email}</p>
                <input type="file" id="fileInput">
                <button id="uploadBtn">Subir Imagen</button>
            `;

            document.querySelector("#uploadBtn").addEventListener("click", subirImagen);
        }
    } catch (err) {
        console.error(err);
    }
}

// =======================
// SUBIR IMAGEN
// =======================
async function subirImagen() {
    const file = document.querySelector("#fileInput").files[0];
    if (!file) return alert("Selecciona una imagen");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
        const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: { Authorization: token },
            body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert("✅ Imagen subida correctamente");
        location.reload();
    } catch (err) {
        alert("❌ " + err.message);
    }
}

// =======================
// ANIMACIONES AL SCROLL
// =======================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".feature-card, .projects-card").forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
});

// =======================
// EJECUTAR PERFIL SI EXISTE
// =======================
cargarPerfil();

// =======================
// MENU HAMBURGUESA
// =======================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navbar nav ul");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}