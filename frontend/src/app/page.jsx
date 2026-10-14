
"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("/api/produtos")
      .then(res => res.json())
      .then(dados => setProdutos(dados));
  }, []);

  return (
    <main>
      <h1>Papelândia</h1>
      <p>Gerenciamento de produtos da papelaria</p>

      <h2>Produtos cadastrados</h2>

      <div className="lista">
        {produtos.map(produto => (
          <div className="produto" key={produto.id}>
            <h3>{produto.nome}</h3>
            <p>Categoria: {produto.categoria}</p>
            <p>Preço: R$ {produto.preco.toFixed(2)}</p>
            <p>Estoque: {produto.quantidade}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
