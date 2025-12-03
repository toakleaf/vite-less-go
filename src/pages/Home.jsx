import { Link } from 'react-router-dom'
import './Home.less'

const featuredPets = [
  { name: 'Golden Retriever', slug: 'golden-retriever', emoji: '🦮', description: 'The ultimate family companion' },
  { name: 'Persian Cat', slug: 'persian', emoji: '🐱', description: 'Elegant and fluffy royalty' },
  { name: 'Parrot', slug: 'parrot', emoji: '🦜', description: 'Colorful and chatty friend' },
  { name: 'Hamster', slug: 'hamster', emoji: '🐹', description: 'Tiny bundle of energy' },
  { name: 'Goldfish', slug: 'goldfish', emoji: '🐠', description: 'Serene aquatic beauty' },
  { name: 'Husky', slug: 'husky', emoji: '🐺', description: 'Majestic arctic adventurer' },
]

const categories = [
  { name: 'Dogs', emoji: '🐕', count: 8, color: '#e67e22' },
  { name: 'Cats', emoji: '🐈', count: 8, color: '#9b59b6' },
  { name: 'Birds', emoji: '🦜', count: 8, color: '#27ae60' },
  { name: 'Exotic', emoji: '🦎', count: 8, color: '#e74c3c' },
  { name: 'Aquatic', emoji: '🐠', count: 8, color: '#3498db' },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Welcome to</span>
            <span className="title-highlight">PawSpace</span>
          </h1>
          <p className="hero-subtitle">
            The social network where every pet is a star. Connect, share, and celebrate
            the furry, feathery, and scaly friends that make our lives complete.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Explore Pets</button>
            <button className="btn-secondary">Create Profile</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">40+</span>
              <span className="stat-label">Pet Profiles</span>
            </div>
            <div className="stat">
              <span className="stat-number">5</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Cuteness</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-pets">
            <span className="pet pet-1">🐕</span>
            <span className="pet pet-2">🐈</span>
            <span className="pet pet-3">🦜</span>
            <span className="pet pet-4">🐹</span>
            <span className="pet pet-5">🐠</span>
            <span className="pet pet-6">🐰</span>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="category-card" style={{ '--cat-color': cat.color }}>
              <span className="category-emoji">{cat.emoji}</span>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-count">{cat.count} profiles</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Pets</h2>
        <p className="section-subtitle">Meet some of our most popular furry friends</p>
        <div className="featured-grid">
          {featuredPets.map((pet) => (
            <Link key={pet.slug} to={`/${pet.slug}`} className="pet-card">
              <div className="pet-avatar">{pet.emoji}</div>
              <h3 className="pet-name">{pet.name}</h3>
              <p className="pet-description">{pet.description}</p>
              <span className="pet-link">View Profile →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to join the pack?</h2>
          <p className="cta-text">Create a profile for your pet today and connect with pet lovers worldwide.</p>
          <button className="btn-cta">Get Started</button>
        </div>
        <div className="cta-decoration">
          <span className="paw">🐾</span>
          <span className="paw">🐾</span>
          <span className="paw">🐾</span>
        </div>
      </section>
    </div>
  )
}
