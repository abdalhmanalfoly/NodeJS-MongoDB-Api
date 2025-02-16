document.addEventListener("DOMContentLoaded", function () {
    const container = document.createElement("div");
    container.style.fontFamily = "Arial, sans-serif";
    container.style.margin = "40px";
    container.style.lineHeight = "1.6";

    function createElement(tag, text, parent, className = "") {
        const element = document.createElement(tag);
        element.textContent = text;
        if (className) element.className = className;
        parent.appendChild(element);
        return element;
    }

    function createPreformatted(codeText, parent) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = codeText;
        pre.style.background = "#f4f4f4";
        pre.style.padding = "10px";
        pre.style.borderRadius = "5px";
        pre.appendChild(code);
        parent.appendChild(pre);
    }

    createElement("h1", "REST API with Express.js & MongoDB", container);
    createElement("p", "This project is a REST API built using Express.js and integrated with MongoDB via Mongoose. The API provides endpoints for managing users and courses, utilizing JWT authentication.", container);
    
    createElement("h2", "Base URL", container);
    createPreformatted("https://satisfactory-teddy-abdalrhmangroup-f18e5404.koyeb.app/api/", container);
    
    createElement("h2", "Technologies Used", container);
    const techList = ["Node.js", "Express.js", "MongoDB & Mongoose", "JWT", "bcrypt.js", "dotenv", "morgan", "CORS", "Multer"];
    const ul = document.createElement("ul");
    techList.forEach(tech => createElement("li", tech, ul));
    container.appendChild(ul);
    
    createElement("h2", "Project Setup", container);
    createElement("h3", "1. Install Dependencies", container);
    createPreformatted("npm install express mongoose dotenv jsonwebtoken bcryptjs cors morgan multer", container);
    
    createElement("h3", "2. Environment Variables", container);
    createPreformatted("MONGO_URL=your_mongodb_connection_string\nJSONWEBTOKEN_SECRET_KEY=your_secret_key\nPORT=5000", container);
    
    createElement("h3", "3. Start the Server", container);
    createPreformatted("node index.js", container);
    
    createElement("h2", "API Endpoints", container);
    
    const endpoints = {
        "Course Management": [
            { method: "GET", path: "/api/courses", desc: "Get All Courses" },
            { method: "GET", path: "/api/courses/:courseId", desc: "Get a Single Course" },
            { method: "POST", path: "/api/courses", desc: "Create a New Course" },
            { method: "PATCH", path: "/api/courses/:courseId", desc: "Update a Course" },
            { method: "DELETE", path: "/api/courses/:courseId", desc: "Delete a Course" },
        ],
        "User Management": [
            { method: "GET", path: "/api/users", desc: "Get All Users" },
            { method: "POST", path: "/api/users/register", desc: "User Registration" },
            { method: "POST", path: "/api/users/login", desc: "User Login" },
        ]
    };

    for (let section in endpoints) {
        createElement("h3", section, container);
        endpoints[section].forEach(ep => {
            createElement("h4", ep.desc, container);
            createPreformatted(`${ep.method} ${ep.path}`, container);
        });
    }
    
    createElement("h2", "File Uploads", container);
    createElement("p", "Multer is used for handling file uploads.", container);
    
    createElement("h2", "Authentication & Authorization", container);
    createElement("p", "Users receive a JWT token upon registration or login.", container);
    
    createElement("h2", "Error Handling", container);
    const errorList = [
        "Validation Errors: 400 Bad Request",
        "Unauthorized Access: 401 Unauthorized",
        "Resource Not Found: 404 Not Found"
    ];
    const errorUl = document.createElement("ul");
    errorList.forEach(err => createElement("li", err, errorUl));
    container.appendChild(errorUl);
    
    createElement("h2", "Conclusion", container);
    createElement("p", "This REST API provides a secure and scalable way to manage courses and users.", container);
    
    createElement("h2", `Server created by  ABDALRHMAN FOLY `, container);
    const link = document.createElement("a");
    link.href = "https://portfolio-me-main.vercel.app/";
    link.textContent = "FIND ME IN MY PORTFOLIO";
    link.style.color = "slateblue";
    container.appendChild(link);
    
    document.body.appendChild(container);
});
