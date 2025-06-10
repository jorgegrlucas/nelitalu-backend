import { hash } from "bcryptjs";
import { CreateUserRequest } from "../../models/interfaces/user/CreateUserRequest";
import User from "../../models/User";

class CreateUserService {
    async execute({ name, email, password }: CreateUserRequest) {
        if (!email) {
            throw new Error("Email incorrect");
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            throw new Error("Email already exists");
        }

        const passwordHash = await hash(password, 8);

        const user = new User({
            name,
            email,
            password: passwordHash,
        });

        await user.save();

        return {
            id: user._id,
            email: user.email,
        };
    }
}

export { CreateUserService };
