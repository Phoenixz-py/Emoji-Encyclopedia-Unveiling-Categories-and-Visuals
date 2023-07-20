const emojiContainer = document.getElementById('emojiContainer');
const categorySelect = document.getElementById('categorySelect');
let allEmojis = [];

async function fetchEmojiDetails() {
  try {
    const response = await fetch('https://emojihub.yurace.pro/api/all');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching emoji details:', error);
    return [];
  }
}

function createEmojiCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('bg-white', 'shadow-md', 'p-4', 'text-center', 'rounded-lg', 'transform', 'transition-transform', 'hover:scale-105', 'emoji-card');

  const emojiHtml = emoji.htmlCode;
  const name = emoji.name;
  const category = emoji.category;
  const group = emoji.group;

  card.innerHTML = `
    <div>${emojiHtml}</div>
    <p class="text-xl font-semibold">${name}</p>
    <p class="text-gray-600">${category}</p>
    <p class="text-gray-600">${group}</p>
  `;

  return card;
}

async function displayEmojiDetails() {
  const emojis = await fetchEmojiDetails();

  if (emojis.length === 0) {
    emojiContainer.innerHTML = '<p class="text-gray-600 text-center mt-6">No emojis found.</p>';
    return;
  }

  // Group emojis by category and select 10 emojis from each category
  const groupedEmojis = {};
  emojis.forEach((emoji) => {
    if (!groupedEmojis[emoji.category]) {
      groupedEmojis[emoji.category] = [];
    }
    if (groupedEmojis[emoji.category].length < 10) {
      groupedEmojis[emoji.category].push(emoji);
    }
  });

  allEmojis = Object.entries(groupedEmojis).flatMap(([, emojis]) => emojis);

  // Show emojis initially without any filtering
  showEmojis(allEmojis);

  // Populate the category select dropdown
  const allCategories = ['All', ...Object.keys(groupedEmojis)];
  categorySelect.innerHTML = allCategories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join('');

  // Add event listener to the category select dropdown
  categorySelect.addEventListener('change', filterByCategory);
}

function filterByCategory() {
  const selectedCategory = categorySelect.value;
  const emojisToShow = selectedCategory === 'All' ? allEmojis : allEmojis.filter((emoji) => emoji.category === selectedCategory);
  showEmojis(emojisToShow);
}

function showEmojis(emojisToShow) {
  emojiContainer.innerHTML = ''; // Clear the container first

  if (emojisToShow.length === 0) {
    emojiContainer.innerHTML = '<p class="text-gray-600 text-center mt-6">No emojis found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  emojisToShow.forEach((emoji) => {
    const card = createEmojiCard(emoji);
    fragment.appendChild(card);
  });

  emojiContainer.appendChild(fragment);
}

displayEmojiDetails();
