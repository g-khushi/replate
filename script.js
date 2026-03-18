function handleDonate() {
  window.location.href = "donate.html";
}

function handleRequest() {
  window.location.href = "request.html";
}

const hero = document.querySelector('.hero');

const heroImages = [
  "https://leansixsigmaenvironment.org/wp-content/uploads/2019/11/wasted_food.jpg",
  "https://annamrita.org/wp-content/uploads/2023/02/Everything-you-need-to-know-about-the-functions-of-a-food-NGO.jpg",
  "https://previews.123rf.com/images/phanuwatnandee/phanuwatnandee1503/phanuwatnandee150300536/37882750-macro-expiration-date-on-canned-food-isolated-on-white-background.jpg"
];

let currentHero = 0;

if (hero) {
  setInterval(() => {
    currentHero = (currentHero + 1) % heroImages.length;
    hero.style.backgroundImage = `url('${heroImages[currentHero]}')`;
  }, 10000);

  // Set initial image
  hero.style.backgroundImage = `url('${heroImages[currentHero]}')`;
}

// Donation form submission
const donateForm = document.getElementById('donationForm');

if (donateForm) {
  donateForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      contact: document.getElementById('contact').value,
      food: document.getElementById('food').value,
      location: document.getElementById('location').value
    };

    try {
      const res = await fetch('http://localhost:5500/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert('Donation submitted successfully!');
        donateForm.reset();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Failed to connect to server.');
      console.error(err);
    }
  });
}


