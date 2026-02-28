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


        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editNote(item.note);


        const deleteBtn = document.createElement("button");
        deleteBtn.className = "close";
        deleteBtn.textContent = "x";
        deleteBtn.addEventListener("click", async () => {
        //   if (confirm("Are you sure you want to delete this?")) {
        //   await fetch(`/note/${item.id}`, { method: "DELETE" });
        //   fetchData();
        //   }
        // });

          if (confirm("Are you sure you want to delete this?")) {
            try {
              await fetch(`/note/${item.id}`, {
                method: "DELETE",
              });
             
                fetchData(); // Refresh list after deleting
            
            } 
          }
        });

        //  = deleteNote(item.id); // check if this one is needed
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
  });

  // Handle form submission to edit notes


  const editNote = async () => {
    const newText = prompt("Update your text:", currentText);

    if (newText !== null && newText.trim() !== currentText) {
      try {
        const response = await fetch(`/note/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: newText }),
        });

        if (response.ok) {
          fetchData(); // Refresh list after editing
        }
      } catch (error) {
        console.error("Error updating:", error);
      }
    }
  };

  //Handle deleting notes

  // deleteBtn.addEventListener("click", async () => {
  //   await fetch(`/note/${item.id}`, { method: "DELETE"});
  //   fetchData();
  // } );





  // Fetch data on page load
  fetchData();
});
