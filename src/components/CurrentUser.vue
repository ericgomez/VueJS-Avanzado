<template>
  <div class="current-user">
    <!-- slot principal - informacion que lanza hacia el componente padre  -->
    <slot :user="user"></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentUser',
  computed: {
    // Accedemos al Helper a travez del Spread Operator
    ...mapGetters({
      // le indicamo que la variable user este enlazado con authUser
      user: 'authUser',
    }),
  },
};
</script>
