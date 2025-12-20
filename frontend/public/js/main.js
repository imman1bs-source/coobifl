/**
 * Coobifl - Main JavaScript
 * Client-side functionality for the application
 */

// Configuration
const CONFIG = {
  API_BASE_URL: window.location.origin.includes('localhost')
    ? 'http://localhost:5000/api'
    : 'https://coobifl-production.up.railway.app/api'
};

/**
 * Display toast notification
 */
function showToast(message, type = 'info') {
  // Simple alert for now - will implement proper toast in Phase 5
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  console.log(`${icon} ${message}`);
  // TODO: Implement Bootstrap toast
}

/**
 * Show loading spinner
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }
}

/**
 * Format price with currency
 */
function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Generate star rating HTML
 */
function generateStarRating(rating, count = 0) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let html = '<span class="rating-stars">';

  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }

  html += `</span> <span class="text-muted">${rating.toFixed(1)}</span>`;

  if (count > 0) {
    html += ` <span class="text-muted small">(${count})</span>`;
  }

  return html;
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Handle vote action (upvote/downvote)
 */
async function handleVote(productId, voteType) {
  try {
    const response = await axios.post(
      `${CONFIG.API_BASE_URL}/products/${productId}/${voteType}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      showToast(`Successfully ${voteType}d!`, 'success');
      // Update vote counts in UI
      updateVoteCounts(productId, response.data.data);
    }
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to vote';
    showToast(message, 'error');
  }
}

/**
 * Update vote counts in the UI
 */
function updateVoteCounts(productId, data) {
  const upvoteElement = document.querySelector(`[data-product-id="${productId}"] .upvote-count`);
  const downvoteElement = document.querySelector(`[data-product-id="${productId}"] .downvote-count`);

  if (upvoteElement) {
    upvoteElement.textContent = data.upvotes || 0;
  }
  if (downvoteElement) {
    downvoteElement.textContent = data.downvotes || 0;
  }
}

/**
 * Initialize event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Coobifl initialized');

  // Add event listeners for vote buttons when they exist
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      const voteType = btn.dataset.voteType;
      await handleVote(productId, voteType);
    });
  });
});

/**
 * Export functions for use in other scripts
 */
window.ProductHub = {
  showToast,
  showLoading,
  formatPrice,
  generateStarRating,
  handleVote,
  debounce
};
