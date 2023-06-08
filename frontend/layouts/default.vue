<script lang="ts" setup>
const { appName } = useRuntimeConfig().public
const { message, snackbar } = storeToRefs(useMessageStore())
</script>

<template>
  <v-card>
    <v-layout>
      <v-main>
        <v-container
          class="d-flex justify-center align-center flex-column"
          style="min-height: 100dvh"
        >
          <slot />
          <v-snackbar v-model="snackbar">
            {{ message }}

            <template v-slot:actions>
              <v-btn color="pink-lighten-3" variant="text" @click="snackbar = false">
                X
              </v-btn>
            </template>
          </v-snackbar>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
