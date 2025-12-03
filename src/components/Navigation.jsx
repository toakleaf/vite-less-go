import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navigation.less'

const animalCategories = [
  {
    name: 'Dogs',
    emoji: '🐕',
    animals: ['golden-retriever', 'husky', 'poodle', 'bulldog', 'beagle', 'corgi', 'dalmatian', 'chihuahua']
  },
  {
    name: 'Cats',
    emoji: '🐈',
    animals: ['persian', 'siamese', 'maine-coon', 'bengal', 'ragdoll', 'sphynx', 'british-shorthair', 'scottish-fold']
  },
  {
    name: 'Birds',
    emoji: '🦜',
    animals: ['parrot', 'canary', 'cockatiel', 'parakeet', 'macaw', 'finch', 'lovebird', 'dove']
  },
  {
    name: 'Exotic',
    emoji: '🦎',
    animals: ['hamster', 'rabbit', 'guinea-pig', 'ferret', 'turtle', 'iguana', 'hedgehog', 'chinchilla']
  },
  {
    name: 'Aquatic',
    emoji: '🐠',
    animals: ['goldfish', 'betta', 'koi', 'clownfish', 'seahorse', 'jellyfish', 'axolotl', 'hermit-crab']
  }
]

function formatName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PawSpace</span>
        </Link>

        <button
          className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>

          {animalCategories.map((category) => (
            <div
              key={category.name}
              className={`nav-dropdown ${activeDropdown === category.name ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown(category.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link dropdown-trigger">
                <span>{category.emoji}</span>
                <span>{category.name}</span>
                <svg className="dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-emoji">{category.emoji}</span>
                  <span>Popular {category.name}</span>
                </div>
                <div className="dropdown-grid">
                  {category.animals.map((animal) => (
                    <NavLink
                      key={animal}
                      to={`/${animal}`}
                      className="dropdown-item"
                      onClick={() => {
                        setMobileOpen(false)
                        setActiveDropdown(null)
                      }}
                    >
                      {formatName(animal)}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="nav-actions">
          <button className="search-btn" aria-label="Search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="profile-btn">
            <span className="avatar">🐶</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
