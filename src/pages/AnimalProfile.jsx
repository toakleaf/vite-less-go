import { useParams, Link } from 'react-router-dom'

const animalData = {
  // Dogs
  'golden-retriever': { name: 'Golden Retriever', emoji: '🦮', category: 'Dogs', personality: 'Friendly, Reliable, Trustworthy', lifespan: '10-12 years', origin: 'Scotland', size: 'Large', activity: 'High', grooming: 'Moderate', traits: ['Loyal', 'Smart', 'Playful', 'Patient'] },
  'husky': { name: 'Siberian Husky', emoji: '🐺', category: 'Dogs', personality: 'Outgoing, Mischievous, Loyal', lifespan: '12-14 years', origin: 'Siberia', size: 'Medium', activity: 'Very High', grooming: 'High', traits: ['Energetic', 'Friendly', 'Independent', 'Vocal'] },
  'poodle': { name: 'Poodle', emoji: '🐩', category: 'Dogs', personality: 'Proud, Active, Very Smart', lifespan: '12-15 years', origin: 'Germany/France', size: 'Various', activity: 'High', grooming: 'High', traits: ['Elegant', 'Athletic', 'Alert', 'Trainable'] },
  'bulldog': { name: 'English Bulldog', emoji: '🐕', category: 'Dogs', personality: 'Calm, Courageous, Friendly', lifespan: '8-10 years', origin: 'England', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Gentle', 'Determined', 'Affectionate', 'Stubborn'] },
  'beagle': { name: 'Beagle', emoji: '🐕‍🦺', category: 'Dogs', personality: 'Curious, Friendly, Merry', lifespan: '12-15 years', origin: 'England', size: 'Small-Medium', activity: 'High', grooming: 'Low', traits: ['Curious', 'Happy', 'Social', 'Vocal'] },
  'corgi': { name: 'Welsh Corgi', emoji: '🐕', category: 'Dogs', personality: 'Playful, Bold, Smart', lifespan: '12-15 years', origin: 'Wales', size: 'Small', activity: 'High', grooming: 'Moderate', traits: ['Adorable', 'Herding', 'Loyal', 'Sassy'] },
  'dalmatian': { name: 'Dalmatian', emoji: '🐕', category: 'Dogs', personality: 'Dignified, Smart, Outgoing', lifespan: '11-13 years', origin: 'Croatia', size: 'Large', activity: 'Very High', grooming: 'Low', traits: ['Spotted', 'Athletic', 'Playful', 'Watchful'] },
  'chihuahua': { name: 'Chihuahua', emoji: '🐕', category: 'Dogs', personality: 'Charming, Sassy, Graceful', lifespan: '14-16 years', origin: 'Mexico', size: 'Toy', activity: 'Moderate', grooming: 'Low', traits: ['Tiny', 'Bold', 'Devoted', 'Alert'] },

  // Cats
  'persian': { name: 'Persian Cat', emoji: '🐱', category: 'Cats', personality: 'Gentle, Quiet, Dignified', lifespan: '12-17 years', origin: 'Persia', size: 'Medium', activity: 'Low', grooming: 'Very High', traits: ['Fluffy', 'Calm', 'Sweet', 'Elegant'] },
  'siamese': { name: 'Siamese Cat', emoji: '🐱', category: 'Cats', personality: 'Social, Intelligent, Vocal', lifespan: '15-20 years', origin: 'Thailand', size: 'Medium', activity: 'High', grooming: 'Low', traits: ['Talkative', 'Affectionate', 'Playful', 'Curious'] },
  'maine-coon': { name: 'Maine Coon', emoji: '🐱', category: 'Cats', personality: 'Gentle Giant, Friendly', lifespan: '12-15 years', origin: 'Maine, USA', size: 'Very Large', activity: 'Moderate', grooming: 'High', traits: ['Majestic', 'Dog-like', 'Gentle', 'Intelligent'] },
  'bengal': { name: 'Bengal Cat', emoji: '🐆', category: 'Cats', personality: 'Wild, Athletic, Playful', lifespan: '12-16 years', origin: 'USA', size: 'Medium-Large', activity: 'Very High', grooming: 'Low', traits: ['Exotic', 'Active', 'Confident', 'Curious'] },
  'ragdoll': { name: 'Ragdoll Cat', emoji: '🐱', category: 'Cats', personality: 'Docile, Calm, Affectionate', lifespan: '12-17 years', origin: 'California, USA', size: 'Large', activity: 'Low', grooming: 'High', traits: ['Floppy', 'Sweet', 'Puppy-like', 'Trusting'] },
  'sphynx': { name: 'Sphynx Cat', emoji: '🐱', category: 'Cats', personality: 'Energetic, Silly, Loving', lifespan: '8-14 years', origin: 'Canada', size: 'Medium', activity: 'High', grooming: 'Special', traits: ['Hairless', 'Warm', 'Entertaining', 'Social'] },
  'british-shorthair': { name: 'British Shorthair', emoji: '🐱', category: 'Cats', personality: 'Easy-going, Calm, Loyal', lifespan: '12-17 years', origin: 'Britain', size: 'Medium-Large', activity: 'Low', grooming: 'Moderate', traits: ['Chunky', 'Dignified', 'Independent', 'Quiet'] },
  'scottish-fold': { name: 'Scottish Fold', emoji: '🐱', category: 'Cats', personality: 'Sweet, Quiet, Adaptable', lifespan: '11-14 years', origin: 'Scotland', size: 'Medium', activity: 'Moderate', grooming: 'Moderate', traits: ['Folded Ears', 'Owl-like', 'Loving', 'Playful'] },

  // Birds
  'parrot': { name: 'African Grey Parrot', emoji: '🦜', category: 'Birds', personality: 'Intelligent, Social, Talkative', lifespan: '40-60 years', origin: 'Central Africa', size: 'Medium', activity: 'High', grooming: 'Moderate', traits: ['Genius', 'Mimicking', 'Bonding', 'Complex'] },
  'canary': { name: 'Canary', emoji: '🐦', category: 'Birds', personality: 'Cheerful, Independent, Musical', lifespan: '10-15 years', origin: 'Canary Islands', size: 'Small', activity: 'Moderate', grooming: 'Low', traits: ['Singing', 'Colorful', 'Hardy', 'Peaceful'] },
  'cockatiel': { name: 'Cockatiel', emoji: '🦜', category: 'Birds', personality: 'Gentle, Affectionate, Whistling', lifespan: '15-25 years', origin: 'Australia', size: 'Small-Medium', activity: 'Moderate', grooming: 'Moderate', traits: ['Crested', 'Friendly', 'Vocal', 'Cuddly'] },
  'parakeet': { name: 'Budgerigar', emoji: '🦜', category: 'Birds', personality: 'Playful, Curious, Social', lifespan: '5-10 years', origin: 'Australia', size: 'Small', activity: 'High', grooming: 'Low', traits: ['Colorful', 'Chatty', 'Acrobatic', 'Entertaining'] },
  'macaw': { name: 'Scarlet Macaw', emoji: '🦜', category: 'Birds', personality: 'Vibrant, Loud, Intelligent', lifespan: '40-50 years', origin: 'Central/South America', size: 'Large', activity: 'High', grooming: 'High', traits: ['Stunning', 'Powerful', 'Bonding', 'Demanding'] },
  'finch': { name: 'Zebra Finch', emoji: '🐦', category: 'Birds', personality: 'Active, Social, Hardy', lifespan: '5-7 years', origin: 'Australia', size: 'Tiny', activity: 'High', grooming: 'Low', traits: ['Chirpy', 'Flocking', 'Easy-care', 'Entertaining'] },
  'lovebird': { name: 'Lovebird', emoji: '🦜', category: 'Birds', personality: 'Affectionate, Feisty, Playful', lifespan: '10-15 years', origin: 'Africa', size: 'Small', activity: 'High', grooming: 'Low', traits: ['Bonding', 'Colorful', 'Spunky', 'Cuddly'] },
  'dove': { name: 'Ring-necked Dove', emoji: '🕊️', category: 'Birds', personality: 'Peaceful, Gentle, Calm', lifespan: '12-20 years', origin: 'Africa', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Serene', 'Cooing', 'Docile', 'Beautiful'] },

  // Exotic
  'hamster': { name: 'Syrian Hamster', emoji: '🐹', category: 'Exotic', personality: 'Curious, Active, Nocturnal', lifespan: '2-3 years', origin: 'Syria', size: 'Tiny', activity: 'High', grooming: 'Low', traits: ['Pouchy', 'Solitary', 'Burrowing', 'Adorable'] },
  'rabbit': { name: 'Holland Lop Rabbit', emoji: '🐰', category: 'Exotic', personality: 'Friendly, Calm, Sweet', lifespan: '7-14 years', origin: 'Netherlands', size: 'Small', activity: 'Moderate', grooming: 'Moderate', traits: ['Floppy Ears', 'Cuddly', 'Social', 'Playful'] },
  'guinea-pig': { name: 'Guinea Pig', emoji: '🐹', category: 'Exotic', personality: 'Social, Vocal, Gentle', lifespan: '4-8 years', origin: 'South America', size: 'Small', activity: 'Moderate', grooming: 'Moderate', traits: ['Squeaky', 'Popcorning', 'Herd Animals', 'Sweet'] },
  'ferret': { name: 'Ferret', emoji: '🦡', category: 'Exotic', personality: 'Playful, Curious, Mischievous', lifespan: '6-10 years', origin: 'Europe', size: 'Small', activity: 'Very High', grooming: 'Moderate', traits: ['Sneaky', 'Entertaining', 'Flexible', 'Bonding'] },
  'turtle': { name: 'Red-eared Slider', emoji: '🐢', category: 'Exotic', personality: 'Calm, Independent, Hardy', lifespan: '20-40 years', origin: 'USA', size: 'Medium', activity: 'Low', grooming: 'Moderate', traits: ['Ancient', 'Patient', 'Aquatic', 'Long-lived'] },
  'iguana': { name: 'Green Iguana', emoji: '🦎', category: 'Exotic', personality: 'Calm, Territorial, Intelligent', lifespan: '15-20 years', origin: 'Central/South America', size: 'Large', activity: 'Low', grooming: 'Moderate', traits: ['Prehistoric', 'Basking', 'Herbivore', 'Majestic'] },
  'hedgehog': { name: 'African Pygmy Hedgehog', emoji: '🦔', category: 'Exotic', personality: 'Shy, Curious, Nocturnal', lifespan: '4-6 years', origin: 'Africa', size: 'Tiny', activity: 'Moderate', grooming: 'Low', traits: ['Spiky', 'Ball Rolling', 'Unique', 'Adorable'] },
  'chinchilla': { name: 'Chinchilla', emoji: '🐭', category: 'Exotic', personality: 'Soft, Active, Shy', lifespan: '10-20 years', origin: 'South America', size: 'Small', activity: 'High', grooming: 'Special', traits: ['Softest Fur', 'Bouncy', 'Dust Bathing', 'Cute'] },

  // Aquatic
  'goldfish': { name: 'Fancy Goldfish', emoji: '🐠', category: 'Aquatic', personality: 'Peaceful, Social, Hardy', lifespan: '10-15 years', origin: 'China', size: 'Small-Medium', activity: 'Moderate', grooming: 'Moderate', traits: ['Golden', 'Swimming', 'Fancy Tails', 'Classic'] },
  'betta': { name: 'Betta Fish', emoji: '🐟', category: 'Aquatic', personality: 'Territorial, Beautiful, Fierce', lifespan: '3-5 years', origin: 'Southeast Asia', size: 'Small', activity: 'Low', grooming: 'Low', traits: ['Flowing Fins', 'Colorful', 'Solitary', 'Elegant'] },
  'koi': { name: 'Koi Carp', emoji: '🐟', category: 'Aquatic', personality: 'Graceful, Social, Long-lived', lifespan: '25-35 years', origin: 'Japan', size: 'Large', activity: 'Moderate', grooming: 'Moderate', traits: ['Ornamental', 'Pond Life', 'Patterned', 'Zen'] },
  'clownfish': { name: 'Clownfish', emoji: '🐠', category: 'Aquatic', personality: 'Bold, Territorial, Symbiotic', lifespan: '6-10 years', origin: 'Indo-Pacific', size: 'Small', activity: 'Moderate', grooming: 'Moderate', traits: ['Nemo', 'Orange', 'Anemone', 'Hardy'] },
  'seahorse': { name: 'Seahorse', emoji: '🦑', category: 'Aquatic', personality: 'Gentle, Unique, Delicate', lifespan: '1-5 years', origin: 'Worldwide', size: 'Tiny', activity: 'Low', grooming: 'High', traits: ['Magical', 'Upright', 'Monogamous', 'Mesmerizing'] },
  'jellyfish': { name: 'Moon Jellyfish', emoji: '🪼', category: 'Aquatic', personality: 'Serene, Hypnotic, Simple', lifespan: '1 year', origin: 'Worldwide', size: 'Small-Medium', activity: 'Low', grooming: 'Special', traits: ['Translucent', 'Drifting', 'Glowing', 'Ethereal'] },
  'axolotl': { name: 'Axolotl', emoji: '🦎', category: 'Aquatic', personality: 'Friendly, Unique, Hardy', lifespan: '10-15 years', origin: 'Mexico', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Smiling', 'Regenerating', 'Gilled', 'Adorable'] },
  'hermit-crab': { name: 'Hermit Crab', emoji: '🦀', category: 'Aquatic', personality: 'Social, Curious, Shell-swapping', lifespan: '10-15 years', origin: 'Worldwide', size: 'Small', activity: 'Moderate', grooming: 'Low', traits: ['Shell Home', 'Climbing', 'Social', 'Quirky'] },
}

export default function AnimalProfile({ lessFile }) {
  const { slug } = useParams()
  const animal = animalData[slug]

  if (!animal) {
    return (
      <div className="not-found">
        <h1>Pet Not Found</h1>
        <p>We couldn't find this pet profile.</p>
        <Link to="/">Go Home</Link>
      </div>
    )
  }

  return (
    <div className={`animal-profile animal-${slug}`}>
      <header className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <span className="avatar-emoji">{animal.emoji}</span>
          </div>
          <div className="online-status"></div>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-info">
          <h1 className="profile-name">{animal.name}</h1>
          <p className="profile-category">{animal.category}</p>
          <p className="profile-personality">{animal.personality}</p>

          <div className="profile-actions">
            <button className="btn-follow">Follow</button>
            <button className="btn-message">Message</button>
            <button className="btn-share">Share</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">12.4K</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">892</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">2.1K</span>
            <span className="stat-label">Posts</span>
          </div>
        </div>

        <div className="profile-details">
          <h2 className="section-title">About Me</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-content">
                <span className="detail-label">Origin</span>
                <span className="detail-value">{animal.origin}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <div className="detail-content">
                <span className="detail-label">Lifespan</span>
                <span className="detail-value">{animal.lifespan}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📏</span>
              <div className="detail-content">
                <span className="detail-label">Size</span>
                <span className="detail-value">{animal.size}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⚡</span>
              <div className="detail-content">
                <span className="detail-label">Activity</span>
                <span className="detail-value">{animal.activity}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">✨</span>
              <div className="detail-content">
                <span className="detail-label">Grooming</span>
                <span className="detail-value">{animal.grooming}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-traits">
          <h2 className="section-title">Personality Traits</h2>
          <div className="traits-list">
            {animal.traits.map((trait, index) => (
              <span key={trait} className="trait-badge" style={{ '--delay': index }}>
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-gallery">
          <h2 className="section-title">Photo Gallery</h2>
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="gallery-item">
                <div className="gallery-placeholder">{animal.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-posts">
          <h2 className="section-title">Recent Posts</h2>
          <div className="posts-list">
            {[
              { title: 'Just had the best day at the park! 🌳', likes: 234, comments: 45 },
              { title: 'My human gave me extra treats today 🎉', likes: 567, comments: 89 },
              { title: 'New favorite spot found! So cozy ☀️', likes: 123, comments: 23 },
            ].map((post, index) => (
              <div key={index} className="post-card">
                <div className="post-avatar">{animal.emoji}</div>
                <div className="post-content">
                  <p className="post-text">{post.title}</p>
                  <div className="post-meta">
                    <span className="post-likes">❤️ {post.likes}</span>
                    <span className="post-comments">💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-friends">
          <h2 className="section-title">Friends</h2>
          <div className="friends-grid">
            {Object.entries(animalData)
              .filter(([key]) => key !== slug)
              .slice(0, 6)
              .map(([key, friend]) => (
                <Link key={key} to={`/${key}`} className="friend-card">
                  <span className="friend-avatar">{friend.emoji}</span>
                  <span className="friend-name">{friend.name.split(' ')[0]}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
