const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

const connection = require("./database/database")

//database

connection
    .authenticate()
    .then(() => {
        console.log('conexao feita')
    })
    .catch((err) => {
        console.log(err)
    })

// dizendo pro express usar o ejs como view engine

app.set('view engine', 'ejs');
app.use(express.static('public'))
//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//rotas
app.listen(4000, () => {
    console.log('App rodando.....')
})


app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']  // ASC ou DESC 
    ]})  // = select ALL from PERGUNTAS
        .then((perguntas) => {
            res.render("index", {
                perguntas: perguntas
            })
        })
})

app.get("/perguntar", (req, res) => {

    res.render("perguntar")
})

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id;
    Pergunta.findOne({
        where: {id : id}

    })
    .then(pergunta => {
        if( pergunta != undefined){ // pergunta achada
            
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                    ['id' , 'DESC'] 
                ]
            })
            .then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
            
            
        }else { 
            res.redirect("/")
        }
    })


})

app.post("/salvarpergunta", (req, res) => {
    
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({  // = ao insert INTO pergunta
        titulo: titulo,
        descricao: descricao
    })
    .then(() => {
        res.redirect("/")
    })  
})
  

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo 
    const perguntaId = req.body.pergunta

    Resposta.create({
        corpo : corpo,
        perguntaId : perguntaId
    })
    .then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })

})



