import { hash } from "bcryptjs";
import { CreateUserRequest } from "../../models/interfaces/user/CreateUserRequest";
import User from "../../models/User"; // Importa o modelo Mongoose

class CreateUserService {
    async execute({ name, email, password }: CreateUserRequest) {
        console.log("execute create user");
        if (!email) {
            throw new Error("Email incorrect");
        }

        // Verificar se o usuário já existe
        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            throw new Error("Email already exists");
        }

        // Criptografar a senha
        const passwordHash = await hash(password, 8);

        // Criar novo usuário
        const user = new User({
            name,
            email,
            password: passwordHash,
        });

        // Salvar no MongoDB
        await user.save();

        // Retornar usuário criado sem a senha
        return {
            id: user._id,
            //   name: user.name,
            email: user.email,
        };
    }
}

export { CreateUserService };
