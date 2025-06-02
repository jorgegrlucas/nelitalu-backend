import { Request, Response } from "express";
import { CreateUserRequest } from "../../models/interfaces/user/CreateUserRequest";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
    async handle(request: Request, response: Response) {
        const { name, email, password } = request.body as CreateUserRequest;
        console.log("handle", name, email, password);

        // Validação de campos (opcional, mas recomendado)
        if (!name || !email || !password) {
            return response
                .status(400)
                .json({ error: "Missing required fields" });
        }

        const createUserService = new CreateUserService();

        try {
            const user = await createUserService.execute({
                name,
                email,
                password,
            });

            return response.status(201).json(user);
        } catch (error: any) {
            console.error("Erro ao criar usuário:", error);
            return response.status(400).json({ error: error.message });
        }
    }
}

export { CreateUserController };
