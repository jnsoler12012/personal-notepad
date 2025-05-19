<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="full-height flex flex-center bg-grey-2">
        <q-card class="note-card" :style="{ backgroundColor: noteColor, '--text-color': textColor, color: textColor }">

          <q-btn icon="close" dense flat round size="sm" class="close-btn" @click="handleClose" />

          <div class="folded-corner"></div>

          <q-input :style="{ color: textColor }" v-model="title" placeholder="Note Title" dense flat class="note-title"
            autofocus />

          <div class="checklist-title q-mt-md q-mb-sm">Checklist</div>

          <div class="checklist">
            <div v-for="(item, index) in checklistItems" :key="index"
              class="checklist-item row items-center q-gutter-sm">
              <q-input v-model="item.text" dense flat class="checklist-text" :class="{ crossed: item.checked }" />
              <q-btn :icon="item.checked ? 'close' : 'check'" :color="item.checked ? 'negative' : 'positive'" flat dense
                size="sm" @click="toggleChecklistItem(index)" />
              <q-btn icon="delete" color="negative" flat dense @click="removeChecklistItem(index)" />
            </div>

            <div class="add-checklist-item row items-center q-gutter-sm">
              <q-input v-model="newChecklistItem" placeholder="Add new checklist item..." dense flat
                class="new-item-input col" style="font-size: 12px;" />
              <q-btn icon="add" color="primary" flat dense @click="addChecklistItem" />
            </div>
          </div>

          <div class="note-content">
            <q-input v-model="contentText" type="textarea" placeholder="Write your notes here..." rows="10" autogrow
              dense flat />
          </div>

          <div class="attachments">
            <q-btn label="Add Attachment" flat color="primary" class="q-mt-sm" @click="addAttachment" />
            <ul v-if="attachments.length">
              <li v-for="(attachment, index) in attachments" :key="index" class="attachment-item">
                <q-btn label="Open" icon="open_in_new" flat dense color="primary" size="18px"
                  @click="openAttachment(attachment)" />
                <span>{{ attachment }}</span>
                <q-btn icon="delete" flat dense color="negative" size="18px" @click="removeAttachment(index)" />
              </li>
            </ul>
          </div>

          <!-- Color Picker -->
          <div class="color-picker-wrapper">
            <q-btn round dense flat :style="{ backgroundColor: textColor }" @click="toggleColorPicker" />
            <q-popup-proxy v-model="showColorPicker" cover transition-show="scale" transition-hide="scale">
              <q-color v-model="noteColor" format="rgba" preset-colors :show-alpha="true" flat style="width: 220px;" />
            </q-popup-proxy>
          </div>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script>
import { ref, computed, } from 'vue'

export default {
  name: 'testSecond',
  setup() {
    const title = ref('')
    const contentText = ref('')
    const newChecklistItem = ref('')
    const checklistItems = ref([
      { text: 'Sample task 1', checked: false },
      { text: 'Sample task 2', checked: false },
    ])
    const attachments = ref([])
    const noteColor = ref('rgba(255, 255, 255, 1)');
    const showColorPicker = ref(false);



    // Calculate text color based on background color
    const textColor = computed(() => {
      console.log('computeeded');

      const [r, g, b] = noteColor.value.match(/\d+/g).map(Number)
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      // Return black for light backgrounds and white for dark ones

      console.log('computeeded', luminance > 0.5 ? '#000000' : '#FFFFFF');

      return luminance > 0.5 ? '#000000' : '#FFFFFF'
    })

    console.log(textColor);


    function addChecklistItem() {
      if (newChecklistItem.value.trim()) {
        checklistItems.value.push({ text: newChecklistItem.value.trim(), checked: false })
        newChecklistItem.value = ''
      }
    }

    function toggleChecklistItem(index) {
      checklistItems.value[index].checked = !checklistItems.value[index].checked
    }

    function removeChecklistItem(index) {
      checklistItems.value.splice(index, 1)
    }

    function addAttachment() {
      const attachmentName = prompt('Enter attachment name:')
      if (attachmentName) attachments.value.push(attachmentName)
    }

    function openAttachment(attachment) {
      const url = prompt('Enter the attachment URL for ' + attachment + ':')
      if (url) window.open(url, '_blank')
    }

    function removeAttachment(index) {
      attachments.value.splice(index, 1)
    }

    return {
      title,
      contentText,
      newChecklistItem,
      checklistItems,
      attachments,
      noteColor,
      showColorPicker,
      textColor,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
      addAttachment,
      openAttachment,
      removeAttachment,
    }
  }
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
.note-title,
.checklist-title,
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
