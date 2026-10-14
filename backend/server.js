//Aqui vai ficar a configuração do express
const express = require('express');
const app = express()

app.use(express.json());

let proximoId = 3;

let produtos = [
{
    id: 1,
    nome: "Caderno",
    categorias: "Cadernos",
    preco: 25,
    quantidade: 10
},
{
    id: 2,
    nome: "Caneta Azul",
    categorias: "Canetas",
    preco: 2.50,
    quantidade: 30
}
];


app.get("/produtos", (req, res) => {
    res.json(produtos);
});

app.post("/produtos", (req, res) => {
    const novoProduto = {
        id: proximoId++,
      nome: req.body.nome,
      categoria: req.body.categoria,
      preco: req.body.preco,
      quantidade: req.body.quantidade
    };
  
    produtos.push(novoProduto);
  
    res.json(novoProduto);
  });

  
app.put("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
  
    const produto = produtos.find(p => p.id === id);
  
    if (!produto) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }
  
    produto.nome = req.body.nome;
    produto.categoria = req.body.categoria;
    produto.preco = req.body.preco;
    produto.quantidade = req.body.quantidade;
  
    res.json(produto);
  });
  
  
app.delete("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
  
    const produto = produtos.find(p => p.id === id);
  
    if (!produto) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }
  
    produtos = produtos.filter(p => p.id !== id);
  
    res.json({
      mensagem: "Produto excluído com sucesso"
    });
  });
  

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001")
})