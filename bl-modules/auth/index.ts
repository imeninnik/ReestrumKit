import * as argon2 from "argon2";

export default class Auth {

    public static async LoginWithEmail(rkInstance, email: string, password: string, fingerprint?: string) {
        // find user by email
        // find users salt
        // check if valid
        const user = await rkInstance.Models.User.GetOneByContactEndPoint('email', email);
        const crypto = await user.getCrypto();

        const isValid = await argon2.verify(crypto.value, password);

        return isValid;

    }


}