/*import express from "express" //call express
import fs from 'node:fs' //call fs
import morgan from "morgan"

const homepage = fs.readFileSync('./html.html','utf8') //call file

const app = express() //make application 

app.use(morgan('dev')) //madeelwaires of dev

app.use(express.static('./', { cacheControl: false, etag: false, lastModified: false }));
// call all file in maidel waire to showed
const port = 3003

app.get('/',(req,res)=>{

    res.send(homepage)
}); //handel request form localhost/domain/home

app.get('/product',(req, res)=>{
    res.send([
        {id:1,title:"clappe"},
        {id:2,title:"clompey"}
    ])
}); //handel request from localhost/domain/product 

app.listen(port,()=>{
    console.log('server is done in 3003')
})
// handeled port to listen
*/