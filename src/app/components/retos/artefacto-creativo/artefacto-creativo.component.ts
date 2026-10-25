import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
  icono?: string;
}

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal' | 'special';
}

export interface CasaHogwarts {
  id: 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';
  nombre: string;
  lema: string;
  colorHex: string;
  icono: string;
  bono: string;
}

export interface RivalConfig {
  id: number;
  nombre: string;
  casa: string;
  titulo: string;
  avatar: string;
  dificultad: 'Aprendiz' | 'Avanzado' | 'Señor Oscuro';
  hechizos: string[];
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy, AfterViewInit {
  // =========================================================================
  // 🎨 RETO 7: EL GRAN LIENZO CREATIVO (30% DE LA CALIFICACIÓN)
  // Torneo de los 3 Magos Oscuros & Gryffindor Ganador
  // =========================================================================

  // --- 1. Múltiples Estados Interactivos ---
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';
  vistaActiva: 'DUELO' | 'FORJA' | 'ESTADISTICAS' = 'DUELO';
  arenaOscura: boolean = false;
  escudoMagoActivo: number = 0;
  efectoVisualActual: string = '';
  ultimoDanioInfligido: number = 0;

  // --- 2. Estadísticas del Jugador (Gryffindor por defecto) ---
  nombreMago: string = 'Harry Potter';
  saludMago: number = 100;
  energiaMago: number = 100;
  casaSeleccionada: 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff' = 'Gryffindor';
  varitaSeleccionada: string = 'Acebo y Pluma de Fénix (Equilibrada)';

  // --- 3. Catálogo de los 3 Rivales a Enfrentar ---
  rivalesDisponibles: RivalConfig[] = [
    {
      id: 1,
      nombre: 'Draco Malfoy',
      casa: 'Slytherin',
      titulo: 'Heredero de Slytherin',
      avatar: '🧙‍♂️🐍',
      dificultad: 'Aprendiz',
      hechizos: ['Serpensortia', 'Tarantallegra', 'Rictusempra', 'Protego']
    },
    {
      id: 2,
      nombre: 'Bellatrix Lestrange',
      casa: 'Mortífaga',
      titulo: 'Lugarteniente de las Sombras',
      avatar: '🧙‍♀️⚡',
      dificultad: 'Avanzado',
      hechizos: ['Crucio Menor', 'Confringo', 'Bombarda', 'Impedimenta']
    },
    {
      id: 3,
      nombre: 'Lord Voldemort',
      casa: 'El Que No Debe Ser Nombrado',
      titulo: 'Señor Tenebroso',
      avatar: '💀🐍',
      dificultad: 'Señor Oscuro',
      hechizos: ['Fuego Maldito', 'Maldición Asesina Fallida', 'Avada Espectral', 'Aura Tenebrosa']
    }
  ];

  rivalSeleccionadoId: number = 1;
  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Seguimiento del Torneo de los 3 Magos
  rivalesDerrotadosIds: number[] = [];

  // Parámetros de la partida
  numeroTurno: number = 1;
  victoriasTotales: number = 0;
  derrotasTotales: number = 0;
  danoTotalInfligido: number = 0;

  // Casas de Hogwarts
  casasHogwarts: CasaHogwarts[] = [
    { id: 'Gryffindor', nombre: 'Gryffindor', lema: 'Valor, temple y audacia', colorHex: '#ae0001', icono: '🦁', bono: '+5 de daño crítico en ataques' },
    { id: 'Slytherin', nombre: 'Slytherin', lema: 'Astucia, ingenio y ambición', colorHex: '#2a623d', icono: '🐍', bono: '15% de probabilidad de contraataque venenoso' },
    { id: 'Ravenclaw', nombre: 'Ravenclaw', lema: 'Sabiduría, mente y erudición', colorHex: '#222f5b', icono: '🦅', bono: 'Recupera maná 20% más rápido' },
    { id: 'Hufflepuff', nombre: 'Hufflepuff', lema: 'Lealtad, esfuerzo y paciencia', colorHex: '#eeb546', icono: '🦡', bono: '+10 de poder en hechizos curativos' }
  ];

  varitasDisponibles: string[] = [
    'Acebo y Pluma de Fénix (Equilibrada)',
    'Sauco y Pelo de Thestral (+10 Ataque)',
    'Vid y Fibra de Corazón de Dragón (+15 Escudo)',
    'Tejo y Núcleo de Cuerno de Basilisco (Coste -5 Maná)'
  ];

  // Exponer Number y getters defensivos para el template
  readonly Number = Number;

  get rivalActual(): RivalConfig {
    return this.rivalesDisponibles.find(r => r.id === Number(this.rivalSeleccionadoId)) || this.rivalesDisponibles[0];
  }

  get siguienteRival(): RivalConfig | undefined {
    return this.rivalesDisponibles.find(r => !this.rivalesDerrotadosIds.includes(r.id));
  }

  // Grimorio ancestral de Hechizos
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Expelliarmus', tipo: 'Ataque', poder: 25, costoEnergia: 20, descripcion: 'Desarma al oponente con un rayo rojo escarlata.', icono: '⚡' },
    { id: 2, nombre: 'Protego', tipo: 'Defensa', poder: 30, costoEnergia: 15, descripcion: 'Crea un escudo mágico que absorbe el siguiente impacto.', icono: '🛡️' },
    { id: 3, nombre: 'Episkey', tipo: 'Sanacion', poder: 25, costoEnergia: 20, descripcion: 'Restaura vitalidad y sella heridas de combate.', icono: '✨' },
    { id: 4, nombre: 'Stupefy', tipo: 'Ataque', poder: 38, costoEnergia: 35, descripcion: 'Aturde al rival con una potente onda expansiva luminosa.', icono: '💥' },
    { id: 5, nombre: 'Incendio', tipo: 'Ataque', poder: 45, costoEnergia: 40, descripcion: 'Conjura una llamarada ardiente directa contra el rival.', icono: '🔥' }
  ];

