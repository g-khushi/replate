document.getElementById('donationForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent page reload

  const formData = {
    name: this.name.value,
    contact: this.contact.value,
    food: this.food.value,
    quantity: this.quantity.value,
    location: this.location.value,
  };

  try {
    const response = await fetch('http://localhost:5500/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Show result section with receiver name
      document.getElementById("donationResult").style.display = "block";
     

      alert('Donation submitted successfully!');
      this.reset();
    } else {
      alert('Error: ' + (data.error || 'Failed to submit donation'));
    }
  } catch (error) {
    alert('Failed to submit donation. Please try again.');
    console.error(error);
  }
});
