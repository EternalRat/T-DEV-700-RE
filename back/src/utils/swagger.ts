import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Documentation de l'API",
        },
        servers: [
            {
                url: "http://localhost:8080/api",
            },
        ],
    },
    apis: ["./build/routes/**/*.js", "./build/index.js"],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
