<template>
  <q-layout view="lHh Lpr lFf" style="min-height: 80vh">
    <q-page-container>
      <q-page style="min-height: 100%" class="full-height flex  items-start justify-center flex-top bg-grey-2 q-mt-lg">
        <q-card class="note-card" :style="{ backgroundColor: color, '--text-color': textColor, color: textColor }">
          <q-btn icon="close" dense flat round size="sm" class="close-btn" @click="handleClose" />

          <div class="folded-corner"></div>

          <q-input :style="{ color: textColor }" v-model="noteCode" placeholder="Note noteCode" value='noteCode' dense
            flat class="note-noteCode" autofocus :readonly="mode == create" />

          <div class="checklist-noteCode q-mt-md q-mb-sm">Checklist</div>

          <div class="checklist">
            <div v-for="(item, index) in checklist" :key="index" class="checklist-item row items-center q-gutter-sm">
              <q-input v-model="item.text" dense flat class="checklist-text" :class="{ crossed: item.checked }"
                :readonly="!isEditing" />
              <q-btn :icon="item.checked ? 'close' : 'check'" :color="item.checked ? 'negative' : 'positive'" flat dense
                size="sm" @click="toggleChecklistItem(index)" :disable="!isEditing" />
              <q-btn icon="delete" color="negative" flat dense @click="removeChecklistItem(index)"
                :disable="!isEditing" />
            </div>

            <div class="add-checklist-item row items-center q-gutter-sm">
              <q-input v-model="newChecklistItem" placeholder="Add new checklist item..." dense flat
                class="new-item-input col" style="font-size: 12px;" :readonly="!isEditing" />
              <q-btn icon="add" color="primary" flat dense @click="addChecklistItem" :disable="!isEditing" />
            </div>
          </div>

          <div class="note-content">
            <q-input v-model="contentText" type="textarea" placeholder="Write your notes here..." rows="10" autogrow
              dense flat :readonly="!isEditing" />
          </div>

          <div class="attachments">
            <q-btn label="Add Attachment" flat color="primary" class="q-mt-sm" @click="openAttachment"
              :disable="!isEditing" />

            <ul v-if="attachments.length">
              <li v-for="(attachment, index) in attachments" :key="index" class="attachment-item">
                <q-btn label="Open" icon="open_in_new" flat dense color="primary" size="18px"
                  @click="viewAttachment(attachment)" />
                <span>{{ attachment.name }}</span>
                <q-btn icon="delete" flat dense color="negative" size="18px" @click="removeAttachment(index)"
                  :disable="!isEditing" />
              </li>
            </ul>

            <!-- Hidden File Input -->
            <input :style='{ display: "none" }' ref="fileInputRef" type="file" class="hidden-file-input"
              @change="handleFileChange" />
          </div>


          <!-- Color Picker -->
          <div class="color-picker-wrapper">
            <q-btn round dense flat :style="{ backgroundColor: textColor }" @click="toggleColorPicker" />
            <q-popup-proxy v-model="showColorPicker" cover transition-show="scale" transition-hide="scale">
              <q-color v-model="color" format="rgba" preset-colors :show-alpha="true" flat style="width: 220px;" />
            </q-popup-proxy>
          </div>
          {{ isEditing }}

          <!-- Edit / Save Buttons for view mode -->
          <div v-if="mode === 'view'" class="edit-controls q-mt-md" style="text-align: center;">
            <q-btn v-if="!isEditing" label="Edit Note" color="primary" @click="startEditing" />
            <q-btn v-else label="Save Note" color="positive" @click="saveNote" />
          </div>
          <div v-if="mode === 'create'" class="edit-controls q-mt-md" style="text-align: center;">
            <q-btn label="Save Note" color="positive" @click="saveNote" />
          </div>
          <div class="edit-controls q-mt-md" style="text-align: center;">
            <q-btn label="Delete Note" color="warning" @click="deleteNote" />
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'NoteComponent',
  props: {
    mode: {
      type: String,
      default: 'create', // or 'view'
      validator: (val) => ['create', 'view'].includes(val),
    },
    noteData: {
      // Pass existing note data for 'view' mode
      type: Object,
      default: () => ({
        noteCode: '',
        contentText: '',
        checklist: [],
        attachments: [],
      }),
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    // State\
    console.log(props.noteData, 'asdadasdAAAAAAAAAAAAAA');

    const noteCode = ref(props.noteData.noteCode)
    const content = ref(props.noteData.content)
    const contentText = ref(props.noteData.contentText)


    const checklist = ref(props.noteData.checklist)
    const attachments = ref(props.noteData.attachments)
    const color = ref(props.noteData.color || 'rgba(255,255,255,1)');
    const showColorPicker = ref(false)
    const newChecklistItem = ref('')
    const fileInputRef = ref(null);

    // Editing mode: true if creating new or editing existing
    const isEditing = ref(props.mode === 'create')

    console.log('----------------', color.value);

    const textColor = computed(() => {
      const rgbString = color.value || 'rgb(255, 255, 255)'; // Fallback to white if undefined
      const match = rgbString.match(/\d+/g);

      if (!match || match.length < 3) {
        console.warn('Invalid color value:', rgbString);
        return '#000000'; // Default to black
      }

      const [r, g, b] = match.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    });

    // Watch for prop changes (if needed)
    watch(
      () => props.noteData,
      (newData) => {
        if (props.mode === 'view' && !isEditing.value) {
          noteCode.value = newData.noteCode
          contentText.value = newData.contentText
          checklist.value = newData.checklist
          attachments.value = newData.attachments
          color.value = newData.color
        }
      }
    )

    // Functions
    function addChecklistItem() {
      if (!isEditing.value) return
      if (newChecklistItem.value.trim()) {
        checklist.value.push({ text: newChecklistItem.value.trim(), checked: false })
        newChecklistItem.value = ''
      }
    }

    function toggleChecklistItem(index) {
      if (!isEditing.value) return
      checklist.value[index].checked = !checklist.value[index].checked
    }

    function removeChecklistItem(index) {
      if (!isEditing.value) return
      checklist.value.splice(index, 1)
    }

    function addAttachment() {
      if (!isEditing.value) return
      const attachmentName = prompt('Enter attachment name:')
      if (attachmentName) attachments.value.push(attachmentName)
    }


    function removeAttachment(index) {
      if (!isEditing.value) return
      attachments.value.splice(index, 1)
    }

    function toggleColorPicker() {
      if (!isEditing.value) return
      showColorPicker.value = !showColorPicker.value
    }

    function handleClose() {
      emit('close')
    }

    function startEditing() {
      isEditing.value = true
    }

    function saveNote() {
      console.log('asdasddasdsadsadsa');

      isEditing.value = false
      // Emit the updated note data
      emit('save', {
        noteCode: noteCode.value,
        contentText: contentText.value,
        checklist: checklist.value,
        attachments: attachments.value,
        color: color.value,
      })
    }

    function deleteNote() {
      console.log('DELETE');

      isEditing.value = false
      // Emit the updated note data
      emit('delete', {
        noteCode: noteCode.value,
      })
    }

    function openAttachment() {
      if (!isEditing.value) return;

      // Trigger the hidden file input click
      fileInputRef.value.click();
    }

    function handleFileChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const file = files[0];
        attachments.value.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        });
        console.log('Attachments:', attachments.value);
        event.target.value = ''; // Clear the input to allow the same file to be selected again
      }
    }

    return {
      noteCode,
      content,
      contentText,
      checklist,
      attachments,
      color,
      showColorPicker,
      textColor,
      newChecklistItem,
      isEditing,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
      addAttachment,
      openAttachment,
      removeAttachment,
      toggleColorPicker,
      handleClose,
      startEditing,
      saveNote,
      deleteNote,
      handleFileChange,
      fileInputRef
    }
  },
}
</script>
<style lang="scss">
.full-height {
  height: 100vh;
  width: 100%;
}

.note-card {
  width: 500px;
  min-height: 600px;
  max-width: 95vw;
  max-height: 100%;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  color: var(--text-color);
  /* Use CSS variable */
}

/* Use CSS variable for text color */
.note-noteCode,
.checklist-noteCode,
.checklist-item,
.new-item-input,
.note-content,
.attachment-item,
.q-placeholder {
  color: var(--text-color);
}

/* Position helper for top right corner */
.color-picker-wrapper {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
}

.folded-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background-color: #fdfd96;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  box-shadow: -5px -5px 10px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.note-content {
  position: relative;
  background-color: transparent;
  padding: 7px;
  color: var(--text-color);
  /* text color */
}

.note-content::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(to bottom,
      transparent 0px,
      transparent 27px,
      currentColor 28px);
  opacity: 0.3;
  z-index: 0;
}

.note-content>* {
  position: relative;
  z-index: 1;
  opacity: 1;
  /* ensure full opacity on content */
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.checklist-text {
  flex-grow: 1;
  background-color: transparent;
  font-size: 0.85em;
  padding: 4px;
  border-radius: 4px;
}

.crossed {
  text-decoration: line-through;
  color: #ff0000;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  color: var(--text-color);
}
</style>
