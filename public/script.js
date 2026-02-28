document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("note-list");
  const inputForm = document.getElementById("input-form");
  const input = document.getElementById("input");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/note");
      const note = await response.json();
      noteList.innerHTML = ""; // Clear the list before rendering
      note.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `{item.text}`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editData(item.id, item.text); //check if in need to remove item.id. Item ID should not be 
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "close";
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => deleteData(item.id); // check if this one is needed
        

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
    const newNote = { text: input.value };

    try {
      const response = await fetch("/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        data.value = "";
        fetchData(); 
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  });

  // Handle form submission to edit notes
 const editNote = async (id, currentText) => {
    const newText = prompt("Update your text:", currentText);
    
    if (newText !== null && newText !== currentText) {
      try {
        const response = await fetch(`/note/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newText }),
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
  const deletedItem = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        const response = await fetch(`/note/${item.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchData(); // Refresh list after deleting
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };


  // Fetch data on page load
  fetchData();
});
