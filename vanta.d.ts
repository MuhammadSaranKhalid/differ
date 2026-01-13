declare module 'vanta/dist/vanta.net.min' {
  import * as THREE from 'three';

  interface VantaEffect {
    destroy: () => void;
  }

  interface VantaOptions {
    el: HTMLElement | null;
    THREE?: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number | string;
    backgroundColor?: number | string;
    points?: number;
    maxDistance?: number;
    spacing?: number;
  }

  export default function NET(options: VantaOptions): VantaEffect;
}
