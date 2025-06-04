import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AuthUserRequest } from "../../models/interfaces/user/AuthUserRequest";
import User from "../../models/User"; // modelo do Mongoose

async function gerarHash(password: string) {
    // 8 é o custo de salt; ajuste conforme necessário
    const senhaHash = await hash(password, 8);

    return senhaHash;
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {
        if (!email) {
            throw new Error("Email precisa ser enviado!");
        }

        if (!password) {
            throw new Error("A senha precisa ser enviada!");
        }

        // Buscar usuário no MongoDB usando Mongoose
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Wrong username or password!");
        }

        // const senhaHash = await gerarHash(user.password);
        // Comparar senhas
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Wrong password");
        }

        // Gerar token JWT
        const token = sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            {
                subject: user._id.toString(), // ID do MongoDB como string
                expiresIn: "30d",
            },
        );

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        };
    }
}

export { AuthUserService };
