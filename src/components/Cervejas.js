import React, { useEffect } from 'react';
import './Cervejas.css';

const Cervejas = () => {
  const cervejas = [
    {
      nome: "Virada IPA",
      tipo: "India Pale Ale",
      descricao: "Amarga e aromática com notas cítricas e de pinho",
      imagem: "https://images.unsplash.com/photo-1593371257234-eee84b5c556f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      teor: "6.5%",
      ano: "1923"
    },
    {
      nome: "Virada Stout",
      tipo: "Stout",
      descricao: "Negra e cremosa com aromas de café torrado e chocolate",
      imagem: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      teor: "5.8%",
      ano: "1918"
    },
    {
      nome: "Virada Weiss",
      tipo: "Weissbier",
      descricao: "Refrescante com notas de banana e cravo",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      teor: "5.0%",
      ano: "1932"
    },
    {
      nome: "Virada Pilsen",
      tipo: "Pilsen",
      descricao: "Clássica e refrescante com amargor equilibrado",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      teor: "4.8%",
      ano: "1905"
    }
  ];

  useEffect(() => {
    const cards = document.querySelectorAll('.cerveja-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));

    return () => cards.forEach(card => observer.unobserve(card));
  }, []);

  return (
    <section id="cervejas-section" className="cervejas-section">
      <h2 className="section-title">Nossas <span className="destaque">Cervejas</span> Históricas</h2>
      <div className="cervejas-grid">
        {cervejas.map((cerveja, index) => (
          <div key={index} className="cerveja-card">
            <div className="cerveja-imagem-container">
              <div 
                className="cerveja-imagem" 
                style={{ backgroundImage: `url(${cerveja.imagem})` }}
              ></div>
              <div className="cerveja-detalhes">
                <div className="cerveja-tag">Virada</div>
                <div className="cerveja-ano">{cerveja.ano}</div>
              </div>
            </div>
            <div className="cerveja-info">
              <h3>{cerveja.nome}</h3>
              <p className="cerveja-tipo">{cerveja.tipo} • {cerveja.teor}</p>
              <p className="cerveja-desc">{cerveja.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cervejas;