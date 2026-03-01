document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("note-list");
  const inputForm = document.getElementById("input-form");
  const input = document.getElementById("input");


  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/note");
      const notes = await response.json();
      noteList.innerHTML = ""; // Clear the list before rendering
      notes.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.note} `;

        //EDIT button
        const editBtn = document.createElement("button");
        editBtn.idName = "edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", async () => {
          const currentText = item.value;
          const newText = prompt("Update your text:", currentText);

          if (newText !== null && newText.trim() !== "" && newText.trim() !== currentText) {
            try {
              const response = await fetch(`/note/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: newText }),
              });

              if (response.ok) {
                fetchData(); 
              }
            } catch (error) {
              console.error("Error updating:", error);
            }
          }
        });

        // DELETE button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "x";
        deleteBtn.onclick = () => deleteNote(item.id);
        const deleteNote = async () => {
          if (confirm("Do you want to DELETE the note?")) {
            try {
              const response = await fetch(`/note/${item.id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                fetchData(); // 
              }
            } catch (error) {
              console.error("Error deleting:", error);
            }
          }
        };


        noteList.appendChild(li);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
      });
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  // Handle form submission to add new note
  inputForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newNote = { note: input.value };
 if (input.value.trim() !== "") {
    try {
      const response = await fetch("/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        input.value = "";
        fetchData();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  } else {alert("Add your note!")};
  });

  // Fetch data on page load
  fetchData();
});
