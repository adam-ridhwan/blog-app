import { Fragment } from 'react';
import { getCategories } from '@/actions/getCategories';
import { type Category } from '@/types';

import { Separator } from '@/components/ui/separator';
import Categories from '@/components/categories';
import Post from '@/components/post';

const PostList = async () => {
  const categories: Category[] = await getCategories();

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
    {
      title: 'Whispers from the Woods',
      date: 'Jun 05',
      content: `In the heart of the woods, a chorus of life serenades the observant traveler. Each rustling leaf and chirping cricket carries tales of ancient spirits and forgotten paths. Towering trees, like nature's librarians, hold stories of seasons gone by, while the babbling brooks share whispers of romances nurtured in their embrace.`,
    },
    {
      title: 'Tales of the Tundra',
      date: 'Feb 28',
      content: `A vast expanse of white, the tundra stands cold and mysterious. Arctic foxes dart through the snow while the northern lights paint the sky in radiant colors. Every frozen river and silent snowfall tells a tale of endurance, of life persisting in the harshest conditions, a testament to nature's indomitable spirit.`,
    },
    {
      title: 'Dance of the Monsoons',
      date: 'Aug 15',
      content: `The heavens open, releasing torrents of rain upon the parched earth. Every drop brings life and renewal, as the land awakens with vibrant greens. Rivers surge with newfound energy, and children revel in the cool cascades. The monsoons, with their rhythmic dance, celebrate the eternal cycle of life and rebirth.`,
    },
    {
      title: 'Mysteries of the Marshlands',
      date: 'Nov 21',
      content: `Misty marshlands, with their maze of reeds and ponds, harbor secrets of a watery realm. Frogs croon under the moonlight while fireflies light up the darkness. Each soft squelch of mud underfoot is a step into a world teeming with life, where every splash and quack reveals a hidden narrative of survival.`,
    },
    {
      title: 'Songs of the Savanna',
      date: 'Apr 25',
      content: `Golden grasslands stretch endlessly, dotted with herds of roaming wildlife. Majestic elephants tread ancient pathways, while lions laze under the shade. The savanna, with its intricate dance of predator and prey, sings a song of life's delicate balance, a reminder of nature's raw beauty and power.`,
    },
    {
      title: 'Reverie of the Rainforest',
      date: 'May 03',
      content: `Deep within the lush green canopy, the rainforest pulses with life. Exotic birds call to each other, and waterfalls cascade into emerald pools. Every vine and fern tells tales of symbiosis and competition. The rainforest, a treasure trove of biodiversity, stands as a testament to nature's boundless creativity and wonder.`,
    },
    {
      title: 'Caverns of the Unknown',
      date: 'Jul 29',
      content: `Hidden beneath the surface, caverns and caves invite the intrepid explorer. Stalactites and stalagmites grow in nature's slow artistry, while subterranean rivers echo in the silent depths. These underground sanctuaries, untouched by sunlight, hold tales of epochs past, waiting to be unraveled by the light of a torch.`,
    },
    {
      title: 'Frost and Fire',
      date: 'Oct 30',
      content: `In lands where geysers erupt and glaciers roam, the eternal dance of frost and fire plays out. Volcanoes slumber, only to awaken with roaring might. The juxtaposition of icy fjords and molten lava tells a story of contrasts, a reminder of the planet's ever-evolving nature and dynamic forces.`,
    },
    {
      title: 'Isles of Inspiration',
      date: 'Dec 15',
      content: `Surrounded by azure waters, islands rise as jewels of the sea. Each sandy shore and coral reef carries tales of mariners, castaways, and paradise found. The whisper of the palm trees blends with the rhythm of the waves, narrating stories of adventure, solitude, and the infinite allure of the ocean's embrace.`,
    },
    {
      title: 'Valleys of the Ancients',
      date: 'Jan 20',
      content: `Nestled between mighty peaks, valleys stand as cradles of civilization. Ancient ruins, remnants of once-great empires, whisper tales of glory and decay. Each stone and mural, touched by the hands of bygone artisans, reveals secrets of history, of battles won and lost, and the ebb and flow of time itself.`,
    },
  ];

  return (
    <>
      <main className='relative mb-6 mt-12 md:flex md:flex-col md:items-center'>
        <div className='max-w-[728px]'>
          <Categories {...{ categories }} />

          <div className='mt-[50px] flex w-full flex-col gap-5 md:items-center'>
            {recentPosts.map(post => {
              return (
                <Fragment key={post.title}>
                  <Post title={post.title} date={post.date} content={post.content} />
                  <Separator className='md:hidden' />
                </Fragment>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default PostList;
