import * as Helpers from '../helpers';



describe('Test Helpers. Hex Part', () => {

    test('getUUID', async () => {
        let uuid = Helpers.getUUID();
        expect(uuid.length).toEqual(36);
    });

    test('getLRC', async () => {
        const someString = 'AA030301030304';
        let lrc = Helpers.getLRC(someString);
        let total = Helpers.checkLRC(someString+lrc);

        expect(lrc).toEqual('fa');
        expect(total).toBeTruthy();
    });

    describe('Hex Part',() => {
        test('Hex Unify should convert any string text to Lowercase No Dashes', async () => {
            const h = '11aabbcc';

            const h1 = '11-aa BB cc ';
            const h2 = '11-AA-BB-CC';
            const h3 = '1 1 a a b b c c';
            const h4 = '  11AA   BBcc  ';

            expect(Helpers.hexUnify(h1)).toEqual(h);
            expect(Helpers.hexUnify(h2)).toEqual(h);
            expect(Helpers.hexUnify(h3)).toEqual(h);
            expect(Helpers.hexUnify(h4)).toEqual(h);

        });

        test('Hex Flip change endianness for byte swap', async () => {
            const h = 'c4b3a211';

            const h1 = '11-a2 B3 c4 ';

            expect(Helpers.hexFlip(h1)).toEqual(h);

        });

        test('Convert Hex To Base64 and back', async () => {
            const h = 'bbaaff00';
            const h2b = Helpers.convert.hexToBase64(h);
            const b2h = Helpers.convert.base64ToHex(h2b);

            expect( b2h ).toEqual(h);
        });
    });


});