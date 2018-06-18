import * as argon2 from "argon2";

export default class Auth {

    public static async LoginWithEmail(rkInstance, email: string, password: string) {
        const testHash = `$argon2i$v=19$m=4096,t=3,p=1$QcNE1jCubspYMQsyU3peIQ$WMHETbkACWZcblgjtjCtfUEk0pB3jGST9c0LlizcBrg`;
        const isValid = await argon2.verify(testHash, password);

        return isValid;


    }


}