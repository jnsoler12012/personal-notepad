<template>

  <!-- HEADER -->
  <NoteComponent mode="view" :noteData="currentNote" @close="handleClose" @save="handleSave" @delete="handleDelete" />

</template>

<script>
import NoteComponent from 'src/components/NoteComponent.vue';
import useNoteStore from 'src/stores/notes';
import { onBeforeMount } from 'vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    NoteComponent,
  },
  method: {

  },
  setup() {
    const noteStore = useNoteStore()
    const router = useRouter();

    const currentNote = ref({
      attachments: [],
      checklist: [],
      collaborators: [],
      content: "",
      contentText: "",
      createdAt: "",
      createdBy: "",
      noteCode: "",
      updatedAt: "",
      updatedBy: "",
      _id: ""
    });

    console.log(router);

    const route = useRoute();
    const noteCode = route.params.noteCode;

    console.log('noteCode:', route, noteCode);


    onBeforeMount(async () => {
      const response = await noteStore.getByNoteCode({ noteCode })
      console.log(response);
      if (!response?.badStatus)
        currentNote.value = noteStore.getCurrentNote()
      else
        router.push('/')
    })

    console.log(currentNote, 'asdasdkjasdhjkhjsdka');

    const handleSave = async (propsNote) => {

      const { noteCode, contentText, color, checklist, attachments } = propsNote;

      console.log('log saVe', propsNote, noteCode, contentText, color, checklist, attachments);

      const response = await noteStore.saveByNoteCode(propsNote)

      console.log(response);



    }

    const handleDelete = async ({ noteCode }) => {
      console.log(noteCode);

      const response = await noteStore.deleteByNoteCode({ noteCode })

      console.log(response);
      router.push('/')
    }

    const handleClose = () => {
      console.log('CLOSE');
      router.push('/')
    }

    return {
      currentNote,
      handleSave,
      handleDelete,
      handleClose
    }
  }

}
//
</script>
