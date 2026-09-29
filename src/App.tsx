import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, Signal, Zap } from 'lucide-react';
import Scene3D from './components/Scene3D';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import AudioEngine from './components/AudioEngine';
import MagneticWrapper from './components/MagneticWrapper';
import GlitchedText from './components/GlitchedText';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Pinned Animation for Scroll Tracking
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      });

      // Fade in animations for sections
      const sections = gsap.utils.toArray('section:not(.hero)');
      sections.forEach((section: any) => {
        gsap.from(section, {
          opacity: 0,
          y: 100,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Initial stagger animations
      gsap.from(".welcome-text span", {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.05,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.5
      });

      gsap.from(".nav-item", {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        delay: 1
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
      <CustomCursor />
      <AudioEngine />
      <div className="fixed inset-0 scanlines z-[99] opacity-20" />
      <div className="fixed inset-0 vignette z-[99] opacity-50" />
      <div ref={mainRef} className="relative bg-ink">
        {/* 3D Background */}
        <Scene3D scrollProgress={scrollProgress} />

        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-8 flex items-center justify-between mix-blend-difference">
          <MagneticWrapper>
            <a href="#" className="nav-item interactive text-2xl font-display font-black tracking-tighter text-paper">
              ITZFIZZ
            </a>
          </MagneticWrapper>

          <div className="hidden md:flex items-center gap-12 text-[10px] font-mono tracking-[0.3em] uppercase">
            <MagneticWrapper><a href="#experience" className="nav-item interactive hover:text-acid transition-colors">Experience</a></MagneticWrapper>
            <MagneticWrapper><a href="#city" className="nav-item interactive hover:text-acid transition-colors">City</a></MagneticWrapper>
            <MagneticWrapper><a href="#gallery" className="nav-item interactive hover:text-acid transition-colors">Gallery</a></MagneticWrapper>
            <MagneticWrapper><a href="#contact" className="nav-item interactive hover:text-acid transition-colors">Contact</a></MagneticWrapper>
          </div>

          <MagneticWrapper>
            <button className="nav-item interactive px-8 py-3 bg-white text-ink text-[10px] font-display font-bold uppercase tracking-[0.2em] hover:bg-acid transition-all">
              SYNC CORE
            </button>
          </MagneticWrapper>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="hero relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-[20%] left-0 w-full flex flex-col items-center z-20 pointer-events-none perspective-1000">
            <h1 className="welcome-text text-[clamp(2rem,10vw,15rem)] font-display font-black tracking-[0.4em] text-center leading-none uppercase opacity-40">
              {"WELCOME".split("").map((char, i) => <span key={i} className="inline-block">{char}</span>)}
              <br />
              {"ITZFIZZ".split("").map((char, i) => <span key={i} className="inline-block">{char}</span>)}
            </h1>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <p 
              className="text-2xl md:text-5xl font-display font-bold tracking-[0.5em] text-center transition-all duration-700 uppercase"
              style={{ 
                opacity: scrollProgress > 0.1 && scrollProgress < 0.3 ? 1 : 0,
                transform: `translateY(${(0.2 - scrollProgress) * 200}px) scale(${1 + scrollProgress})`
              }}
            >
              The Object Becomes The World
            </p>
          </div>

          {/* Metrics */}
          <div className="absolute bottom-16 left-8 md:left-16 flex flex-col gap-10 z-20">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mb-2">Neural Link</span>
              <span className="text-3xl font-mono tabular-nums text-acid">ACTIVE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mb-2">Core Velocity</span>
              <span className="text-3xl font-mono tabular-nums">{(scrollProgress * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Scroll Cue */}
          <div className="absolute bottom-16 right-8 md:right-16 flex flex-col items-center gap-4 z-20 mix-blend-difference">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-white/40 overflow-hidden">
              <div className="w-full h-full bg-acid animate-bounce origin-top" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] rotate-90 origin-right translate-x-4">Initiate Scroll</span>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="relative min-h-screen w-full bg-paper/95 text-ink px-8 md:px-32 py-40 z-10 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ink/30 mb-10 block">01 / KINETIC ARCHITECTURE</span>
            <h2 className="text-7xl md:text-9xl font-black mb-16 tracking-tighter leading-[0.9] text-balance">
              <GlitchedText text="3D OBJECTIVES AS INTERFACE." />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
              <p className="text-2xl md:text-3xl font-medium leading-snug opacity-90 text-balance">
                We've moved beyond the flat web. Our interfaces are spatial environments where depth, lighting, and physics create a visceral connection between the user and the signal.
              </p>
              <div className="flex flex-col gap-10">
                {[
                  { icon: Signal, label: "Volumetric Flow", desc: "Real-time shader calculations for organic movement and liquid logic." },
                  { icon: Zap, label: "Zero-Latency Physics", desc: "Complex 3D calculations optimized for 120fps fluid performance." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group interactive">
                    <div className="w-12 h-12 flex items-center justify-center border border-ink/10 rounded-full group-hover:bg-ink group-hover:text-paper transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-[0.2em] mb-2 text-sm">{item.label}</h4>
                      <p className="text-base opacity-50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* City Section */}
        <section id="city" className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-32 py-40 z-10 overflow-hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm z-0" />
          <div className="relative z-10 max-w-5xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-acid mb-10 block">02 / SPATIAL DATA</span>
            <h2 className="text-7xl md:text-9xl font-black mb-16 text-white tracking-tighter leading-[0.9]">
              <GlitchedText text="NAVIGATE THE INFINITE." />
            </h2>
            <p className="text-2xl md:text-3xl text-paper/70 leading-snug mb-16 text-balance max-w-3xl">
              A digital metropolis built from pure information. Every structure is a data point, every light a living signal in the ITZFIZZ universe.
            </p>
            <button className="group flex items-center gap-6 px-10 py-5 border border-white/20 hover:border-acid hover:text-acid transition-all text-paper font-display font-bold uppercase tracking-[0.3em] text-xs">
              ACCESS CITY CORE <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="relative min-h-screen w-full bg-ink/80 px-8 md:px-32 py-40 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
              <div className="max-w-2xl">
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-10 block">03 / VISUAL EVIDENCE</span>
                <h2 className="text-7xl font-black text-white tracking-tighter">IMPOSSIBLE<br />GALLERY</h2>
              </div>
              <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 pb-4">
                <span className="text-acid border-b border-acid">All Signals</span>
                <span className="hover:text-white cursor-pointer transition-colors">Motion</span>
                <span className="hover:text-white cursor-pointer transition-colors">Code</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "NEURAL RIBBON", category: "MOTION", image: "/src/assets/images/portfolio_project_1_1790686069956.jpg" },
                { title: "KINETIC VOID", category: "VISUAL", image: "/src/assets/images/portfolio_project_2_1790686083544.jpg" },
                { title: "LIQUID LOGIC", category: "CODE", image: "/src/assets/images/portfolio_project_3_1790686096142.jpg" }
              ].map((project, i) => (
                <div key={i} className="interactive group relative aspect-[4/5] overflow-hidden bg-white/5 cursor-none perspective-1000">
                  <div className="w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-12 left-12">
                    <span className="text-[10px] font-mono text-acid tracking-[0.4em] block mb-3">{project.category}</span>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{project.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="relative min-h-screen w-full flex flex-col items-center justify-center px-8 text-center z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink z-0" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-[clamp(3rem,15vw,18rem)] font-display font-black tracking-tighter leading-[0.8] uppercase mb-20 text-white">
              JOIN THE<br />CORE
            </h2>
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <MagneticWrapper>
                <button className="interactive px-16 py-8 bg-acid text-ink font-display font-black text-2xl uppercase tracking-[0.2em] hover:scale-105 transition-transform active:scale-95 shadow-[0_0_50px_rgba(215,255,0,0.3)]">
                  INITIATE
                </button>
              </MagneticWrapper>
              <div className="text-left border-l border-white/10 pl-16">
                <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4">Transmission Channel</p>
                <MagneticWrapper>
                  <p className="interactive text-2xl font-bold text-white hover:text-acid cursor-pointer transition-colors">signal@itzfizz.universe</p>
                </MagneticWrapper>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-16 w-full px-8 md:px-32 flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-mono uppercase tracking-[0.5em] text-white/20">
            <p>© 2026 ITZFIZZ TRANSMISSION</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-acid transition-colors">Twitter</a>
              <a href="#" className="hover:text-acid transition-colors">Instagram</a>
              <a href="#" className="hover:text-acid transition-colors">Nodes</a>
            </div>
            <p>SYNCED WITH UNIVERSAL TIME</p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
