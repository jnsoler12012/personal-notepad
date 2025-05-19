<template>
  <!-- HEADER -->
  <NoteComponent mode="create" @close="handleClose" @save="handleSave" />

</template>

<script>
import NoteComponent from 'src/components/NoteComponent.vue';
import useNoteStore from 'src/stores/notes';
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

    console.log(currentNote, 'asdasdkjasdhjkhjsdka');

    const handleSave = async (propsNote) => {

      const { noteCode, contentText, color, checklist, attachments } = propsNote;

      console.log('log saVe', propsNote, noteCode, contentText, color, checklist, attachments);

      const response = await noteStore.saveNewNote({ ...propsNote, content: contentText })

      console.log(response);
      router.push('/')
      window.location.reload()


    }

    const handleClose = () => {
      console.log('CLOSE');
      router.push('/')
    }

    return {
      currentNote,
      handleSave,
      handleClose
    }
  }

}
//
</script>
