const API_URL = 'http://localhost:5500/api/reminders';
let deleteMode = false;

document.getElementById('reminderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const food = document.getElementById('food').value.trim();
  const expiryDate = document.getElementById('expiryDate').value;

  if (!food || !expiryDate) {
    alert("Please enter both food name and expiry date.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food, expiryDate })
    });

    await res.json();
    alert(`✅ Reminder for "${food}" (expires on ${formatDate(expiryDate)}) has been saved.`);
    document.getElementById('reminderForm').reset();
    loadReminders();
  } catch (err) {
    alert("Error saving reminder. Is your backend running?");
    console.error(err);
  }
});

async function deleteReminder(id) {
  try {
    console.log("Trying to delete ID:", id);
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    alert(data.message || "Deleted successfully!");
    loadReminders();
  } catch (err) {
    alert("Error deleting reminder.");
    console.error(err);
  }
}

document.getElementById('enableDeleteMode').addEventListener('click', () => {
  deleteMode = true;
  document.getElementById('deleteSelected').style.display = 'inline';
  loadReminders();
});

document.getElementById('deleteSelected').addEventListener('click', async () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  for (const checkbox of checkboxes) {
    await deleteReminder(checkbox.value);
  }
  deleteMode = false;
  document.getElementById('deleteSelected').style.display = 'none';
  loadReminders();
});

async function loadReminders() {
  try {
    const res = await fetch(API_URL);
    const reminders = await res.json();
    const list = document.getElementById('reminderList');
    list.innerHTML = '';

    const today = new Date();

    if (reminders.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No reminders found.';
      list.appendChild(li);
      return;
    }

    reminders.forEach(item => {
      const li = document.createElement('li');
      const expiryDate = new Date(item.expiryDate);
      const expiryDateStr = formatDate(expiryDate);

      li.textContent = `${item.food} - Expires on ${expiryDateStr}`;

      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        alert(`⚠️ Reminder: ${item.food} expires today!`);
      } else if (diffDays === 1) {
        alert(`⚠️ Reminder: ${item.food} expires tomorrow!`);
      }

      if (expiryDate < today) {
        li.classList.add('expired');
      }

      if (deleteMode) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item._id;
        checkbox.style.marginLeft = '10px';
        li.appendChild(checkbox);
      }

      list.appendChild(li);
    });
  } catch (err) {
    alert("Error loading reminders.");
    console.error(err);
  }
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

window.onload = loadReminders;
