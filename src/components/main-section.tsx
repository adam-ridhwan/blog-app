import { Separator } from '@/components/ui/separator';
import Card from '@/components/card';
import PopularCategories from '@/components/popular-categories';

const MainSection = () => {
  const recentPosts = [
    {
      title: 'Whispers of the Shore',
      date: 'Mar 21',
      content: `The sun painted vibrant hues across the evening sky as stars began their nocturnal vigil. Waves gently lapped the shore, whispering tales of distant lands and ancient mariners. Every grain of sand, having journeyed from far and wide, seemed to hold a secret tale, eagerly waiting for the right ear to listen and uncover its age-old mysteries.`,
    },
    {
      title: 'City Chronicles',
      date: 'Oct 01',
      content: `Amidst the bustling city streets, old bookstores stood resiliently, acting as time capsules amidst modernity. Every cobblestone corner and winding alley unveiled a new story, hinting at forgotten romances and bygone eras. Strangers from all walks of life passed by in a hurried dance, each carrying their unique universe of dreams, regrets, whispered promises, and hidden sorrows.`,
    },
    {
      title: 'Guardians of Time',
      date: 'Sep 21',
      content: `Mountains, ancient and majestic, stood tall against the horizon, their peaks confidently kissing the wandering clouds. Birds, like poets of the air, danced gracefully through the valleys below, composing intricate melodies of freedom and joy. The trees, with their gnarled and twisted branches, have seen the passing of countless seasons, standing firm as nature's sentinels, guarding the sacred lore of the land and its many tales.`,
    },
    {
      title: 'Echoes of the Abyss',
      date: 'Dec 05',
      content: `Beneath the vast blue, the ocean depths remain the last great uncharted territory. Mysterious creatures weave through the cold, dark waters, their luminous forms creating a mesmerizing dance of lights. Forgotten shipwrecks, remnants of mankind's adventures, lay scattered on the seabed, a testament to nature's might. Each silent bubble that rises to the surface carries a story, a whisper from the abyss, awaiting discovery.`,
    },
    {
      title: 'Starlit Memories',
      date: 'Jan 09',
      content: `In the vast expanse of the cosmos, stars burn brilliantly, each a beacon of ancient history. Constellations tell tales of mythological heroes and age-old legends, guiding wanderers for generations. Across the inky void, comets streak, leaving trails of cosmic dust, like tears of the universe. Each celestial event serves as a reminder that our fleeting lives are part of a grand, intricate tapestry of existence.`,
    },
    {
      title: "Desert's Lullaby",
      date: 'Jul 17',
      content: `Amidst endless dunes, the desert paints a landscape of solitude and reflection. The relentless sun casts long shadows, creating mirages that dance with the wind. Cacti stand resilient, storing life-giving water, while nocturnal creatures emerge in the cooler hours, revealing a hidden world. The desert, with its stark contrasts and serene beauty, teaches lessons of endurance, resilience, and the delicate balance of life.`,
    },
  ];

  return (
    <>
      <main className='relative mb-6 mt-12'>
        <PopularCategories />

        <div className='pointer-events-none h-0 select-none bg-red opacity-0' id='categories-placeholder'>
          placeholder
        </div>

        <div className='mt-[120px]'>
          {recentPosts.map(post => {
            return (
              <>
                <Separator orientation='horizontal' className='my-5' />
                <Card key={post.title} title={post.title} date={post.date} content={post.content} />
              </>
            );
          })}
          {recentPosts.map(post => {
            return (
              <>
                <Separator orientation='horizontal' className='my-5' />
                <Card key={post.title} title={post.title} date={post.date} content={post.content} />
              </>
            );
          })}
          {recentPosts.map(post => {
            return (
              <>
                <Separator orientation='horizontal' className='my-5' />
                <Card key={post.title} title={post.title} date={post.date} content={post.content} />
              </>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default MainSection;
