export default {
  filteredNotes: (state) => (searchTerm) => {
    if (!searchTerm) return state.notes
    return state.notes.filter((c) => c.noteCode.toLowerCase().includes(searchTerm.toLowerCase()))
  },
}
