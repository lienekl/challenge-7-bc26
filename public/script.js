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


        const deleteBtn = document.createElement("button");
        deleteBtn.className = "close";
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => deleteData(item.id); // check if this one is needed
        deleteBtn.addEventListener("click", async (event) => {
          await fetch(`/note/${item.id}`, { method: "DELETE" });
          fetchData();
        });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editData(item.id, item.text); //check if in need to remove item.id. Item ID should not be 
      editBtn.addEventListener("click", async (event) => {

      })


      noteList.appendChild(li);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
    });
    } catch (error) {
  console.error("Error fetching data:", error);
}
  };

// Handle form submission to add new data
inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newData = { text: input.value };

  try {
    const response = await fetch("/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      data.value = ""; // Clear input field
      fetchData(); // Refresh the list
    }
  } catch (error) {
    console.error("Error adding data:", error);
  }
});

// Fetch data on page load
fetchData();
});
