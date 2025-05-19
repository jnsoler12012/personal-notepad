import { api } from 'src/boot/axios'

export default {
  async getAllNotes(props) {
    console.log('getAllNotes', props)

    return await api
      .get(
        props?.textSearch ? `search?term=${props?.textSearch}&limit=100` : `search?limit=100`,
        {},
      )
      .then((response) => {
        console.log(response)

        return (this.notes = !response.data.data ? [] : response.data.data)
      })
      .catch((error) => {
        if (error) {
          console.error('Login failed:', error)
          return `${error.code} - ${error.message}`
        }
      })
  },
  getAllCurrentNotes() {
    console.log('GET ALL NOTES')

    return this.notes
  },
  editNote(state) {
    return (this.currentNote = state)
  },
  async getByNoteCode(props) {
    console.log('before 22')
    const { noteCode } = props

    return await api
      .get(`${noteCode}`, {})
      .then((response) => {
        console.log(response)
        return (this.currentNote = !response.data ? [] : response.data)
      })
      .catch((error) => {
        if (error) {
          console.error('No note', error)
          return {
            badStatus: true,
            text: `${error.code} - ${error.message}`,
          }
        }
      })
  },
  getCurrentNote() {
    console.log('GET CURRENT NOTE')

    return this.currentNote
  },
  deleteCurrentNote() {
    return (this.currentNote = null)
  },
  async saveByNoteCode(props) {
    console.log('saveByNoteCode', props)
    const { noteCode, contentText, color, checklist, attachments, content } = props

    console.log(checklist, attachments)

    return await api
      .patch(`/${noteCode}`, {
        content: content,
        checklist: checklist,
        attachments: attachments,
        color: color,
        noteCode: noteCode,
        contentText: contentText,
      })
      .then((response) => {
        console.log(response)
        return (this.currentNote = !response.data ? [] : response.data)
      })
      .catch((error) => {
        if (error) {
          return {
            badStatus: false,
            text: `${error.code} - ${error.message}`,
          }
        }
      })
  },
  async deleteByNoteCode(props) {
    console.log('deleteByNoteCode', props)
    const { noteCode } = props

    return await api
      .delete(`/${noteCode}`, {})
      .then((response) => {
        console.log(response)
        window.location.reload()
      })
      .catch((error) => {
        if (error) {
          console.error('Login failed:', error)
          return `${error.code} - ${error.message}`
        }
      })
  },
  async saveNewNote(props) {
    console.log('saveNewNote', props)
    const { noteCode, contentText, color, checklist, attachments, content } = props

    console.log(checklist, attachments)

    return await api
      .post(`/`, {
        content: content,
        checklist: checklist,
        attachments: attachments,
        color: color,
        noteCode: noteCode,
        contentText: contentText,
      })
      .then((response) => {
        console.log(response)
        return (this.currentNote = !response.data ? [] : response.data)
      })
      .catch((error) => {
        if (error) {
          console.error('Error creating', error)
          return {
            badStatus: false,
            text: `${error.code} - ${error.message}`,
          }
        }
      })
  },
}
