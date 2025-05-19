<template>
  <div class="q-pa-md bg-grey-2 full-height flex flex-center">
    <q-layout view="lHh Lpr lFf" class="rounded-borders shadow-2"
      style="max-width: calc(960px - 300px); width: 100%; min-height: 100%">

      <q-header elevated class="bg-primary text-white">
        <q-toolbar class="q-pl-sm q-pr-md">
          <q-btn round dense flat icon="keyboard_arrow_left" @click="toggleLeftDrawer" aria-label="Toggle drawer" />

          <div class="text-h6 ellipsis q-mr-md" style="margin-left: 20px">
            Welcome back to your notes
          </div>

          <q-space />
          <q-btn round dense flat class="q-ml-sm q-mr-md">
            <q-avatar size="36px">
              <img :src="currentNote?.avatar || 'https://avatars.githubusercontent.com/u/63087709?v=4&size=64'" />
            </q-avatar>
            <q-menu auto-close :offset="[0, 36]">
              <q-list style="min-width: 160px">
                <q-item clickable v-for="item in menuItems" :key="item.text" @click="onMenuItemClick(item)"
                  class="q-hoverable hover-text-negative">
                  <q-item-section avatar v-if="item.icon">
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section @click="item.action()">{{ item.text }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>


      <!-- DRAWER -->
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="300" :breakpoint="690" class="bg-white">
        <q-toolbar class="bg-grey-3 q-px-md">
          <q-avatar class="cursor-pointer" size="36px">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-space />

          <q-btn round dense flat icon="close" class="q-ml-sm" @click="toggleLeftDrawer" />
        </q-toolbar>

        <q-toolbar class="bg-grey-1 q-pa-sm">
          <q-input dense outlined rounded v-model="search" placeholder="Search by noteCode" clearable debounce="300"
            class="full-width">
            <template v-slot:prepend>
              <q-icon name="search" @click="searchNotes" />
            </template>
          </q-input>
        </q-toolbar>

        <q-scroll-area class="q-pa-sm" style="height: calc(100% - 112px);">
          <q-list separator>
            <q-item v-for="(note, index) in noteStore.notes" :key="note._id" clickable v-ripple
              :active="currentNoteIndex === index" @click="setCurrentNote({ index, note })" class="q-my-xs">
              <q-item-section avatar>
                <!-- Replace avatar image with a note icon -->
                <q-icon name="note" size="30px" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" class="text-weight-bold">
                  {{ note.noteCode }}
                </q-item-label>
                <q-item-label caption class="text-grey-7">
                  {{ truncateText(note.contentText) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top class="text-grey-6 text-caption">
                <q-icon name="keyboard_arrow_down" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <!-- PAGE CONTAINER -->
      <q-page-container class="bg-grey-2" style="padding: 6% 0 0 0;">
        <router-view />
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import useNoteStore from 'src/stores/notes'
import useAuthStore from 'src/stores/auth';
import { useRoute, useRouter } from 'vue-router';



export default {
  name: 'mainnLayout',
  methods: {
    truncateText(text, length = 15) {
      if (!text) return '';
      return text.length > length ? text.slice(0, length) + '...' : text;
    }
  },
  setup() {
    const $q = useQuasar()

    const leftDrawerOpen = ref(false)

    const search = ref('')
    const currentNoteIndex = ref(0)


    const noteStore = useNoteStore();
    const authStore = useAuthStore();
    const notes = ref([])

    const route = useRoute();
    const router = useRouter();
    const noteCode = ref(route.params.noteCode);

    onBeforeMount(async () => {
      await noteStore.getAllNotes()
      notes.value = noteStore.getAllCurrentNotes()
    })

    function loadNote(noteCode) {
      // Fetch or load the note based on the noteCode
      console.log('Loading note:', noteCode);

    }

    onMounted(() => {
      loadNote(noteCode.value);
    });

    watch(
      () => route.params.noteCode,
      (newNoteCode) => {
        noteCode.value = newNoteCode;
        loadNote();  // Re-fetch or reload note
      },
      { immediate: true }
    );

    const currentNote = computed(() => {
      return notes[currentNoteIndex.value]
    })

    const filterednotes = computed(() => {
      if (!search.value) return notes
      return notes.value.filter(c =>
        c.person.toLowerCase().includes(search.value.toLowerCase())
      )
    })

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function setCurrentNote({ index, note }) {
      console.log(index, note);

      currentNoteIndex.value = index
      router.push(`/notes/${note.noteCode}`);
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }

    const menuItems = [
      { text: 'Logout', icon: 'logout', action: () => { return authStore.logout() } }  // Add icon for logout here
    ]

    function onMenuItemClick(item) {
      console.log('Menu item clicked:', item)
      // Add your menu item handling logic here
    }

    const searchNotes = async (target) => {
      console.log(target, search.value);
      await noteStore.getAllNotes({textSearch: search.value})
    }



    return {
      $q,
      leftDrawerOpen,
      search,
      currentNoteIndex,
      notes,
      noteStore,
      currentNote,
      filterednotes,
      toggleLeftDrawer,
      setCurrentNote,
      menuItems,
      onMenuItemClick,
      searchNotes
    }
  }
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
