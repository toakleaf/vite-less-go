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

  // More Dogs
  'german-shepherd': { name: 'German Shepherd', emoji: '🐕‍🦺', category: 'More Dogs', personality: 'Loyal, Confident, Courageous', lifespan: '9-13 years', origin: 'Germany', size: 'Large', activity: 'Very High', grooming: 'High', traits: ['Protective', 'Intelligent', 'Versatile', 'Noble'] },
  'labrador': { name: 'Labrador Retriever', emoji: '🦮', category: 'More Dogs', personality: 'Friendly, Active, Outgoing', lifespan: '10-14 years', origin: 'Canada', size: 'Large', activity: 'High', grooming: 'Moderate', traits: ['Friendly', 'Loyal', 'Playful', 'Patient'] },
  'rottweiler': { name: 'Rottweiler', emoji: '🐕', category: 'More Dogs', personality: 'Loyal, Loving, Guardian', lifespan: '8-10 years', origin: 'Germany', size: 'Large', activity: 'Moderate', grooming: 'Low', traits: ['Powerful', 'Protective', 'Devoted', 'Confident'] },
  'boxer': { name: 'Boxer', emoji: '🐕', category: 'More Dogs', personality: 'Fun-loving, Bright, Active', lifespan: '10-12 years', origin: 'Germany', size: 'Medium-Large', activity: 'Very High', grooming: 'Low', traits: ['Playful', 'Energetic', 'Patient', 'Fearless'] },
  'doberman': { name: 'Doberman Pinscher', emoji: '🐕', category: 'More Dogs', personality: 'Loyal, Alert, Fearless', lifespan: '10-13 years', origin: 'Germany', size: 'Large', activity: 'High', grooming: 'Low', traits: ['Elegant', 'Athletic', 'Intelligent', 'Watchful'] },
  'shiba-inu': { name: 'Shiba Inu', emoji: '🐕', category: 'More Dogs', personality: 'Alert, Active, Attentive', lifespan: '12-15 years', origin: 'Japan', size: 'Small', activity: 'Moderate', grooming: 'Moderate', traits: ['Independent', 'Bold', 'Good-natured', 'Spirited'] },
  'akita': { name: 'Akita Inu', emoji: '🐕', category: 'More Dogs', personality: 'Dignified, Courageous, Loyal', lifespan: '10-14 years', origin: 'Japan', size: 'Large', activity: 'Moderate', grooming: 'High', traits: ['Noble', 'Faithful', 'Quiet', 'Protective'] },
  'border-collie': { name: 'Border Collie', emoji: '🐕', category: 'More Dogs', personality: 'Smart, Energetic, Athletic', lifespan: '12-15 years', origin: 'Scotland', size: 'Medium', activity: 'Very High', grooming: 'Moderate', traits: ['Brilliant', 'Workaholic', 'Agile', 'Responsive'] },

  // More Cats
  'abyssinian': { name: 'Abyssinian Cat', emoji: '🐱', category: 'More Cats', personality: 'Active, Curious, Playful', lifespan: '12-15 years', origin: 'Ethiopia', size: 'Medium', activity: 'Very High', grooming: 'Low', traits: ['Athletic', 'Social', 'Intelligent', 'Regal'] },
  'burmese': { name: 'Burmese Cat', emoji: '🐱', category: 'More Cats', personality: 'Affectionate, Social, Playful', lifespan: '10-17 years', origin: 'Myanmar', size: 'Medium', activity: 'Moderate', grooming: 'Low', traits: ['Sweet', 'Dog-like', 'Vocal', 'Silky'] },
  'russian-blue': { name: 'Russian Blue', emoji: '🐱', category: 'More Cats', personality: 'Gentle, Quiet, Reserved', lifespan: '15-20 years', origin: 'Russia', size: 'Medium', activity: 'Moderate', grooming: 'Low', traits: ['Elegant', 'Shy', 'Loyal', 'Silvery'] },
  'norwegian-forest': { name: 'Norwegian Forest Cat', emoji: '🐱', category: 'More Cats', personality: 'Friendly, Interactive, Independent', lifespan: '14-16 years', origin: 'Norway', size: 'Large', activity: 'Moderate', grooming: 'High', traits: ['Majestic', 'Hardy', 'Climbing', 'Fluffy'] },
  'chartreux': { name: 'Chartreux', emoji: '🐱', category: 'More Cats', personality: 'Gentle, Quiet, Observant', lifespan: '12-15 years', origin: 'France', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Smiling', 'Woolly', 'Sweet', 'Patient'] },
  'somali': { name: 'Somali Cat', emoji: '🐱', category: 'More Cats', personality: 'Active, Social, Playful', lifespan: '11-16 years', origin: 'USA', size: 'Medium', activity: 'Very High', grooming: 'Moderate', traits: ['Fox-like', 'Bushy', 'Curious', 'Mischievous'] },
  'oriental': { name: 'Oriental Shorthair', emoji: '🐱', category: 'More Cats', personality: 'Social, Intelligent, Vocal', lifespan: '12-15 years', origin: 'Thailand', size: 'Medium', activity: 'High', grooming: 'Low', traits: ['Sleek', 'Dramatic', 'Loyal', 'Talkative'] },
  'savannah': { name: 'Savannah Cat', emoji: '🐱', category: 'More Cats', personality: 'Adventurous, Loyal, Active', lifespan: '12-20 years', origin: 'USA', size: 'Large', activity: 'Very High', grooming: 'Low', traits: ['Wild', 'Spotted', 'Athletic', 'Dog-like'] },

  // More Birds
  'peacock': { name: 'Indian Peacock', emoji: '🦚', category: 'More Birds', personality: 'Proud, Showy, Social', lifespan: '10-25 years', origin: 'India', size: 'Large', activity: 'Moderate', grooming: 'Moderate', traits: ['Majestic', 'Colorful', 'Vocal', 'Display'] },
  'flamingo': { name: 'Greater Flamingo', emoji: '🦩', category: 'More Birds', personality: 'Social, Graceful, Elegant', lifespan: '20-30 years', origin: 'Africa', size: 'Large', activity: 'Moderate', grooming: 'Low', traits: ['Pink', 'Long-legged', 'Flocking', 'Tropical'] },
  'owl': { name: 'Great Horned Owl', emoji: '🦉', category: 'More Birds', personality: 'Wise, Silent, Nocturnal', lifespan: '10-30 years', origin: 'Americas', size: 'Large', activity: 'Nocturnal', grooming: 'Low', traits: ['Mysterious', 'Keen-eyed', 'Patient', 'Fierce'] },
  'toucan': { name: 'Toco Toucan', emoji: '🐦', category: 'More Birds', personality: 'Playful, Social, Curious', lifespan: '15-20 years', origin: 'South America', size: 'Medium', activity: 'Moderate', grooming: 'Low', traits: ['Colorful', 'Frugivore', 'Intelligent', 'Acrobatic'] },
  'hummingbird': { name: 'Ruby-throated Hummingbird', emoji: '🐦', category: 'More Birds', personality: 'Energetic, Territorial, Fearless', lifespan: '3-5 years', origin: 'North America', size: 'Tiny', activity: 'Very High', grooming: 'Low', traits: ['Iridescent', 'Hovering', 'Nectar', 'Swift'] },
  'penguin': { name: 'Emperor Penguin', emoji: '🐧', category: 'More Birds', personality: 'Social, Hardy, Devoted', lifespan: '15-20 years', origin: 'Antarctica', size: 'Large', activity: 'Moderate', grooming: 'Low', traits: ['Tuxedo', 'Swimming', 'Huddling', 'Loyal'] },
  'pelican': { name: 'Great White Pelican', emoji: '🦅', category: 'More Birds', personality: 'Patient, Social, Adaptable', lifespan: '25-30 years', origin: 'Africa/Europe', size: 'Very Large', activity: 'Moderate', grooming: 'Low', traits: ['Pouchy', 'Fishing', 'Soaring', 'Colonial'] },
  'crane': { name: 'Red-crowned Crane', emoji: '🦢', category: 'More Birds', personality: 'Graceful, Elegant, Sacred', lifespan: '25-40 years', origin: 'East Asia', size: 'Large', activity: 'Moderate', grooming: 'Low', traits: ['Dancing', 'Symbolic', 'Majestic', 'Faithful'] },

  // More Exotic
  'sugar-glider': { name: 'Sugar Glider', emoji: '🐿️', category: 'More Exotic', personality: 'Social, Curious, Nocturnal', lifespan: '12-15 years', origin: 'Australia', size: 'Tiny', activity: 'High', grooming: 'Low', traits: ['Gliding', 'Bonding', 'Sweet-tooth', 'Adorable'] },
  'gecko': { name: 'Leopard Gecko', emoji: '🦎', category: 'More Exotic', personality: 'Docile, Curious, Hardy', lifespan: '15-20 years', origin: 'Middle East', size: 'Small', activity: 'Moderate', grooming: 'Low', traits: ['Spotted', 'Smiling', 'Climbing', 'Colorful'] },
  'chameleon': { name: 'Veiled Chameleon', emoji: '🦎', category: 'More Exotic', personality: 'Calm, Solitary, Fascinating', lifespan: '5-8 years', origin: 'Yemen', size: 'Medium', activity: 'Low', grooming: 'Moderate', traits: ['Color-changing', 'Eyes', 'Unique', 'Arboreal'] },
  'tarantula': { name: 'Mexican Red Knee', emoji: '🕷️', category: 'More Exotic', personality: 'Calm, Docile, Fascinating', lifespan: '20-30 years', origin: 'Mexico', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Fuzzy', 'Patient', 'Beautiful', 'Long-lived'] },
  'snake': { name: 'Ball Python', emoji: '🐍', category: 'More Exotic', personality: 'Docile, Curious, Shy', lifespan: '20-30 years', origin: 'West Africa', size: 'Medium', activity: 'Low', grooming: 'Low', traits: ['Gentle', 'Patterned', 'Curling', 'Quiet'] },
  'gerbil': { name: 'Mongolian Gerbil', emoji: '🐭', category: 'More Exotic', personality: 'Curious, Active, Social', lifespan: '3-5 years', origin: 'Mongolia', size: 'Small', activity: 'High', grooming: 'Low', traits: ['Burrowing', 'Friendly', 'Digging', 'Thumping'] },
  'capybara': { name: 'Capybara', emoji: '🦫', category: 'More Exotic', personality: 'Gentle, Social, Calm', lifespan: '8-12 years', origin: 'South America', size: 'Large', activity: 'Low', grooming: 'Low', traits: ['Chill', 'Swimming', 'Friendly', 'Relaxed'] },
  'mouse': { name: 'Fancy Mouse', emoji: '🐭', category: 'More Exotic', personality: 'Curious, Active, Social', lifespan: '1-3 years', origin: 'Worldwide', size: 'Tiny', activity: 'High', grooming: 'Low', traits: ['Clever', 'Quick', 'Grooming', 'Adorable'] },

  // More Aquatic
  'dolphin': { name: 'Bottlenose Dolphin', emoji: '🐬', category: 'More Aquatic', personality: 'Intelligent, Playful, Social', lifespan: '40-50 years', origin: 'Worldwide', size: 'Large', activity: 'Very High', grooming: 'N/A', traits: ['Smart', 'Acrobatic', 'Echo', 'Friendly'] },
  'octopus': { name: 'Giant Pacific Octopus', emoji: '🐙', category: 'More Aquatic', personality: 'Intelligent, Curious, Solitary', lifespan: '3-5 years', origin: 'Pacific Ocean', size: 'Large', activity: 'Moderate', grooming: 'N/A', traits: ['Genius', 'Camouflage', 'Flexible', 'Problem-solver'] },
  'orca': { name: 'Orca', emoji: '🐋', category: 'More Aquatic', personality: 'Intelligent, Social, Powerful', lifespan: '50-80 years', origin: 'Worldwide', size: 'Very Large', activity: 'High', grooming: 'N/A', traits: ['Apex', 'Family', 'Vocal', 'Majestic'] },
  'shark': { name: 'Great White Shark', emoji: '🦈', category: 'More Aquatic', personality: 'Powerful, Curious, Apex', lifespan: '30-70 years', origin: 'Worldwide', size: 'Very Large', activity: 'High', grooming: 'N/A', traits: ['Predator', 'Ancient', 'Sensory', 'Powerful'] },
  'stingray': { name: 'Southern Stingray', emoji: '🐟', category: 'More Aquatic', personality: 'Gentle, Curious, Graceful', lifespan: '15-25 years', origin: 'Atlantic', size: 'Medium', activity: 'Moderate', grooming: 'N/A', traits: ['Flat', 'Gliding', 'Sandy', 'Gentle'] },
  'pufferfish': { name: 'Porcupinefish', emoji: '🐡', category: 'More Aquatic', personality: 'Curious, Defensive, Unique', lifespan: '10-15 years', origin: 'Tropical', size: 'Medium', activity: 'Low', grooming: 'N/A', traits: ['Puffy', 'Spiky', 'Cute', 'Inflating'] },
  'starfish': { name: 'Ochre Sea Star', emoji: '⭐', category: 'More Aquatic', personality: 'Slow, Regenerating, Patient', lifespan: '20-35 years', origin: 'Pacific', size: 'Small', activity: 'Very Low', grooming: 'N/A', traits: ['Star-shaped', 'Colorful', 'Regenerating', 'Tidal'] },
  'lobster': { name: 'American Lobster', emoji: '🦞', category: 'More Aquatic', personality: 'Hardy, Solitary, Long-lived', lifespan: '50-100 years', origin: 'Atlantic', size: 'Medium', activity: 'Moderate', grooming: 'N/A', traits: ['Armored', 'Clawed', 'Delicious', 'Ancient'] },
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