  historialDuelo: RegistroTurno[] = [];

  // Forja de Hechizos
  nuevoHechizo: HechizoDuelo = {
    id: 6,
    nombre: '',
    tipo: 'Ataque',
    poder: 30,
    costoEnergia: 25,
    descripcion: ''
  };
  mensajeForja: string = '';

  private ambientMusicInterval: any = null;
  private rivalTurnTimeout: any = null;
  private efectoVisualTimeout: any = null;

  // =========================================================================
  // HOOKS DE CICLO DE VIDA
  // =========================================================================

  ngOnInit(): void {
    console.log('🎨 [Reto 7] ngOnInit: Torneo de los 3 Magos cargado.');
    this.sincronizarRivalActual();
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        const incrementoMago = this.casaSeleccionada === 'Ravenclaw' ? 3 : 2;
        this.energiaMago = Math.min(100, this.energiaMago + incrementoMago);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 1800);
  }

  ngAfterViewInit(): void {
    console.log('🎨 [Reto 7] ngAfterViewInit: Vistas y componentes del torneo sincronizados.');
  }

  ngOnDestroy(): void {
    if (this.ambientMusicInterval) {
      clearInterval(this.ambientMusicInterval);
      this.ambientMusicInterval = null;
    }
    if (this.rivalTurnTimeout) {
      clearTimeout(this.rivalTurnTimeout);
      this.rivalTurnTimeout = null;
    }
    if (this.efectoVisualTimeout) {
      clearTimeout(this.efectoVisualTimeout);
      this.efectoVisualTimeout = null;
    }
    console.log('🎨 [Reto 7] ngOnDestroy: Recursos destruidos.');
  }

  // =========================================================================
  // LÓGICA DEL TORNEO DE LOS 3 MAGOS
  // =========================================================================

  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.vistaActiva = 'DUELO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.escudoMagoActivo = 0;
    this.numeroTurno = 1;

    this.sincronizarRivalActual();
    this.dispararEfectoVisual(`⚔️ ¡Comienza el duelo contra ${this.nombreRival}!`);

    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Árbitro de Hogwarts',
        hechizo: 'Apertura de Duelo',
        efecto: `¡Varitas en alto! ${this.nombreMago} (${this.casaSeleccionada}) vs ${this.nombreRival}.`,
        tipo: 'special'
      }
    ];
  }

  elegirRival(id: number): void {
    if (this.estadoDuelo === 'EN_CURSO') return;
    this.rivalSeleccionadoId = Number(id);
    this.sincronizarRivalActual();
  }

  sincronizarRivalActual(): void {
    const rival = this.rivalesDisponibles.find(r => r.id === Number(this.rivalSeleccionadoId));
    if (rival) {
      this.nombreRival = rival.nombre;
    }
  }

  cambiarRival(): void {
    this.sincronizarRivalActual();
  }

  // Verifica si los 3 magos ya han sido vencidos
  todosRivalesDerrotados(): boolean {
    return this.rivalesDisponibles.every(r => this.rivalesDerrotadosIds.includes(r.id));
  }

  // Busca el siguiente rival aún no derrotado en el orden
  obtenerSiguienteRival(): RivalConfig | undefined {
    return this.rivalesDisponibles.find(r => !this.rivalesDerrotadosIds.includes(r.id));
  }

  // Avanza automáticamente al siguiente rival del torneo
  avanzarSiguienteRival(): void {
    const siguiente = this.obtenerSiguienteRival();
    if (siguiente) {
      this.rivalSeleccionadoId = siguiente.id;
      this.sincronizarRivalActual();
      this.iniciarDuelo();
    } else {
      this.reiniciarTorneo();
    }
  }

  reiniciarTorneo(): void {
    this.rivalesDerrotadosIds = [];
    this.rivalSeleccionadoId = 1;
    this.sincronizarRivalActual();
    this.estadoDuelo = 'PREPARACION';
    this.saludMago = 100;
    this.saludRival = 100;
    this.energiaMago = 100;
    this.energiaRival = 100;
    this.historialDuelo = [];
  }

  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.energiaMago < hechizo.costoEnergia) return;

    const costoFinal = this.varitaSeleccionada.includes('Tejo')
      ? Math.max(5, hechizo.costoEnergia - 5)
      : hechizo.costoEnergia;
    this.energiaMago = Math.max(0, this.energiaMago - costoFinal);

    let poderFinal = hechizo.poder;

    if (hechizo.tipo === 'Ataque') {
      if (this.casaSeleccionada === 'Gryffindor') poderFinal += 5;
      if (this.varitaSeleccionada.includes('Sauco')) poderFinal += 10;

      this.saludRival = Math.max(0, this.saludRival - poderFinal);
      this.danoTotalInfligido += poderFinal;
      this.ultimoDanioInfligido = poderFinal;
      this.dispararEfectoVisual(`💥 ¡${hechizo.nombre}! (-${poderFinal} HP)`);

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `¡Impacto directo! Causa ${poderFinal} pts de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      if (this.casaSeleccionada === 'Hufflepuff') poderFinal += 10;
      this.saludMago = Math.min(100, this.saludMago + poderFinal);
      this.dispararEfectoVisual(`✨ ¡Curación con ${hechizo.nombre}! (+${poderFinal} HP)`);

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Cura mágica: Restaura ${poderFinal} pts de vitalidad.`,
        tipo: 'heal'
      });
    } else {
      if (this.varitaSeleccionada.includes('Vid')) poderFinal += 15;
      this.escudoMagoActivo = poderFinal;
      this.dispararEfectoVisual(`🛡️ ¡${hechizo.nombre}! Escudo absorbe ${poderFinal} pts`);

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Escudo activo: Absorberá ${poderFinal} puntos del próximo impacto.`,
        tipo: 'shield'
      });
    }

    // Verificar si el rival cayó
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      this.victoriasTotales++;

      // Registrar rival derrotado
      if (!this.rivalesDerrotadosIds.includes(Number(this.rivalSeleccionadoId))) {
        this.rivalesDerrotadosIds.push(Number(this.rivalSeleccionadoId));
      }

      if (this.todosRivalesDerrotados()) {
        this.casaSeleccionada = 'Gryffindor'; // Gryffindor campeón absoluto
        this.dispararEfectoVisual('🏆 ¡TORNEO CONCLUIDO! ¡GRYFFINDOR GANADOR!');
      } else {
        this.dispararEfectoVisual(`🏆 ¡${this.nombreRival} derrotado!`);
      }
      return;
    }

    this.turnoRival();
  }

  private turnoRival(): void {
    this.rivalTurnTimeout = setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const rival = this.rivalesDisponibles.find(r => r.id === Number(this.rivalSeleccionadoId));
      const hechizos = rival?.hechizos || ['Serpensortia', 'Tarantallegra', 'Rictusempra'];
      const hechizoElegido = hechizos[Math.floor(Math.random() * hechizos.length)];

      let danoBase = Math.floor(Math.random() * 15) + 12;
      if (rival?.dificultad === 'Avanzado') danoBase += 8;
      if (rival?.dificultad === 'Señor Oscuro') danoBase += 15;

      let danoReal = danoBase;
      let absorbido = 0;

      if (this.escudoMagoActivo > 0) {
        absorbido = Math.min(this.escudoMagoActivo, danoReal);
        this.escudoMagoActivo -= absorbido;
        danoReal -= absorbido;
      }

      this.saludMago = Math.max(0, this.saludMago - danoReal);
      this.numeroTurno++;

      const detalleEscudo = absorbido > 0 ? ` (Escudo absorbió ${absorbido} pts)` : '';

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: hechizoElegido,
        efecto: `¡${this.nombreRival} lanza ${hechizoElegido}! Causa ${danoReal} pts de daño${detalleEscudo}.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
        this.derrotasTotales++;
        this.dispararEfectoVisual('💀 ¡Has caído en el duelo!');
      }
    }, 650);
  }

  // --- Forja de Hechizos Personalizados ---
  forjarHechizo(): void {
    if (!this.nuevoHechizo.nombre || this.nuevoHechizo.nombre.trim().length < 3) {
      this.mensajeForja = '⚠️ El encantamiento debe tener un nombre de al menos 3 letras.';
      return;
    }
    if (this.nuevoHechizo.poder <= 0 || this.nuevoHechizo.costoEnergia <= 0) {
      this.mensajeForja = '⚠️ El poder y costo deben ser estrictamente mayores a 0.';
      return;
    }

    const iconoTipo = this.nuevoHechizo.tipo === 'Ataque' ? '⚡' : this.nuevoHechizo.tipo === 'Defensa' ? '🛡️' : '✨';

    const hechizoCreado: HechizoDuelo = {
      id: Date.now(),
      nombre: this.nuevoHechizo.nombre.trim(),
      tipo: this.nuevoHechizo.tipo,
      poder: Number(this.nuevoHechizo.poder),
      costoEnergia: Number(this.nuevoHechizo.costoEnergia),
      descripcion: this.nuevoHechizo.descripcion.trim() || 'Hechizo forjado en el taller.',
      icono: iconoTipo
    };

    this.hechizosDuelo.push(hechizoCreado);
    this.mensajeForja = `✨ ¡Encantamiento "${hechizoCreado.nombre}" forjado y añadido al mazo!`;

    this.nuevoHechizo = {
      id: Date.now(),
      nombre: '',
      tipo: 'Ataque',
      poder: 30,
      costoEnergia: 25,
      descripcion: ''
    };
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  cambiarVista(vista: 'DUELO' | 'FORJA' | 'ESTADISTICAS'): void {
    this.vistaActiva = vista;
  }

  private dispararEfectoVisual(texto: string): void {
    this.efectoVisualActual = texto;
    if (this.efectoVisualTimeout) clearTimeout(this.efectoVisualTimeout);
    this.efectoVisualTimeout = setTimeout(() => {
      this.efectoVisualActual = '';
    }, 2500);
  }
}
