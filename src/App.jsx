import React, { useRef, useState, useEffect } from 'react';

// =======================================================================
// COMPONENTE DE ANIMACIÓN (Aparición rápida y optimizada para móvil)
// =======================================================================
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out will-change-[opacity,transform] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// =======================================================================
// APLICACIÓN PRINCIPAL
// =======================================================================
function App() {
  const imagenesDepartamento = [
    "/img/FOTO1.jpg",
    "/img/FOTO2.jpg",
    "/img/FOTO3.jpg",
    "/img/FOTO4.jpg",
    "/img/FOTO5.jpg",
    "/img/FOTO6.jpg",
    "/img/FOTO7.jpg"
  ];

  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const carouselRef = useRef(null);

  // =======================================================================
  // AUTO-SCROLL PERFECTO: 1 píxel entero por fotograma (Adiós a los ladrillos)
  // =======================================================================
  useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrameId;

    const autoScroll = () => {
      if (carousel && !isHovering) {
        // Al sumar exactamente "1", forzamos un movimiento constante sin
        // que el navegador del celular intente redondear decimales.
        carousel.scrollLeft += 1; 

        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering]);

  // Rueda del ratón para el carrusel en PC
  useEffect(() => {
    const carousel = carouselRef.current;
    const handleNativeWheel = (e) => {
      if (carousel) {
        e.preventDefault(); 
        carousel.scrollLeft += e.deltaY;
      }
    };
    if (carousel) {
      carousel.addEventListener('wheel', handleNativeWheel, { passive: false });
    }
    return () => {
      if (carousel) carousel.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const abrirImagen = (index) => setLightbox({ isOpen: true, index: index });
  const cerrarLightbox = () => setLightbox({ isOpen: false, index: 0 });
  
  const imagenAnterior = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + imagenesDepartamento.length) % imagenesDepartamento.length
    }));
  };

  const siguienteImagen = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % imagenesDepartamento.length
    }));
  };

  const scrollToSection = (e, id) => {
    e.preventDefault(); 
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMenuOpen(false); 
  };

  return (
    <div className="min-h-screen text-stone-700 font-sans font-light tracking-wide bg-[#E0D8CC]">
      
      {/* NAVEGACIÓN SUPERIOR CON MENÚ HAMBURGUESA */}
      <nav className="fixed w-full bg-[#E0D8CC]/95 backdrop-blur-md shadow-sm z-40 border-b border-stone-300/40 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center relative">
          
          <h1 className="text-xl font-serif font-bold text-[#2D4350] whitespace-nowrap">
            Departamento 3
          </h1>
          
          {/* Menú de Escritorio (Oculto en celular) */}
          <div className="hidden lg:flex space-x-5 text-sm font-medium text-[#4A6B7C]">
            <a href="#informacion" onClick={(e) => scrollToSection(e, 'informacion')} className="hover:text-[#2D4350] transition-colors">Info</a>
            <a href="#ubicacion" onClick={(e) => scrollToSection(e, 'ubicacion')} className="hover:text-[#2D4350] transition-colors">Ubicación</a>
            <a href="#llegada" onClick={(e) => scrollToSection(e, 'llegada')} className="hover:text-[#2D4350] transition-colors">Llegada</a>
            <a href="#reglas" onClick={(e) => scrollToSection(e, 'reglas')} className="hover:text-[#2D4350] transition-colors">Reglas</a>
            <a href="#wifi" onClick={(e) => scrollToSection(e, 'wifi')} className="hover:text-[#2D4350] transition-colors">Wi-Fi</a>
            <a href="#recomendaciones" onClick={(e) => scrollToSection(e, 'recomendaciones')} className="hover:text-[#2D4350] transition-colors">Recomendaciones</a>
            <a href="#servicios" onClick={(e) => scrollToSection(e, 'servicios')} className="hover:text-[#2D4350] transition-colors">Servicios</a>
            <a href="#transporte" onClick={(e) => scrollToSection(e, 'transporte')} className="hover:text-[#2D4350] transition-colors">Transporte</a>
          </div>

          {/* Botón de Hamburguesa para Celular */}
          <button 
            className="lg:hidden text-[#2D4350] focus:outline-none p-1 transform transition-transform duration-300 active:scale-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú Desplegable (Celular) ANIMADO */}
        <div 
          className={`lg:hidden absolute top-full left-0 w-full bg-[#F4F1EA] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[500px] border-b border-stone-300 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col px-6 divide-y divide-stone-300/60 text-sm font-bold text-[#4A6B7C]">
            <a href="#informacion" onClick={(e) => scrollToSection(e, 'informacion')} className="py-4 hover:text-[#2D4350] transition-colors">Info del Depa</a>
            <a href="#ubicacion" onClick={(e) => scrollToSection(e, 'ubicacion')} className="py-4 hover:text-[#2D4350] transition-colors">Ubicación</a>
            <a href="#llegada" onClick={(e) => scrollToSection(e, 'llegada')} className="py-4 hover:text-[#2D4350] transition-colors">Check-in / Check-out</a>
            <a href="#reglas" onClick={(e) => scrollToSection(e, 'reglas')} className="py-4 hover:text-[#2D4350] transition-colors">Reglas</a>
            <a href="#wifi" onClick={(e) => scrollToSection(e, 'wifi')} className="py-4 hover:text-[#2D4350] transition-colors">Wi-Fi</a>
            <a href="#recomendaciones" onClick={(e) => scrollToSection(e, 'recomendaciones')} className="py-4 hover:text-[#2D4350] transition-colors">Recomendaciones</a>
            <a href="#servicios" onClick={(e) => scrollToSection(e, 'servicios')} className="py-4 hover:text-[#2D4350] transition-colors">Servicios Cercanos</a>
            <a href="#transporte" onClick={(e) => scrollToSection(e, 'transporte')} className="py-4 hover:text-[#2D4350] transition-colors">Transporte</a>
          </div>
        </div>
      </nav>

      {/* SECCIÓN 1: BIENVENIDA */}
      <section className="pt-32 pb-10 px-6 bg-[#E0D8CC]">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#2D4350] mb-6">
              ¡Bienvenido a tu hogar en Campeche!
            </h2>
            <p className="text-lg text-stone-700 max-w-2xl mx-auto">
              Nos alegra mucho recibirte. Hemos preparado este espacio con mucho empeño para que disfrutes al máximo tu visita y te sientas como en casa.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* SECCIÓN 2: INFORMACIÓN DEL DEPARTAMENTO */}
      <section id="informacion" className="pb-16 px-6 bg-[#E0D8CC]">
        <FadeInSection delay={150}>
          <div className="max-w-4xl mx-auto bg-[#F4F1EA] p-8 md:p-10 rounded-3xl shadow-sm border border-stone-200/40">
            <h3 className="text-2xl font-serif text-[#2D4350] mb-6 text-center border-b border-stone-300/40 pb-4">
              Acerca del departamento
            </h3>
            <p className="text-stone-600 text-center mb-8 font-medium">
              Concepto tipo Loft • Estilo Industrial
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm text-stone-700">
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Cocina equipada</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Área de sala</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Espacio con cama matrimonial</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Aire acondicionado</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Ventiladores de techo</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Baño con regadera</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Agua caliente</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Detector de monóxido de carbono</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Ropero y mueble con varios cajones</div>
              <div className="flex items-center gap-3"><span className="text-[#4A6B7C] text-lg">✦</span> Burro chico para planchar y plancha</div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SECCIÓN 3: GALERÍA DE IMÁGENES */}
      <section className="py-12 bg-[#A8BBC9] overflow-hidden">
        <FadeInSection>
          <div 
            ref={carouselRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => {
              setIsHovering(true);
              if (window.touchTimeout) clearTimeout(window.touchTimeout);
            }}
            onTouchEnd={() => {
              window.touchTimeout = setTimeout(() => {
                setIsHovering(false);
              }, 2000);
            }}
            className="w-full flex gap-6 overflow-x-auto px-6 pb-4 pt-4 [webkit-overflow-scrolling:touch] select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {[...imagenesDepartamento, ...imagenesDepartamento].map((url, idx) => (
              <div 
                key={idx} 
                onClick={() => abrirImagen(idx % imagenesDepartamento.length)}
                className="w-80 h-56 md:w-[450px] md:h-72 bg-[#F4F1EA] rounded-3xl flex-shrink-0 cursor-pointer shadow-sm relative border-4 border-[#F4F1EA] transform transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:z-10"
              >
                <img 
                  src={url} 
                  alt={`Vista del departamento ${(idx % imagenesDepartamento.length) + 1}`} 
                  className="w-full h-full object-cover rounded-[20px] pointer-events-none"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* SECCIÓN 4: UBICACIÓN */}
      <section id="ubicacion" className="py-16 px-6 bg-[#E0D8CC]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <FadeInSection delay={0}>
            <div className="text-left space-y-4">
              <h3 className="text-3xl font-serif text-[#2D4350]">Ubicación</h3>
              <p className="text-stone-800 font-medium text-lg">Calle Bravo # 101, entre 24 y Narciso Mendoza.</p>
              <p className="text-stone-600 leading-relaxed">
                Col. San José, San Francisco de Campeche, Camp. C.P. 24040. <br/>
                <span className="text-sm text-stone-500 italic">(A dos casas de Papelería Stylos y frente a un tendejón).</span>
              </p>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <div className="flex flex-col space-y-4 w-full rounded-3xl">
              <img 
                src="/img/MAPS.jpg" 
                alt="Mapa de ubicación" 
                className="w-full h-52 object-cover rounded-3xl shadow-inner border border-stone-200/40"
              />
              <button className="w-full bg-[#4A6B7C] hover:bg-[#2D4350] text-[#F4F1EA] py-3.5 px-6 rounded-full transition-colors shadow-md font-medium text-center">
                Guíame hasta aquí (Google Maps)
              </button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECCIÓN 5: CHECK-IN Y CHECK-OUT */}
      <section id="llegada" className="py-16 px-6 bg-[#A8BBC9]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          
          <FadeInSection delay={0}>
            <div className="bg-[#F4F1EA] p-8 rounded-3xl shadow-sm border border-stone-200/40 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full flex flex-col">
              <div className="border-b border-stone-300/40 pb-4 mb-6">
                <h4 className="text-2xl font-serif text-[#2D4350] mb-1">Check-in</h4>
                <p className="text-3xl font-light text-stone-500">13:00 hrs</p>
              </div>
              <img 
                src="/img/IN.jpg" 
                alt="Check-in" 
                className="w-full h-72 object-cover rounded-2xl mb-8 border border-[#4A6B7C]/20 shadow-sm"
              />
              <ul className="space-y-5 text-stone-700 text-sm md:text-base flex-grow">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4A6B7C]/10 text-[#4A6B7C] flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                  <span><strong>Puerta principal:</strong> Ingresa el código <span className="font-bold text-[#4A6B7C]">101003#</span> en el teclado.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4A6B7C]/10 text-[#4A6B7C] flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                  <span><strong>Tu departamento:</strong> Sube las escaleras, el Depa 3 está al final del pasillo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4A6B7C]/10 text-[#4A6B7C] flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                  <span><strong>Tus llaves:</strong> Abre la caja de seguridad junto a la puerta usando el código <span className="font-bold text-[#4A6B7C]">1013</span>.</span>
                </li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="bg-[#F4F1EA] p-8 rounded-3xl shadow-sm border border-stone-200/40 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full flex flex-col">
              <div className="border-b border-stone-300/40 pb-4 mb-6">
                <h4 className="text-2xl font-serif text-[#2D4350] mb-1">Check-out</h4>
                <p className="text-3xl font-light text-stone-500">12:00 hrs</p>
              </div>
              <img 
                src="/img/OUT.jpg" 
                alt="Check-out" 
                className="w-full h-72 object-cover rounded-2xl mb-8 border border-[#4A6B7C]/20 shadow-sm"
              />
              <ul className="space-y-5 text-stone-700 text-sm md:text-base flex-grow">
                <li className="flex items-start gap-3">
                  <span className="text-[#4A6B7C] text-lg leading-none mt-0.5">•</span>
                  <span>Apaga todas las luces y los aires acondicionados de los cuartos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4A6B7C] text-lg leading-none mt-0.5">•</span>
                  <span>Revisa minuciosamente no dejar cargadores u objetos de valor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4A6B7C] text-lg leading-none mt-0.5">•</span>
                  <span>Introduce la llave en la caja trasera y <strong>gira los números</strong> para dejarla bloqueada.</span>
                </li>
              </ul>
            </div>
          </FadeInSection>

        </div>
      </section>

      {/* SECCIÓN 6: REGLAS DE LA CASA */}
      <section id="reglas" className="py-16 px-6 bg-[#E0D8CC]">
        <FadeInSection>
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-serif text-[#2D4350] mb-8 text-center">Reglas de la casa</h3>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 bg-[#F4F1EA] p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200/30">
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">01</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Silencio</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Mantener el ruido al mínimo de 22:00 a 08:00 hrs para respetar a los vecinos.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">02</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Aire Acondicionado</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Cerrar puertas y ventanas al usarlo y apagarlo completamente al salir.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">03</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Fiestas y Visitas</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Quedan estrictamente prohibidos los eventos masivos o visitas no registradas.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">04</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Libre de humo</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Este es un espacio 100% libre de humo. Prohibido fumar en el interior.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">05</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Limpieza</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Por favor, deposita los residuos en los contenedores asignados de basura.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">06</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Cuidado de Toallas</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Usa las toallas únicamente para secarte el cuerpo. Evita usarlas para desmaquillarte, limpiar derrames o zapatos.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start md:col-span-2 lg:w-1/2 lg:mx-auto">
                <span className="text-4xl font-serif font-bold text-[#4A6B7C] opacity-80 leading-none mt-1">07</span>
                <div>
                  <h5 className="font-bold text-[#2D4350] text-lg mb-1">Seguridad y Gas</h5>
                  <p className="text-stone-600 text-sm leading-relaxed">Al salir, verifica cerrar bien la puerta principal y asegúrate de <strong className="text-[#2D4350]">cerrar completamente las llaves del gas</strong> de la estufa.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SECCIÓN 7: WI-FI */}
      <section id="wifi" className="py-16 px-6 bg-[#A8BBC9]">
        <FadeInSection>
          <div className="max-w-4xl mx-auto bg-[#F4F1EA] p-10 rounded-3xl shadow-sm border border-stone-200/40 text-center transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <h3 className="text-3xl font-serif text-[#2D4350] mb-4">Conexión Wi-Fi</h3>
            <p className="text-stone-600 mb-8">Escanea el código QR con tu celular o ingresa los datos manualmente:</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <img 
                src="/img/QR1.jpg" 
                alt="Código QR Wi-Fi" 
                className="w-40 h-40 object-cover rounded-xl shadow-md border border-stone-200/50" 
              />
              <div className="text-left space-y-6">
                <div>
                  <p className="text-sm text-[#4A6B7C] uppercase tracking-wider font-semibold mb-1">Nombre de la red</p>
                  <p className="text-2xl font-bold text-[#2D4350]">Bravo101 #2</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A6B7C] uppercase tracking-wider font-semibold mb-1">Contraseña</p>
                  <p className="text-xl font-mono text-[#2D4350] bg-[#E0D8CC]/60 px-4 py-2 rounded-lg inline-block shadow-inner font-semibold tracking-wide">
                    CBravo101
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SECCIÓN 8: PREGUNTAS FRECUENTES */}
      <section id="faq" className="py-16 px-6 bg-[#E0D8CC]">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <h3 className="text-3xl font-serif text-[#2D4350] mb-8 text-center">Preguntas Frecuentes</h3>
          </FadeInSection>
          <div className="space-y-6">
            <FadeInSection delay={0}>
              <div className="bg-[#F4F1EA] p-6 rounded-2xl shadow-sm border border-stone-200/30 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <h5 className="font-serif text-lg text-[#2D4350] mb-2">¿Cómo funciona el agua caliente de la regadera?</h5>
                <p className="text-stone-700 text-sm">Al abrir la llave derecha, por favor espera entre 5 y 10 minutos para que el agua fluya caliente.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={150}>
              <div className="bg-[#F4F1EA] p-6 rounded-2xl shadow-sm border border-stone-200/30 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <h5 className="font-serif text-lg text-[#2D4350] mb-2">¿Puedo dejar mi equipaje antes del check-in o después del check-out?</h5>
                <p className="text-stone-700 text-sm">Sí, sabemos que los horarios de viaje a veces no coinciden. Puedes dejar tus maletas de forma segura con nosotros mientras tu depa está listo o antes de tu viaje. Solo avísanos con anticipación para coordinarlo.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={300}>
              <div className="bg-[#F4F1EA] p-6 rounded-2xl shadow-sm border border-stone-200/30 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <h5 className="font-serif text-lg text-[#2D4350] mb-2">¿La televisión cuenta con cable o plataformas de streaming?</h5>
                <p className="text-stone-700 text-sm">El departamento cuenta con una Smart TV conectada a internet. Puedes disfrutar de tus series y películas favoritas en tus plataformas de streaming iniciando sesión con tus propias cuentas.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={450}>
              <div className="bg-[#F4F1EA] p-6 rounded-2xl shadow-sm border border-stone-200/30 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <h5 className="font-serif text-lg text-[#2D4350] mb-2">¿Puedo solicitar entrar antes (early check-in) o salir más tarde (late check-out)?</h5>
                <p className="text-stone-700 text-sm">Esto siempre está sujeto a disponibilidad, ya que dependemos de si hay otros huéspedes saliendo o entrando ese mismo día. Mándanos un mensaje con tus horarios y haremos todo lo posible por acomodarte.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

{/* SECCIÓN 9: RECOMENDACIONES DE LUGARES */}
      <section id="recomendaciones" className="py-16 px-6 bg-[#A8BBC9]">
        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* SUB-SECCIÓN: SUPERMERCADOS */}
          <div>
            <FadeInSection>
              <div className="text-center mb-10">
                <div className="inline-block border border-[#4A6B7C]/40 bg-[#F4F1EA]/60 px-8 py-3 rounded-2xl shadow-sm mb-3">
                  <h3 className="text-2xl md:text-3xl font-serif text-[#2D4350]">Supermercados y Dónde comprar</h3>
                </div>
                <p className="text-[#2D4350]/80 text-sm font-medium mt-2">Despensa completa, productos locales y especialidades</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { nombre: "Bodega Aurrera", horario: "8:00 am - 9:30 pm", desc: "La opción ideal para realizar compras grandes de despensa general, abarrotes, frutas, verduras, panadería fresca y artículos de higiene a precios muy accesibles.", foto: "/img/AURRERA.jpg" },
                  { nombre: "OXXO", horario: "24 Hrs.", desc: "Tienda de conveniencia abierta toda la noche. Perfecta para emergencias, comprar hielo, botanas, refrescos, café caliente, cargadores rápidos o realizar retiros de efectivo.", foto: "/img/OXXO.jpg" },
                  { nombre: "Soriana", horario: "8:00 am - 10:00 pm", desc: "Supermercado amplio y cómodo. Cuenta con un excelente surtido de alimentos, carnes frescas, una amplia sección de vinos y licores, farmacia y cuidado personal.", foto: "/img/SORIANA.jpg" },
                  { nombre: "Mercado Campeche", horario: "6:00 am - 8:00 pm", desc: "Para vivir la experiencia local. Ideal para comprar mariscos y pescados frescos del día, frutas tropicales de temporada, verduras de la región y artesanías auténticas.", foto: "/img/MERCADO.jpg" },
                  { nombre: "Carnes Santa Fé", horario: "10:00 am - 8:00 pm", desc: "Boutique especializada en cortes de carne premium (res, cerdo y pollo) de excelente calidad para preparar una asada. Pregunta por su servicio de entrega a domicilio.", foto: "/img/CARNESSANTAFE.jpg" },
                ].map((lugar, i) => (
                  <div key={i} className="bg-[#F4F1EA] rounded-3xl overflow-hidden shadow-sm border border-stone-200/30 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className="h-32 w-full flex items-center justify-center border-b border-stone-300/30 bg-[#E0D8CC]/60">
                      <img src={lugar.foto} alt={lugar.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow text-center">
                      <h5 className="font-serif text-xl font-bold text-[#2D4350] mb-1">{lugar.nombre}</h5>
                      <p className="text-xs font-bold text-[#4A6B7C] mb-4 tracking-wider">{lugar.horario}</p>
                      <p className="text-sm text-stone-600 mb-6 flex-grow leading-relaxed">{lugar.desc}</p>
                      <button className="mt-auto bg-[#4A6B7C] text-[#F4F1EA] py-2.5 rounded-full text-xs font-bold hover:bg-[#2D4350] transition-colors w-full shadow-sm">
                        Guíame aquí
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>

          {/* SUB-SECCIÓN: DÓNDE COMER */}
          <div>
            <FadeInSection>
              <div className="text-center mb-10">
                <div className="inline-block border border-[#4A6B7C]/40 bg-[#F4F1EA]/60 px-8 py-3 rounded-2xl shadow-sm mb-3">
                  <h3 className="text-2xl md:text-3xl font-serif text-[#2D4350]">Dónde comer</h3>
                </div>
                <p className="text-[#2D4350]/80 text-sm font-medium mt-2">Desayunar, comer y cenar como un local</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { nombre: "La Parrilla (Cocina Económica)", horario: "1:00 pm - 5:00 pm", desc: "La mejor opción para el almuerzo. Ofrecen comidas, cocina corrida y deliciosos guisos tradicionales campechanos.", foto: "/img/PARRILLA.jpg" },
                  { nombre: "La Palapa del Tío Fito", horario: "8:00 am - 8:00 pm", desc: "Genuina comida tradicional costera. Especialistas en mariscos frescos, cocteles y gastronomía campechana en un ambiente relajado junto al mar.", foto: "/img/TIOFITO.jpg" },
                  { nombre: "Arlés", horario: "L-V 2pm-9pm | Sáb 8am-4pm", desc: "Excelente opción para comer o cenar. Restaurante con enfoque saludable, platillos 100% veganos, orgánicos, café y postres.", foto: "/img/ARLES.jpg" },
                  { nombre: "La Parroquia del Centro", horario: "24 Hrs.", desc: "Ubicada en el Centro de la ciudad. Un clásico imperdible para disfrutar de auténtica comida tradicional campechana, pan y café.", foto: "/img/PARROQUIA.jpg" },
                  { nombre: "Carola Brunch", horario: "8:00 am - 2:00 pm", desc: "Un rincón precioso ideal para iniciar el día. Destaca por su excelente variedad de opciones para un desayuno completo, chilaquiles y café.", foto: "/img/CAROLA.jpg" },
                  { nombre: "La 59", horario: "24 Hrs.", desc: "Ubicado en la calle más icónica del centro. Es un sitio muy popular y con gran ambiente tanto para el desayuno y almuerzo, como para cenar de noche.", foto: "/img/59.jpg" },
                  { nombre: "Parrillita Bola de Queso", horario: "10:00 am - 5:00 pm", desc: "Deliciosas especialidades regionales con el icónico queso de bola. Ideal para un almuerzo rápido, pedir desde el automóvil o solicitar entrega a domicilio.", foto: "/img/PARRILLITA.jpg" },
                  { nombre: "La Parrilla (Taquería)", horario: "Lun a Sáb: 8:00 pm - 1:00 am", desc: "El mismo excelente sazón pero para cenar. Ideal para antojos nocturnos, con un menú variado y servicio rápido.", foto: "/img/PARRILLA.jpg" },
                ].map((lugar, i) => (
                  <div key={i} className="bg-[#F4F1EA] rounded-3xl overflow-hidden shadow-sm border border-stone-200/30 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className={`h-32 w-full flex items-center justify-center border-b border-stone-300/30 ${lugar.foto.includes('.svg') ? 'bg-white' : 'bg-[#E0D8CC]/60'}`}>
                      <img src={lugar.foto} alt={lugar.nombre} className={`w-full h-full ${lugar.foto.includes('.svg') ? 'object-contain p-4' : 'object-cover'}`} />
                    </div>
                    <div className="p-6 flex flex-col flex-grow text-center">
                      <h5 className="font-serif text-xl font-bold text-[#2D4350] mb-1">{lugar.nombre}</h5>
                      <p className="text-xs font-bold text-[#4A6B7C] mb-4 tracking-wider">{lugar.horario}</p>
                      <p className="text-sm text-stone-600 mb-6 flex-grow leading-relaxed">{lugar.desc}</p>
                      <button className="mt-auto bg-[#4A6B7C] text-[#F4F1EA] py-2.5 rounded-full text-xs font-bold hover:bg-[#2D4350] transition-colors w-full shadow-sm">
                        Guíame aquí
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECCIÓN 10: SERVICIOS CERCANOS */}
      <section id="servicios" className="py-16 px-6 bg-[#E0D8CC]">
        <div className="max-w-5xl mx-auto space-y-10">
          <FadeInSection>
            <div className="text-center mb-10">
              <div className="inline-block border border-[#4A6B7C]/40 bg-[#F4F1EA]/60 px-8 py-3 rounded-2xl shadow-sm mb-3">
                <h3 className="text-2xl md:text-3xl font-serif text-[#2D4350]">Servicios Cercanos</h3>
              </div>
              <p className="text-[#2D4350]/80 text-sm font-medium mt-2">Todo lo que necesitas a unos pasos</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  categoria: "Lavandería", 
                  desc: "Servicio de lavado y secado cercano para tu mayor comodidad durante tu estancia.", 
                  foto: "/img/LAVANDERIA.jpg",
                  opciones: [
                    { nombre: "Lavandería Local", link: "https://www.google.com/maps/search/lavanderia+cerca+de+mi+Campeche" } 
                  ]
                },
                { 
                  categoria: "Gimnasios", 
                  desc: "Mantén tu rutina de ejercicios sin interrupciones en los gimnasios locales a corta distancia.", 
                  foto: "/img/GYM.jpg",
                  opciones: [
                    { nombre: "Gym 1 (Más cercano)", link: "https://www.google.com/maps/search/gimnasio+cerca+de+mi+Campeche" },
                    { nombre: "Gym 2", link: "https://www.google.com/maps/search/gimnasio+Campeche" },
                    { nombre: "Gym 3", link: "https://www.google.com/maps/search/gym+Campeche" }
                  ]
                },
                { 
                  categoria: "Hospitales (privados)", 
                  desc: "Atención médica rápida, segura y de primera calidad exclusivamente en clínicas y hospitales privados.", 
                  foto: "/img/HOSPITAL.jpg",
                  opciones: [
                    { nombre: "Hospital Privado 1", link: "https://www.google.com/maps/search/hospital+privado+Campeche" },
                    { nombre: "Clínica Privada 2", link: "https://www.google.com/maps/search/clinica+privada+Campeche" }
                  ]
                },
                { 
                  categoria: "Farmacias", 
                  desc: "Sucursales cercanas para surtir recetas médicas, comprar cuidado personal o artículos de primera necesidad.", 
                  foto: "/img/FARMACIAS.jpg",
                  opciones: [
                    { nombre: "Farmacias Bazar", link: "https://www.google.com/maps/search/Farmacia+Bazar+Campeche" },
                    { nombre: "Farmacia Yza", link: "https://www.google.com/maps/search/Farmacia+Yza+Campeche" },
                    { nombre: "Farmacia Guadalajara", link: "https://www.google.com/maps/search/Farmacia+Guadalajara+Campeche" }
                  ]
                },
                { 
                  categoria: "Gasolineras", 
                  desc: "Estaciones de servicio cercanas y accesibles para recargar combustible de forma rápida.", 
                  foto: "/img/GASOLINERA.jpg",
                  opciones: [
                    { nombre: "Gasolinera 1 (Más cercana)", link: "https://www.google.com/maps/search/gasolinera+cerca+de+mi+Campeche" },
                    { nombre: "Gasolinera 2", link: "https://www.google.com/maps/search/estacion+de+servicio+Campeche" },
                    { nombre: "Gasolinera 3", link: "https://www.google.com/maps/search/pemex+Campeche" }
                  ]
                },
              ].map((servicio, i) => (
                <div key={i} className="bg-[#F4F1EA] rounded-3xl overflow-hidden shadow-sm border border-stone-200/30 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="h-32 bg-[#A8BBC9]/40 flex items-center justify-center border-b border-stone-200/50">
                    <img src={servicio.foto} alt={servicio.categoria} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-center">
                    <h5 className="font-serif text-xl font-bold text-[#2D4350] mb-3">{servicio.categoria}</h5>
                    <p className="text-sm text-stone-600 mb-6 flex-grow leading-relaxed">{servicio.desc}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-auto">
                      {servicio.opciones.map((opcion, idx) => (
                        <a 
                          key={idx} 
                          href={opcion.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#4A6B7C]/10 text-[#2D4350] border border-[#4A6B7C]/30 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#4A6B7C] hover:text-[#F4F1EA] transition-colors shadow-sm"
                        >
                          {opcion.nombre}
                        </a>
                      ))}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECCIÓN 11: LUGARES PARA VISITAR */}
      <section className="py-16 px-6 bg-[#A8BBC9]">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <h3 className="text-3xl font-serif text-[#2D4350] mb-8 text-center">Lugares para visitar</h3>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nombre: "Plaza Galerias", horario: "11:00 am - 9:00 pm", desc: "El centro comercial más grande y moderno de la ciudad.", foto: "/img/GALERIAS.jpg" },
              { nombre: "Centro de Campeche", horario: "24 Hrs.", desc: "Patrimonio de la Humanidad. Camina por sus calles adoquinadas y maravíllate con sus coloridas casas coloniales.", foto: "/img/CENTRO.jpg" },
              { nombre: "Malecón de Campeche", horario: "24 Hrs.", desc: "El lugar perfecto para relajarte frente al mar. Es ideal para caminar, correr o ver los atardeceres.", foto: "/img/MALECON.jpg" }
            ].map((lugar, i) => (
              <FadeInSection delay={i * 150} key={i}>
                <div className="bg-[#F4F1EA] rounded-3xl overflow-hidden shadow-sm border border-stone-200/30 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <img src={lugar.foto} alt={lugar.nombre} className="h-32 w-full object-cover border-b border-stone-200/50" />
                  <div className="p-6 flex flex-col flex-grow text-center">
                    <h5 className="font-serif text-xl font-bold text-[#2D4350] mb-1">{lugar.nombre}</h5>
                    <p className="text-xs font-bold text-[#4A6B7C] mb-3">{lugar.horario}</p>
                    <p className="text-sm text-stone-600 mb-5 flex-grow leading-relaxed">{lugar.desc}</p>
                    <button className="bg-[#4A6B7C] text-[#F4F1EA] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#2D4350] transition-colors w-full shadow-sm">
                      Guíame aquí
                    </button>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 12: TRANSPORTE */}
      <section id="transporte" className="py-16 px-6 bg-[#E0D8CC]">
        <div className="max-w-3xl mx-auto bg-[#F4F1EA] p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200/30 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
          <FadeInSection>
            <h3 className="text-3xl font-serif text-[#2D4350] mb-4 text-center">Transporte</h3>
            <p className="text-lg font-bold text-[#4A6B7C] mb-6 text-center">Cómo moverte por Campeche</p>
            <p className="text-stone-700 mb-4 leading-relaxed text-center">
              La forma más cómoda, rápida y común de moverse por la ciudad es utilizando aplicaciones de transporte. Actualmente, <strong className="text-[#4A6B7C]">inDrive</strong> es la app más popular y utilizada aquí.
            </p>
            <p className="text-stone-700 mb-8 leading-relaxed text-center">
              También puedes usar el servicio de <strong className="text-[#4A6B7C]">taxis tradicionales</strong>, los cuales puedes tomar fácilmente en la calle o en sitios establecidos.
            </p>
            
            <div className="w-full flex justify-center mt-6">
              <img 
                src="/img/TRANSPORTE.jpg" 
                alt="Transporte en Campeche" 
                className="w-full max-w-lg h-48 md:h-64 object-contain bg-[#F4F1EA] rounded-2xl border border-[#4A6B7C]/20 shadow-sm mt-6" 
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* PIE DE PÁGINA (CONTACTO) */}
      <footer id="contacto" className="bg-[#2D4350] text-[#F4F1EA] text-center py-12">
        <FadeInSection>
          <h4 className="text-2xl font-serif mb-4">Contacto Directo</h4>
          <p className="text-sm text-[#F4F1EA]/80 mb-4">¿Tienes alguna urgencia o duda extra? Escríbenos.</p>
          
          <a
            href="https://wa.me/5219818290543"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold text-xl md:text-2xl mb-8 tracking-widest text-white hover:text-[#A8BBC9] hover:-translate-y-1 transform transition-all duration-300"
          >
            +52 1 981 829 0543
          </a>
          
          <p className="text-xs text-[#F4F1EA]/60">© 2026 Departamentos Campeche. Todos los derechos reservados.</p>
        </FadeInSection>
      </footer>

      {/* LIGHTBOX DE IMÁGENES COMPLETO */}
      {lightbox.isOpen && (
        <div onClick={cerrarLightbox} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none backdrop-blur-sm transition-opacity duration-300">
          <button onClick={cerrarLightbox} className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl focus:outline-none p-2 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors">✕</button>
          <button onClick={imagenAnterior} className="absolute left-4 md:left-8 text-white/80 hover:text-white text-4xl p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none z-50">‹</button>
          <div className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center">
            <img src={imagenesDepartamento[lightbox.index]} alt="Visualización ampliada" className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10 transform transition-transform duration-300" onClick={(e) => e.stopPropagation()} />
            <div className="mt-4 text-white/70 text-sm font-medium tracking-widest">{lightbox.index + 1} / {imagenesDepartamento.length}</div>
          </div>
          <button onClick={siguienteImagen} className="absolute right-4 md:right-8 text-white/80 hover:text-white text-4xl p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none z-50">›</button>
        </div>
      )}
    </div>
  );
}

export default App;