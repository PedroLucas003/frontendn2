import React, { useEffect, useState } from 'react';
import './Cervejas.css';
import axios from 'axios';

const Cervejas = () => {
  const [stock, setStock] = useState({
    'IPA': 0,
    'Stout': 0,
    'Weiss': 0,
    'Pilsen': 0
  });
  const [loading, setLoading] = useState(true);
  
  const cervejas = [
    {
      id: 1,
      nome: "Virada IPA",
      tipo: "India Pale Ale",
      beerType: "IPA",
      descricao: "Amarga e aromática com notas cítricas e de pinho. Uma homenagem aos mestres cervejeiros que iniciaram nossa tradição em 1923.",
      imagem: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "3.0% ABV",
      ano: "1923"
    },
    {
      id: 2,
      nome: "Virada Stout",
      tipo: "Stout Imperial",
      beerType: "Stout",
      descricao: "Negra e cremosa com aromas de café torrado e chocolate. Receita original desde 1918, mantida em nossos arquivos secretos.",
      imagem: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "8.2% ABV",
      ano: "1918"
    },
    {
      id: 3,
      nome: "Virada Weiss",
      tipo: "Weissbier Tradicional",
      beerType: "Weiss",
      descricao: "Refrescante com notas de banana e cravo. Introduzida em 1932 por um mestre cervejeiro alemão que se juntou à nossa equipe.",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "5.0% ABV",
      ano: "1932"
    },
    {
      id: 4,
      nome: "Virada Pilsen",
      tipo: "Pilsen Premium",
      beerType: "Pilsen",
      descricao: "Clássica e refrescante com amargor equilibrado. Nossa primeira receita, criada pelos fundadores em 1905.",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "4.8% ABV",
      ano: "1905"
    }
  ];

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/beers');
        
        // Cria um novo objeto de estoque baseado nos dados da API
        const newStock = {
          'IPA': 0,
          'Stout': 0,
          'Weiss': 0,
          'Pilsen': 0
        };
        
        // Atualiza as quantidades com os dados da API
        response.data.forEach(beer => {
          if (newStock.hasOwnProperty(beer.beerType)) {
            newStock[beer.beerType] = beer.quantity;
          }
        });
        
        setStock(newStock);
      } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        // Mantém os valores padrão (0) em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchStock();

    // Configuração da animação dos cards
    const setupAnimation = () => {
      const cards = document.querySelectorAll('.cerveja-card');
      if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
        return () => cards.forEach(card => observer.unobserve(card));
      }
    };

    // Aguarda um pouco para garantir que os cards foram renderizados
    const animationTimer = setTimeout(setupAnimation, 100);
    return () => clearTimeout(animationTimer);
  }, []);

  if (loading) {
    return (
      <section id="cervejas-section" className="cervejas-section">
        <div className="loading-indicator">Carregando estoque...</div>
      </section>
    );
  }

  return (
    <section id="cervejas-section" className="cervejas-section">
      <h2 className="section-title">Nossas <span className="destaque">Cervejas</span> Históricas</h2>
      <div className="cervejas-grid">
        {cervejas.map((cerveja) => (
          <div key={cerveja.id} className="cerveja-card">
            <div className="cerveja-imagem-container">
              <img
                src={cerveja.imagem}
                alt={cerveja.nome}
                className="cerveja-imagem"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x500.png?text=Garrafa+Virada";
                }}
              />
              <div className="cerveja-detalhes">
                <div className="cerveja-tag">Virada</div>
                <div className="cerveja-ano">{cerveja.ano}</div>
              </div>
            </div>
            <div className="cerveja-info">
              <h3>{cerveja.nome}</h3>
              <p className="cerveja-tipo">{cerveja.tipo}</p>
              <p className="cerveja-desc">{cerveja.descricao}</p>
              <div className="cerveja-stock">
                <span className="stock-label">Estoque:</span>
                <span className={`stock-value ${stock[cerveja.beerType] > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {stock[cerveja.beerType]} unidades
                </span>
              </div>
              <span className="cerveja-teor">{cerveja.teor}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cervejas;