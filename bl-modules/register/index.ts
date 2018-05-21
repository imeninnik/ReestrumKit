import * as argon2 from "argon2";
import getUUID from "../../dal/Helpers/getUUID";
import has = Reflect.has;

export default class Register {
    public static addUser(IBasicUser) {

    }

    public static async RegisterByEmail(rkInstance, email: string) {
        try {
            console.log('will run Registering by Email 2');

            const tempPass = getUUID();
            const hash = await argon2.hash(tempPass, { raw: false });

            const cryptoItem = new rkInstance.Models.Crypto('salt', hash);
            await cryptoItem.save();

            const userItem = new rkInstance.Models.User();
            userItem.crypto_id = cryptoItem.id;
            userItem.password = tempPass;
            await userItem.save();

            // const isValid = await argon2.verify(hash, tempPass);
            // console.log(333, isValid);

            // check for person with email
            // create crypto and password
            // create user
            // send email




        } catch (err) {
           console.log(33, err);
        }





    }
}