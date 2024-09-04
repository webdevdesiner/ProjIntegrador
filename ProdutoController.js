let  produtos = require('../model/Produto');
const pool = require('../database/mysql')
// const multer = require('multer');
// const path = require('path');
// const date = new Date();

// Configuração do Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../../public/images'); // Define o diretório onde os arquivos serão armazenados
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`); // Define o nome do arquivo
//     }
// });

// const upload = multer({ storage: storage });




const ProdutoController = {


    async criar(req, res) {
        // console.log(req.body)
        const {nome, marca, estado_uso, descricao, data, preco, usuarios_id, id_produtos, url_foto_produto, produtos_id} = req.body;
        
        let imgUrl = 'http://localhost:3333/images/'
        if(req.file) {
            imgUrl = imgUrl + `${req.file.filename}`
        }

      
        let sql = `INSERT INTO produtos (nome, marca, estado_uso, descricao, data, preco, usuarios_id) VALUES(?,?,?,?,?,?,?)`
        const result = await pool.query(sql,[nome, marca, estado_uso, descricao, data, preco, usuarios_id])
        const insertId = result[0]?.insertId;
        if(!insertId){
            return res.status(401).json({message: 'erro ao criar produto!'})
        }
        let sql_fotosProdutos = `INSERT INTO fotos_produtos (id_produtos, url_foto_produto, produtos_id) VALUES(?,?,?)`
        const result_fotosProdutos = await pool.query(sql_fotosProdutos, [id_produtos, url_foto_produto, produtos_id]);

        const sql_select = `SELECT * from produtos where PRODUTO_ID = ?`
        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])
    },




    async listar(req, res) {
        let sql = "select * from produtos";
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async show(req, res) {
        const paramId = req.params.id;
        const sql_select = `SELECT * from produtos where produto_id = ?`
        const [rows] =await pool.query(sql_select, [Number(paramId)])
        return res.status(201).json(rows[0])
        
    },

    async deletar(req, res) {
        const paramId = req.params.id;
        let sql = `DELETE from produtos WHERE PRODUTO_ID = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if(!affectedRows) {
            return res.status(401).json({message: 'erro ao deletar produto!'})
        }
        return res.status(200).json({mensagem: "Produto deletado com sucesso!"})
    },


    async alterar(req, res) {
        //pegar o id via parametro da url de requisicao
        const paramId = req.params.id;
        //return res.status(201).json({id: paramId});
        //pegou os valores do form via body
        const {NOME, MARCA, ESTADO_USO, DESCRICAO, DATA, PRECO, USUARIOS_ID} = req.body;
        
        let sql = "UPDATE produtos SET NOME = ?, MARCA = ?, ESTADO_USO = ?, DESCRICAO = ?, DATA = ?, PRECO = ?, USUARIOS_ID = ? WHERE PRODUTO_ID = ?"
        const result = await pool.query(sql, [NOME, MARCA, ESTADO_USO, DESCRICAO, DATA, PRECO, USUARIOS_ID, Number(paramId)])
        const changedRows = result[0]?.changedRows;
        if(!changedRows) {
            return res.status(401).json({message: 'erro ao alterar produto!'})
        }
        const sql_select = `SELECT * from produtos where PRODUTO_ID = ?`
        const [rows] =await pool.query(sql_select, [paramId])
        return res.status(201).json(rows[0])      
    }


   
}
module.exports = ProdutoController;