<template>
  <div class="slider-wrapper">
    <slot></slot>
  </div>
</template>

<script>
// importacion de librerias
import { tns } from 'tiny-slider/src/tiny-slider';
// Propios estilos de tiny slider
import 'tiny-slider/dist/tiny-slider.css';

export default {
  name: 'TinySlider',
  data() {
    return {
      // Cuando asignamos un $ al principio estamos indicando
      // que no vamos a utilizar reactivadad dentro de este elemento
      $slider: null,
    };
  },
  // Metodo cuando el compoenente a sido montado
  mounted() {
    // iniciamos el componente
    this.init();
  },
  methods: {
    // Metodo inicial
    init() {
      // Configuracionnes para el elemento a cargar
      const settings = {
        // $el - accedesmos al elemento padre del elemento
        container: this.$el,
        mode: 'gallery',
      };
      // Asinamos la confirguracion de tiny-slider al componente slider
      this.$slider = tns(settings);
    },
  },
  // Metodo antes deque se destruye el componente
  beforeDestroy() {
    if (this.$slider) {
      // destruimos el compoenente cuando salga de la pantalla
      this.$slider.destroy();
    }
  },
};
</script>
