document.getElementById('requestForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    contact: this.contact.value,
    foodNeeded: this.foodNeeded.value,
    location: this.location.value,
  };

  try {
    const response = await fetch('http://localhost:5500/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      let message = '✅ Request submitted successfully!';

      if (data.matchedDonation) {
        message += `\n\n🍽 Available Donation Nearby:\n`;
        message += `👤 Donor: ${data.matchedDonation.donor}\n📞 Contact: ${data.matchedDonation.contact}\n🍲 Food: ${data.matchedDonation.food} (${data.matchedDonation.quantity} plates)`;
      } else {
        message += '\n\n❌ No matching donation found nearby.';
      }

      alert(message);
      this.reset();
    } else {
      alert('Error: ' + (data.error || 'Failed to submit request'));
    }
  } catch (error) {
    alert('Failed to submit request. Please try again.');
  }
});
