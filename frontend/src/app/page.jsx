
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
  const [idEditando, setIdEditando] = useState(null);

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


  function editarProduto(produto) {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setPreco(produto.preco);
    setQuantidade(produto.quantidade);
    setMensagem("");
  }


  async function salvarEdicao(e) {
    e.preventDefault();

    if (!nome.trim() || !categoria.trim() ||
      preco === "" || quantidade === "" ||
      Number(preco) < 0 || Number(quantidade) < 0 ||
      !Number.isInteger(Number(quantidade))) {
      setMensagem("Preencha os campos corretamente.");
      return;
    }

    const produtoAtualizado = {
      nome: nome.trim(),
      categoria: categoria.trim(),
      preco: Number(preco),
      quantidade: Number(quantidade)
    };

    try {
      const resposta = await fetch(`/api/produtos/${idEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoAtualizado)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao editar");
      }

      const produtoEditado = await resposta.json();

      setProdutos(produtos.map(produto =>
        produto.id === idEditando ? produtoEditado : produto
      ));

      setNome("");
      setCategoria("");
      setPreco("");
      setQuantidade("");
      setIdEditando(null);
      setMensagem("Produto atualizado com sucesso!");

    } catch (erro) {
      setMensagem("Erro ao editar produto.");
    }
  }



  return (
    <main>
      <div className="cabecalho">
        <img src="\Logo Papelândia.png" alt="Logo da Papelândia"className="logo"/>

        <div className="cabecalho-texto">
          <h1>Papelândia</h1>
          <p>Gerenciamento de produtos da papelaria</p>
        </div>
      </div>


      <h2>{idEditando !== null ? "Editar produto" : "Cadastrar produto"}</h2>

      <form onSubmit={idEditando !== null ? salvarEdicao : cadastrarProduto}>

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


        <button type="submit">
          {idEditando !== null ? "Salvar alterações" : "Cadastrar"}
        </button>

        {idEditando !== null && (
          <button
            type="button"
            onClick={() => {
              setIdEditando(null);
              setNome("");
              setCategoria("");
              setPreco("");
              setQuantidade("");
              setMensagem("");
            }}
          >
            Cancelar
          </button>
        )}

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


            <button
              className="btn-editar"
              onClick={() => editarProduto(produto)}
            >
              Editar
            </button>

          </div>
        ))}
      </div>

    </main>
  );
}
