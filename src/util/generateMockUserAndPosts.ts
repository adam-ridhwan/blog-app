import { connectToDatabase } from '@/util/connectToDatabase';
import { generateRandomString } from '@/util/generateRandomString';
import { InsertOneResult, ObjectId } from 'mongodb';

import { Post, User } from '@/types/types';

type MockPost = {
  title: string;
  subtitle: string;
  content: string;
};

type MockUser = {
  name: string;
};

const blogPosts: MockPost[] = [
  {
    title: `The Joys of Traveling Solo`,
    subtitle: `Discovering oneself through solitary adventures`,
    content: `<p>Traveling solo can be a life-changing experience. It offers a chance to reflect and grow as an individual. Moreover, it lets you curate your own itinerary without compromise.</p>`,
  },
  {
    title: `The Digital Revolution and Its Impact`,
    subtitle: `How technology reshapes our daily lives`,
    content: `<p>The digital revolution has transformed the way we work and communicate. Automation and digitization are reshaping industries, making them more efficient and consumer-friendly.</p>`,
  },
  {
    title: `The Importance of Mental Health`,
    subtitle: `Prioritizing the mind for holistic wellness`,
    content: `<p>Mental health is just as crucial as physical health. Recognizing and addressing emotional and psychological issues is vital for overall well-being and leading a balanced life.</p>`,
  },
  {
    title: `Harnessing the Power of Renewable Energy`,
    subtitle: `Shifting towards a sustainable future`,
    content: `<p>Renewable energy is the future, as the world seeks sustainable solutions to combat climate change. Solar and wind energy are paving the way for a cleaner planet.</p>`,
  },
  {
    title: `The Renaissance of Classical Literature`,
    subtitle: `The enduring appeal of timeless tales`,
    content: `<p>Classic literature has seen a resurgence in recent years. Works from centuries ago resonate today, proving the timeless nature of profound storytelling.</p>`,
  },
  {
    title: `Exploring Culinary Delights Around the World`,
    subtitle: `A gastronomic journey across cultures`,
    content: `<p>Cuisine tells a lot about a culture. Traveling the globe offers unique opportunities to indulge in diverse culinary experiences, each narrating its own story.</p>`,
  },
  {
    title: `Artificial Intelligence: Promise or Peril?`,
    subtitle: `Balancing benefits with ethical concerns`,
    content: `<p>AI is transforming our world at a rapid pace. While it promises efficiency and innovation, ethical considerations must guide its evolution.</p>`,
  },
  {
    title: `Keeping Fit in a Busy World`,
    subtitle: `Finding wellness amidst the hustle`,
    content: `<p>Balancing work and fitness can be challenging. Incorporating small changes like short workouts or active commutes can make a big difference.</p>`,
  },
  {
    title: `Reconnecting with Nature`,
    subtitle: `Seeking solace in the embrace of the natural world`,
    content: `<p>In our tech-driven world, it's essential to take breaks and reconnect with nature. It provides mental peace and a fresh perspective on life.</p>`,
  },
  {
    title: `The Magic of Film and Cinema`,
    subtitle: `The evolving art of storytelling on screen`,
    content: `<p>Films transport audiences to different worlds, allowing them to experience a myriad of emotions. The art of filmmaking has evolved, but its impact remains profound.</p>`,
  },
  {
    title: `Decoding the Universe: A Look at Astrophysics`,
    subtitle: `Unraveling cosmic mysteries beyond our world`,
    content: `<p>Astrophysics delves into the mysteries of the universe. From black holes to galaxies, it seeks answers to some of life's most profound questions.</p>`,
  },
  {
    title: `Sustainability and Fashion: A New Era`,
    subtitle: `Fusing style with environmental responsibility`,
    content: `<p>The fashion industry is undergoing a transformation. Embracing sustainability not only benefits the planet but also leads to innovative designs and materials.</p>`,
  },
  {
    title: `The Role of Music in Society`,
    subtitle: `The universal language of emotion and unity`,
    content: `<p>Music transcends borders and languages. It has the power to heal, inspire, and bring people together, playing an integral role in societal development.</p>`,
  },
  {
    title: `Innovations in Modern Architecture`,
    subtitle: `Designing the future of living spaces`,
    content: `<p>Architecture reflects society's evolution. Modern designs prioritize sustainability, functionality, and aesthetics, reshaping our urban landscapes.</p>`,
  },
  {
    title: `Diving into the World of Digital Art`,
    subtitle: `The fusion of technology and creative expression`,
    content: `<p>Digital art is blurring the lines between reality and imagination. With technology, artists can now create immersive and interactive masterpieces.</p>`,
  },
  {
    title: `Unraveling the Wonders of Space Exploration`,
    subtitle: `Venturing beyond Earth to unlock cosmic secrets`,
    content: `<p>Space exploration has provided insights into our universe's vastness. Each mission uncovers more about our place in this expansive cosmos.</p>`,
  },
  {
    title: `Empathy: The Cornerstone of Human Connection`,
    subtitle: `Understanding the power of feeling with others`,
    content: `<p>Empathy allows us to understand and connect with others. It is the foundation of trust, compassion, and genuine human interactions.</p>`,
  },
  {
    title: `The Vibrant World of Street Art`,
    subtitle: `Urban canvases telling stories of society`,
    content: `<p>Street art is more than just graffiti. It's a form of expression, commentary, and an integral part of urban culture worldwide.</p>`,
  },
  {
    title: `Preserving Biodiversity: Why Every Species Matters`,
    subtitle: `Guarding the intricate web of life on Earth`,
    content: `<p>Biodiversity is essential for ecosystem balance and health. Protecting every species, no matter how small, ensures a thriving and resilient environment.</p>`,
  },
  {
    title: `Unlocking the Power of Mindfulness and Meditation`,
    subtitle: `Finding serenity in the midst of chaos`,
    content: `<p>Mindfulness and meditation are tools for inner peace and clarity. They help navigate life's challenges with grace and poise.</p>`,
  },
];

