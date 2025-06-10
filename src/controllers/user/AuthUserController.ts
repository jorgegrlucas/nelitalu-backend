import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";
import { AuthUserRequest } from "../../models/interfaces/user/AuthUserRequest";

class AuthUserController {
    async handle(request: Request, response: Response) {
        const { email, password }: AuthUserRequest = request.body;
        const authUserService = new AuthUserService();

        try {
            const auth = await authUserService.execute({ email, password });
            return response.json(auth);
        } catch (err: any) {
            return response.status(500).json({
                error: err.message,
            });
        }
    }
}

export { AuthUserController };
