const { describe } = require("node:test")
const { sqlForPartialUpdate} = require("./sql")

describe("sqlForPartialUpdate", ()=>{
    test("Correct with one input", ()=>{
        const result = sqlForPartialUpdate(
            {f1: "value1"},
            {f1: "f1", fF2: "f2"}        
        );
        expect(result).toEqual({
            setCols: "\"f1\"= $1",
            values: ["value1"],
        });
    });

    test("Correct with 2 inputs", ()=>{
        const results = sqlForPartialUpdate(
            { f1: "value1", jsF2: "value2"},
            { jsF2: "f2" }
        );
        expect(results).toEqual({
            setCols: "\"f1\"=$1, \"f2\=$2",
            values: ["value1", "value2"]
        });
    });
});