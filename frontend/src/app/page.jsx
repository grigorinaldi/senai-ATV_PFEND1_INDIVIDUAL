
"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("/api/produtos")
      .then(res => res.json())
      .then(dados => setProdutos(dados));
  }, []);

  async function cadastrarProduto(e) {
    e.preventDefault();

    if (!nome.trim() || !categoria.trim() ||
      preco === "" || quantidade === "" ||
      Number(preco) < 0 || Number(quantidade) < 0 ||
      !Number.isInteger(Number(quantidade))) {
      setMensagem("Preencha os campos corretamente.");
      return;
    }

    const novoProduto = {
      nome: nome.trim(),
      categoria: categoria.trim(),
      preco: Number(preco),
      quantidade: Number(quantidade)
    };

    try {
      const resposta = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoProduto)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar");
      }

      const produtoCadastrado = await resposta.json();

      setProdutos([...produtos, produtoCadastrado]);

      setNome("");
      setCategoria("");
      setPreco("");
      setQuantidade("");
      setMensagem("Produto cadastrado com sucesso!");

    } catch (erro) {
      setMensagem("Erro ao cadastrar produto.");
    }
  }


  async function excluirProduto(id) {
    const confirmar = window.confirm("Deseja excluir este produto?");

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`/api/produtos/${id}`, {
        method: "DELETE"
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir");
      }

      setProdutos(produtos.filter(produto => produto.id !== id));
      setMensagem("Produto excluído com sucesso!");

    } catch (erro) {
      setMensagem("Erro ao excluir produto.");
    }
  }


  return (
    <main>
      <h1>Papelândia</h1>
      <p>Gerenciamento de produtos da papelaria</p>

      <h2>Cadastrar produto</h2>

      <form onSubmit={cadastrarProduto}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          min="0"
          step="0.01"
          required
        />

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          min="0"
          step="1"
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      <p>{mensagem}</p>

      <h2>Produtos cadastrados</h2>


      <div className="lista">
        {produtos.map(produto => (
          <div className="produto" key={produto.id}>
            <h3>{produto.nome}</h3>
            <p>Categoria: {produto.categoria}</p>
            <p>Preço: R$ {Number(produto.preco).toFixed(2)}</p>
            <p>Estoque: {produto.quantidade}</p>

            <button
              className="btn-excluir"
              onClick={() => excluirProduto(produto.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}
