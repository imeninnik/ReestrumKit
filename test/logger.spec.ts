import Logger from '../core/Logger/Logger.class';

const logger = new Logger('logger.spec','test');
// logger.level = 0;
// logger.log('logger #log', 4,[5,3,2]);
// logger.dbg('logger #dbg', 3,[5,3,2]);
// logger.info('logger #info', 2,[5,3,2]);
// logger.warn('logger #warn', 1,[5,3,2]);

const logMessage = logger.error(
    `this should find 6 tags #one#two #three, #4 
        #five \t #6 $# ###`, 0,[5,3,2]);

// console.log(logMessage);

test('Logger model > Tags Extractor',()=> {
    expect( logMessage['tags'].length ).toEqual(6);
});