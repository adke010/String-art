import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Sparkles, 
  PlayCircle, 
  Move, 
  Zap, 
  Layers, 
  CheckCircle, 
  Heart,
  ArrowRight,
  ChevronDown,
  Star
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="feature-card group"
  >
    <motion.div 
      className="feature-icon mb-4"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{desc}</p>
  </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ name, role, content, avatar, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className="bg-card p-6 rounded-2xl border border-border shadow-md"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="fill-accent text-accent" />
      ))}
    </div>
    <p className="text-muted-foreground mb-4 leading-relaxed">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </motion.div>
);

// Step Card
const StepCard = ({ number, title, desc }) => (
  <motion.div
    variants={fadeInUp}
    className="relative"
  >
    <div className="flex items-start gap-4">
      <motion.div 
        className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg flex-shrink-0"
        whileHover={{ scale: 1.1 }}
      >
        {number}
      </motion.div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const LandingPage = ({ onStart }) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-rose-200">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
      >
        <div className="section-container py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Hash size={24} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight">String Art <span className="text-accent">2026</span></span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Características</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Cómo Funciona</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Testimonios</a>
          </div>
          
          <Button 
            onClick={onStart}
            variant="outline"
            className="font-semibold"
          >
            Iniciar App
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="section-container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="badge-rose gap-1.5">
                <Sparkles size={14} /> Nueva Versión 2026
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight"
            >
              Convierte tus fotos en{' '}
              <span className="text-gradient-rose">Arte con Hilo</span>.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Nuestro algoritmo avanzado calcula la ruta perfecta de un solo hilo continuo para recrear cualquier imagen con precisión matemática y belleza artesanal.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button 
                onClick={onStart}
                size="lg"
                className="btn-accent text-lg gap-2 px-8"
              >
                <PlayCircle className="fill-current" size={20} />
                COMENZAR A CREAR
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-lg"
                asChild
              >
                <a href="#features">
                  Ver cómo funciona
                  <ChevronDown size={18} className="ml-1" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" />
                  </motion.div>
                ))}
              </div>
              <p>Usado por <span className="text-foreground font-semibold">+10k artistas</span> este mes</p>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image with Before/After Slider */}
          <motion.div 
            className="relative"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -top-10 -right-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-10 -left-10 w-64 h-64 bg-stone-300 rounded-full blur-3xl opacity-20"
              animate={{ 
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Comparison Slider Card */}
            <motion.div 
              className="relative bg-card p-2 rounded-3xl shadow-2xl"
              whileHover={{ rotate: 0 }}
              initial={{ rotate: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden group cursor-ew-resize">
                {/* Original Image */}
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop" 
                  alt="Original" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-foreground/50 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md z-10">
                  FOTO ORIGINAL
                </div>

                {/* String Art Result Overlay */}
                <div 
                  className="absolute inset-0 w-full h-full bg-card"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop" 
                    alt="String Art Result" 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: 'grayscale(100%) contrast(150%) brightness(110%) blur(0.5px)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                  
                  {/* Thread Texture Overlay */}
                  <div 
                    className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px),
                        repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px),
                        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px),
                        repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px)
                      `,
                      backgroundSize: '4px 4px'
                    }}
                  />
                  
                  {/* Circular Mask */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_68%,white_69%)]" />
                  
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg z-10">
                    RESULTADO HILO
                  </div>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-card cursor-ew-resize z-20"
                  style={{ 
                    left: `${sliderPos}%`,
                    boxShadow: '0 0 15px rgba(0,0,0,0.5)'
                  }}
                >
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-card rounded-full shadow-xl flex items-center justify-center text-accent border-4 border-card/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex gap-1">
                      <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                      <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                    </div>
                  </motion.div>
                </div>

                {/* Hidden Range Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
              
              {/* Footer hint */}
              <motion.div 
                className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                  <Move size={14} className="text-accent animate-pulse" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Desliza para comparar</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Logos/Social Proof */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="section-container">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground font-medium mb-8"
          >
            TECNOLOGÍAS Y TÉCNICAS QUE POTENCIAN NUESTRA APP
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            {['Canvas API', 'Algoritmo Greedy', 'Bresenham', 'WebWorkers', 'LocalStorage'].map((tech, i) => (
              <motion.span 
                key={tech}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-lg font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Badge className="badge-stone mb-4">Características</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas para tu obra maestra
            </h2>
            <p className="text-muted-foreground text-lg">
              Desde la carga de la imagen hasta el último clavo, hemos optimizado cada paso del proceso creativo.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-warning" />}
              title="Algoritmo Ultra Rápido"
              desc="Genera hasta 10,000 líneas en segundos sin congelar tu navegador. Visualiza el proceso de tejido en tiempo real."
              index={0}
            />
            <FeatureCard 
              icon={<Layers className="w-8 h-8 text-accent" />}
              title="Editor Integrado"
              desc="Ajusta brillo, contraste, zoom y posición de tu imagen para asegurar que el resultado final sea perfecto."
              index={1}
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-success" />}
              title="Asistente de Construcción"
              desc="Modo interactivo paso a paso que te guía clavo por clavo, guarda tu progreso y estima el tiempo restante."
              index={2}
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1654028103663-ad58080b9999" 
                  alt="String Art Example"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-card p-4 rounded-2xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">4,500 líneas</p>
                    <p className="text-sm text-muted-foreground">procesadas</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Steps */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <Badge className="badge-stone mb-4">Proceso Simple</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  3 pasos para crear arte único
                </h2>
                <p className="text-muted-foreground text-lg">
                  Nuestro flujo de trabajo intuitivo te permite crear arte profesional en minutos.
                </p>
              </motion.div>

              <motion.div 
                className="space-y-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <StepCard 
                  number="1"
                  title="Sube tu imagen"
                  desc="Arrastra o selecciona cualquier foto. Ajusta el encuadre, brillo y contraste."
                />
                <StepCard 
                  number="2"
                  title="Configura los parámetros"
                  desc="Define el número de clavos, líneas y tamaño físico de tu lienzo."
                />
                <StepCard 
                  number="3"
                  title="Genera y construye"
                  desc="Observa el algoritmo trabajar y sigue las instrucciones paso a paso."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Button onClick={onStart} className="btn-accent gap-2">
                  Empezar ahora <ArrowRight size={18} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Badge className="badge-rose mb-4">Testimonios</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Lo que dicen nuestros artistas
            </h2>
            <p className="text-muted-foreground text-lg">
              Miles de creadores han transformado sus ideas en obras de arte tangibles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="María García"
              role="Artista Visual"
              content="Increíble herramienta. Pude crear un retrato de mi abuela que la hizo llorar de emoción. La precisión del algoritmo es impresionante."
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
              delay={0}
            />
            <TestimonialCard 
              name="Carlos Mendoza"
              role="Diseñador Gráfico"
              content="El modo constructor paso a paso es genial. Nunca había hecho string art antes y ahora tengo 3 piezas en mi sala."
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=carlos"
              delay={0.1}
            />
            <TestimonialCard 
              name="Ana Rodríguez"
              role="Emprendedora"
              content="Empecé vendiendo string art personalizado gracias a esta app. El historial de versiones me permite experimentar sin miedo."
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=ana"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="section-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ¿Listo para tejer?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Únete a miles de creadores y convierte esa foto especial en un regalo inolvidable o una pieza de decoración única.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                onClick={onStart}
                size="lg"
                className="bg-accent text-accent-foreground text-xl font-bold py-6 px-10 rounded-full hover:bg-accent/90 shadow-rose-glow hover:scale-105 transition-all"
              >
                Crear Proyecto Nuevo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-muted py-12">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center text-foreground">
                <Hash size={18} strokeWidth={3} />
              </div>
              <span className="text-lg font-bold text-card">String Art 2026</span>
            </div>
            
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              © 2026 String Art Studio. Hecho con 
              <Heart size={14} className="text-accent fill-accent mx-1" /> 
              por Artistas.
            </p>
            
            <div className="flex gap-6">
              <a href="#features" className="text-muted-foreground hover:text-card transition-colors text-sm">Características</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-card transition-colors text-sm">Cómo Funciona</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-card transition-colors text-sm">Testimonios</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
