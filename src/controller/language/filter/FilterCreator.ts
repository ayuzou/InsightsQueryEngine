/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {IQueryFilter} from "./IQueryFilter";
import StringFilter from "./StringFilter";
import NegationFilter from "./NegationFilter";
import LogicFilter from "./LogicFilter";
import MathFilter from "./MathFilter";
import ParseUtil from "../ParseUtil";

export default class FilterCreator {
    static create(body: any): IQueryFilter {
        ParseUtil.checkNumFields(body, 1);

        if (body.hasOwnProperty('IS')) {
            return StringFilter.parse(body['IS']);
        }

        if (body.hasOwnProperty('NOT')) {
            return NegationFilter.parse(body['NOT']);
        }

        // try logic filter
        for (let validLogic of LogicFilter.validOperators) {
            if (body.hasOwnProperty(validLogic)) {
                return LogicFilter.parse(validLogic, body[validLogic]);
            }
        }

        // try math filter
        for (let comparator of MathFilter.validComparators) {
            if (body.hasOwnProperty(comparator)) {
                return MathFilter.parse(comparator, body[comparator]);
            }
        }

        throw "cannot find a valid implementation to create IQueryFilter";
    }
}