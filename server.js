/* Express Route Adapter */
const resolver = (handlerFn) => {
    return (req, res, next) => {
        return Promise.resolve(handlerFn(req, res, next))
        .catch(e => next(e));
    }
}

/* Errors */
class InternalServerError extends Error{
    constructor(msg) {
        super(msg);
        this.name = 'InternalServerError';
        this.statusCode = 500;
    }
}
/* Interface Adapters */
const controller =  async (req, res) => {
    await new Promise(r => setTimeout(r, 3000));
    throw new InternalServerError('Um erro qualquer.');
    res.json({ok:1})
}

/* Router */
const { Router } =  require('express');
const router = new Router();
router.get('/', resolver(controller));

/* Server */
const app = require('express')();


app.use(router);

app.listen(3000, () => {
    console.log(`SEVER RUNNING ON PORT 3000`);
});


/* Middleware de tratamento de errors */
app.use((error, req, res, next) => {
    if(error && error.statusCode){
        res.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message
        });
    }
})