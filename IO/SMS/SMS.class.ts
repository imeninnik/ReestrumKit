/**
 * todo: providers abstraction.
      Now it is used for smsclub.mobi only
 */
export default class SMS {

    constructor(private rkInstance: any) {
        // rkInstance.restClient.post('https://gate.smsclub.mobi/token/getbalance.php?username=380991006566&token=2uz7uQ590PggfmF').then(res =>
        //     console.log(1111, res)
        // )
    }


    public async send(message) {
        const resp = await this.rkInstance.restClient
            .post(`https://gate.smsclub.mobi/token/?username=380000000000&token=2uz7uQ590PggfmF&from=Zakaz&to=380000000000&text=${message}`);
        console.log(22, resp);
        return;
    }

    private getBalance() {

    }
}