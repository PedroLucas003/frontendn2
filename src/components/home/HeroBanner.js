import React, { useEffect } from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  useEffect(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const scrollToCervejas = (e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const element = document.getElementById('cervejas-section');

    if (!element) {
      console.error('Seção de cervejas não encontrada!');
      return;
    }

    // Animação do botão
    button.classList.add('button-clicked');
    setTimeout(() => {
      button.classList.remove('button-clicked');
    }, 300);

    // Scroll para a seção
    setTimeout(() => {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 30;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Ativa o efeito na seção de destino após o scroll
      const checkScroll = setInterval(() => {
        if (Math.abs(window.pageYOffset - targetPosition) < 10) {
          clearInterval(checkScroll);
          element.classList.add('scroll-activated');
          setTimeout(() => {
            element.classList.remove('scroll-activated');
          }, 1000);
        }
      }, 100);
    }, 100);
  };

  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content-container">
        <div className="hero-content">
          <div className="brand-name">
            <div className="cervejaria">Cervejaria</div>
            <div className="virada">Vir<span className="inverted-a">a</span>da</div>
          </div>
          <p className="subtitle">Artesanal • Autêntica • Inesquecível</p>
          <button 
            className="cta-button" 
            onClick={scrollToCervejas}
            aria-label="Conheça nossas cervejas"
          >
            <span className="button-text">Conheça Nossas Cervejas</span>
            <span className="button-icon">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;