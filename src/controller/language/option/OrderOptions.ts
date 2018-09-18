/**
 * Order Options Interface
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

export interface OrderOptions {

    interp(data: Array<any>): Array<any>;

    checkValidity(columnKeys: Array<string>): boolean;

}