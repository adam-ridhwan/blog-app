import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import HydrateAtoms from '@/providers/hydrate-atoms';
import { connectToDatabase } from '@/util/connectToDatabase';
import { generateRandomString } from '@/util/generateRandomString';
import { ObjectId } from 'mongodb';

import { Post, User } from '@/types/types';
import PostList from '@/components/post/post-list';
import BuiltWith from '@/components/side-menu/built-with';
import Draft from '@/components/side-menu/draft';
import EditorPosts from '@/components/side-menu/editor-posts';
import SideMenu from '@/components/side-menu/side-menu';
import TrendingPosts from '@/components/side-menu/trending-posts';
import WhoToFollow from '@/components/side-menu/who-to-follow';

type MockPost = {
  title: string;
  content: string;
};

type MockUser = {
  name: string;
};

const blogPosts: MockPost[] = [
  {
    title: `The Joys of Traveling Solo`,
    content: `<p>Traveling solo can be a life-changing experience . It offers a chance to reflect and grow as an individual. Moreover, it lets you curate your own itinerary without compromise.</p>`,
  },
  {
    title: `The Digital Revolution and Its Impact`,
    content: `<p>The digital revolution has transformed the way we work and communicate. Automation and digitization are reshaping industries, making them more efficient and consumer-friendly.</p>`,
  },
  {
    title: `The Importance of Mental Health`,
    content: `<p>Mental health is just as crucial as physical health. Recognizing and addressing emotional and psychological issues is vital for overall well-being and leading a balanced life.</p>`,
  },
  {
    title: `Harnessing the Power of Renewable Energy`,
    content: `<p>Renewable energy is the future, as the world seeks sustainable solutions to combat climate change. Solar and wind energy are paving the way for a cleaner planet.</p>`,
  },
  {
    title: `The Renaissance of Classical Literature`,
    content: `<p>Classic literature has seen a resurgence in recent years. Works from centuries ago resonate today, proving the timeless nature of profound storytelling.</p>`,
  },
  {
    title: `Exploring Culinary Delights Around the World`,
    content: `<p>Cuisine tells a lot about a culture. Traveling the globe offers unique opportunities to indulge in diverse culinary experiences, each narrating its own story.</p>`,
  },
  {
    title: `Artificial Intelligence: Promise or Peril?`,
    content: `<p>AI is transforming our world at a rapid pace. While it promises efficiency and innovation, ethical considerations must guide its evolution.</p>`,
  },
  {
    title: `Keeping Fit in a Busy World`,
    content: `<p>Balancing work and fitness can be challenging. Incorporating small changes like short workouts or active commutes can make a big difference.</p>`,
  },
  {
    title: `Reconnecting with Nature`,
    content: `<p>In our tech-driven world, it's essential to take breaks and reconnect with nature. It provides mental peace and a fresh perspective on life.</p>`,
  },
  {
    title: `The Magic of Film and Cinema`,
    content: `<p>Films transport audiences to different worlds, allowing them to experience a myriad of emotions. The art of filmmaking has evolved, but its impact remains profound.</p>`,
  },
  {
    title: `Decoding the Universe: A Look at Astrophysics`,
    content: `<p>Astrophysics delves into the mysteries of the universe. From black holes to galaxies, it seeks answers to some of life's most profound questions.</p>`,
  },
  {
    title: `Sustainability and Fashion: A New Era`,
    content: `<p>The fashion industry is undergoing a transformation. Embracing sustainability not only benefits the planet but also leads to innovative designs and materials.</p>`,
  },
  {
    title: `The Role of Music in Society`,
    content: `<p>Music transcends borders and languages. It has the power to heal, inspire, and bring people together, playing an integral role in societal development.</p>`,
  },
  {
    title: `Innovations in Modern Architecture`,
    content: `<p>Architecture reflects society's evolution. Modern designs prioritize sustainability, functionality, and aesthetics, reshaping our urban landscapes.</p>`,
  },
  {
    title: `Diving into the World of Digital Art`,
    content: `<p>Digital art is blurring the lines between reality and imagination. With technology, artists can now create immersive and interactive masterpieces.</p>`,
  },
  {
    title: `Unraveling the Wonders of Space Exploration`,
    content: `<p>Space exploration has provided insights into our universe's vastness. Each mission uncovers more about our place in this expansive cosmos.</p>`,
  },
  {
    title: `Empathy: The Cornerstone of Human Connection`,
    content: `<p>Empathy allows us to understand and connect with others. It is the foundation of trust, compassion, and genuine human interactions.</p>`,
  },
  {
    title: `The Vibrant World of Street Art`,
    content: `<p>Street art is more than just graffiti. It's a form of expression, commentary, and an integral part of urban culture worldwide.</p>`,
  },
  {
    title: `Preserving Biodiversity: Why Every Species Matters`,
    content: `<p>Biodiversity is essential for ecosystem balance and health. Protecting every species, no matter how small, ensures a thriving and resilient environment.</p>`,
  },
  {
    title: `Unlocking the Power of Mindfulness and Meditation`,
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

const generatePost = (index: number, users: User[]): Post => {
  const title = blogPosts[index].title;
  const postSlug = `mock-post-${index}`;
  const categoryId = new ObjectId('650ce47033901fc25b0af02f');
  const content = blogPosts[index].content;
  const authorId = new ObjectId(`${users[index]._id}`);

  return {
    subtitle: '',
    createdAt: new Date(),
    postSlug,
    title,
    content,
    views: Math.floor(Math.random() * 2000),
    categorySlug: 'mock-category',
    categoryId,
    authorId,
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

  const users = await userCollection.find().toArray();

  // mocks
  const mockPosts = Array.from({ length: 20 }, (_, index) => generatePost(index, users));
  // await postCollection.deleteMany({});
  // await postCollection.insertMany(mockPosts);

  const mockUsers = Array.from({ length: 20 }, (_, index) => generateMockUsers(index));
  // await userCollection.deleteMany({});
  // await userCollection.insertMany(mockUsers);

  return (
    <div className='container flex flex-col px-5 xl:flex-row xl:justify-center'>
      <PostList>{/*<Categories />*/}</PostList>
      <SideMenu>
        <>
          <TrendingPosts />
          <Draft />
          <WhoToFollow />
          <EditorPosts />
          <BuiltWith />
        </>
      </SideMenu>
    </div>
  );
}
