import * as argon2 from "argon2";
import getUUID from "../../dal/Helpers/getUUID";
import { IBasicUser } from "../../reestrumKit.interfaces";

interface IResponse {
    error?: boolean;
    message: string;
    user: IBasicUser
}

export default class Register {
    public static addUser(IBasicUser) {

    }

    public static async RegisterByEmail(rkInstance, email: string): Promise<IResponse> {
        try {

            // check for contact end point with this value (email)
            // then if no -> go and create new endpoint and new person
            // if there any endpoint with this value, then say: is not possible (and collect this data?)
            const contactEndPoint = await rkInstance.Models.ContactEndpoint.FindOneByTypeAndValue('email', email);

            let resp: IResponse;

            if (contactEndPoint) resp = await Register._HandleRegistrationWithExistingEndPoint(rkInstance, contactEndPoint);
            if (!contactEndPoint ) resp = await Register._HandleRegistrationWithoutExistingEndPoint(rkInstance, email);


            return resp;

        } catch (err) {
           console.log(33, err);
        }


    }

    private static async _HandleRegistrationWithExistingEndPoint(rkInstance, contactEndPoint) {
        if (contactEndPoint.verified) return {error: true, message: 'This email already in use'};
        // create user and crypto
        const user = await Register._CreateUserWithPassAndCrypto(rkInstance);

        return user;
    }

    private static async _HandleRegistrationWithoutExistingEndPoint(rkInstance, email:string): Promise<IResponse> {
        // create conact end-point
        // create user and crypto
        const person = new rkInstance.Models.Person();
        await person.save();

        const endPoint = new rkInstance.Models.ContactEndpoint();

        endPoint.person_uuid = person.id;
        endPoint.type = 'email';
        endPoint.value = email;
        await endPoint.save();

        const user = await Register._CreateUserWithPassAndCrypto(rkInstance);

        const message = 'New user has been created';
        console.log(message);

        return {user, message};

    }

    private static async _CreateUserWithPassAndCrypto(rkInstance) {
        const tempPass = getUUID();
        const hash = await argon2.hash(tempPass, { raw: false });

        const cryptoItem = new rkInstance.Models.Crypto('salt', hash);
        await cryptoItem.save();

        const user = new rkInstance.Models.User();
        user.crypto_id = cryptoItem.id;
        user.password = tempPass;
        await user.save();

        return user;
    }
}