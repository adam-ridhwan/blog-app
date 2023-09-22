import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import HydrateAtoms from '@/provider/hydrate-atoms';
import { Post, User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { generateRandomString } from '@/util/generateRandomString';
import { ObjectId } from 'mongodb';

import Categories from '@/components/categories';
import PostList from '@/components/post-list';
import SideMenu from '@/components/side-menu';

type MockPost = {
  title: string;
  content: string;
};

type MockUser = {
  name: string;
  userId: string;
};

const blogPosts: MockPost[] = [
  {
    title: 'The Joys of Traveling Solo',
    content:
      'Traveling solo can be a life-changing experience. It offers a chance to reflect and grow as an individual. Moreover, it lets you curate your own itinerary without compromise.',
  },
  {
    title: 'The Digital Revolution and Its Impact',
    content:
      'The digital revolution has transformed the way we work and communicate. Automation and digitization are reshaping industries, making them more efficient and consumer-friendly.',
  },
  {
    title: 'The Importance of Mental Health',
    content:
      'Mental health is just as crucial as physical health. Recognizing and addressing emotional and psychological issues is vital for overall well-being and leading a balanced life.',
  },
  {
    title: 'Harnessing the Power of Renewable Energy',
    content:
      'Renewable energy is the future, as the world seeks sustainable solutions to combat climate change. Solar and wind energy are paving the way for a cleaner planet.',
  },
  {
    title: 'The Renaissance of Classical Literature',
    content:
      'Classic literature has seen a resurgence in recent years. Works from centuries ago resonate today, proving the timeless nature of profound storytelling.',
  },
  {
    title: 'Exploring Culinary Delights Around the World',
    content:
      'Cuisine tells a lot about a culture. Traveling the globe offers unique opportunities to indulge in diverse culinary experiences, each narrating its own story.',
  },
  {
    title: 'Artificial Intelligence: Promise or Peril?',
    content:
      'AI is transforming our world at a rapid pace. While it promises efficiency and innovation, ethical considerations must guide its evolution.',
  },
  {
    title: 'Keeping Fit in a Busy World',
    content:
      'Balancing work and fitness can be challenging. Incorporating small changes like short workouts or active commutes can make a big difference.',
  },
  {
    title: 'Reconnecting with Nature',
    content:
      "In our tech-driven world, it's essential to take breaks and reconnect with nature. It provides mental peace and a fresh perspective on life.",
  },
  {
    title: 'The Magic of Film and Cinema',
    content:
      'Films transport audiences to different worlds, allowing them to experience a myriad of emotions. The art of filmmaking has evolved, but its impact remains profound.',
  },
  {
    title: 'Decoding the Universe: A Look at Astrophysics',
    content:
      "Astrophysics delves into the mysteries of the universe. From black holes to galaxies, it seeks answers to some of life's most profound questions.",
  },
  {
    title: 'Sustainability and Fashion: A New Era',
    content:
      'The fashion industry is undergoing a transformation. Embracing sustainability not only benefits the planet but also leads to innovative designs and materials.',
  },
  {
    title: 'The Role of Music in Society',
    content:
      'Music transcends borders and languages. It has the power to heal, inspire, and bring people together, playing an integral role in societal development.',
  },
  {
    title: 'Innovations in Modern Architecture',
    content:
      "Architecture reflects society's evolution. Modern designs prioritize sustainability, functionality, and aesthetics, reshaping our urban landscapes.",
  },
  {
    title: 'Diving into the World of Digital Art',
    content:
      'Digital art is blurring the lines between reality and imagination. With technology, artists can now create immersive and interactive masterpieces.',
  },
  {
    title: 'Unraveling the Wonders of Space Exploration',
    content:
      "Space exploration has provided insights into our universe's vastness. Each mission uncovers more about our place in this expansive cosmos.",
  },
  {
    title: 'Empathy: The Cornerstone of Human Connection',
    content:
      'Empathy allows us to understand and connect with others. It is the foundation of trust, compassion, and genuine human interactions.',
  },
  {
    title: 'The Vibrant World of Street Art',
    content:
      "Street art is more than just graffiti. It's a form of expression, commentary, and an integral part of urban culture worldwide.",
  },
  {
    title: 'Preserving Biodiversity: Why Every Species Matters',
    content:
      'Biodiversity is essential for ecosystem balance and health. Protecting every species, no matter how small, ensures a thriving and resilient environment.',
  },
  {
    title: 'Unlocking the Power of Mindfulness and Meditation',
    content:
      "Mindfulness and meditation are tools for inner peace and clarity. They help navigate life's challenges with grace and poise.",
  },
];

const user: MockUser[] = [
  { name: 'Ava Thompson', userId: '650e126945e26c7bd150540c' },
  { name: 'James Anderson', userId: '650e126945e26c7bd150540d' },
  { name: 'Sophia White', userId: '650e126945e26c7bd150540e' },
  { name: 'Benjamin Martinez', userId: '650e126945e26c7bd150540f' },
  { name: 'Mia Lewis', userId: '650e126945e26c7bd1505410' },

  { name: 'Ethan Walker', userId: '650e126945e26c7bd1505411' },
  { name: 'Emily Rodriguez', userId: '650e126945e26c7bd1505412' },
  { name: 'William Perez', userId: '650e126945e26c7bd1505413' },
  { name: 'Olivia Torres', userId: '650e126945e26c7bd1505414' },
  { name: 'Michael Jenkins', userId: '650e126945e26c7bd1505415' },

  { name: 'Emma Evans', userId: '650e126945e26c7bd1505416' },
  { name: 'Jacob Sanchez', userId: '650e126945e26c7bd1505417' },
  { name: 'Amelia Simmons', userId: '650e126945e26c7bd1505418' },
  { name: 'Lucas Rivera', userId: '650e126945e26c7bd1505419' },
  { name: 'Chloe Hayes', userId: '650e126945e26c7bd150541a' },

  { name: 'Jackson James', userId: '650e126945e26c7bd150541b' },
  { name: 'Grace Wright', userId: '650e126945e26c7bd150541c' },
  { name: 'Elijah Cox', userId: '650e126945e26c7bd150541d' },
  { name: 'Abigail Collins', userId: '650e126945e26c7bd150541e' },
  { name: 'Alexander Foster', userId: '650e126945e26c7bd150541f' },
];

const generatePost = (index: number): Post => {
  const title = blogPosts[index].title;
  const postSlug = `mock-post-${index}`;
  const category = new ObjectId('650ce47033901fc25b0af02f');
  const content = blogPosts[index].content;
  const author = new ObjectId(`${user[index].userId}`);

  return {
    createdAt: new Date(),
    postSlug,
    title,
    content,
    views: Math.floor(Math.random() * 2000),
    categorySlug: 'mock-category',
    category,
    author,
    comments: [],
    likes: Math.floor(Math.random() * 100),
  };
};

const generateMockUsers = (index: number): User => {
  return {
    name: user[index].name,
    username: '@' + `${user[index].name.split(' ')[0].toLowerCase()}` + '_' + generateRandomString(),
    email: `${user[index].name.split(' ')[0].toLowerCase()}@gmail.com`,
    accounts: [],
    comments: [],
    posts: [],
    sessions: [],
    followers: [],
  };
};

export default async function Home() {
  const { postCollection, userCollection } = await connectToDatabase();
  const mockPosts = Array.from({ length: 20 }, (_, index) => generatePost(index));
  // await postCollection.deleteMany({});
  // await postCollection.insertMany(mockPosts);

  const mockUsers = Array.from({ length: 20 }, (_, index) => generateMockUsers(index));
  // await userCollection.deleteMany({});
  // await userCollection.insertMany(mockUsers);

  const users = await userCollection.find().toArray();
  console.log(users.flatMap(user => user).map(user => user._id));

  const [initialPosts] = await getPosts(5, undefined);

  if (!initialPosts) throw new Error('Failed to fetch initial posts');

  const authorIds = initialPosts.map(post => post.author);
  const initialAuthors = await getUsersById(authorIds);

  if (!initialAuthors) throw new Error('Failed to fetch initial authors');
  if (!initialPosts && !initialAuthors) throw new Error('Failed to fetch initial posts and authors');

  const seenAuthors = new Set();
  const uniqueAuthors = initialAuthors.filter(author => {
    if (!seenAuthors.has(author._id)) {
      seenAuthors.add(author._id);
      return true;
    }
    return false;
  });

  return (
    <div className='container flex flex-col px-5 xl:flex-row xl:justify-center'>
      <HydrateAtoms posts={initialPosts} authors={uniqueAuthors}>
        <PostList>
          <Categories />
        </PostList>
        <SideMenu />
      </HydrateAtoms>
    </div>
  );
}