const user: MockUser[] = [
  { name: 'Ava Thompson' },
  { name: 'James Anderson' },
  { name: 'Sophia White' },
  { name: 'Benjamin Martinez' },
  { name: 'Mia Lewis' },

  { name: 'Ethan Walker' },
  { name: 'Emily Rodriguez' },
  { name: 'William Perez' },
  { name: 'Olivia Torres' },
  { name: 'Michael Jenkins' },

  { name: 'Emma Evans' },
  { name: 'Jacob Sanchez' },
  { name: 'Amelia Simmons' },
  { name: 'Lucas Rivera' },
  { name: 'Chloe Hayes' },

  { name: 'Jackson James' },
  { name: 'Grace Wright' },
  { name: 'Elijah Cox' },
  { name: 'Abigail Collins' },
  { name: 'Alexander Foster' },
];

export const generateMockUsersAndPosts = async () => {
  /**
   * 1) Create one user
   * 2) Get the user's id
   * 3) Create one main-section with the user's id
   * 4) update user's posts array with the main-section's id
   * */
  const { userCollection, postCollection } = await connectToDatabase();

  Array.from({ length: 20 }, async (_, index) => {
    const generatedUser: InsertOneResult<User> = await userCollection.insertOne({
      name: user[index].name,
      username: '@' + `${user[index].name.split(' ')[0].toLowerCase()}` + '_' + generateRandomString(),
      email: `${user[index].name.split(' ')[0].toLowerCase()}@gmail.com`,
      accounts: [],
      comments: [],
      posts: [],
      sessions: [],
      followers: [],
    });

    Array.from({ length: 3 }, async () => {
      const randomIndex = Math.floor(Math.random() * 20);

      const generatedPost: InsertOneResult<Post> = await postCollection.insertOne({
        title: blogPosts[randomIndex].title,
        subtitle: blogPosts[randomIndex].subtitle,
        content: blogPosts[randomIndex].content,
        authorId: generatedUser.insertedId,
        categoryId: new ObjectId('650ce47033901fc25b0af02f'),
        createdAt: new Date(),
        postSlug: `mock-post-${randomIndex}`,
        views: Math.floor(Math.random() * 2000),
        categorySlug: 'mock-category',
        comments: [],
        likes: Math.floor(Math.random() * 100),
      });

      await userCollection.updateOne(
        { _id: generatedUser.insertedId },
        { $push: { posts: generatedPost.insertedId } }
      );
    });
  });
};

export default generateMockUsersAndPosts;
