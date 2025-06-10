import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AuthUserRequest } from "../../models/interfaces/user/AuthUserRequest";
import User from "../../models/User";

async function gerarHash(password: string) {
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

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Wrong username or password!");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Wrong password");
        }

        const token = sign(
            {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET as string,
            {
                subject: user._id.toString(),
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
