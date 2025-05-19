<template>
  <q-page class="flex flex-center">

    <q-banner dense :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" style="margin: 0px 20px">
      <template v-slot:avatar>
        <q-icon name="note_add" color="primary" />
      </template>
      Welcome to Note Manager V1, Create a New Note or edit an existing one. Select it from the left-side menu
      <template v-slot:action>
        <q-btn flat color="primary" label="Create Note" @click="createNewNote()" />
      </template>
    </q-banner>
  </q-page>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'welcomePage',
  setup() {
    // Call useRouter here inside setup
    const router = useRouter()
    console.log(router)

    function createNewNote() {
      router.push('/notes/new')
    }

    return {
      createNewNote
    }
  }
}
</script>
