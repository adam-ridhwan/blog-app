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
    content: `
      <p>Traveling solo can be a life-changing experience. It offers a chance to reflect and grow as an individual. Moreover, it lets you curate your own itinerary without compromise.</p>
      <p>When you're on your own, there's a sense of complete freedom. You can choose to visit that hidden museum you discovered or spend hours at a local cafe, immersing yourself in a new culture. There's no need to rush or skip anything because of someone else's preferences. Every decision, from where to eat to which attractions to visit, is entirely up to you.</p>
      <p>Moreover, solo travel is also about self-discovery. It pushes you out of your comfort zone, challenges you in unexpected ways, and often leads to personal growth. There's nothing like navigating a foreign city on your own or making friends with strangers to boost your confidence and sense of independence.</p>`,
  },
  {
    title: `The Digital Revolution and Its Impact`,
    subtitle: `How technology reshapes our daily lives`,
    content: `
      <p>The digital revolution has transformed the way we work and communicate. Automation and digitization are reshaping industries, making them more efficient and consumer-friendly. In an era where technology permeates every aspect of our lives, from smartphones and social media to smart homes and artificial intelligence, the impact of this digital transformation is undeniable. It has not only revolutionized the way we conduct business but has also fundamentally altered how we connect with one another, access information, and even think about the future.</p>
      <p>One of the most significant consequences of the digital revolution is the rapid acceleration of innovation. This innovation has led to breakthroughs in fields like healthcare, transportation, and entertainment. For instance, telemedicine now allows patients to consult with doctors remotely, while autonomous vehicles promise to revolutionize transportation by reducing accidents and congestion. Moreover, the entertainment industry has shifted towards streaming services, giving consumers unprecedented access to a vast array of content on-demand. These technological advancements have not only improved our quality of life but have also created new opportunities for businesses to thrive in a digital-first world.</p>
      <p>However, the digital revolution is not without its challenges. It has raised concerns about privacy, data security, and the potential for job displacement due to automation. As technology continues to evolve at an astonishing pace, it becomes imperative for society to adapt and strike a balance between embracing innovation and safeguarding ethical and societal values. The digital revolution is an ongoing transformation that will continue to shape our lives in profound ways, requiring us to navigate the ever-changing landscape of technology with mindfulness and responsibility.</p>`,
  },
  {
    title: `The Importance of Mental Health`,
    subtitle: `Prioritizing the mind for holistic wellness`,
    content: `<p>Mental health is just as crucial as physical health. Recognizing and addressing emotional and psychological issues is vital for overall well-being and leading a balanced life.</p>
  <p>It's important to destigmatize conversations around mental health. By acknowledging our emotions and seeking help when needed, we create a supportive environment for ourselves and others. Taking care of our mental well-being is not a sign of weakness; it's a testament to our strength and resilience.</p>
  <p>Practices like mindfulness, therapy, and self-care can play a significant role in maintaining good mental health. When we prioritize our mental well-being, we are better equipped to face life's challenges and enjoy a more fulfilling, harmonious life.</p>`,
  },

  {
    title: `Harnessing the Power of Renewable Energy`,
    subtitle: `Shifting towards a sustainable future`,
    content: `<p>Renewable energy is the future, as the world seeks sustainable solutions to combat climate change. Solar and wind energy are paving the way for a cleaner planet.</p>
  <p>Transitioning to renewable energy sources is not just an environmental imperative; it's also an economic opportunity. Green technologies are creating jobs and driving innovation in the energy sector, positioning us for a more sustainable and prosperous future.</p>
  <p>Moreover, the shift to renewable energy reduces our dependence on fossil fuels, mitigating the adverse effects of pollution and climate change. Embracing renewable energy is not just a choice; it's a collective responsibility towards safeguarding our planet for future generations.</p>`,
  },

  {
    title: `The Renaissance of Classical Literature`,
    subtitle: `The enduring appeal of timeless tales`,
    content: `<p>Classic literature has seen a resurgence in recent years. Works from centuries ago resonate today, proving the timeless nature of profound storytelling.</p>
  <p>These timeless tales provide insights into the human condition, exploring themes of love, ambition, morality, and the human experience. They offer a window into different historical periods and cultures, fostering empathy and understanding among readers.</p>
  <p>With the advent of digital platforms and audiobooks, classic literature has become more accessible than ever, allowing new generations to appreciate the beauty of language and the depth of storytelling that has shaped our literary heritage.</p>`,
  },

  {
    title: `Exploring Culinary Delights Around the World`,
    subtitle: `A gastronomic journey across cultures`,
    content: `<p>Cuisine tells a lot about a culture. Traveling the globe offers unique opportunities to indulge in diverse culinary experiences, each narrating its own story.</p>
  <p>Food is a universal language that transcends borders. It brings people together, fostering cultural exchange and understanding. Exploring international cuisines allows us to savor the richness of our planet's culinary diversity.</p>
  <p>From street food vendors in bustling Asian markets to Michelin-starred restaurants in Europe, the world of food offers endless adventures for the palate and a deeper connection to the cultures that produce these delectable dishes.</p>`,
  },

  {
    title: `Artificial Intelligence: Promise or Peril?`,
    subtitle: `Balancing benefits with ethical concerns`,
    content: `<p>AI is transforming our world at a rapid pace. While it promises efficiency and innovation, ethical considerations must guide its evolution.</p>
  <p>The potential of AI is vast, from revolutionizing healthcare and transportation to optimizing manufacturing processes. However, it also raises questions about job displacement, data privacy, and the ethical use of AI in decision-making.</p>
  <p>As we embrace AI technologies, it's essential to strike a balance between reaping its benefits and safeguarding against its potential risks. Ethical AI development and responsible AI implementation are critical to ensuring that AI serves humanity's best interests.</p>`,
  },

  {
    title: `Keeping Fit in a Busy World`,
    subtitle: `Finding wellness amidst the hustle`,
    content: `<p>Balancing work and fitness can be challenging. Incorporating small changes like short workouts or active commutes can make a big difference.</p>
  <p>In our fast-paced world, finding time for physical activity is essential for maintaining good health. Even brief moments of exercise can boost energy levels and reduce stress, contributing to overall well-being.</p>
  <p>Moreover, staying active not only benefits our bodies but also sharpens our minds. It enhances productivity and mental clarity, making it a crucial aspect of leading a fulfilling life in today's busy society.</p>`,
  },

  {
    title: `Reconnecting with Nature`,
    subtitle: `Seeking solace in the embrace of the natural world`,
    content: `<p>In our tech-driven world, it's essential to take breaks and reconnect with nature. It provides mental peace and a fresh perspective on life.</p>
  <p>Nature has a calming and rejuvenating effect on our minds and bodies. Whether it's a walk in the park, a hike in the mountains, or simply spending time outdoors, nature offers a respite from the demands of modern life.</p>
  <p>By reconnecting with the natural world, we can find solace, reduce stress, and gain a deeper appreciation for the beauty and intricacy of our planet. It's a way to recharge and find balance in an increasingly digital and fast-paced society.</p>`,
  },

  {
    title: `The Magic of Film and Cinema`,
    subtitle: `The evolving art of storytelling on screen`,
    content: `<p>Films transport audiences to different worlds, allowing them to experience a myriad of emotions. The art of filmmaking has evolved, but its impact remains profound.</p>
  <p>Cinema is a powerful medium for storytelling and artistic expression. It has the ability to evoke laughter, tears, and reflection, often all within the same film. The evolution of special effects and technology has expanded the possibilities of cinematic storytelling, creating immersive experiences for viewers.</p>
  <p>Furthermore, film is a reflection of society's values and concerns. It has the power to challenge norms, provoke thought, and inspire change. The magic of cinema continues to captivate audiences worldwide, making it an enduring and influential art form.</p>`,
  },

  {
    title: `Decoding the Universe: A Look at Astrophysics`,
    subtitle: `Unraveling cosmic mysteries beyond our world`,
    content: `<p>Astrophysics delves into the mysteries of the universe. From black holes to galaxies, it seeks answers to some of life's most profound questions.</p>
  <p>Studying the cosmos not only expands our understanding of the universe but also sheds light on our place within it. Astrophysicists explore the origins of stars, the nature of dark matter, and the possibilities of extraterrestrial life, sparking curiosity and awe in the process.</p>
  <p>With advancements in telescopes and space exploration, astrophysics is at the forefront of scientific discovery, pushing the boundaries of human knowledge and inspiring the next generation of explorers and scientists.</p>`,
  },

  {
    title: `Sustainability and Fashion: A New Era`,
    subtitle: `Fusing style with environmental responsibility`,
    content: `<p>The fashion industry is undergoing a transformation. Embracing sustainability not only benefits the planet but also leads to innovative designs and materials.</p>
  <p>Sustainable fashion focuses on reducing environmental impact and promoting ethical practices throughout the supply chain. It encourages mindful consumption, advocating for quality over quantity and supporting brands that prioritize eco-friendly materials and production methods.</p>
  <p>By embracing sustainability, the fashion industry is not just changing how we dress; it's reshaping our attitudes towards clothing and consumption. It's an exciting era where style and responsibility can coexist harmoniously.</p>`,
  },

  {
    title: `The Role of Music in Society`,
    subtitle: `The universal language of emotion and unity`,
    content: `<p>Music transcends borders and languages. It has the power to heal, inspire, and bring people together, playing an integral role in societal development.</p>
  <p>Throughout history, music has been a means of expressing emotions, telling stories, and fostering cultural identity. It can serve as a tool for social change, raising awareness about important issues and promoting unity among diverse communities.</p>
  <p>From classical symphonies to contemporary pop hits, music remains a fundamental aspect of human culture, connecting individuals across the globe through the shared experience of sound and melody.</p>`,
  },

  {
    title: `Innovations in Modern Architecture`,
    subtitle: `Designing the future of living spaces`,
    content: `<p>Architecture reflects society's evolution. Modern designs prioritize sustainability, functionality, and aesthetics, reshaping our urban landscapes.</p>
  <p>Architects today face the challenge of creating environmentally conscious and aesthetically pleasing structures. Green building practices, energy-efficient designs, and innovative use of materials are transforming cities into sustainable, livable spaces.</p>
  <p>Modern architecture not only shapes our physical environment but also influences how we interact with it. It blurs the line between art and functionality, creating spaces that inspire and enhance our daily lives.</p>`,
  },

  {
    title: `Diving into the World of Digital Art`,
    subtitle: `The fusion of technology and creative expression`,
    content: `<p>Digital art is blurring the lines between reality and imagination. With technology, artists can now create immersive and interactive masterpieces.</p>
  <p>Advancements in digital tools have revolutionized the art world, allowing artists to experiment with new mediums and techniques. Digital art can be dynamic, interactive, and accessible to a global audience, democratizing the creative process.</p>
  <p>Moreover, digital art challenges traditional notions of artistry, inviting viewers to engage with and even become a part of the artwork. It's an exciting frontier where technology and creativity converge, pushing the boundaries of artistic expression.</p>`,
  },

  {
    title: `Unraveling the Wonders of Space Exploration`,
    subtitle: `Venturing beyond Earth to unlock cosmic secrets`,
    content: `<p>Space exploration has provided insights into our universe's vastness. Each mission uncovers more about our place in this expansive cosmos.</p>
  <p>From the Apollo moon landings to rovers on Mars, space exploration has expanded our understanding of celestial bodies and the conditions that govern our universe. It sparks curiosity, inspires scientific discovery, and fosters international cooperation in the quest for cosmic knowledge.</p>
  <p>Space exploration isn't just about satisfying our innate curiosity; it also holds the promise of technological advancements and solutions to Earth's challenges. As we venture further into the cosmos, we continue to unlock the mysteries of the universe and gain a deeper appreciation for our place in the cosmos.</p>`,
  },

  {
    title: `Empathy: The Cornerstone of Human Connection`,
    subtitle: `Understanding the power of feeling with others`,
    content: `<p>Empathy allows us to understand and connect with others. It is the foundation of trust, compassion, and genuine human interactions.</p>
  <p>Empathy enables us to see the world through the eyes of others, to share in their joys and sorrows. It fosters kindness and solidarity, breaking down barriers and promoting understanding among diverse individuals and communities.</p>
  <p>By practicing empathy, we not only enrich our own lives but also contribute to a more empathetic and compassionate world. It's a fundamental quality that strengthens the bonds of humanity and paves the way for a more harmonious society.</p>`,
  },

  {
    title: `The Vibrant World of Street Art`,
    subtitle: `Urban canvases telling stories of society`,
    content: `<p>Street art is more than just graffiti. It's a form of expression, commentary, and an integral part of urban culture worldwide.</p>
  <p>Street artists use public spaces as their canvas, creating thought-provoking and visually stunning works that reflect societal issues, cultural diversity, and individual creativity. Street art adds color and character to cityscapes, inviting passersby to engage with the art and the messages it conveys.</p>
  <p>From the vibrant murals of Wynwood Walls in Miami to the political statements in the streets of Berlin, street art serves as a dynamic and ever-evolving cultural phenomenon, challenging norms and inspiring dialogue among urban communities.</p>`,
  },

  {
    title: `Preserving Biodiversity: Why Every Species Matters`,
    subtitle: `Guarding the intricate web of life on Earth`,
    content: `<p>Biodiversity is essential for ecosystem balance and health. Protecting every species, no matter how small, ensures a thriving and resilient environment.</p>
  <p>Each species on Earth plays a unique role in maintaining ecological balance. From pollinators that enable plant reproduction to predators that control prey populations, the intricate web of life is a delicate and interconnected system.</p>
  <p>Conservation efforts are crucial in safeguarding biodiversity. By preserving ecosystems and protecting endangered species, we not only maintain the beauty of our planet but also ensure its long-term sustainability and resilience in the face of environmental challenges.</p>`,
  },

  {
    title: `Unlocking the Power of Mindfulness and Meditation`,
    subtitle: `Finding serenity in the midst of chaos`,
    content: `<p>Mindfulness and meditation are tools for inner peace and clarity. They help navigate life's challenges with grace and poise.</p>
  <p>In a fast-paced and often chaotic world, mindfulness and meditation offer moments of tranquility and self-reflection. These practices promote self-awareness, reduce stress, and enhance mental well-being.</p>
  <p>By incorporating mindfulness and meditation into daily routines, individuals can tap into their inner resources to find calm amidst the storms of life. These ancient practices have enduring relevance in modern times, empowering people to live with greater serenity and balance.</p>`,
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

    Array.from({ length: 5 }, async () => {
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
