import express from 'express';

const app = express();

app.get('/health', (req, res)=>{
    res.send('<button>click</dutton>').status(200);
})


export {app};
export default app;