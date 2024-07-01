"use strict";

/** Routes for searching for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureAdmin } = require("../middleware/auth")
const { BadRequestError } = require("../expressError");
const Job = require("../models/jobs");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobSearchSchema = require("../schemas/jobSearch.json");

const router = express.Router({ mergeParams: true });



// POST new job 
// Job should return {id, title, salary, equity, companyHandle}
// Auth required

router.post("/", ensureAdmin, async (req,res,next)=>{
    try{
        const validate = (jsonschema.validate(req.body,jobNewSchema))

        if (!validate.valid){
            const err = validate.errors.map(e => e.stack);
            throw new BadRequestError(err);
        }else{
            const job = await Job.create(req.body);
            return res.status(201).json({ job });
        }

    }catch(e){
        return next(e)
    }
})


/** GET / =>
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */
router.get('/', async function(req,res,next){
    const q= req.query
    // change str to ints and booleans
    if (q.minSalary !== undefined){
        q.minSalary = +q.minSalary;
        q.hasEquity = q.hasEquity === "true"
    }

    try{
        const validate = jsonschema.validate(q, jobSearchSchema)
        if (!validate.valid){
            const err = validate.errors.map(e=> e.stack);
            throw new BadRequestError(err)
        }

    } catch(e){
        return next(e)
    }
});

// PATCH /[jobId] {title, salary, equity, companyHandle} 
// returns object with Id
// Admin Auth required

router.patch('/:id', ensureAdmin, async function(req,res,next){
    try{
        const validate = (jsonschema.validate(req.body,jobUpdateSchema))

        if (!validate.valid){
            const err = validate.errors.map(e => e.stack);
            throw new BadRequestError(err);
        }
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    }catch(e){
        return next(e)
    }
});

// DELETE /[handle] returns { deleted : id}
// Admin Auth required


router.delete("/:id", ensureAdmin, async function(req,res,next){
    try{
        await Job.remove(req.params.id);
        return res.json({ deleted: +req.params.id })

    }catch(e){
        return next(e)
    }
});


module.exports = router;