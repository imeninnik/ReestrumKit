import * as argon2 from "argon2";


run();

async function run() {

    try {
        const hash = await argon2.hash("password");
        console.log(22, hash);

        const verify = await argon2.verify(hash, "password");
        console.log(222, verify);
    } catch (err) {
        console.log(11, err);
    }

}

